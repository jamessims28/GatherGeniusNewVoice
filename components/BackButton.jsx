"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BackButton({ label = "Back" }) {
  const router = useRouter();
  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
    else router.push("/");
  }
  return (
    <motion.button type="button" aria-label="Go back" className="gg-back" whileTap={{ scale: 0.94 }} whileHover={{ y: -1 }} onClick={goBack}>
      <span aria-hidden="true">←</span><span>{label}</span>
    </motion.button>
  );
}
