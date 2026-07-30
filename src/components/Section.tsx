import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({
  eyebrow, title, description, children, className = "",
}: { eyebrow?: string; title?: string; description?: string; children?: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 ${className}`}>
      {(title || eyebrow) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          {eyebrow && <p className="mb-2 text-xs uppercase tracking-[0.25em] text-blush">{eyebrow}</p>}
          {title && <h2 className="font-serif text-3xl text-cocoa sm:text-4xl md:text-5xl">{title}</h2>}
          {description && <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{description}</p>}
        </motion.div>
      )}
      {children}
    </section>
  );
}
