import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit } from "lucide-react";

export const Route = createFileRoute("/admin/blogs/")({
  component: AdminBlogsPage,
});

function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setBlogs(data);
    setLoading(false);
  };

  const deleteBlog = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await supabase.from("blog_posts").delete().eq("id", id);
      fetchBlogs();
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-cocoa">Blog Posts</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your articles and guides</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="flex items-center justify-center gap-2 rounded-full bg-blush px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-blush-dark"
        >
          <Plus className="h-4 w-4" /> Add Post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm text-cocoa">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Post</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  Loading blog posts...
                </td>
              </tr>
            ) : blogs.map((post) => (
              <tr key={post.id} className="hover:bg-secondary/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={post.image} alt={post.title} className="h-12 w-16 rounded object-cover" />
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-muted-foreground">/{post.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {post.date}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => deleteBlog(post.id)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && blogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No blog posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
