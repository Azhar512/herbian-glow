import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { AdminProductForm } from "@/components/AdminProductForm";
import { saveProduct, getProductById } from "@/lib/products";

export const Route = createFileRoute("/admin/products/$id")({
  loader: async ({ params }) => {
    const product = await getProductById(params.id);
    if (!product) throw notFound();
    return { product };
  },
  component: EditProduct,
});

function EditProduct() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await saveProduct({ ...data, id: product.id });
    navigate({ to: "/admin/products" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl text-cocoa">Edit Product</h1>
      <AdminProductForm initialData={product} onSubmit={handleSubmit} isEdit />
    </div>
  );
}
