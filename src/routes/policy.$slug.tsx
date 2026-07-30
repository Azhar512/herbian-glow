import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

const policies: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "This is a placeholder Privacy Policy for Herbian Glow. Replace with your real policy before going live.",
      "We collect only the information needed to fulfill your order and improve your shopping experience. We never sell your data.",
      "For any privacy-related questions, email hello@herbianglow.com.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By using this website you agree to the following terms. Placeholder copy — replace before launch.",
      "All content, images and product formulations are the property of Herbian Glow.",
    ],
  },
  shipping: {
    title: "Shipping Policy",
    body: [
      "We offer nationwide delivery across Pakistan.",
      "Free shipping on prepaid orders above Rs. 3,000. Standard delivery takes 3–5 business days.",
    ],
  },
  refund: {
    title: "Refund Policy",
    body: [
      "We accept returns on unopened products within 7 days of delivery.",
      "To initiate a return, please email hello@herbianglow.com with your order number.",
    ],
  },
};

export const Route = createFileRoute("/policy/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${policies[params.slug]?.title ?? "Policy"} — Herbian Glow` }],
  }),
  component: PolicyPage,
});

function PolicyPage() {
  const { slug } = Route.useParams();
  const p = policies[slug] ?? { title: "Policy", body: ["Content coming soon."] };
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-serif text-4xl text-cocoa md:text-5xl">{p.title}</h1>
        <div className="mt-8 space-y-5 text-muted-foreground">
          {p.body.map((para, i) => <p key={i} className="leading-relaxed">{para}</p>)}
        </div>
      </div>
    </Layout>
  );
}
