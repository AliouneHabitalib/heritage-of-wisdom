import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    text: "Ce livre m'a fait pleurer. J'ai retrouvé ma propre mère dans chaque page. Un trésor.",
    name: "Aminata D.",
    location: "Dakar, Sénégal",
  },
  {
    text: "Un chef-d'œuvre africain. Une écriture sincère, puissante, qui parle à l'universel.",
    name: "Moussa K.",
    location: "Paris, France",
  },
  {
    text: "Une vraie leçon de vie. J'ai offert ce livre à mes enfants pour qu'ils comprennent d'où nous venons.",
    name: "Fatou S.",
    location: "Abidjan, Côte d'Ivoire",
  },
];

const ReviewsSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-gradient-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold-light tracking-[0.2em] uppercase text-sm mb-4">
            Témoignages
          </p>
          <h2 className="text-3xl sm:text-4xl text-cream">
            Ce que les lecteurs <span className="text-gradient-gold italic">ressentent</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-8 rounded-xl border border-gold/10 bg-warm-brown/20"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-cream/80 italic text-lg leading-relaxed mb-6">
                "{r.text}"
              </p>
              <div>
                <p className="text-cream font-display font-semibold">{r.name}</p>
                <p className="text-cream/50 text-sm">{r.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
