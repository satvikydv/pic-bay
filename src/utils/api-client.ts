import { IOrder } from "@/models/Order";
import { IProduct, ImageVariant } from "@/models/Product";
import { Types } from "mongoose";

export type ProductFormData = Omit<IProduct, "_id">;

export interface CreateOrderData {
  productId: Types.ObjectId | string;
  variant: ImageVariant;
}

type FetchOptions<T = unknown> = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: T;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<TResponse, TBody = unknown>(
    endpoint: string,
    options: FetchOptions<TBody> = {}
  ): Promise<TResponse> {
    const { method = "GET", body, headers = {} } = options;
  
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };
  
    const response = await fetch(`/api/${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  
    if (!response.ok) {
      throw new Error(await response.text());
    }
  
    return response.json();
  }
  

  async getProducts() {
    const res = await this.fetch<IProduct[]>("/products");
    // console.log("res: ", res)
    return res;
  }

  async getProduct(id: string) {
    return this.fetch<IProduct>(`/products/${id}`);
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData,
    });
  }

  async getUserOrders() {
    return this.fetch<IOrder[]>("/orders/user");
  }

  async createOrder(orderData: CreateOrderData) {
    const sanitizedOrderData = {
      ...orderData,
      productId:
        typeof orderData.productId === "string"
          ? orderData.productId
          : orderData.productId.toString(),
    };
  
    console.log("sanitizedOrderData: ", sanitizedOrderData);
  
    try {
      const response = await this.fetch<{ orderId: string; amount: number }>(
        "/orders",
        {
          method: "POST",
          body: sanitizedOrderData,
        }
      );
      console.log("Order created successfully:", response);
      return response;
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof Error) {
        console.error("Error response body:", error.message);
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();