import { motion } from "framer-motion";
import bookCover from "@/assets/oumy-cover.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-dark">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, hsl(36 60% 45% / 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, hsl(36 60% 45% / 0.2) 0%, transparent 40%)`
      }} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gold-light tracking-[0.3em] uppercase text-sm mb-6"
            >
              Un livre d'hommage
            </motion.p>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 text-cream">
              Une mère.{" "}
              <span className="text-gradient-gold italic">Une vie.</span>{" "}
              <br />Un héritage éternel.
            </h1>
            
            <p className="text-lg sm:text-xl text-cream/70 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              Découvrez une histoire vraie remplie d'amour, de sacrifices et de sagesse transmise de génération en génération.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.a
                href="#offre"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-display font-semibold bg-gradient-gold text-cream rounded-lg shadow-gold transition-all"
              >
                Acheter le livre maintenant
              </motion.a>
              <motion.a
                href="#histoire"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-display border-2 border-gold/40 text-gold-light rounded-lg hover:border-gold transition-colors"
              >
                Découvrir l'histoire
              </motion.a>
            </div>
          </motion.div>

          {/* Book cover */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-b from-gold/20 to-transparent rounded-2xl blur-2xl" />
              <img
                src={bookCover}
                alt="La Sagesse d'une Mère, l'Héritage d'une Vie - Couverture du livre"
                className="relative w-72 sm:w-80 lg:w-96 rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gold/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-gold rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
