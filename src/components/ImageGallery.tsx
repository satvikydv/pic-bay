import type { IProduct } from "@/models/Product"
import ProductCard from "./ProductCard"
import { Card, CardContent } from "@/components/ui/card"
import { PackageSearch } from "lucide-react"

interface ImageGalleryProps {
  products?: IProduct[] | null;
}

export default function ImageGallery({ products }: ImageGalleryProps) {
  // Ensure products is always an array
  console.log(products)
  const safeProducts = Array.isArray(products) ? products : []
  console.log(safeProducts)
  
  // Show loading skeleton if products is undefined
  if (typeof products === "undefined") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Show empty state if products array is empty
  if (safeProducts.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="bg-muted p-4 rounded-full">
            <PackageSearch className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold tracking-tight">No products found</h3>
            <p className="text-sm text-muted-foreground">There are no products available at the moment.</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {safeProducts.map((product) => (
        <ProductCard key={product._id?.toString() || Math.random().toString()} product={product} />
      ))}
    </div>
  )
}