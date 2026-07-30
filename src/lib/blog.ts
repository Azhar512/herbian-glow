import { supabase } from "./supabase";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
  return data as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  if (error || !data) return undefined;
  return data as BlogPost;
}
