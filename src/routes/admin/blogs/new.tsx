import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { ArrowLeft, Save, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/blogs/new")({
  component: NewBlogPage,
});

function NewBlogPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Admin",
    category: "Skincare",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        alert("Failed to upload image.");
        setLoading(false);
        return;
      }
    } else {
      alert("Please upload a cover image.");
      setLoading(false);
      return;
    }

    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const { error } = await supabase.from("blog_posts").insert([
      {
        slug,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        date: date,
        image: imageUrl,
      }
    ]);

    setLoading(false);

    if (error) {
      alert("Failed to create blog post. Check permissions or make sure the title is unique.");
      console.error(error);
    } else {
      alert("Blog post published!");
      navigate({ to: "/admin/blogs" });
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link to="/admin/blogs" className="rounded-full bg-secondary p-2 text-muted-foreground hover:bg-border hover:text-cocoa">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-cocoa">Create Blog Post</h2>
          <p className="mt-1 text-sm text-muted-foreground">Publish a new article to your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cocoa">Post Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-blush"
                placeholder="The Secret to Glowing Skin"
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-cocoa">Category</label>
                <input
                  required
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-blush"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-cocoa">Author</label>
                <input
                  required
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-blush"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-cocoa">Excerpt (Short description)</label>
              <textarea
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-blush"
                rows={2}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-cocoa">Content</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-blush"
                rows={10}
                placeholder="Write your article here..."
              />
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cocoa">Cover Image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5 text-muted-foreground">
                    <Upload className="mb-2 h-6 w-6" />
                    <p className="text-sm">
                      {imageFile ? <span className="font-medium text-cocoa">{imageFile.name}</span> : <span>Click to upload image</span>}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            to="/admin/blogs"
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blush px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-blush-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
