import { createFileRoute, Link } from "@tanstack/react-router";
import { DollarSign, Package, ShoppingBag, TrendingUp, Clock } from "lucide-react";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/cart";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const products = await getProducts();
    const { data: allOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    const orders = allOrders || [];
    const pendingCount = orders.filter(o => o.status === "PENDING").length;
    
    // Calculate total revenue from delivered/shipped/pending orders (excluding cancelled)
    const validOrders = orders.filter(o => o.status !== "CANCELLED");
    const totalRevenue = validOrders.reduce((sum, order) => sum + order.total_amount, 0);
    
    return { products, orders, pendingCount, totalRevenue, totalOrders: orders.length };
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { products, orders, pendingCount, totalRevenue, totalOrders } = Route.useLoaderData();
  const activeProducts = products.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={formatPrice(totalRevenue)} icon={<DollarSign className="h-5 w-5" />} trend="All time" />
        <StatCard title="Total Orders" value={totalOrders.toString()} icon={<ShoppingBag className="h-5 w-5" />} trend="All time" />
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-yellow-800">Pending Orders</p>
            <div className="text-yellow-600"><Clock className="h-5 w-5" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-yellow-900">{pendingCount}</h3>
            <p className="mt-1 text-xs text-yellow-700">Requires your attention</p>
          </div>
        </div>
        <StatCard title="Active Products" value={activeProducts.toString()} icon={<Package className="h-5 w-5" />} trend="2 pending review" />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="font-serif text-xl text-cocoa">New & Pending Orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-sage hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cocoa">
            <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.filter(o => o.status === 'PENDING').slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-secondary/30">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{order.id.split("-")[0]}</td>
                  <td className="px-6 py-4 font-medium">{order.customer_name}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  </td>
                </tr>
              ))}
              {orders.filter(o => o.status === 'PENDING').length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No pending orders right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
