import { ProductsEntity } from 'src/database/entities/products/products.entity';

export interface GetProductRequestInterface {
  page: number;
  limit: number;
  orderType: GetProductOrderType;
  orderValue: GetProductOrderValue;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
}

export interface CreateProductInterface {
    name: string;
    description: string;
    brand: string;
    price: number;
    size: string;
    color: string;
}

export interface UpdateProductInterface {
  name?: string;
  description?: string;
  brand?: string;
  price?: number;
  size?: string;
  color?: string;
}

export type GetProductOrderType = 'price' | 'name' | 'brand';
export type GetProductOrderValue = 'ASC' | 'DESC';