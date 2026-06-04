import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import BannerShowcase from "@/components/BannerShowcase";
import StorySection from "@/components/StorySection";
import WhyBuySection from "@/components/WhyBuySection";
import ExcerptSection from "@/components/ExcerptSection";
import ReviewsSection from "@/components/ReviewsSection";
import OfferSection from "@/components/OfferSection";
import AuthorSection from "@/components/AuthorSection";
import EmailCaptureSection from "@/components/EmailCaptureSection";
import FooterSection from "@/components/FooterSection";

const bookJsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "La Sagesse d'une Mère, l'Héritage d'une Vie",
  author: {
    "@type": "Person",
    name: "Alioune Habitalib Coulibaly",
  },
  inLanguage: "fr",
  bookFormat: "https://schema.org/EBook",
  description:
    "Un livre d'hommage rempli d'amour, de sagesse et de valeurs familiales africaines — l'histoire vraie de Oumy par Alioune Habitalib Coulibaly.",
  image: "https://heritage-of-wisdom.lovable.app/og-image.jpg",
  offers: {
    "@type": "Offer",
    price: "5000",
    priceCurrency: "XOF",
    availability: "https://schema.org/InStock",
  },
};

const Index = () => {
  return (
    <main>
      <Helmet>
        <title>La Sagesse d'une Mère, l'Héritage d'une Vie | Livre Africain</title>
        <meta name="description" content="Découvrez l'histoire vraie de Oumy — un livre d'hommage rempli d'amour, de sagesse et de valeurs familiales africaines. Par Alioune Habitalib Coulibaly." />
        <link rel="canonical" href="https://heritage-of-wisdom.lovable.app/" />
        <meta property="og:title" content="La Sagesse d'une Mère, l'Héritage d'une Vie" />
        <meta property="og:description" content="Un livre d'hommage à Oumy — amour, sagesse et héritage africain. Par Alioune Habitalib Coulibaly." />
        <meta property="og:url" content="https://heritage-of-wisdom.lovable.app/" />
        <meta property="og:type" content="book" />
        <script type="application/ld+json">{JSON.stringify(bookJsonLd)}</script>
      </Helmet>
      <HeroSection />
      <BannerShowcase />
      <StorySection />
      <WhyBuySection />
      <ExcerptSection />
      <ReviewsSection />
      <OfferSection />
      <AuthorSection />
      <EmailCaptureSection />
      <FooterSection />
    </main>
  );
};

export default Index;
