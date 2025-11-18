import { buildSalePayload, createSale } from "../api/tablecrmApi";
import { CustomerPhoneSearch } from "../components/CustomerPhoneSearch";
import { OrderSummary } from "../components/OrderSummary";
import { ProductsPicker } from "../components/ProductsPicker";
import { SelectField } from "../components/SelectField";
import { TokenForm } from "../components/TokenForm";
import { useOrderState } from "../hooks/useOrderState";

export const OrderFormPage = () => {
  const {
    token,
    setToken,
    customer,
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
    items,
    setItems,
  } = useOrderState();
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeOrganizations = Array.isArray(organizations) ? organizations : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];
  const safePriceTypes = Array.isArray(priceTypes) ? priceTypes : [];
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
      alert("Заполните обязательные поля и добавьте товары");
      return;
    }

    try {
      const payload = buildSalePayload(
        {
          customerId: customer.id,
          organizationId: selectedOrganizationId,
          warehouseId: selectedWarehouseId,
          accountId: selectedAccountId,
          priceTypeId: selectedPriceTypeId,
        },
        items,
        conduct
      );
      console.log("SALE PAYLOAD", payload);
      const result = await createSale(token, payload);
      console.log("Sale created:", result);
      alert("Продажа успешно создана");
    } catch (e) {
      console.error(e);
      alert("Ошибка при создании продажи");
    }
  };

  return (
    <div className="order-page">
      <div className="order-page__card">
        <TokenForm token={token} onTokenChange={setToken} />

        {token && (
          <>
            <CustomerPhoneSearch
              token={token}
              customer={customer}
              onCustomerChange={setCustomer}
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
