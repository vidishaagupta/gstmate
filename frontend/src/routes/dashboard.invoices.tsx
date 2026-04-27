import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Info, Loader2, Save, Download } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useClients } from "@/features/clients/api";
import { useProducts } from "@/features/products/api";
import { useCreateInvoice, previewInvoiceReport } from "@/features/invoices/api";
import { toast } from "sonner";
import { InvoiceTemplate } from "@/components/dashboard/InvoiceTemplate";

export const Route = createFileRoute("/dashboard/invoices")({
  component: InvoicesPage,
});

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  gstRate: number;
}

function InvoicesPage() {
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const createInvoice = useCreateInvoice();
  const navigate = Route.useNavigate();

  const [selectedClientId, setSelectedClientId] = useState("");
  const [businessState] = useState("Karnataka"); // Should come from user profile eventually
  const [discount, setDiscount] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, price: 0, gstRate: 18 },
  ]);
  const [debouncedPreviewData, setDebouncedPreviewData] = useState({
    invoiceNumber,
    items,
    discount,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPreviewData({ invoiceNumber, items, discount });
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [invoiceNumber, items, discount]);

  const [isDownloading, setIsDownloading] = useState(false);
  
  const clientObj = clients.find((c: any) => c._id === selectedClientId);
  const isSameState = clientObj?.state === businessState;

  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now().toString(), description: "", quantity: 1, price: 0, gstRate: 18 }]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const selectProduct = (id: string, productId: string) => {
    const product = products.find((p: any) => p._id === productId);
    if (product) {
      updateItem(id, "description", product.name);
      updateItem(id, "price", product.price);
      updateItem(id, "gstRate", product.gstRate);
    }
  };

  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    const taxDetails = (items || []).map((i) => {
      const taxable = i.quantity * i.price;
      const gstAmount = taxable * (i.gstRate / 100);
      return { ...i, taxable, gstAmount };
    });
    const totalGst = taxDetails.reduce((sum, i) => sum + i.gstAmount, 0);
    const grandTotal = subtotal - discount + totalGst;
    return { subtotal, totalGst, grandTotal, taxDetails };
  }, [items, discount]);

  const handleCreateInvoice = async () => {
    if (!selectedClientId) {
      toast.error("Please select a client.");
      return;
    }
    if (items.some(i => !i.description || i.price <= 0)) {
      toast.error("Please ensure all items have a description and valid price.");
      return;
    }

    try {
      await createInvoice.mutateAsync({
        invoiceNumber,
        clientId: selectedClientId,
        items: (items || []).map(({ id, ...rest }) => rest),
        subtotal: calculations.subtotal,
        discount,
        totalGst: calculations.totalGst,
        grandTotal: calculations.grandTotal,
        status: 'draft'
      });
      toast.success("Invoice created successfully!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Failed to create invoice.");
    }
  };

  const handleDownloadPreview = async () => {
    if (!selectedClientId) {
      toast.error("Please select a client first.");
      return;
    }

    try {
      setIsDownloading(true);

      const payload = {
        invoiceNumber,
        clientId: selectedClientId,
        items: (items || []).map(({ id, ...rest }) => rest),
        subtotal: calculations.subtotal,
        discount,
        totalGst: calculations.totalGst,
        grandTotal: calculations.grandTotal,
        businessState
      };

      await previewInvoiceReport(payload, invoiceNumber);
      toast.success("Invoice PDF downloaded!");
    } catch (err: any) {
      console.error("PDF ERROR:", err);
      // Attempt to read error message from blob if it failed
      let message = "Failed to generate PDF";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          message = json.error?.message || message;
        } catch (e) {}
      } else {
        message = err.response?.data?.error?.message || message;
      }
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (clientsLoading || productsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading invoice data...</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 relative">
      <div className="space-y-5">
        <div className="bg-background rounded-xl border p-5 space-y-4">
          <h3 className="font-semibold">Invoice Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice Number</Label>
              <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>
            <div>
              <Label>Select Client</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option value="">Choose a client...</option>
                {(clients || []).map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.state})</option>
                ))}
              </select>
            </div>
          </div>
          {selectedClientId && (
            <div className="flex items-center gap-2 text-xs rounded-lg bg-info/10 text-info p-2.5">
              <Info className="h-3.5 w-3.5 shrink-0" />
              {isSameState ? "Same state — CGST + SGST applies" : "Different state — IGST applies"}
            </div>
          )}
        </div>

        <div className="bg-background rounded-xl border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Line Items</h3>
            <Button variant="outline" size="sm" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
          </div>
          {(items || []).map((item) => (
            <div key={item.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <Label>Item / Service</Label>
                  <select
                    className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onChange={(e) => selectProduct(item.id, e.target.value)}
                  >
                    <option value="">Select a product (optional)</option>
                    {(products || []).map((p: any) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                  <div className="mt-2 text-xs font-medium text-muted-foreground italic mb-1">Or manual entry:</div>
                  <Input value={item.description} placeholder="Description" onChange={(e) => updateItem(item.id, "description", e.target.value)} />
                </div>
                <Button variant="ghost" size="icon" className="mt-5" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Qty</Label><Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} /></div>
                <div><Label>Price (₹)</Label><Input type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))} /></div>
                <div><Label>GST %</Label><Input type="number" value={item.gstRate} onChange={(e) => updateItem(item.id, "gstRate", Number(e.target.value))} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-xl border p-5 space-y-4">
          <h3 className="font-semibold">Discount & Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Discount Amount (₹)</Label>
              <Input 
                type="number" 
                value={discount} 
                onChange={(e) => setDiscount(Number(e.target.value))} 
                placeholder="0"
              />
            </div>
            <div className="flex flex-col justify-end text-right">
              <p className="text-xs text-muted-foreground">Grand Total</p>
              <p className="text-2xl font-black text-primary">₹{calculations.grandTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            className="flex-1 h-12 text-base gap-2" 
            variant="hero" 
            onClick={handleCreateInvoice}
            disabled={createInvoice.isPending}
          >
            {createInvoice.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save Invoice
          </Button>
          <Button 
            className="flex-1 h-12 text-base gap-2" 
            variant="hero-outline" 
            onClick={handleDownloadPreview}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            Download PDF
          </Button>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="h-fit sticky top-20">
        <div className="bg-background rounded-xl border p-1 overflow-hidden">
          <div className="scale-[0.65] origin-top transform-gpu -mb-[35%]">
            <InvoiceTemplate
              id="invoice-preview"
              invoiceNumber={debouncedPreviewData.invoiceNumber}
              client={{
                name: clientObj?.name || "Client Name",
                state: clientObj?.state || "State",
                email: clientObj?.email
              }}
              items={debouncedPreviewData.items}
              subtotal={calculations.subtotal}
              discount={debouncedPreviewData.discount}
              totalGst={calculations.totalGst}
              grandTotal={calculations.grandTotal}
              businessState={businessState}
            />
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground italic">
          Preview is scaled down. PDF will be full quality A4.
        </div>
      </div>
    </div>
  );
}
