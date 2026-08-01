import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useCart, formatPrice } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, UploadCloud, Loader2, Tag } from "lucide-react";
import { getDiscountCodeByCode, DiscountCode } from "@/lib/discounts";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Herbian Glow" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  
  const [method, setMethod] = useState<"COD" | "ONLINE">("COD");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<DiscountCode | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const shipping = subtotal > 3000 || items.length === 0 ? 0 : 250;
  
  // Calculate Influencer Promo Discount
  let promoDiscountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.product_id) {
      // Applies to specific product only
      const targetItem = items.find((i) => i.product.id === appliedPromo.product_id);
      if (targetItem) {
        promoDiscountAmount = Math.floor((targetItem.product.price * targetItem.quantity) * (appliedPromo.discount_percentage / 100));
      }
    } else {
      // Applies to entire cart subtotal
      promoDiscountAmount = Math.floor(subtotal * (appliedPromo.discount_percentage / 100));
    }
  }

  const rawTotal = subtotal + shipping - promoDiscountAmount;
  const onlineDiscountAmount = method === "ONLINE" ? Math.floor(rawTotal * 0.1) : 0;
  const finalTotal = rawTotal - onlineDiscountAmount;
  const totalDiscount = promoDiscountAmount + onlineDiscountAmount;

  if (items.length === 0 && !success) {
    navigate({ to: "/cart" });
    return null;
  }

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoError("");
    
    try {
      const discount = await getDiscountCodeByCode(promoCodeInput.trim());
      
      if (!discount) {
        setPromoError("Invalid discount code.");
      } else if (!discount.is_active) {
        setPromoError("This code has expired or is disabled.");
      } else if (discount.product_id && !items.find(i => i.product.id === discount.product_id)) {
        setPromoError("This code does not apply to any items in your cart.");
      } else {
        setAppliedPromo(discount);
        setPromoCodeInput("");
      }
    } catch (err) {
      setPromoError("Failed to verify code.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === "ONLINE" && !file) {
      alert("Please upload your payment screenshot.");
      return;
    }
    setLoading(true);

    try {
      let screenshotUrl = null;

      if (method === "ONLINE" && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("payment_receipts")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("payment_receipts")
          .getPublicUrl(fileName);
          
        screenshotUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("orders").insert({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_city: formData.city,
        payment_method: method,
        total_amount: finalTotal,
        discount_amount: totalDiscount,
        items: items,
        screenshot_url: screenshotUrl
      });

      if (insertError) throw insertError;

      clear();
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-32 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sage/20 text-sage">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="font-serif text-4xl text-cocoa">Order Confirmed!</h1>
          <p className="mt-4 text-muted-foreground">
            Thank you for shopping with Herbian Glow. Your order has been received and is being processed.
          </p>
          <button 
            onClick={() => navigate({ to: "/" })}
            className="btn-pill mt-8 bg-blush text-primary-foreground"
          >
            Back to Home
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="mb-10 text-center font-serif text-4xl text-cocoa md:text-5xl">Checkout</h1>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Info */}
            <section className="rounded-3xl bg-card p-6 shadow-sm md:p-8">
              <h2 className="mb-6 font-serif text-2xl text-cocoa">Shipping Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cocoa">Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={input} placeholder="Aisha Khan" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cocoa">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={input} placeholder="aisha@example.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cocoa">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={input} placeholder="03xx xxxxxxx" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cocoa">Complete Address</label>
                  <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={input} placeholder="House 123, Street 4, Phase 5" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cocoa">City</label>
                  <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={input} placeholder="Lahore" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="rounded-3xl bg-card p-6 shadow-sm md:p-8">
              <h2 className="mb-6 font-serif text-2xl text-cocoa">Payment Method</h2>
              
              <div className="space-y-4">
                <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors ${method === "COD" ? "border-blush bg-blush/5" : "border-border"}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD" 
                    checked={method === "COD"} 
                    onChange={() => setMethod("COD")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-cocoa">Cash on Delivery (COD)</p>
                    <p className="text-sm text-muted-foreground">Pay in cash when your order arrives.</p>
                  </div>
                </label>

                <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors ${method === "ONLINE" ? "border-blush bg-blush/5" : "border-border"}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="ONLINE" 
                    checked={method === "ONLINE"} 
                    onChange={() => setMethod("ONLINE")}
                    className="mt-1"
                  />
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-cocoa">Online Payment (Easypaisa / JazzCash)</p>
                      <span className="rounded-full bg-sage/20 px-2 py-0.5 text-xs font-bold text-sage">10% OFF</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Send payment directly to our account and upload a screenshot.</p>
                    
                    {method === "ONLINE" && (
                      <div className="mt-4 rounded-xl bg-background p-4 text-sm">
                        <p className="mb-2 text-cocoa">Please send exactly <strong className="font-bold text-blush">Rs. {formatPrice(finalTotal)}</strong> to the following number via Easypaisa or JazzCash:</p>
                        <div className="mb-4 rounded-lg bg-secondary p-3 text-center text-lg font-bold tracking-widest text-cocoa">
                          0308 2057 133
                        </div>
                        
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cocoa">Upload Transaction Screenshot</label>
                        <div className="flex w-full items-center justify-center">
                          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card hover:bg-secondary/50">
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                              <UploadCloud className="mb-2 h-6 w-6 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {file ? (
                                  <span className="font-medium text-blush">{file.name}</span>
                                ) : (
                                  <>Click to upload screenshot</>
                                )}
                              </p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </section>
          </form>

          {/* Order Summary */}
          <div>
            <aside className="sticky top-24 rounded-3xl bg-secondary p-6 shadow-sm">
              <h3 className="mb-4 font-serif text-xl text-cocoa">Order Summary</h3>
              <ul className="mb-6 space-y-3">
                {items.map((i) => (
                  <li key={i.product.id} className="flex items-center gap-3 text-sm">
                    <img src={i.product.image} className="h-12 w-12 rounded-md object-cover" alt={i.product.name} />
                    <div className="flex-1">
                      <p className="font-medium text-cocoa">{i.product.name}</p>
                      <p className="text-muted-foreground">Qty: {i.quantity} {i.variant && `| ${i.variant}`}</p>
                    </div>
                    <p className="font-medium">{formatPrice(i.product.price * i.quantity)}</p>
                  </li>
                ))}
              </ul>

              {/* Promo Code Section */}
              <div className="mb-6 rounded-2xl bg-background p-4 border border-border">
                {appliedPromo ? (
                  <div className="flex items-center justify-between rounded-xl bg-sage/10 p-3">
                    <div className="flex items-center gap-2 text-sage">
                      <Tag className="h-4 w-4" />
                      <span className="font-bold">{appliedPromo.code}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="text-xs font-medium text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-cocoa">Promo Code</label>
                    <div className="flex gap-2">
                      <input 
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                        placeholder="e.g. INFLUENCER20"
                        className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-blush"
                      />
                      <button 
                        type="button" 
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo || !promoCodeInput.trim()}
                        className="rounded-xl bg-cocoa px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-blush disabled:opacity-50"
                      >
                        {isApplyingPromo ? "..." : "Apply"}
                      </button>
                    </div>
                    {promoError && <p className="mt-2 text-xs text-red-500">{promoError}</p>}
                  </div>
                )}
              </div>
              
              <dl className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
                
                {promoDiscountAmount > 0 && (
                  <div className="flex justify-between text-sage">
                    <dt>Promo Code Discount</dt>
                    <dd>-{formatPrice(promoDiscountAmount)}</dd>
                  </div>
                )}

                {method === "ONLINE" && (
                  <div className="flex justify-between text-sage">
                    <dt>Online Payment (10%)</dt>
                    <dd>-{formatPrice(onlineDiscountAmount)}</dd>
                  </div>
                )}

                <div className="flex justify-between border-t border-border pt-3 font-serif text-xl text-cocoa">
                  <dt>Total</dt><dd>{formatPrice(finalTotal)}</dd>
                </div>
              </dl>

              <button 
                type="submit" 
                form="checkout-form" 
                disabled={loading}
                className="btn-pill mt-6 flex w-full items-center justify-center gap-2 bg-cocoa text-primary-foreground hover:bg-blush disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Processing..." : "Place Order"}
              </button>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const input = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-blush";
