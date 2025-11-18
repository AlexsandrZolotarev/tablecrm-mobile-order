import { get, post } from "./httpClient";
import type {
  Customer,
  Account,
  Organization,
  Warehouse,
  PriceType,
  OrderItem,
  Product,
} from "../types/tablecrm";

export async function searchCustomerByPhone(
  token: string,
  phone: string
): Promise<Customer[]> {
  const raw = await get<any>("/contragents/", {
    token,
    phone,
  });
  if (raw && Array.isArray(raw.result)) {
    return raw.result as Customer[];
  }

  if (Array.isArray(raw)) return raw as Customer[];
  return [];
}

export async function fetchPayboxes(token: string): Promise<Account[]> {
  const raw = await get<any>("/payboxes/", { token });
  return Array.isArray(raw.result) ? (raw.result as Account[]) : [];
}

export async function fetchOrganizations(
  token: string
): Promise<Organization[]> {
  const raw = await get<any>("/organizations/", { token });
  return Array.isArray(raw.result) ? (raw.result as Organization[]) : [];
}

export async function fetchWarehouses(token: string): Promise<Warehouse[]> {
  const raw = await get<any>("/warehouses/", { token });
  return Array.isArray(raw.result) ? (raw.result as Warehouse[]) : [];
}

export async function fetchPriceTypes(token: string): Promise<PriceType[]> {
  const raw = await get<any>("/price_types/", { token });
  return Array.isArray(raw.result) ? (raw.result as PriceType[]) : [];
}

export async function searchProducts(
  token: string,
  query: string
): Promise<Product[]> {
  const raw = await get<any>("/webapp/", { token });

  const list: any[] = Array.isArray(raw.result)
    ? raw.result
    : Array.isArray(raw)
    ? raw
    : [];

  const q = query.toLowerCase();

  return list
    .filter((p) => typeof p.name === "string")
    .filter((p) => p.name.toLowerCase().includes(q));
}

export async function fetchProductPrice(
  token: string,
  productId: number,
  priceTypeId: number
) {
  return get<any>(`/alt_prices/${productId}/`, {
    token,
    price_type_id: priceTypeId,
  });
}

export async function createSale(token: string, body: any) {
  return post("/docs_sales/", [body], { token });
}

export function buildSalePayload(
  params: {
    customerId: number;
    organizationId: number;
    warehouseId: number;
    accountId: number;
    priceTypeId: number;
  },
  items: OrderItem[],
  conduct: boolean
) {
  const unixNow = Math.floor(Date.now() / 1000);

  return {
    dated: unixNow,
    operation: "Заказ",
    tax_included: true,
    tax_active: true,

    goods: items.map((i) => ({
      price: i.price,
      quantity: i.quantity,
      unit: (i as any).unit ?? 1,
      discount: 0,
      sum_discounted: 0,
      nomenclature: i.product_id,
    })),

    settings: {
      date_next_created: null,
    },

    loyality_card_id: null,

    warehouse: params.warehouseId,
    contragent: params.customerId,
    paybox: params.accountId,
    organization: params.organizationId,

    status: conduct,
    paid_rubles: 0,
    paid_lt: 0,
  };
}
