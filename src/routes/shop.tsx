import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { categories, getProducts } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — Herbian Glow" },
      { name: "description", content: "Shop the full Herbian Glow collection of organic herbal skincare, hair care and beauty rituals." },
    ],
  }),
  loader: async () => {
    const products = await getProducts();
    return { products };
  },
  component: ShopPage,
});

const sorts = ["Best selling", "Newest", "Price: Low to High", "Price: High to Low"] as const;

function ShopPage() {
  const { products } = Route.useLoaderData();
  const [cat, setCat] = useState<string>("all");
  const [inStock, setInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Best selling");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (inStock && !p.in_stock) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    switch (sort) {
      case "Newest": list = [...list].sort((a, b) => Number(!!b.is_new) - Number(!!a.is_new)); break;
      case "Price: Low to High": list = [...list].sort((a, b) => a.price - b.price); break;
      case "Price: High to Low": list = [...list].sort((a, b) => b.price - a.price); break;
      default: list = [...list].sort((a, b) => Number(!!b.is_best_seller) - Number(!!a.is_best_seller));
    }
    return list;
  }, [cat, inStock, maxPrice, sort]);

  return (
    <Layout>
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-14">
          <p className="text-xs uppercase tracking-[0.3em] text-blush">Collection</p>
          <h1 className="mt-2 font-serif text-4xl text-cocoa sm:text-5xl">Shop All</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">Every drop of Herbian Glow, in one place.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="space-y-6 rounded-2xl border border-border bg-card p-5">
              <FilterGroup title="Category">
                <button onClick={() => setCat("all")} className={row(cat === "all")}>All</button>
                {categories.map((c) => (
                  <button key={c.slug} onClick={() => setCat(c.slug)} className={row(cat === c.slug)}>{c.label}</button>
                ))}
              </FilterGroup>
              <FilterGroup title="Price">
                <input type="range" min={500} max={6000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-blush" />
                <div className="text-xs text-muted-foreground">Up to Rs. {maxPrice.toLocaleString()}</div>
              </FilterGroup>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-blush" />
                In stock only
              </label>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters((v) => !v)} className="btn-pill border border-border bg-card md:hidden">
                  <Filter className="h-4 w-4" /> Filters
                </button>
                <span className="text-sm text-muted-foreground">{filtered.length} products</span>
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-blush">
                {sorts.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
                No products match your filters.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-cocoa">{title}</h4>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function row(active: boolean) {
  return `text-left rounded-lg px-3 py-1.5 text-sm ${active ? "bg-blush/15 text-blush font-medium" : "text-cocoa hover:bg-secondary"}`;
}
