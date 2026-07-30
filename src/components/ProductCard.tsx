import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useCart, formatPrice } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add, wishlist, toggleWishlist } = useCart();
  const wished = wishlist.includes(product.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col"
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden rounded-2xl bg-card"
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {product.is_new && (
          <span className="absolute left-3 top-3 rounded-full bg-sage px-3 py-1 text-xs font-medium text-primary-foreground">
            New
          </span>
        )}
        {product.original_price && (
          <span className="absolute left-3 top-3 mt-8 rounded-full bg-blush-dark px-3 py-1 text-xs font-medium text-primary-foreground">
            Sale
          </span>
        )}
        {product.status === "coming_soon" ? (
          <span className="absolute right-3 top-3 rounded-full bg-yellow-600/90 px-3 py-1 text-xs font-medium text-primary-foreground">
            Coming Soon
          </span>
        ) : !product.in_stock && (
          <span className="absolute right-3 top-3 rounded-full bg-cocoa/90 px-3 py-1 text-xs font-medium text-primary-foreground">
            Out of Stock
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-cream/90 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-cream"
        >
          <Heart className={cn("h-4 w-4", wished ? "fill-blush stroke-blush" : "stroke-cocoa")} />
        </button>
      </Link>
      <div className="mt-4 flex flex-col items-start gap-1">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="font-serif text-lg leading-tight text-cocoa hover:text-blush">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-blush stroke-blush" />
          <span>{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-medium text-cocoa">{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>
        <button
          onClick={() => product.in_stock && product.status !== "coming_soon" && add(product, 1)}
          disabled={!product.in_stock || product.status === "coming_soon"}
          className="btn-pill mt-3 w-full bg-cocoa text-primary-foreground hover:bg-blush disabled:cursor-not-allowed disabled:opacity-50"
        >
          {product.status === "coming_soon" ? "Coming Soon" : product.in_stock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </motion.div>
  );
}
