import Hero from "./components/Hero";
import ProductSection from "./components/ProductSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductSection></ProductSection>

      <section
        id="সর্ব-পণ্য"
        className="scroll-mt-28 px-4 py-12 sm:px-6 lg:px-10"
      ></section>
    </>
  );
}








