import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { getBlogPosts } from "@/lib/blog";
import { motion } from "framer-motion";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Herbian Glow" },
      { name: "description", content: "Read the latest news, skincare guides, and updates from Herbian Glow." }
    ]
  }),
  loader: async () => {
    const blogPosts = await getBlogPosts();
    return { blogPosts };
  },
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { blogPosts } = Route.useLoaderData();
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="text-center">
          <h1 className="font-serif text-5xl text-cocoa md:text-6xl">Our Blogs</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Explore our latest thoughts on natural skincare, sustainable living, and achieving your best glow.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col"
            >
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="overflow-hidden rounded-2xl bg-secondary">
                <img
                  src={post.image}
                  alt={post.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="text-blush">{post.category}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="mt-3 block">
                <h3 className="font-serif text-2xl leading-tight text-cocoa transition-colors group-hover:text-blush">
                  {post.title}
                </h3>
              </Link>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-cocoa">
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="group/link flex items-center gap-1 hover:text-blush">
                  Read More
                  <span className="transition-transform group-hover/link:translate-x-1">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
