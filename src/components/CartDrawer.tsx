import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatPrice, useCart } from "@/lib/cart";

const FREE_SHIP = 3000;

export function CartDrawer() {
  const { isOpen, close, items, remove, update, subtotal } = useCart();
  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-cocoa/40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="font-serif text-xl text-cocoa">Your Cart ({items.length})</h3>
              <button onClick={close} aria-label="Close cart"><X className="h-5 w-5" /></button>
            </div>

            <div className="border-b border-border bg-secondary/50 px-5 py-4">
              {remaining > 0 ? (
                <p className="text-xs text-cocoa">
                  Add <b>{formatPrice(remaining)}</b> more for <b>free shipping</b>
                </p>
              ) : (
                <p className="text-xs font-medium text-sage">🎉 You've unlocked free shipping!</p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-blush transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <button onClick={close} className="btn-pill mt-2 bg-blush text-primary-foreground">Continue Shopping</button>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  {items.map((i) => (
                    <li key={i.product.id} className="flex gap-4">
                      <img src={i.product.image} alt={i.product.name} className="h-20 w-20 rounded-xl object-cover" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-cocoa">{i.product.name}</p>
                            {i.variant && <p className="text-xs text-muted-foreground">Size: {i.variant}</p>}
                          </div>
                          <button onClick={() => remove(i.product.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-border">
                            <button onClick={() => update(i.product.id, i.quantity - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                            <span className="w-6 text-center text-sm">{i.quantity}</span>
                            <button onClick={() => update(i.product.id, i.quantity + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
                          </div>
                          <span className="font-medium text-cocoa">{formatPrice(i.product.price * i.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-5">
                <div className="mb-4 flex items-center justify-between text-cocoa">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-serif text-xl">{formatPrice(subtotal)}</span>
                </div>
                <Link to="/cart" onClick={close} className="btn-pill w-full bg-cocoa text-primary-foreground hover:bg-blush">
                  Proceed to Checkout
                </Link>
                <button onClick={close} className="mt-2 w-full text-center text-xs text-muted-foreground underline underline-offset-2">
                  or continue shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
