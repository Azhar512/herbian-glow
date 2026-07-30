import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = {
  product: Product;
  quantity: number;
  variant?: string;
};

type CartContextType = {
  items: CartItem[];
  wishlist: string[];
  isOpen: boolean;
  add: (p: Product, quantity?: number, variant?: string) => void;
  remove: (id: string) => void;
  update: (id: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggleWishlist: (id: string) => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("hg_cart");
      if (s) setItems(JSON.parse(s));
      const w = localStorage.getItem("hg_wishlist");
      if (w) setWishlist(JSON.parse(w));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("hg_cart", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("hg_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const value = useMemo<CartContextType>(() => {
    const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return {
      items, wishlist, isOpen,
      add: (p, q = 1, variant) => {
        setItems((prev) => {
          const idx = prev.findIndex((i) => i.product.id === p.id && i.variant === variant);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + q };
            return next;
          }
          return [...prev, { product: p, quantity: q, variant }];
        });
        setIsOpen(true);
      },
      remove: (id) => setItems((prev) => prev.filter((i) => i.product.id !== id)),
      update: (id, q) => setItems((prev) => prev.map((i) => i.product.id === id ? { ...i, quantity: Math.max(1, q) } : i)),
      clear: () => setItems([]),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggleWishlist: (id) => setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]),
      subtotal, count,
    };
  }, [items, wishlist, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

export function formatPrice(n: number) {
  return `Rs. ${n.toLocaleString("en-PK")}`;
}
