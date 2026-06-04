import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { CheckCircle, Download, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";


const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get("ref");
  const [status, setStatus] = useState<"loading" | "success" | "pending" | "error">("loading");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!orderRef) {
      setStatus("error");
      return;
    }

    const checkOrder = async () => {
      try {
        const { data: order, error } = await supabase.functions.invoke("check-order-status", {
          body: { order_id: orderRef },
        });

        if (error || !order) {
          setStatus("error");
          return;
        }

        if (order.payment_status === "completed") {
          // Get download URL
          const { data } = await supabase.functions.invoke("download-book", {
            body: { order_id: orderRef },
          });

          if (data?.download_url) {
            setDownloadUrl(data.download_url);
            setStatus("success");
            // Auto-trigger download
            const link = document.createElement("a");
            link.href = data.download_url;
            link.download = "La-Sagesse-d-une-Mere.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            setStatus("success");
          }
        } else if (order.payment_status === "pending") {
          setStatus("pending");
          // Poll every 5 seconds
          setTimeout(checkOrder, 5000);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    checkOrder();
  }, [orderRef]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h1 className="text-2xl font-display">Vérification du paiement...</h1>
            <p className="text-muted-foreground">Veuillez patienter quelques instants.</p>
          </>
        )}

        {status === "pending" && (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h1 className="text-2xl font-display">Paiement en cours de traitement</h1>
            <p className="text-muted-foreground">
              Votre paiement est en cours de confirmation. Cette page se mettra à jour automatiquement.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-display">Merci pour votre achat ! 🎉</h1>
            <p className="text-muted-foreground">
              Votre exemplaire de <span className="italic">La Sagesse d'une Mère</span> est prêt à être téléchargé.
            </p>
            {downloadUrl && (
              <motion.a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 py-4 px-8 text-lg font-display font-semibold bg-gradient-gold text-cream rounded-lg shadow-gold"
              >
                <Download className="w-5 h-5" />
                Télécharger le PDF
              </motion.a>
            )}
            <p className="text-sm text-muted-foreground">
              Un lien de téléchargement a également été envoyé à votre adresse email.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-display">Une erreur est survenue</h1>
            <p className="text-muted-foreground">
              Nous n'avons pas pu confirmer votre paiement. Veuillez nous contacter via WhatsApp.
            </p>
            <a
              href="https://wa.me/221772292392"
              className="inline-flex items-center gap-2 py-3 px-6 bg-green-600 text-white rounded-lg font-semibold"
            >
              Contacter via WhatsApp
            </a>
          </>
        )}

        <Link to="/" className="block text-primary underline text-sm mt-8">
          ← Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
