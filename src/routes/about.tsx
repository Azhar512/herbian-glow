import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { Layout } from "@/components/Layout";
import aboutImg from "@/assets/about-image.jpg";
import hero2 from "@/assets/hero-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Herbian Glow" },
      { name: "description", content: "Herbian Glow is a small-batch, cruelty-free organic skincare brand rooted in the healing power of plants." },
      { property: "og:title", content: "About Herbian Glow" },
      { property: "og:description", content: "Small-batch, cruelty-free organic skincare rooted in the healing power of plants." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
        <img src={hero2} alt="Herbian Glow" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blush">Our Story</p>
            <h1 className="mt-2 font-serif text-5xl text-cocoa md:text-6xl">Rooted in nature. Made with love.</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:px-6">
        <p className="font-serif text-2xl leading-relaxed text-cocoa md:text-3xl">
          Herbian Glow was born from the belief that your skin deserves nothing less than
          the pure goodness of plants — nurtured slowly, blended thoughtfully, and shared
          generously.
        </p>
        <p className="text-muted-foreground">
          Every jar and bottle in our collection is small-batch, cruelty-free, and made with
          organic botanicals sourced with care from farmers we trust. We don't chase trends.
          We chase results — the kind you can see in the mirror and feel on your skin.
        </p>
        <p className="text-muted-foreground">
          Because we believe glow isn't something you buy. It's something you nurture.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Leaf, title: "100% Organic", text: "Botanicals sourced from trusted organic farms." },
            { icon: Heart, title: "Cruelty-Free", text: "Never tested on animals — only on us and our loved ones." },
            { icon: Sparkles, title: "Small-Batch", text: "Hand-poured in tiny batches for freshness and love." },
            { icon: ShieldCheck, title: "Dermatologist Tested", text: "Safe, gentle, and clinically vetted." },
          ].map((v) => (
            <div key={v.title} className="rounded-3xl bg-card p-6">
              <v.icon className="h-7 w-7 text-blush" />
              <h3 className="mt-3 font-serif text-xl text-cocoa">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid overflow-hidden rounded-3xl bg-secondary md:grid-cols-2">
          <img src={aboutImg} alt="Founder" className="h-full w-full object-cover" />
          <div className="flex flex-col justify-center gap-4 p-10 md:p-14">
            <p className="text-xs uppercase tracking-[0.3em] text-blush">From the founder</p>
            <h2 className="font-serif text-3xl text-cocoa md:text-4xl">A note to you</h2>
            <p className="text-muted-foreground">
              I started Herbian Glow in my grandmother's kitchen, following recipes she scribbled
              on the back of old envelopes. What began as gifts for family became a promise —
              that beauty should be gentle, generous, and rooted in real ingredients.
            </p>
            <p className="text-cocoa">— Aiman, Founder</p>
            <div className="mt-2">
              <Link to="/shop" className="btn-pill bg-blush text-primary-foreground hover:bg-blush-dark">Explore the Collection</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
