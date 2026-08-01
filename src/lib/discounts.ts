import { supabase } from "./supabase";

export type DiscountCode = {
  id?: string;
  code: string;
  influencer_name: string;
  discount_percentage: number;
  product_id: string | null;
  is_active: boolean;
  created_at?: string;
};

export async function getDiscountCodes(): Promise<DiscountCode[]> {
  const { data, error } = await supabase.from("discount_codes").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching discount codes:", error);
    return [];
  }
  return data as DiscountCode[];
}

export async function getDiscountCodeByCode(code: string): Promise<DiscountCode | null> {
  const { data, error } = await supabase.from("discount_codes").select("*").eq("code", code.toUpperCase()).single();
  if (error || !data) return null;
  return data as DiscountCode;
}

export async function saveDiscountCode(discount: Partial<DiscountCode>) {
  if (discount.code) {
    discount.code = discount.code.toUpperCase();
  }
  
  if (discount.id) {
    const { error } = await supabase.from("discount_codes").update(discount).eq("id", discount.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("discount_codes").insert([discount]);
    if (error) throw error;
  }
}

export async function deleteDiscountCode(id: string) {
  const { error } = await supabase.from("discount_codes").delete().eq("id", id);
  if (error) throw error;
}
