import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminProductForm } from "@/components/AdminProductForm";
import { saveProduct } from "@/lib/products";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProduct,
});

function NewProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveProduct(data);
    navigate({ to: "/admin/products" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl text-cocoa">Add New Product</h1>
      <AdminProductForm onSubmit={handleSubmit} />
    </div>
  );
}
