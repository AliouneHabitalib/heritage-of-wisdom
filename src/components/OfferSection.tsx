import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Gift, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bookBanner from "@/assets/oumy-banner2.jpeg";

const OfferSection = () => {
  const [loading, setLoading] = useState<null | "paypal" | "paydunya">(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const startPayment = async (provider: "paypal" | "paydunya") => {
    if (!email) {
      toast.error("Veuillez entrer votre adresse email");
      return;
    }

    setLoading(provider);
    try {
      const fn = provider === "paypal" ? "create-paypal-order" : "create-paydunya-invoice";
      const { data, error } = await supabase.functions.invoke(fn, {
        body: { email, name },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error("Payment response:", data);
        toast.error("Erreur lors de la redirection vers le paiement");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(null);
    }
  };



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
                  src={bookBanner}
                  alt="Couverture du livre"
                  className="w-full rounded-lg shadow-xl"
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

                <div className="pt-4 space-y-3">
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                    <span className="text-4xl font-display font-bold text-primary">5 000 FCFA</span>
                    <span className="text-lg text-muted-foreground">/ 19,99 €</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Votre nom (optionnel)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="email"
                    placeholder="Votre adresse email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startPayment("paydunya")}
                    disabled={loading !== null}
                    className="w-full py-4 px-8 text-lg font-display font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-gold transition-all disabled:opacity-60"
                  >
                    {loading === "paydunya" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirection...
                      </span>
                    ) : (
                      "Payer (Orange Money · Wave · Carte)"
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startPayment("paypal")}
                    disabled={loading !== null}
                    className="w-full py-4 px-8 text-lg font-display font-semibold bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-lg shadow-md transition-all disabled:opacity-60"
                  >
                    {loading === "paypal" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirection...
                      </span>
                    ) : (
                      "Payer avec PayPal (international)"
                    )}
                  </motion.button>

                  <p className="text-center text-muted-foreground text-sm mt-3">
                    Paiement 100% sécurisé · Mobile Money, Wave, carte bancaire ou PayPal
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
