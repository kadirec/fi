import { Header } from "@/components/header";
import { MeStory } from "@/components/me-story";
import { Tagline } from "@/components/tagline";
import { WorksCarousel } from "@/components/works-carousel";
import { Guest } from "@/components/guest";
import { Shop } from "@/components/shop";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <MeStory />
      <Tagline />
      <WorksCarousel />
      <Guest />
      <Shop />
      <Footer />
    </main>
  );
}
