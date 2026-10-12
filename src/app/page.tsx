import Hero from "./components/Hero";
import ProductSection from "./components/ProductCard";

export default function HomePage() {
  return (
    <main className="w-full">
      <Hero />
      <ProductSection />
    </main>
  );
}
