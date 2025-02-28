"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import type { IOrder } from "@/models/Order"
import { Download } from "lucide-react"
import { IKImage } from "imagekitio-next"
import { IMAGE_VARIANTS } from "@/models/Product"
import { apiClient } from "@/utils/api-client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiClient.getUserOrders()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session) fetchOrders()
  }, [session])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="w-[200px] h-[150px] rounded-lg" />
                  <div className="flex-grow space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => {
          const variant = order.variant.type as any
          const variantDimensions = IMAGE_VARIANTS[variant as keyof typeof IMAGE_VARIANTS].dimensions
          const product = order.productId as any

          return (
            <Card key={order._id?.toString()}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Preview Image - Low Quality */}
                  <div
                    className="relative rounded-lg overflow-hidden bg-muted"
                    style={{
                      width: "200px",
                      aspectRatio: `${variantDimensions.width} / ${variantDimensions.height}`,
                    }}
                  >
                    <IKImage
                      urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                      path={product.imageUrl}
                      alt={`Order ${order._id?.toString().slice(-6)}`}
                      transformation={[
                        {
                          quality: "60",
                          width: variantDimensions.width.toString(),
                          height: variantDimensions.height.toString(),
                          cropMode: "extract",
                          focus: "center",
                        },
                      ]}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold mb-2">Order #{order._id?.toString().slice(-6)}</h2>
                        <div className="space-y-2 text-muted-foreground">
                          <p>
                            Resolution: {variantDimensions.width} x {variantDimensions.height}px
                          </p>
                          <p>
                            License Type: <span className="capitalize">{order.variant.license}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            Status:{" "}
                            <Badge
                              variant={
                                order.status === "paid"
                                  ? "secondary"
                                  : order.status === "failed"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold mb-4">₹{(order.amount / 100).toFixed(2)}</p>

                        {order.status === "paid" && (
                          <Button asChild>
                            <a
                              href={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/tr:q-100,w-${variantDimensions.width},h-${variantDimensions.height},cm-extract,fo-center/${product.imageUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={`image-${order._id?.toString().slice(-6)}.jpg`}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download High Quality
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {orders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-lg text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

