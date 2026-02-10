import { ProductDetails } from "@/components/product/product-details";
import { EmptyState } from "@/components/ui/empty-state";
import { getProductById, getProducts } from "@/services/actions";
import { PackageSearch } from "lucide-react";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  try {
    const product = await getProductById(productId);
    return {
      title: `${product.name} | Dashboard`,
      description: product.subDescription,
    };
  } catch (error) {
    return {
      title: "Product Not Found",
    };
  }
}

export async function generateStaticParams() {
  try {
    const products = await getProducts({ limit: 10 });

    const productList = products;

    return productList.map((product) => ({
      productId: product.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const product = await getProductById(productId);

  if (!product) {
    return (
      <div className="container mx-auto py-24">
        <EmptyState
          title="Product not found"
          description="The product you're looking for doesn't exist or has been removed."
          icon={PackageSearch}
          action={{
            label: "Back to products",
            href: "/dashboard/products",
          }}
        />
      </div>
    );
  }

  return (
    <div className="md:container mx-auto ">
      <ProductDetails product={product} />
    </div>
  );
}
