import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useOrderStore } from "@/utils/orderStore";
import { useMenuStore } from "@/utils/menuStore";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export function NewOrderForm() {
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();
  const addOrder = useOrderStore((state) => state.addOrder);
  const menuItems = useMenuStore((state) => state.items);

  const addItem = (item: typeof menuItems[0]) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one item",
      });
      return;
    }

    const total = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderItems = selectedItems.map(({ name, quantity, price }) => ({
      name,
      quantity,
      price,
    }));

    addOrder({
      customerName: customerName || "Guest",
      items: orderItems,
      total,
    });
    
    toast({
      title: "Order Created",
      description: "The order has been successfully created",
    });
    
    setCustomerName("");
    setSelectedItems([]);
  };

  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">New Order</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium mb-2"
              >
                Customer Name (optional)
              </label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="max-w-md"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Menu Items</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItem(item)}
                    className="flex items-center justify-between p-3 text-sm border rounded-lg hover:bg-accent transition-colors"
                  >
                    <span>{item.name}</span>
                    <Badge variant="secondary">₹{item.price}</Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {selectedItems.length > 0 && (
          <Card className="p-6">
            <h3 className="font-medium mb-4">Order Summary</h3>
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center space-x-3">
                    <span>₹{item.price * item.quantity}</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => updateQuantity(item.id, -item.quantity)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={selectedItems.length === 0}>
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
}
