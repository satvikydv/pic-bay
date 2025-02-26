"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import type { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useNotification } from "./Notification"
import { IMAGE_VARIANTS, type ImageVariantType } from "@/models/Product"
import { apiClient, type ProductFormData } from "@/utils/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import FileUpload from "./FileUpload"

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false)
  const { showNotification } = useNotification()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      variants: [
        {
          type: "square" as ImageVariantType,
          price: 9.99,
          license: "personal",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  })

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("imageUrl", response.filePath)
    showNotification("Image uploaded successfully!", "success")
  }

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)
    try {
      await apiClient.createProduct(data)
      showNotification("Product created successfully!", "success")

      // Reset form
      setValue("name", "")
      setValue("description", "")
      setValue("imageUrl", "")
      setValue("variants", [
        {
          type: "SQUARE" as ImageVariantType,
          price: 9.99,
          license: "personal",
        },
      ])
    } catch (error) {
      showNotification(error instanceof Error ? error.message : "Failed to create product", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter the basic details about your product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              className={`min-h-[100px] ${errors.description ? "border-destructive" : ""}`}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="mt-2">
              <FileUpload onSuccess={handleUploadSuccess} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image Variants</CardTitle>
          <CardDescription>Configure different sizes and licensing options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Size & Aspect Ratio</Label>
                      <Select
                        defaultValue={field.type}
                        onValueChange={(value) => setValue(`variants.${index}.type`, value as ImageVariantType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(IMAGE_VARIANTS).map(([key, value]) => (
                            <SelectItem key={key} value={value.type}>
                              {value.label} ({value.dimensions.width}x{value.dimensions.height})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>License</Label>
                      <Select
                        defaultValue={field.license}
                        onValueChange={(value) => setValue(`variants.${index}.license`, value as "personal" | "commercial")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal Use</SelectItem>
                          <SelectItem value="commercial">Commercial Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register(`variants.${index}.price`, {
                          valueAsNumber: true,
                          required: "Price is required",
                          min: { value: 0.01, message: "Price must be greater than 0" },
                        })}
                        className={errors.variants?.[index]?.price ? "border-destructive" : ""}
                      />
                      {errors.variants?.[index]?.price && (
                        <p className="text-sm text-destructive">{errors.variants[index]?.price?.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              append({
                type: "SQUARE" as ImageVariantType,
                price: 9.99,
                license: "personal",
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Product...
          </>
        ) : (
          "Create Product"
        )}
      </Button>
    </form>
  )
}

