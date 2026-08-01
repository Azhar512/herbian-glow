import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { saveDiscountCode, DiscountCode } from "@/lib/discounts";
import { getProducts } from "@/lib/products";

export const Route = createFileRoute("/admin/discounts/new")({
  loader: async () => {
    const products = await getProducts();
    return { products };
  },
  component: NewDiscount,
});

function NewDiscount() {
  const { products } = Route.useLoaderData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<DiscountCode>>({
    code: "",
    influencer_name: "",
    discount_percentage: 10,
    product_id: "",
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveDiscountCode({
      ...formData,
      product_id: formData.product_id || null, // null if applied to all
    });
    navigate({ to: "/admin/discounts" });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-cocoa">Create Discount Code</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Influencer Name</label>
          <input
            required
            name="influencer_name"
            value={formData.influencer_name}
            onChange={handleChange}
            placeholder="e.g. Aisha Khan"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-cocoa">Discount Code</label>
            <input
              required
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. AISHA20"
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm uppercase focus:border-blush focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-cocoa">Discount Percentage (%)</label>
            <input
              required
              type="number"
              min="1"
              max="100"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Applies to Product (Optional)</label>
          <select
            name="product_id"
            value={formData.product_id || ""}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          >
            <option value="">-- Apply to entire order --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - Rs. {p.price}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">If selected, the discount will only apply to this specific product in the cart.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Status</label>
          <select
            name="is_active"
            value={formData.is_active ? "true" : "false"}
            onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.value === "true" }))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          >
            <option value="true">Active</option>
            <option value="false">Disabled</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/admin/discounts"
            className="rounded-lg border border-border px-4 py-2 text-sm text-cocoa hover:bg-secondary"
          >
            Cancel
          </Link>
          <button type="submit" className="rounded-lg bg-blush px-4 py-2 text-sm text-primary-foreground hover:bg-blush-dark">
            Create Code
          </button>
        </div>
      </form>
    </div>
  );
}
