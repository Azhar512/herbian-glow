import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div>
          <div className="font-serif text-2xl text-cocoa">Herbian<span className="text-blush"> Glow</span></div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Nature's Glow, Bottled for You. Organic, cruelty-free skincare made with love.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://www.instagram.com/herbinaglow?igsh=cXV4ZHVlbWNseG5j" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-border text-cocoa transition hover:bg-blush hover:text-primary-foreground hover:border-blush">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61589932171147&mibextid=ZbWKwL" target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-border text-cocoa transition hover:bg-blush hover:text-primary-foreground hover:border-blush">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://www.tiktok.com/@herbina.glow?_r=1&_t=ZS-98MV0p8zlZc" target="_blank" rel="noreferrer" aria-label="TikTok" className="grid h-9 w-9 place-items-center rounded-full border border-border text-cocoa transition hover:bg-blush hover:text-primary-foreground hover:border-blush">
              <Music2 className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cocoa">Customer Care</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-blush">Contact Us</Link></li>
            <li><a href="https://wa.me/923164782073" className="hover:text-blush" target="_blank" rel="noreferrer">WhatsApp: +92 316 4782073</a></li>
            <li><Link to="/shop" className="hover:text-blush">Shop All</Link></li>
            <li><Link to="/login" className="hover:text-blush">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cocoa">Help & Policy</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/policy/$slug" params={{ slug: "privacy" }} className="hover:text-blush">Privacy Policy</Link></li>
            <li><Link to="/policy/$slug" params={{ slug: "terms" }} className="hover:text-blush">Terms & Conditions</Link></li>
            <li><Link to="/policy/$slug" params={{ slug: "shipping" }} className="hover:text-blush">Shipping Policy</Link></li>
            <li><Link to="/policy/$slug" params={{ slug: "refund" }} className="hover:text-blush">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cocoa">Join the Glow</h4>
          <p className="mb-3 text-sm text-muted-foreground">Get updates on new launches and exclusive offers.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-blush"
            />
            <button className="btn-pill bg-blush text-primary-foreground hover:bg-blush-dark">Sign Up</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Herbian Glow. All rights reserved.</span>
          <div className="flex items-center gap-2 opacity-70">
            <span className="rounded border border-border px-2 py-1">VISA</span>
            <span className="rounded border border-border px-2 py-1">Mastercard</span>
            <span className="rounded border border-border px-2 py-1">COD</span>
            <span className="rounded border border-border px-2 py-1">Easypaisa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
