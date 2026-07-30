import { useState } from "react";
import { Product, Category } from "@/lib/products";
import { useNavigate } from "@tanstack/react-router";

export function AdminProductForm({
  initialData,
  onSubmit,
  isEdit = false,
}: {
  initialData?: Product;
  onSubmit: (data: Product) => void;
  isEdit?: boolean;
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      slug: "",
      name: "",
      price: 0,
      image: "",
      category: "skin-care",
      short_description: "",
      description: "",
      status: "draft",
      in_stock: true,
      rating: 0,
      reviews: 0,
      ingredients: [],
      how_to_use: "",
      benefits: [],
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug && formData.name) {
      formData.slug = formData.name.toLowerCase().replace(/\s+/g, "-");
    }
    onSubmit(formData as Product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-border bg-card p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Product Name</label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Slug (optional)</label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="auto-generated if empty"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Price</label>
          <input
            required
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          >
            <option value="skin-care">Skin Care</option>
            <option value="hair-care">Hair Care</option>
            <option value="lip-care">Lip Care</option>
            <option value="body-care">Body Care</option>
            <option value="bundles">Bundles</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Image URL</label>
          <input
            required
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="/assets/product-image.jpg"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-cocoa">Short Description</label>
        <input
          required
          name="short_description"
          value={formData.short_description || ""}
          onChange={handleChange}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-cocoa">Full Description</label>
        <textarea
          required
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/products" })}
          className="rounded-lg border border-border px-4 py-2 text-sm text-cocoa hover:bg-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-blush px-4 py-2 text-sm text-primary-foreground hover:bg-blush-dark">
          {isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
