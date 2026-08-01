import { createFileRoute, Outlet, Link, redirect, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
    router.navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30 md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="font-serif text-xl text-cocoa">Herbian Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <Link
            to="/admin"
            activeProps={{ className: "bg-blush/20 text-cocoa font-medium" }}
            activeOptions={{ exact: true }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-cocoa"
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link
            to="/admin/products"
            activeProps={{ className: "bg-blush/20 text-cocoa font-medium" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-cocoa"
          >
            <Package className="h-4 w-4" /> Products
          </Link>
          <Link
            to="/admin/orders"
            activeProps={{ className: "bg-blush/20 text-cocoa font-medium" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-cocoa"
          >
            <ShoppingCart className="h-4 w-4" /> Orders
          </Link>
          <Link
            to="/admin/discounts"
            activeProps={{ className: "bg-blush/20 text-cocoa font-medium" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-cocoa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg> Discounts
          </Link>
        </nav>
        
        <div className="mt-auto p-4">
          <Link
            to="/"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-cocoa"
          >
            <Store className="h-4 w-4" /> Back to Store
          </Link>
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <span className="font-serif text-lg text-cocoa">Herbian Admin</span>
        <button onClick={handleSignOut} className="text-sm text-red-600">Sign Out</button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <header className="hidden h-16 items-center border-b border-border bg-card px-8 md:flex">
          <h1 className="font-serif text-lg text-cocoa">Dashboard</h1>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card px-2 md:hidden">
        <Link to="/admin" activeProps={{ className: "text-blush" }} activeOptions={{ exact: true }} className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px]">Dashboard</span>
        </Link>
        <Link to="/admin/products" activeProps={{ className: "text-blush" }} className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
          <Package className="h-5 w-5" />
          <span className="text-[10px]">Products</span>
        </Link>
        <Link to="/admin/orders" activeProps={{ className: "text-blush" }} className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span className="text-[10px]">Orders</span>
        </Link>
        <Link to="/admin/discounts" activeProps={{ className: "text-blush" }} className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
          <span className="text-[10px]">Discounts</span>
        </Link>
      </nav>
    </div>
  );
}
