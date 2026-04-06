import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const ExcerptSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-gradient-warm relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full divider-gold" />
      <div className="absolute bottom-0 left-0 w-full divider-gold" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <Quote className="w-12 h-12 text-primary mx-auto mb-8 opacity-50" />
          
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl italic leading-relaxed mb-8">
            Ce livre n'est pas seulement le récit d'une vie…{" "}
            <span className="text-primary font-semibold">
              c'est une lumière qui ne s'éteint jamais…
            </span>
          </blockquote>

          <div className="divider-gold w-24 mx-auto mb-6" />

          <p className="text-muted-foreground text-lg">
            — Extrait du livre, <span className="italic">La Sagesse d'une Mère</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ExcerptSection;
