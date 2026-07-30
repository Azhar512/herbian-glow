import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { getProducts, type Product } from "@/lib/products";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Herbian Glow" },
      { name: "description", content: "Get in touch with Herbian Glow — we'd love to hear from you." },
    ],
  }),
  loader: async () => {
    const products = await getProducts();
    return { products };
  },
  component: ContactPage,
});

function ContactPage() {
  const { products } = Route.useLoaderData() as unknown as { products: Product[] };
  const [sent, setSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const product = formData.get('product');
    const message = formData.get('message');
    
    let text = `Hello Herbian Glow!\n\nMy name is ${name}.\nEmail: ${email}\n`;
    if (product) {
      text += `Interested in: ${product}\n`;
    }
    text += `\nMessage:\n${message}`;
    
    const url = `https://wa.me/923164782073?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSent(true);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-blush">Say hello</p>
          <h1 className="mt-2 font-serif text-5xl text-cocoa md:text-6xl">Get in Touch</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Questions about your ritual, orders, or ingredients? We'd love to help.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <form
            onSubmit={handleContactSubmit}
            className="rounded-3xl bg-card p-8 shadow-sm"
          >
            {sent ? (
              <div className="py-10 text-center">
                <h3 className="font-serif text-2xl text-cocoa">Thank you 🌿</h3>
                <p className="mt-2 text-sm text-muted-foreground">We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="Name"><input name="name" required className={input} placeholder="Your name" /></Field>
                <Field label="Email"><input name="email" type="email" required className={input} placeholder="you@example.com" /></Field>
                <Field label="Interested Product (Optional)">
                  <select name="product" className={`${input} cursor-pointer`}>
                    <option value="">-- Select a Product --</option>
                    {products.map((p: Product) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Message">
                  <textarea name="message" rows={5} required className={`${input} resize-none`} placeholder="How can we help?" />
                </Field>
                <button className="btn-pill w-full bg-blush text-primary-foreground hover:bg-blush-dark">Send Message</button>
              </div>
            )}
          </form>

          <div className="space-y-5">
            <InfoRow icon={MapPin} title="Visit us" text="24 Rose Lane, Gulberg III, Lahore, Pakistan" />
            <InfoRow icon={Phone} title="Call" text="+92 316 4782073" />
            <InfoRow icon={MessageCircle} title="WhatsApp" text="Chat with us anytime" href="https://wa.me/923164782073" />
            <InfoRow icon={Mail} title="Email" text="hello@herbianglow.com" href="mailto:hello@herbianglow.com" />
            <InfoRow icon={Instagram} title="Instagram" text="@herbianglow" href="https://instagram.com" />
            <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary">
              <div className="grid h-full place-items-center text-muted-foreground">Map placeholder</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const input = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-blush";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cocoa">{label}</span>
      {children}
    </label>
  );
}

function InfoRow({ icon: Icon, title, text, href }: { icon: any; title: string; text: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4 rounded-2xl bg-card p-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush/15 text-blush">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium text-cocoa">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
  return href ? <a href={href} className="block hover:opacity-90">{content}</a> : content;
}
