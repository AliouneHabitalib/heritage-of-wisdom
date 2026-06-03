import { motion } from "framer-motion";
import banner from "@/assets/oumy-banner.png";

const BannerShowcase = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-warm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="absolute -inset-6 bg-gradient-to-br from-gold/20 to-transparent rounded-3xl blur-2xl" />
          <img
            src={banner}
            alt="Un livre qui parle au cœur — La Sagesse d'une Mère"
            className="relative w-full rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default BannerShowcase;
