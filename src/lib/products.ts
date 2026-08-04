import { supabase } from "./supabase";
import serum from "@/assets/product-serum.jpg";
import cream from "@/assets/product-cream.jpg";
import mask from "@/assets/product-mask.jpg";
import lip from "@/assets/product-lip.jpg";
import soap from "@/assets/product-soap.jpg";
import hair from "@/assets/product-hair.jpg";
import roller from "@/assets/product-roller.jpg";
import bundle from "@/assets/product-bundle.jpg";

export type Category = "skin-care" | "hair-care" | "bundles" | "accessories" | "lip-care" | "body-care";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  image2?: string;
  image3?: string;
  category: Category;
  rating: number;
  reviews: number;
  is_new?: boolean;
  is_best_seller?: boolean;
  in_stock: boolean;
  stock?: number;
  short_description: string;
  description: string;
  ingredients: string[];
  how_to_use: string;
  benefits: string[];
  variants?: { label: string; value: string }[];
  status: "active" | "draft" | "coming_soon";
};

export const categories = [
  { slug: "skin-care", label: "Skin Care", image: cream },
  { slug: "hair-care", label: "Hair Care", image: hair },
  { slug: "lip-care", label: "Lip Care", image: lip },
  { slug: "bundles", label: "Bundles", image: bundle },
  { slug: "body-care", label: "Body Care", image: soap },
  { slug: "accessories", label: "Accessories", image: roller },
] as const;

export const skinCareSubs = ["Moisturizer", "Serum", "Facial", "Lip Care", "Soap", "Body Care"];

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data as Product[];
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (error || !data) return undefined;
  return data as Product;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return data as Product;
}

export async function getByCategory(cat: Category): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("category", cat).neq("status", "draft");
  if (error) return [];
  return data as Product[];
}

export async function saveProduct(product: Partial<Product>) {
  if (product.id) {
    const { error } = await supabase.from("products").update(product).eq("id", product.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("products").insert([product]);
    if (error) throw error;
  }
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
