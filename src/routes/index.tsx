import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Leaf, ShieldCheck, Sparkles, Truck, Star } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { categories, getProducts } from "@/lib/products";
import { formatPrice, useCart } from "@/lib/cart";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import featured from "@/assets/featured-product.jpg";
import aboutImg from "@/assets/about-image.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async () => {
    const products = await getProducts();
    return { products };
  },
});

const slides = [
  { image: hero1, eyebrow: "New Season", title: "Nature's Glow,\nBottled for You", copy: "Discover our botanical rituals — pure, potent, and made with love.", cta: "Shop the Ritual" },
  { image: hero2, eyebrow: "Bestsellers", title: "Kissed by\nRose & Sage", copy: "Handcrafted formulas that let your skin remember its softest self.", cta: "Explore Bestsellers" },
];

function HomePage() {
  return (
    <Layout>
      <Hero />
      <ShopByCategory />
      <FeaturedSpotlight />
      <BestSellers />
      <Marquee />
      <NewArrivals />
      <Accessories />
      <AboutStrip />
      <ShopTheLook />
      <TrustBadges />
      <Testimonials />
      <Newsletter />
    </Layout>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[68vh] min-h-[520px] w-full">
        {slides.map((slide, idx) => (
          <img
            key={idx}
            src={slide.image}
            alt=""
            width={1600}
            height={900}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-cream/85 via-cream/40 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blush">{s.eyebrow}</p>
            <h1 className="whitespace-pre-line font-serif text-5xl leading-[1.05] text-cocoa sm:text-6xl md:text-7xl">
              {s.title}
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">{s.copy}</p>
            <div className="mt-8 flex gap-3">
              <Link to="/shop" className="btn-pill bg-blush text-primary-foreground hover:bg-blush-dark">{s.cta}</Link>
              <Link to="/about" className="btn-pill border border-cocoa text-cocoa hover:bg-cocoa hover:text-primary-foreground">Our Story</Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <button onClick={() => setI((v) => (v - 1 + slides.length) % slides.length)} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full bg-cream/80 backdrop-blur hover:bg-cream">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-blush" : "w-1.5 bg-cocoa/30"}`}
              />
            ))}
          </div>
          <button onClick={() => setI((v) => (v + 1) % slides.length)} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full bg-cream/80 backdrop-blur hover:bg-cream">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ShopByCategory() {
  return (
    <Section eyebrow="Curated for you" title="Shop by Category" description="From glow-boosting serums to nourishing hair rituals — find what your skin has been craving.">
      <div className="grid grid-cols-3 gap-4 sm:gap-6 md:grid-cols-6">
        {categories.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link to="/collection/$category" params={{ category: c.slug }} className="group flex flex-col items-center gap-3 text-center">
              <div className="aspect-square w-full overflow-hidden rounded-full bg-secondary">
                <img src={c.image} alt={c.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <span className="text-sm font-medium text-cocoa group-hover:text-blush">{c.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function FeaturedSpotlight() {
  const { products } = Route.useLoaderData();
  const p = products[0];
  const { add } = useCart();
  if (!p) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid overflow-hidden rounded-3xl bg-secondary md:grid-cols-2">
        <div className="relative aspect-square md:aspect-auto">
          <img src={featured} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center gap-4 p-8 md:p-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-blush">Hero product</p>
          <h2 className="font-serif text-4xl leading-tight text-cocoa md:text-5xl">{p.name}</h2>
          <p className="text-muted-foreground">{p.description}</p>
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl text-cocoa">{formatPrice(p.price)}</span>
            {p.original_price && <span className="text-muted-foreground line-through">{formatPrice(p.original_price)}</span>}
          </div>
          <div className="mt-2 flex gap-3">
            <button onClick={() => add(p, 1)} className="btn-pill bg-blush text-primary-foreground hover:bg-blush-dark">Add to Cart</button>
            <Link to="/product/$slug" params={{ slug: p.slug }} className="btn-pill border border-cocoa text-cocoa hover:bg-cocoa hover:text-primary-foreground">
              View Details
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BestSellers() {
  const { products } = Route.useLoaderData();
  const list = products.filter((p) => p.is_best_seller);
  return (
    <Section eyebrow="Loved by many" title="Best Sellers">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </Section>
  );
}

function Marquee() {
  const items = ["Unleash Your Natural Glow", "Skincare That Loves You Back", "Pure. Herbal. Effective.", "Cruelty-Free & Handcrafted"];
  return (
    <div className="overflow-hidden border-y border-border bg-blush/10 py-6">
      <div className="marquee-track font-serif text-2xl text-blush-dark md:text-3xl">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t} <Leaf className="h-4 w-4 text-sage" />
          </span>
        ))}
      </div>
    </div>
  );
}

function NewArrivals() {
  const { products } = Route.useLoaderData();
  const list = products.filter((p) => p.is_new);
  return (
    <Section eyebrow="Fresh in bloom" title="New Arrivals">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="mt-10 text-center">
        <Link to="/collection/$category" params={{ category: "new-arrivals" }} className="btn-pill border border-cocoa text-cocoa hover:bg-cocoa hover:text-primary-foreground">View All</Link>
      </div>
    </Section>
  );
}

function Accessories() {
  const { products } = Route.useLoaderData();
  const list = products.filter((p) => p.category === "accessories");
  return (
    <Section eyebrow="The finishing touch" title="Beauty Tools & Accessories">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </Section>
  );
}

function AboutStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid overflow-hidden rounded-3xl bg-cocoa text-cream md:grid-cols-2">
        <img src={aboutImg} alt="About Herbian Glow" loading="lazy" className="h-full w-full object-cover" />
        <div className="flex flex-col justify-center gap-5 p-10 md:p-14">
          <p className="text-xs uppercase tracking-[0.3em] text-blush">Our Story</p>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">Beauty that begins in the garden</h2>
          <p className="text-cream/80">
            Herbian Glow was born from a simple idea — that your skin deserves the pure goodness of plants,
            not the chemistry of a lab. Every formula is small-batch, cruelty-free, and made with organic
            botanicals sourced with care.
          </p>
          <div>
            <Link to="/about" className="btn-pill bg-blush text-primary-foreground hover:bg-blush-dark">Read Our Story</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopTheLook() {
  const { products } = Route.useLoaderData();
  const picks = [products[0], products[1], products[6]].filter(Boolean);
  return (
    <Section eyebrow="Shop the look" title="The Morning Ritual" description="A gentle three-step routine to wake up your glow.">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded-3xl">
          <img src={aboutImg} alt="Morning ritual" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-4">
          {picks.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-2xl bg-secondary p-4">
              <img src={p.image} alt={p.name} className="h-20 w-20 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="font-serif text-lg text-cocoa hover:text-blush">{p.name}</Link>
                <p className="text-sm text-muted-foreground">{formatPrice(p.price)}</p>
              </div>
              <QuickAdd id={p.id} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function QuickAdd({ id }: { id: string }) {
  const { add } = useCart();
  const { products } = Route.useLoaderData();
  const p = products.find((x) => x.id === id);
  if (!p) return null;
  return (
    <button onClick={() => add(p, 1)} className="btn-pill bg-cocoa px-4 py-2 text-xs text-primary-foreground hover:bg-blush">
      Add
    </button>
  );
}

function TrustBadges() {
  const badges = [
    { icon: Truck, label: "Nationwide Delivery" },
    { icon: Leaf, label: "100% Organic" },
    { icon: Sparkles, label: "Cruelty-Free" },
    { icon: ShieldCheck, label: "Dermatologist Tested" },
  ];
  return (
    <section className="border-y border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {badges.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-2 text-center">
            <b.icon className="h-7 w-7 text-blush" />
            <span className="text-sm font-medium text-cocoa">{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Ayesha K.", text: "The Rose Glow Serum transformed my skin in two weeks. It genuinely glows now.", rating: 5 },
    { name: "Zara M.", text: "Finally a hair oil that smells beautiful and actually reduced my hair fall.", rating: 5 },
    { name: "Sara F.", text: "Love the packaging, love the products. My whole routine is Herbian Glow now.", rating: 5 },
    { name: "Hina R.", text: "Aloe Hydration Cream is a summer lifesaver — feather light and calming.", rating: 5 },
  ];
  return (
    <Section eyebrow="Words from our community" title="Loved & Trusted">
      <div className="mb-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="flex">
          {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-blush stroke-blush" />)}
        </div>
        <span className="font-medium text-cocoa">4.8</span> from 500+ reviews
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl bg-card p-6 shadow-sm"
          >
            <div className="mb-3 flex gap-0.5">
              {[...Array(r.rating)].map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-blush stroke-blush" />)}
            </div>
            <p className="text-sm leading-relaxed text-cocoa">"{r.text}"</p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">— {r.name}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="rounded-3xl bg-blush/15 px-6 py-14 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-blush">Join the glow</p>
        <h2 className="font-serif text-3xl text-cocoa md:text-4xl">Get updates on new launches and offers</h2>
        <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email" required placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-blush"
          />
          <button className="btn-pill bg-cocoa text-primary-foreground hover:bg-blush">Sign Up</button>
        </form>
      </div>
    </section>
  );
}
