import { createFileRoute } from "@tanstack/react-router";
import { formatPrice } from "@/lib/cart";

export const Route = createFileRoute("/admin/orders/")({
  component: AdminOrders,
});

// Mock Orders Data
const mockOrders = [
  { id: "ORD-1001", customer: "Ayesha Khan", date: "2026-07-10", total: 4300, status: "Delivered", items: 2 },
  { id: "ORD-1002", customer: "Zainab Ali", date: "2026-07-11", total: 1850, status: "Processing", items: 1 },
  { id: "ORD-1003", customer: "Fatima S.", date: "2026-07-12", total: 5450, status: "Shipped", items: 4 },
  { id: "ORD-1004", customer: "Omar Farooq", date: "2026-07-12", total: 1450, status: "Pending", items: 1 },
];

function AdminOrders() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-cocoa">Orders</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Items</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-secondary/20">
                <td className="px-6 py-4 font-medium text-cocoa">{order.id}</td>
                <td className="px-6 py-4 text-cocoa">{order.customer}</td>
                <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                <td className="px-6 py-4 text-muted-foreground">{order.items}</td>
                <td className="px-6 py-4 text-cocoa">{formatPrice(order.total)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
