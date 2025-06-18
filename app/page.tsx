import { AnimatedHero } from "@/components/dashboard/AnimatedHero";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { FeaturesSection } from "@/components/dashboard/FeaturesSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-100 to-red-200 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/blood-drops-bg.svg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <AnimatedHero />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
}
