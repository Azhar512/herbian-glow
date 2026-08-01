import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { getDiscountCodes, deleteDiscountCode } from "@/lib/discounts";

export const Route = createFileRoute("/admin/discounts/")({
  loader: async () => {
    const discounts = await getDiscountCodes();
    return { discounts };
  },
  component: AdminDiscounts,
});

function AdminDiscounts() {
  const { discounts } = Route.useLoaderData();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this discount code?")) {
      await deleteDiscountCode(id);
      router.invalidate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-cocoa">Influencer Discounts</h1>
        <Link
          to="/admin/discounts/new"
          className="flex items-center gap-2 rounded-lg bg-blush px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-blush-dark"
        >
          <Plus className="h-4 w-4" /> Add Code
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Influencer</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-secondary/20">
                <td className="px-6 py-4 font-mono font-bold text-cocoa">{d.code}</td>
                <td className="px-6 py-4 text-muted-foreground">{d.influencer_name}</td>
                <td className="px-6 py-4 font-medium text-sage">{d.discount_percentage}% OFF</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      d.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {d.is_active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => d.id && handleDelete(d.id)}
                    className="rounded p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No discount codes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
