import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { useCart } from "@/lib/cart";
import { skinCareSubs } from "@/lib/products";
import { cn } from "@/lib/utils";

export function Header() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [skinOpen, setSkinOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { to: "/shop", label: "Shop All" },
    { to: "/about", label: "About Us" },
    { to: "/blog", label: "Blogs" },
    { to: "/contact", label: "Contact" },
  ] as const;

  const collectionLinks = [
    { category: "new-arrivals", label: "New Arrivals" },
    { category: "hair-care", label: "Hair Care" },
    { category: "bundles", label: "Bundles" },
    { category: "accessories", label: "Accessories" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full">
      <AnnouncementBar />
      <div className={cn(
        "w-full border-b border-border bg-cream/95 backdrop-blur transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}>
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" aria-label="Herbian Glow Home">
              <img src="/logo.webp" alt="Herbian Glow" className="h-10 w-auto object-contain" />
            </Link>
          </div>

          <nav className="hidden items-center justify-center gap-7 text-sm font-medium text-cocoa lg:flex">
            <Link to="/shop" className="hover:text-blush">Shop All</Link>
            <Link to="/collection/$category" params={{ category: "new-arrivals" }} className="hover:text-blush">New Arrivals</Link>
            <div className="relative" onMouseEnter={() => setSkinOpen(true)} onMouseLeave={() => setSkinOpen(false)}>
              <Link to="/collection/$category" params={{ category: "skin-care" }} className="flex items-center gap-1 hover:text-blush">
                Skin Care <ChevronDown className="h-3 w-3" />
              </Link>
              {skinOpen && (
                <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3">
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {skinCareSubs.map((s) => (
                        <Link
                          key={s}
                          to="/collection/$category"
                          params={{ category: s.toLowerCase().replace(/\s+/g, '-') }}
                          className="rounded-lg px-3 py-2 text-cocoa hover:bg-secondary hover:text-blush"
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/collection/$category" params={{ category: "hair-care" }} className="hover:text-blush">Hair Care</Link>
            <Link to="/collection/$category" params={{ category: "bundles" }} className="hover:text-blush">Bundles</Link>
            <Link to="/collection/$category" params={{ category: "accessories" }} className="hover:text-blush">Accessories</Link>
            <Link to="/about" className="hover:text-blush">About</Link>
            <Link to="/blog" className="hover:text-blush">Blogs</Link>
            <Link to="/contact" className="hover:text-blush">Contact</Link>
          </nav>

          <div className="flex items-center gap-1 text-cocoa">
            <button aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/login" aria-label="Account" className="hidden h-10 w-10 place-items-center rounded-full hover:bg-secondary sm:grid">
              <User className="h-5 w-5" />
            </Link>
            <button aria-label="Wishlist" className="hidden h-10 w-10 place-items-center rounded-full hover:bg-secondary sm:grid">
              <Heart className="h-5 w-5" />
            </button>
            <button
              onClick={open}
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-blush text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-cocoa/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-cream p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl text-cocoa">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-cocoa hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              {collectionLinks.map((l) => (
                <Link
                  key={l.category}
                  to="/collection/$category"
                  params={{ category: l.category }}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-cocoa hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/collection/$category"
                params={{ category: "skin-care" }}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-cocoa hover:bg-secondary"
              >
                Skin Care
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
