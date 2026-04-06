import { motion } from "framer-motion";

const AuthorSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-gradient-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-gold-light tracking-[0.2em] uppercase text-sm">
              L'auteur
            </p>
            <h2 className="text-3xl sm:text-4xl text-cream">
              Alioune Habitalib <span className="text-gradient-gold italic">Coulibaly</span>
            </h2>
            <div className="divider-gold w-24 mx-auto" />
            <div className="space-y-4 text-cream/70 text-lg leading-relaxed">
              <p>
                Héritier de cette histoire, Alioune Habitalib Coulibaly a choisi de mettre en mots ce que sa mère a transmis en actes.
              </p>
              <p>
                À travers ce livre, il ne raconte pas seulement une vie — il transmet un message aux générations futures. Un message d'amour, de résilience et de foi.
              </p>
              <p className="italic text-gold-light">
                "Écrire ce livre était un devoir. Le partager est un honneur."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
