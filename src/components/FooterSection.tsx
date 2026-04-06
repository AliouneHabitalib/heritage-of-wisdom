import { Mail, Phone } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-16 bg-gradient-dark border-t border-gold/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10 text-center md:text-left">
          <div>
            <h3 className="font-display text-xl text-cream mb-3">
              La Sagesse d'une Mère
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              Un livre d'hommage écrit par Alioune Habitalib Coulibaly. Une histoire d'amour, de foi et de transmission.
            </p>
          </div>

          <div>
            <h4 className="font-display text-cream mb-3">Contact</h4>
            <div className="space-y-2 text-cream/50 text-sm">
              <a href="mailto:habitalibalioune.c95@gmail.com" className="flex items-center gap-2 justify-center md:justify-start hover:text-gold transition-colors">
                <Mail className="w-4 h-4" /> habitalibalioune.c95@gmail.com
              </a>
              <a href="https://wa.me/221772292392" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center md:justify-start hover:text-gold transition-colors">
                <Phone className="w-4 h-4" /> +221 77 229 23 92
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-cream mb-3">Suivez-nous</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              {["Facebook", "Instagram", "Twitter"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-cream/50 hover:text-gold transition-colors text-sm"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="divider-gold mt-12 mb-6" />
        <p className="text-center text-cream/30 text-sm">
          © {new Date().getFullYear()} Alioune Habitalib Coulibaly. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
