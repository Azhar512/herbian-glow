import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { categories, getProducts } from "@/lib/products";

export const Route = createFileRoute("/collection/$category")({
  head: ({ params }) => {
    const label = niceLabel(params.category);
    return {
      meta: [
        { title: `${label} — Herbian Glow` },
        { name: "description", content: `Shop our ${label.toLowerCase()} collection at Herbian Glow.` },
      ],
    };
  },
  loader: async () => {
    const products = await getProducts();
    return { products };
  },
  component: CollectionPage,
});

function niceLabel(slug: string) {
  if (slug === "new-arrivals") return "New Arrivals";
  return categories.find((c) => c.slug === slug)?.label ?? slug.replace("-", " ");
}

function CollectionPage() {
  const { category } = Route.useParams();
  const { products } = Route.useLoaderData();
  const label = niceLabel(category);
  const list =
    category === "new-arrivals"
      ? products.filter((p) => p.is_new)
      : products.filter((p) => p.category === category);

  return (
    <Layout>
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-14">
          <p className="text-xs uppercase tracking-[0.3em] text-blush">Collection</p>
          <h1 className="mt-2 font-serif text-4xl text-cocoa sm:text-5xl">{label}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-14 text-center">
            <p className="text-muted-foreground">Nothing here yet — check back soon.</p>
            <Link to="/shop" className="btn-pill mt-4 bg-blush text-primary-foreground">Shop All</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
