import { motion } from "framer-motion";
import portrait from "@/assets/oumy-portrait.jpeg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const StorySection = () => {
  return (
    <section id="histoire" className="py-24 lg:py-32 bg-gradient-warm relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Image */}
          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-gold/10 to-transparent rounded-2xl" />
            <img
              src={portrait}
              alt="Oumy - Portrait"
              className="relative w-full max-w-md mx-auto rounded-xl shadow-xl"
            />
            <div className="divider-gold mt-8 max-w-xs mx-auto" />
          </motion.div>

          {/* Text */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <p className="text-primary tracking-[0.2em] uppercase text-sm font-semibold">
              L'histoire de Oumy
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Une femme d'exception,{" "}
              <span className="italic text-primary">un destin lumineux</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Ce livre raconte l'histoire de <strong className="text-foreground">Oumy</strong>, une femme africaine exceptionnelle — symbole de courage, de foi, de sacrifice et d'amour familial.
              </p>
              <p>
                De Dakar à Sokone, sa vie a été un voyage de dévotion. Chaque épreuve traversée est devenue une leçon. Chaque sacrifice, un acte d'amour pur.
              </p>
              <p>
                À travers ces pages, vous découvrirez comment une simple mère a su transmettre des valeurs qui traversent le temps et les générations.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StorySection;
