import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/features/products/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/products")({
  component: ProductsPage,
});

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  gstRate: number;
}

function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", gstRate: "18" });

  const handleAdd = async () => {
    if (!form.name || !form.price) return;
    try {
      await createProduct.mutateAsync({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        gstRate: Number(form.gstRate),
      });
      setForm({ name: "", description: "", price: "", gstRate: "18" });
      setShowForm(false);
      toast.success("Product added successfully.");
    } catch (err: any) {
      toast.error("Failed to add product.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success("Product deleted.");
      } catch (err: any) {
        toast.error("Failed to delete product.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} products</p>
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p: Product) => (
          <div key={p._id} className="bg-background rounded-xl border p-5 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{p.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(p._id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">₹{p.price.toLocaleString()}</span>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                GST {p.gstRate}%
              </span>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
            No products found. Add your first product to get started.
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="bg-background rounded-xl border shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">Add Product</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div><Label>Product Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Price (₹) *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div><Label>GST Rate (%) *</Label><Input type="number" value={form.gstRate} onChange={(e) => setForm({ ...form, gstRate: e.target.value })} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button 
                  className="flex-1" 
                  onClick={handleAdd}
                  disabled={createProduct.isPending}
                >
                  {createProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
