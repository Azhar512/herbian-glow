import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { getBlogPost, type BlogPost } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData }) => {
    const p = (loaderData as { post: BlogPost })?.post;
    if (!p) return { meta: [{ title: "Blogs — Herbian Glow" }] };
    return {
      meta: [
        { title: `${p.title} — Herbian Glow` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: `${p.title} — Herbian Glow` },
        { property: "og:description", content: p.excerpt },
        { property: "og:image", content: p.image },
      ],
    };
  },
  loader: async ({ params }): Promise<{ post: BlogPost }> => {
    const post = await getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-xl p-20 text-center">
        <h1 className="font-serif text-3xl">Post not found</h1>
        <Link to="/blog" className="btn-pill mt-6 bg-blush text-primary-foreground">Back to Blogs</Link>
      </div>
    </Layout>
  ),
});

function BlogPostPage() {
  const { post } = Route.useLoaderData() as unknown as { post: BlogPost };

  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
        <nav className="mb-8 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-blush">Home</Link> /{" "}
          <Link to="/blog" className="hover:text-blush">Blogs</Link> /{" "}
          <span className="text-cocoa">{post.title}</span>
        </nav>

        <header className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="text-blush">{post.category}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-cocoa md:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            {post.excerpt}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-secondary">
              <div className="grid h-full w-full place-items-center bg-blush/10 text-sm font-medium text-blush">
                {post.author.charAt(0)}
              </div>
            </div>
            <div className="text-left text-sm">
              <p className="font-medium text-cocoa">{post.author}</p>
              <p className="text-muted-foreground">Author</p>
            </div>
          </div>
        </header>

        <figure className="my-12 overflow-hidden rounded-3xl bg-secondary">
          <img
            src={post.image}
            alt={post.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </figure>

        <div className="prose prose-stone mx-auto max-w-none">
          {post.content.split('\n\n').map((paragraph: string, idx: number) => (
            <p key={idx} className="mb-6 leading-relaxed text-cocoa">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10 text-center">
          <Link to="/blog" className="btn-pill bg-cocoa text-primary-foreground hover:bg-blush">
            ← Back to Blogs
          </Link>
        </div>
      </article>
    </Layout>
  );
}
