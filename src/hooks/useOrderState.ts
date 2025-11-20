import { useEffect, useState } from "react";
import type {
  Customer,
  Account,
  Organization,
  Warehouse,
  PriceType,
  OrderItem,
} from "../types/tablecrm";
import {
  fetchPayboxes,
  fetchOrganizations,
  fetchPriceTypes,
  fetchWarehouses,
  searchCustomerByPhone,
} from "../api/tablecrmApi";

export function useOrderState() {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem("tablecrm_token")
  );

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    number | null
  >(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null
  );
  const [selectedPriceTypeId, setSelectedPriceTypeId] = useState<number | null>(
    null
  );

  const [items, setItems] = useState<OrderItem[]>([]);

  const [loadingDictionaries, setLoadingDictionaries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setToken = (value: string) => {
    setTokenState(value);
    localStorage.setItem("tablecrm_token", value);
  };

  useEffect(() => {
    if (!token) return;

    setLoadingDictionaries(true);
    setIsCustomersLoading(true);
    setError(null);

    Promise.all([
      fetchPayboxes(token),
      fetchOrganizations(token),
      fetchWarehouses(token),
      fetchPriceTypes(token),
      searchCustomerByPhone(token),
    ])
      .then(([payboxes, orgs, warehouses, priceTypes, customers]) => {
        setAccounts(payboxes);
        setOrganizations(orgs);
        setWarehouses(warehouses);
        setPriceTypes(priceTypes);
        setCustomers(customers);
      })
      .catch(() => {
        setError("Не удалось загрузить справочники");
      })
      .finally(() => {
        setLoadingDictionaries(false);
        setIsCustomersLoading(false);
      });
  }, [token]);

  return {
    token,
    setToken,
    customer,
    setCustomer,
    customers,
    isCustomersLoading,
    setIsCustomersLoading,
    accounts,
    organizations,
    warehouses,
    priceTypes,
    selectedAccountId,
    setSelectedAccountId,
    selectedOrganizationId,
    setSelectedOrganizationId,
    selectedWarehouseId,
    setSelectedWarehouseId,
    selectedPriceTypeId,
    setSelectedPriceTypeId,
    items,
    setItems,
    loadingDictionaries,
    error,
  };
}
