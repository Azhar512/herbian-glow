import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/cart";
import { Calendar as CalendarIcon, TrendingUp, DollarSign, Package } from "lucide-react";

export const Route = createFileRoute("/admin/sales")({
  component: AdminSalesPage,
});

type DateFilter = "today" | "last2days" | "thismonth" | "all" | "custom";

function AdminSalesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState<DateFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // Only fetch DELIVERED or paid orders? The prompt didn't specify, but usually sales = all orders or delivered orders. We'll fetch all and maybe show status. Let's fetch all non-cancelled.
    const { data } = await supabase
      .from("orders")
      .select("*")
      .neq("status", "CANCELLED")
      .order("created_at", { ascending: false });
      
    if (data) setOrders(data);
    setLoading(false);
  };

  const filteredOrders = useMemo(() => {
    const now = new Date();
    
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      
      switch(filter) {
        case "today":
          return orderDate.toDateString() === now.toDateString();
        case "last2days":
          const twoDaysAgo = new Date(now);
          twoDaysAgo.setDate(now.getDate() - 2);
          return orderDate >= twoDaysAgo;
        case "thismonth":
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        case "custom":
          if (!startDate && !endDate) return true;
          if (startDate && endDate) {
            return orderDate >= new Date(startDate) && orderDate <= new Date(endDate + 'T23:59:59');
          }
          if (startDate) return orderDate >= new Date(startDate);
          if (endDate) return orderDate <= new Date(endDate + 'T23:59:59');
          return true;
        case "all":
        default:
          return true;
      }
    });
  }, [orders, filter, startDate, endDate]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const totalOrders = filteredOrders.length;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-cocoa">Sales & Revenue</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track your business performance</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-blush/10 text-blush">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <h3 className="font-serif text-2xl text-cocoa">{formatPrice(totalRevenue)}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-sage/10 text-sage">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <h3 className="font-serif text-2xl text-cocoa">{totalOrders}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-500/10 text-blue-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
              <h3 className="font-serif text-2xl text-cocoa">
                {totalOrders > 0 ? formatPrice(totalRevenue / totalOrders) : formatPrice(0)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-cocoa">
          <CalendarIcon className="h-4 w-4" />
          <span className="font-medium">Filter by Date:</span>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as DateFilter)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-blush"
        >
          <option value="today">Today</option>
          <option value="last2days">Last 2 Days</option>
          <option value="thismonth">This Month</option>
          <option value="all">All Time</option>
          <option value="custom">Custom Date Range</option>
        </select>

        {filter === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm text-cocoa">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Date & Time</th>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Sale Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Loading sales data...
                </td>
              </tr>
            ) : filteredOrders.map((order) => {
              const d = new Date(order.created_at);
              return (
                <tr key={order.id} className="hover:bg-secondary/30">
                  <td className="px-6 py-4">
                    <p className="font-medium">{d.toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {order.id.split("-")[0]}...
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatPrice(order.total_amount)}
                  </td>
                </tr>
              );
            })}
            {!loading && filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No sales found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
