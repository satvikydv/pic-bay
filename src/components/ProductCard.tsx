import { IKImage } from "imagekitio-next"
import Link from "next/link"
import { Eye } from "lucide-react"
import { type IProduct, IMAGE_VARIANTS } from "@/models/Product"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ProductCard({ product }: { product: IProduct }) {
  const lowestPrice = product.variants.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants[0]?.price || 0,
  )

  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product._id}`} className="block w-full h-full">
          <div className="relative w-full h-full group">
            <IKImage
              path={product.imageUrl}
              alt={product.name}
              loading="eager"
              transformation={[
                {
                  height: IMAGE_VARIANTS.square.dimensions.height.toString(),
                  width: IMAGE_VARIANTS.square.dimensions.width.toString(),
                  cropMode: "extract",
                  focus: "center",
                  quality: "80",
                },
              ]}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        </Link>
      </div>

      <CardHeader className="p-4 pb-0">
        <Link href={`/products/${product._id}`} className="hover:text-primary transition-colors">
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
        </Link>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{product.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-lg font-bold">From ₹{lowestPrice.toFixed(2)}</span>
          <Badge variant="outline" className="mt-1 font-normal">
            {product.variants.length} sizes available
          </Badge>
        </div>

        <Button asChild size="sm" className="gap-1.5">
          <Link href={`/products/${product._id}`}>
            <Eye className="w-4 h-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

