import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://uzgchrguplnbokiqpjqt.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Z2Nocmd1cGxuYm9raXFwanF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MTk5MzIsImV4cCI6MjEwMDM5NTkzMn0.rBSnfDr9tqm2zwvDahw08RYs7uLpyyRmTPB0FdwSw_4";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const productsData = [
  { slug: "rose-glow-serum", name: "Rose Glow Serum", price: 2450, original_price: 2950, image: "/src/assets/product-serum.jpg", category: "skin-care", rating: 4.9, reviews: 328, is_best_seller: true, in_stock: true, status: "active", short_description: "A radiance-boosting rose extract serum for luminous, hydrated skin.", description: "Our signature Rose Glow Serum blends organic Damask rose extract...", ingredients: ["Damask Rose Extract", "Hyaluronic Acid"], how_to_use: "Apply 2–3 drops...", benefits: ["Deep hydration", "Even skin tone"] },
  { slug: "aloe-hydration-cream", name: "Aloe Hydration Cream", price: 1850, image: "/src/assets/product-cream.jpg", category: "skin-care", rating: 4.8, reviews: 214, is_best_seller: true, in_stock: true, status: "active", short_description: "Featherlight aloe moisturizer...", description: "A whipped, lightweight moisturizer...", ingredients: ["Aloe Vera", "Squalane"], how_to_use: "Massage a pea-sized amount...", benefits: ["24h hydration"] },
  { slug: "herbal-clay-mask", name: "Herbal Clay Mask", price: 1650, image: "/src/assets/product-mask.jpg", category: "skin-care", rating: 4.7, reviews: 156, is_new: true, in_stock: true, status: "coming_soon", short_description: "Detoxifying green clay mask...", description: "A purifying mask...", ingredients: ["French Green Clay", "Neem"], how_to_use: "Apply a thin layer...", benefits: ["Deep cleanse"] },
  { slug: "petal-lip-balm", name: "Petal Lip Balm", price: 650, image: "/src/assets/product-lip.jpg", category: "lip-care", rating: 4.9, reviews: 402, is_best_seller: true, in_stock: true, status: "active", short_description: "Rose-tinted lip balm...", description: "A silky, tinted balm...", ingredients: ["Shea Butter", "Rose Wax"], how_to_use: "Apply generously to lips...", benefits: ["Deep nourishment"] },
  { slug: "wildflower-herbal-soap", name: "Wildflower Herbal Soap", price: 550, image: "/src/assets/product-soap.jpg", category: "body-care", rating: 4.8, reviews: 189, in_stock: true, status: "active", short_description: "Cold-pressed soap bar...", description: "A gentle handmade soap bar...", ingredients: ["Olive Oil", "Lavender"], how_to_use: "Lather onto damp skin...", benefits: ["Gentle cleanse"] },
  { slug: "rosemary-hair-oil", name: "Rosemary Hair Growth Oil", price: 1950, image: "/src/assets/product-hair.jpg", category: "hair-care", rating: 4.9, reviews: 267, is_best_seller: true, in_stock: true, status: "active", short_description: "Ayurvedic rosemary blend...", description: "A potent scalp treatment...", ingredients: ["Rosemary", "Amla"], how_to_use: "Massage into scalp...", benefits: ["Reduces hair fall"] },
  { slug: "rose-quartz-roller", name: "Rose Quartz Facial Roller", price: 1450, image: "/src/assets/product-roller.jpg", category: "accessories", rating: 4.7, reviews: 98, is_new: true, in_stock: true, status: "active", short_description: "100% genuine rose quartz roller...", description: "Depuffs, sculpts and boosts absorption...", ingredients: ["Rose Quartz Stone"], how_to_use: "Glide over serum-prepped skin...", benefits: ["Reduces puffiness"] },
  { slug: "glow-ritual-bundle", name: "The Glow Ritual Bundle", price: 5450, original_price: 6900, image: "/src/assets/product-bundle.jpg", category: "bundles", rating: 5.0, reviews: 142, is_best_seller: true, is_new: true, in_stock: true, status: "active", short_description: "Our best-loved essentials...", description: "The complete 4-step glow ritual...", ingredients: ["Curated set of 4 full-size products"], how_to_use: "Follow the enclosed ritual card...", benefits: ["Save 20%"] },
];

const blogData = [
  { slug: "benefits-of-rosehip-oil", title: "The Ultimate Guide to Rosehip Oil in Skincare", excerpt: "Discover why this powerful...", content: "Rosehip oil has been used...", date: "October 12, 2023", author: "Herbian Glow Team", image: "https://images.unsplash.com/photo-1608248593842-8021c640e708?q=80&w=1600&auto=format&fit=crop", category: "Ingredients" },
  { slug: "building-a-sustainable-routine", title: "How to Build a Sustainable Skincare Routine", excerpt: "Small changes in your daily...", content: "Sustainability is no longer...", date: "November 05, 2023", author: "Amina - Founder", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1600&auto=format&fit=crop", category: "Sustainability" },
];

async function seed() {
  console.log("Seeding products...");
  const mappedProducts = productsData.map((p) => {
    const { originalPrice, ...rest } = p as any;
    return {
      ...rest,
      original_price: p.original_price ?? originalPrice ?? null,
      is_new: p.is_new ?? false,
    };
  });

  const { error: pErr } = await supabase.from("products").insert(mappedProducts);
  if (pErr) console.error("Error inserting products:", pErr.message);
  else console.log("Products seeded successfully!");

  console.log("Seeding blogs...");
  for (const b of blogData) {
    const { error } = await supabase.from('blog_posts').insert(b);
    if (error) console.error("Error inserting blog post:", b.title, error.message);
    else console.log("Inserted:", b.title);
  }
  console.log("Seeding complete!");
}

seed();
