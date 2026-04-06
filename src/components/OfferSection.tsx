import { motion } from "framer-motion";
import { Download, Gift, BookOpen } from "lucide-react";
import bookCover from "@/assets/oumy-cover.png";

const OfferSection = () => {
  return (
    <section id="offre" className="py-24 lg:py-32 bg-gradient-warm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">
            Offre spéciale
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            Obtenez votre <span className="italic text-primary">exemplaire</span> aujourd'hui
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border border-primary/20 bg-card p-8 lg:p-12 shadow-gold">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center">
                <img
                  src={bookCover}
                  alt="Couverture du livre"
                  className="w-56 rounded-lg shadow-xl"
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-display">
                  La Sagesse d'une Mère, l'Héritage d'une Vie
                </h3>

                <ul className="space-y-3">
                  {[
                    { icon: Download, text: "PDF téléchargeable immédiatement" },
                    { icon: Gift, text: "Message exclusif de l'auteur inclus" },
                    { icon: BookOpen, text: "Version physique disponible sur demande" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-muted-foreground">
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-display font-bold text-primary">5 000 FCFA</span>
                    <span className="text-muted-foreground text-sm">(≈ 7,50 €)</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 px-8 text-lg font-display font-semibold bg-gradient-gold text-cream rounded-lg shadow-gold transition-all"
                  >
                    Acheter maintenant
                  </motion.button>

                  <p className="text-center text-muted-foreground text-sm mt-3">
                    Paiement sécurisé · Téléchargement instantané
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferSection;
