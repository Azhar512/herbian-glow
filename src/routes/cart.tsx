import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { formatPrice, useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Herbian Glow" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, update, remove, subtotal } = useCart();
  const shipping = subtotal > 3000 || items.length === 0 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="mb-10 text-center font-serif text-4xl text-cocoa md:text-5xl">Your Cart</h1>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-14 text-center">
            <p className="text-muted-foreground">Your cart is currently empty.</p>
            <Link to="/shop" className="btn-pill mt-5 bg-blush text-primary-foreground">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-[1fr_360px]">
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.product.id} className="grid grid-cols-[100px_1fr_auto] gap-4 rounded-2xl bg-card p-4 sm:grid-cols-[120px_1fr_auto]">
                  <img src={i.product.image} alt={i.product.name} className="aspect-square rounded-xl object-cover" />
                  <div className="min-w-0">
                    <Link to="/product/$slug" params={{ slug: i.product.slug }} className="font-serif text-lg text-cocoa hover:text-blush">
                      {i.product.name}
                    </Link>
                    {i.variant && <p className="text-xs text-muted-foreground">Size: {i.variant}</p>}
                    <p className="mt-1 text-sm text-muted-foreground">{formatPrice(i.product.price)}</p>
                    <div className="mt-3 flex w-fit items-center rounded-full border border-border">
                      <button onClick={() => update(i.product.id, i.quantity - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{i.quantity}</span>
                      <button onClick={() => update(i.product.id, i.quantity + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => remove(i.product.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                    <span className="font-medium text-cocoa">{formatPrice(i.product.price * i.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl bg-secondary p-6">
              <h3 className="font-serif text-xl text-cocoa">Order Summary</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
                <div className="mt-3 flex justify-between border-t border-border pt-3 font-serif text-xl text-cocoa">
                  <dt>Total</dt><dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <Link to="/checkout" className="btn-pill mt-5 w-full bg-cocoa text-primary-foreground hover:bg-blush text-center block">Proceed to Checkout</Link>
              <Link to="/shop" className="mt-3 block text-center text-xs text-muted-foreground underline">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}
