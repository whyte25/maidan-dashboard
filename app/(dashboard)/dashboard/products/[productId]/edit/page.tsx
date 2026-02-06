import { ProductForm } from "@/components/product/product-form";
import { EmptyState } from "@/components/ui/empty-state";
import { getProductById } from "@/services/actions";
import { PackageSearch } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    return (
      <div className="container mx-auto py-24">
        <EmptyState
          title="Product not found"
          description="We couldn't find the product you're trying to edit."
          icon={PackageSearch}
          action={{
            label: "Back to products",
            href: "/dashboard/products",
          }}
        />
      </div>
    );
  }

  return <ProductForm defaultValues={product} productId={productId} />;
}
