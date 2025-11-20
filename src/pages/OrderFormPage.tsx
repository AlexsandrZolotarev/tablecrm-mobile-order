import { useState } from "react";
import { buildSalePayload, createSale } from "../api/tablecrmApi";
import { CustomerPhoneSearch } from "../components/CustomerPhoneSearch";
import { OrderSummary } from "../components/OrderSummary";
import { ProductsPicker } from "../components/ProductsPicker";
import { SelectField } from "../components/SelectField";
import { TokenForm } from "../components/TokenForm";
import { useOrderState } from "../hooks/useOrderState";
import { Toast } from "../components/Toast";

export const OrderFormPage = () => {
  const {
    token,
    setToken,
    customer,
    customers,
    setCustomer,
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
    setIsCustomersLoading,
    isCustomersLoading,
    items,
    setItems,
  } = useOrderState();
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeOrganizations = Array.isArray(organizations) ? organizations : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];
  const safePriceTypes = Array.isArray(priceTypes) ? priceTypes : [];
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type });
  };
  const handleCreate = async (conduct: boolean) => {
    if (
      !token ||
      !customer ||
      !selectedAccountId ||
      !selectedOrganizationId ||
      !selectedWarehouseId ||
      !selectedPriceTypeId ||
      items.length === 0
    ) {
      showToast("Заполните обязательные поля и добавьте товары", "info");
      return;
    }

    try {
      showToast("Продажа успешно создана", "success");
    } catch (e) {
      showToast("Ошибка при создании продажи", "error");
    }
  };

  return (
    <div className="order-page">
      <div className="order-page__card">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <TokenForm
          isLoading={isCustomersLoading}
          token={token}
          onTokenChange={setToken}
        />

        {token && (
          <>
            <CustomerPhoneSearch
              customers={customers}
              customer={customer}
              onCustomerChange={setCustomer}
              isLoading={isCustomersLoading}
              onShowToast={(msg) => showToast(msg, "success")}
            />

            <SelectField
              label="Счёт поступления"
              value={selectedAccountId}
              options={safeAccounts.map((a) => ({
                value: a.id,
                label: a.name,
              }))}
              onChange={setSelectedAccountId}
            />

            <SelectField
              label="Склад отгрузки"
              value={selectedWarehouseId}
              options={safeWarehouses.map((w) => ({
                value: w.id,
                label: w.name,
              }))}
              onChange={setSelectedWarehouseId}
            />

            <SelectField
              label="Организация"
              value={selectedOrganizationId}
              options={safeOrganizations.map((o) => ({
                value: o.id,
                label: o.full_name || o.short_name || `Организация #${o.id}`,
              }))}
              onChange={setSelectedOrganizationId}
            />

            <SelectField
              label="Тип цены"
              value={selectedPriceTypeId}
              options={safePriceTypes.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              onChange={setSelectedPriceTypeId}
            />

            <ProductsPicker
              token={token}
              priceTypeId={selectedPriceTypeId}
              items={items}
              onChangeItems={setItems}
              onShowToast={(msg, type) => showToast(msg, type)}
            />

            <OrderSummary
              customer={customer}
              items={items}
              onCreate={() => handleCreate(false)}
              onCreateAndConduct={() => handleCreate(true)}
            />
          </>
        )}
      </div>
    </div>
  );
};
