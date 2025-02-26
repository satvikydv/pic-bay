"use client"

import { useEffect, useState } from "react"
import ImageGallery from "@/components/ImageGallery"
import type { IProduct } from "@/models/Product"
import { apiClient } from "@/utils/api-client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Home() {
  const [products, setProducts] = useState<IProduct[] | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts()
        
        setProducts(data)
        // console.log("data: ", data)
        // console.log(products)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again later.")
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Pic-Bay</h1>
        <p className="text-muted-foreground">Browse through our collection of high-quality images</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <ImageGallery products={products ?? []} />
      </div>
    </div>
  )
}

