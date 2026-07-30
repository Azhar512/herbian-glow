import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getProducts, deleteProduct, Product } from "@/lib/products";
import { formatPrice } from "@/lib/cart";

export const Route = createFileRoute("/admin/products/")({
  loader: async () => {
    const products = await getProducts();
    return { products };
  },
  component: AdminProducts,
});

function AdminProducts() {
  const { products } = Route.useLoaderData();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      router.invalidate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-cocoa">Products</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-blush px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-blush-dark"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/20">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                    <span className="font-medium text-cocoa">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize text-muted-foreground">{p.category.replace("-", " ")}</td>
                <td className="px-6 py-4 text-cocoa">{formatPrice(p.price)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      p.status === "active"
                        ? "bg-green-100 text-green-700"
                        : p.status === "draft"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status === "coming_soon" ? "Coming Soon" : p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to="/admin/products/$id"
                      params={{ id: p.id }}
                      className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-cocoa"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
