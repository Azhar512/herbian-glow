import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/cart";
import { Eye, Clock, CheckCircle2, Truck, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) {
      await fetchOrders();
      alert("Order status updated successfully!");
    } else {
      alert("Failed to update status. Check permissions.");
    }
    setUpdatingId(null);
  };

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading orders...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-cocoa">Orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your customer orders</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cocoa">
            <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/30">
                  <td className="px-6 py-4 font-mono text-xs">
                    {order.id.split("-")[0]}...
                    <div className="mt-1 text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-muted-foreground">{order.customer_phone}</p>
                    <p className="text-muted-foreground">{order.customer_city}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${order.payment_method === 'ONLINE' ? 'bg-sage/20 text-sage' : 'bg-blush/20 text-blush'}`}>
                      {order.payment_method}
                    </span>
                    {order.screenshot_url && (
                      <a href={order.screenshot_url} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <ImageIcon className="h-3 w-3" /> View Receipt
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{formatPrice(order.total_amount)}</p>
                    {order.discount_amount > 0 && (
                      <p className="text-xs text-sage">- {formatPrice(order.discount_amount)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {order.status === 'PENDING' && <Clock className="h-4 w-4 text-yellow-600" />}
                      {order.status === 'SHIPPED' && <Truck className="h-4 w-4 text-blue-600" />}
                      {order.status === 'DELIVERED' && <CheckCircle2 className="h-4 w-4 text-sage" />}
                      <span className="font-medium">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none disabled:opacity-50"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No orders found.
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
