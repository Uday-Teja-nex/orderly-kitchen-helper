
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useMenuStore } from "@/utils/menuStore";

type MenuItem = {
  id: string;
  name: string;
  price: number;
};

export function MenuEditor() {
  const { toast } = useToast();
  const { items, addItem, updateItem, removeItem } = useMenuStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [editedItem, setEditedItem] = useState<MenuItem | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, MenuItem>>({});

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both name and price",
      });
      return;
    }

    const price = parseFloat(newItem.price);
    if (isNaN(price) || price <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid price",
      });
      return;
    }

    addItem({
      id: crypto.randomUUID(),
      name: newItem.name,
      price,
    });

    setNewItem({ name: "", price: "" });
    toast({
      title: "Success",
      description: "Menu item added successfully",
    });
  };

  const startEditing = (item: MenuItem) => {
    setEditingId(item.id);
    setEditedItem(item);
    setPendingChanges({
      ...pendingChanges, 
      [item.id]: {...item}
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedItem(null);
  };

  const updatePendingChange = (id: string, changes: Partial<MenuItem>) => {
    const currentItem = pendingChanges[id] || items.find(item => item.id === id);
    if (currentItem) {
      setPendingChanges({
        ...pendingChanges,
        [id]: { ...currentItem, ...changes }
      });
    }
  };

  const saveChanges = () => {
    Object.entries(pendingChanges).forEach(([id, item]) => {
      updateItem(id, item);
    });
    
    setPendingChanges({});
    setEditingId(null);
    setEditedItem(null);
    
    toast({
      title: "Success",
      description: "Menu changes saved successfully",
    });
  };

  const handleDelete = (id: string) => {
    removeItem(id);
    // Remove from pending changes if it exists there
    const { [id]: _, ...restChanges } = pendingChanges;
    setPendingChanges(restChanges);
    
    toast({
      title: "Success",
      description: "Menu item removed successfully",
    });
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Menu Editor</h2>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-medium mb-4">Add New Item</h3>
          <div className="flex gap-4">
            <Input
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="max-w-[200px]"
            />
            <Input
              placeholder="Price (₹)"
              type="number"
              min="0"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="max-w-[120px]"
            />
            <Button onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Menu Items</h3>
          {hasPendingChanges && (
            <Button onClick={saveChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              {editingId === item.id ? (
                <div className="flex items-center gap-4">
                  <Input
                    value={pendingChanges[item.id]?.name || item.name}
                    onChange={(e) =>
                      updatePendingChange(item.id, { name: e.target.value })
                    }
                    className="max-w-[200px]"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pendingChanges[item.id]?.price || item.price}
                    onChange={(e) =>
                      updatePendingChange(item.id, {
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="max-w-[120px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span>₹{item.price.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => startEditing(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
