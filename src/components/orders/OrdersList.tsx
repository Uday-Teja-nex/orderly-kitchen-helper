
import { useOrderStore } from "@/utils/orderStore";
import { Button } from "@/components/ui/button";
import { OrderCard } from "./OrderCard";

export function OrdersList() {
  const { orders, updateOrder } = useOrderStore();

  const activeOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "progress"
  );
  const completedOrders = orders.filter((order) => order.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </div>
      {activeOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Orders</h3>
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} onUpdateOrder={updateOrder} />
          ))}
        </div>
      )}
      {completedOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Completed Orders</h3>
          {completedOrders.map((order) => (
            <OrderCard key={order.id} order={order} onUpdateOrder={updateOrder} />
          ))}
        </div>
      )}
    </div>
  );
}
