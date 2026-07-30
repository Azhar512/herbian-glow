import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Heart, Minus, Plus, Star, Eye, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, useCart } from "@/lib/cart";
import { getProduct, getProducts, type Product } from "@/lib/products";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/product/$slug")({
  head: ({ loaderData }) => {
    const p = (loaderData as any)?.product;
    if (!p) return { meta: [{ title: "Product — Herbian Glow" }] };
    return {
      meta: [
        { title: `${p.name} — Herbian Glow` },
        { name: "description", content: p.short_description },
        { property: "og:title", content: `${p.name} — Herbian Glow` },
        { property: "og:description", content: p.short_description },
      ],
    };
  },
  loader: async ({ params }) => {
    const product = await getProduct(params.slug);
    if (!product) throw notFound();
    const products = await getProducts();
    return { product, products };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-xl p-20 text-center">
        <h1 className="font-serif text-3xl">Product not found</h1>
        <Link to="/shop" className="btn-pill mt-6 bg-blush text-primary-foreground">Back to Shop</Link>
      </div>
    </Layout>
  ),
});

function ProductPage() {
  const { product, products } = Route.useLoaderData() as unknown as { product: Product; products: Product[] };
  const { add, wishlist, toggleWishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(product.variants?.[0]?.value);
  const [openAccordion, setOpenAccordion] = useState<string>("desc");
  const [viewers, setViewers] = useState(23);
  const [buyers, setBuyers] = useState(12);

  const [reviews, setReviews] = useState<any[]>([
    { name: "Fatima A.", stars: 5, text: "Absolutely obsessed! My skin has never felt this soft." },
    { name: "Ayesha K.", stars: 5, text: "The glow is unbelievable, I saw results in days." },
    { name: "Zainab B.", stars: 4, text: "Great product, delivery was a bit slow though." },
    { name: "Sana T.", stars: 5, text: "It smells heavenly! Definitely buying again." },
  ]);
  const [newReview, setNewReview] = useState({ name: '', text: '', stars: 5 });
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        // Map db format to our local format and combine with static ones
        const dbReviews = data.map(r => ({ name: r.customer_name, stars: r.rating, text: r.review_text }));
        setReviews([...dbReviews, ...reviews]);
      }
    }
    fetchReviews();
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    
    setLoadingReview(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: product.id,
      customer_name: newReview.name,
      rating: newReview.stars,
      review_text: newReview.text
    });

    setLoadingReview(false);
    if (!error) {
      setReviews([{ ...newReview }, ...reviews]);
      setNewReview({ name: '', text: '', stars: 5 });
    } else {
      alert("Error submitting review. Please try again.");
    }
  };

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 25) + 12);
    setBuyers(Math.floor(Math.random() * 15) + 5);
  }, [product.id]);
  const wished = wishlist.includes(product.id);
  const related = products.filter((p: Product) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-blush">Home</Link> / <Link to="/shop" className="hover:text-blush">Shop</Link> / <span className="text-cocoa">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-secondary">
              <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
            </div>
            {product.status === "coming_soon" && (
              <span className="absolute left-4 top-4 rounded-full bg-yellow-600/90 px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm">
                Coming Soon
              </span>
            )}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[product.image, product.image, product.image, product.image].map((img, i) => (
                <button key={i} className="aspect-square overflow-hidden rounded-xl border-2 border-transparent bg-secondary hover:border-blush">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            {product.is_best_seller && <p className="text-xs uppercase tracking-[0.3em] text-blush">Bestseller</p>}
            <h1 className="mt-2 font-serif text-4xl text-cocoa md:text-5xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-blush stroke-blush" : "stroke-muted-foreground"}`} />)}
              </div>
              <span>{product.rating} · {product.reviews} reviews</span>
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-serif text-3xl text-cocoa">{formatPrice(product.price)}</span>
              {product.original_price && <span className="text-muted-foreground line-through">{formatPrice(product.original_price)}</span>}
            </div>

            <div className="mt-4 space-y-2 rounded-xl bg-secondary p-4 text-sm text-cocoa">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blush" />
                <span><strong className="font-semibold">{viewers} people</strong> are looking at this right now.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-sage" />
                <span><strong className="font-semibold">{buyers} people</strong> bought this in the last 12 hours.</span>
              </div>
            </div>

            <p className="mt-5 text-muted-foreground">{product.short_description}</p>

            <ul className="mt-5 space-y-1.5 text-sm text-cocoa">
              {product.benefits.map((b: string) => (
                <li key={b} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sage" />{b}</li>
              ))}
            </ul>

            {product.variants && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-cocoa">Size</p>
                <div className="flex gap-2">
                  {product.variants.map((v: { value: string; label: string }) => (
                    <button
                      key={v.value} onClick={() => setVariant(v.value)}
                      className={`btn-pill border ${variant === v.value ? "border-blush bg-blush text-primary-foreground" : "border-border text-cocoa hover:border-blush"}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3"><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="p-3"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={() => toggleWishlist(product.id)} aria-label="Wishlist" className="grid h-12 w-12 place-items-center rounded-full border border-border hover:border-blush">
                <Heart className={`h-5 w-5 ${wished ? "fill-blush stroke-blush" : ""}`} />
              </button>
            </div>

            <button
              onClick={() => product.in_stock && product.status !== "coming_soon" && add(product, qty, variant)}
              disabled={!product.in_stock || product.status === "coming_soon"}
              className="btn-pill mt-4 w-full bg-cocoa text-primary-foreground hover:bg-blush disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.status === "coming_soon" 
                ? "Coming Soon" 
                : product.in_stock 
                  ? `Add to Cart · ${formatPrice(product.price * qty)}` 
                  : "Sold Out"}
            </button>

            <div className="mt-8 space-y-2">
              {[
                { id: "desc", title: "Description", content: product.description },
                { id: "ing", title: "Key Ingredients", content: product.ingredients.join(" · ") },
                { id: "use", title: "How to Use", content: product.how_to_use },
                { id: "ship", title: "Shipping & Returns", content: "Free shipping on prepaid orders over Rs. 3,000. 7-day easy returns on unopened products." },
              ].map((a) => (
                <div key={a.id} className="border-b border-border">
                  <button onClick={() => setOpenAccordion(openAccordion === a.id ? "" : a.id)} className="flex w-full items-center justify-between py-4 text-left font-medium text-cocoa">
                    {a.title}
                    <span className="text-blush">{openAccordion === a.id ? "−" : "+"}</span>
                  </button>
                  {openAccordion === a.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="pb-4 text-sm text-muted-foreground">
                      {a.content}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-20">
          <h2 className="font-serif text-3xl text-cocoa">Customer Reviews</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-[280px_1fr]">
            <div className="rounded-2xl bg-secondary p-6">
              <p className="font-serif text-5xl text-cocoa">{product.rating}</p>
              <div className="mt-1 flex">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-blush stroke-blush" />)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Based on {product.reviews} reviews</p>
              <div className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs">
                    <span className="w-6">{s}★</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full bg-blush" style={{ width: `${s === 5 ? 80 : s === 4 ? 15 : 3}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {reviews.map((r, i) => (
                <div key={i} className="border-b border-border pb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(r.stars)].map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-blush stroke-blush" />)}
                    </div>
                    <span className="text-sm font-medium text-cocoa">{r.name}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
              
              <div className="mt-8 rounded-2xl bg-secondary/50 p-6">
                <h3 className="font-serif text-xl text-cocoa">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-cocoa mb-1">Name</label>
                    <input 
                      required 
                      value={newReview.name} 
                      onChange={e => setNewReview({...newReview, name: e.target.value})}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:border-blush" 
                      placeholder="Your name" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-cocoa mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setNewReview({...newReview, stars: star})}
                        >
                          <Star className={`h-5 w-5 ${newReview.stars >= star ? "fill-blush stroke-blush" : "stroke-muted-foreground"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-cocoa mb-1">Review</label>
                    <textarea 
                      required 
                      value={newReview.text}
                      onChange={e => setNewReview({...newReview, text: e.target.value})}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:border-blush resize-none" 
                      rows={3} 
                      placeholder="What did you think?" 
                    />
                  </div>
                  <button type="submit" disabled={loadingReview} className="btn-pill bg-blush text-primary-foreground hover:bg-blush-dark disabled:opacity-50">
                    {loadingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-serif text-3xl text-cocoa">You may also like</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.map((p: Product) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
