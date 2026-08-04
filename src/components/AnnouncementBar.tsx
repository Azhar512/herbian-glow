import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Route as RootRoute } from "@/routes/__root";

export function AnnouncementBar() {
  const { whatsapp } = RootRoute.useLoaderData();
  const messages = [
    "Free shipping on all prepaid orders",
    "Spend Rs. 5,000+ and get a free gift",
    `WhatsApp us at +${whatsapp}`,
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-cream border-b border-border">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center overflow-hidden px-4 text-xs tracking-wide text-blush-dark">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {messages[i]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
