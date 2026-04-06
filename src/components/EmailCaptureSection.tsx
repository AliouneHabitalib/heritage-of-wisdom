import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useState } from "react";

const EmailCaptureSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-24 lg:py-32 bg-gradient-warm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center">
            <Mail className="w-7 h-7 text-cream" />
          </div>

          <h2 className="text-3xl sm:text-4xl mb-4">
            Recevez un <span className="italic text-primary">extrait gratuit</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Entrez votre email et recevez les premières pages du livre directement dans votre boîte mail.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl border border-primary/20 bg-card"
            >
              <p className="text-xl font-display text-primary">Merci ! 🎉</p>
              <p className="text-muted-foreground mt-2">
                Vérifiez votre boîte mail pour découvrir votre extrait gratuit.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 px-5 py-4 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-lg"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-8 py-4 bg-gradient-gold text-cream font-display font-semibold rounded-lg shadow-gold text-lg"
              >
                Recevoir l'extrait
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default EmailCaptureSection;
