import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import Authentication from "../components/Authentication";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FAQ />
        {!user ? (
          <Authentication />
        ) : (
          <p className="text-center mt-10">{t("home.welcome", { email: user.email })}</p>
        )}
      </main>
      <Footer />
    </>
  );
}
