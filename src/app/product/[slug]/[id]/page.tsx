import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  // Replace this with your actual product data or API.
  const products = [
    { id: "1", name: "Rice" },
    { id: "2", name: "Potato" },
  ];

  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
    </div>
  );
}