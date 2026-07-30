import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/cart";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const products = await getProducts();
    return { products };
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { products } = Route.useLoaderData();
  const activeProducts = products.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Mock Stats */}
        <StatCard title="Total Revenue" value={formatPrice(124500)} icon={<DollarSign className="h-5 w-5" />} trend="+14% from last month" />
        <StatCard title="Orders" value="142" icon={<ShoppingBag className="h-5 w-5" />} trend="+5% from last month" />
        <StatCard title="Active Products" value={activeProducts.toString()} icon={<Package className="h-5 w-5" />} trend="2 pending review" />
        <StatCard title="Conversion Rate" value="3.2%" icon={<TrendingUp className="h-5 w-5" />} trend="+0.4% from last month" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-xl text-cocoa">Recent Orders</h2>
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50">
          <p className="text-sm text-muted-foreground">Detailed order history will appear here.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-blush">{icon}</div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-semibold text-cocoa">{value}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
      </div>
    </div>
  );
}
