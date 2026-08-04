import { supabase } from "./supabase";

export async function getSiteSetting(key: string, defaultValue: string = "") {
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).single();
  if (error || !data) return defaultValue;
  return data.value;
}

export async function updateSiteSetting(key: string, value: string) {
  const { error } = await supabase.from("site_settings").upsert({ key, value });
  return !error;
}
