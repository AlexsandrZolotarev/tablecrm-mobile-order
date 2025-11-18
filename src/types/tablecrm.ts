export interface Customer {
  id: number;
  name: string;
  phone?: string | null;
}

export interface Account {
  id: number;
  name: string;
}

export interface Organization {
  id: number;
  type?: string | null;
  short_name?: string | null;
  full_name?: string | null;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface PriceType {
  id: number;
  name: string;
}

export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}
export interface Product {
  id: number;
  name: string;
  price?: number;
}
