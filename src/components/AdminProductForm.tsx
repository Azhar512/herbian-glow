import { useState } from "react";
import { Product, Category } from "@/lib/products";
import { useNavigate } from "@tanstack/react-router";
import { uploadImage } from "@/lib/storage";
import { Upload, X } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      slug: "",
      name: "",
      price: 0,
      original_price: undefined,
      image: "",
      image2: "",
      image3: "",
      category: "skin-care",
      short_description: "",
      description: "",
      status: "draft",
      in_stock: true,
      stock: 50,
      rating: 0,
      reviews: 0,
      ingredients: [],
      how_to_use: "",
      benefits: [],
    }
  );

  const [files, setFiles] = useState<{
    image: File | null;
    image2: File | null;
    image3: File | null;
  }>({
    image: null,
    image2: null,
    image3: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: value === "" ? undefined : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (field: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let updatedData = { ...formData };

    if (!updatedData.slug && updatedData.name) {
      updatedData.slug = updatedData.name.toLowerCase().replace(/\s+/g, "-");
    }

    try {
      if (files.image) {
        const url = await uploadImage(files.image);
        if (url) updatedData.image = url;
      }
      if (files.image2) {
        const url = await uploadImage(files.image2);
        if (url) updatedData.image2 = url;
      }
      if (files.image3) {
        const url = await uploadImage(files.image3);
        if (url) updatedData.image3 = url;
      }

      if (!updatedData.image) {
        alert("Primary image is required!");
        setLoading(false);
        return;
      }

      onSubmit(updatedData as Product);
    } catch (err) {
      console.error(err);
      alert("Error saving product.");
    } finally {
      setLoading(false);
    }
  };

  const renderImageUpload = (field: keyof typeof files, label: string) => {
    const currentUrl = formData[field];
    const currentFile = files[field];

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-cocoa">{label}</label>
        <div className="flex h-32 w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-secondary/30 transition-colors hover:bg-secondary relative">
          {currentFile ? (
            <div className="flex flex-col items-center p-2 text-center">
              <p className="text-xs font-medium text-cocoa line-clamp-1">{currentFile.name}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleFileChange(field, null);
                }}
                className="mt-2 text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : currentUrl ? (
            <>
              <img src={currentUrl as string} alt="" className="h-full w-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <label className="cursor-pointer rounded bg-white/80 px-3 py-1 text-xs font-medium text-cocoa hover:bg-white">
                  Replace
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </>
          ) : (
            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-4 text-muted-foreground">
              <Upload className="mb-2 h-5 w-5" />
              <span className="text-xs">Click to upload</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
              />
            </label>
          )}
        </div>
      </div>
    );
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
          <label className="text-sm font-medium text-cocoa">Actual Price (Original)</label>
          <input
            type="number"
            name="original_price"
            value={formData.original_price || ""}
            onChange={handleChange}
            placeholder="e.g. 3500"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-cocoa">Discounted / Selling Price</label>
          <input
            required
            type="number"
            name="price"
            value={formData.price || ""}
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
          <label className="text-sm font-medium text-cocoa">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={formData.stock ?? 50}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blush focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {renderImageUpload("image", "Primary Image *")}
        {renderImageUpload("image2", "Image 2 (Optional)")}
        {renderImageUpload("image3", "Image 3 (Optional)")}
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
          disabled={loading}
          onClick={() => navigate({ to: "/admin/products" })}
          className="rounded-lg border border-border px-4 py-2 text-sm text-cocoa hover:bg-secondary disabled:opacity-50"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="rounded-lg bg-blush px-4 py-2 text-sm text-primary-foreground hover:bg-blush-dark disabled:opacity-50">
          {loading ? "Uploading..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
