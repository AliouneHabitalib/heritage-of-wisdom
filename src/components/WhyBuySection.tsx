import { motion } from "framer-motion";
import { Heart, BookOpen, Sparkles, Users } from "lucide-react";

const reasons = [
  {
    icon: Heart,
    title: "Valeurs familiales africaines",
    desc: "Redécouvrez les piliers de la famille africaine : respect, amour, solidarité et transmission.",
  },
  {
    icon: BookOpen,
    title: "Une vraie histoire de vie",
    desc: "Pas de fiction — un récit authentique qui touche l'âme et inspire le cœur.",
  },
  {
    icon: Sparkles,
    title: "Développement personnel",
    desc: "Des leçons de vie tirées de l'expérience, applicables à votre propre parcours.",
  },
  {
    icon: Users,
    title: "Héritage culturel & spirituel",
    desc: "Un pont entre les générations, pour préserver et transmettre ce qui compte vraiment.",
  },
];

const WhyBuySection = () => {
  return (
    <section className="py-24 lg:py-32 bg-gradient-dark relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold-light tracking-[0.2em] uppercase text-sm mb-4">
            Pourquoi ce livre ?
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-cream">
            Un livre qui <span className="text-gradient-gold italic">change les perspectives</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group text-center p-8 rounded-xl border border-gold/10 hover:border-gold/30 bg-warm-brown/30 transition-all"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center">
                <r.icon className="w-6 h-6 text-cream" />
              </div>
              <h3 className="text-xl font-display text-cream mb-3">{r.title}</h3>
              <p className="text-cream/60 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBuySection;
