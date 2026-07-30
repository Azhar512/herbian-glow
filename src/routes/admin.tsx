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
    <div className="flex min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
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
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="flex h-16 items-center border-b border-border bg-card px-8">
          <h1 className="font-serif text-lg text-cocoa">Dashboard</h1>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
