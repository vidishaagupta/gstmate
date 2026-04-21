import { IndianRupee } from "lucide-react";

interface LineItem {
  description: string;
  quantity: number;
  price: number;
  gstRate: number;
}

interface InvoiceTemplateProps {
  id?: string;
  invoiceNumber: string;
  client: {
    name: string;
    state: string;
    email?: string;
  };
  items: LineItem[];
  subtotal: number;
  discount?: number;
  totalGst: number;
  grandTotal: number;
  businessState?: string;
  businessName?: string;
  businessAddress?: string;
  businessGstin?: string;
  businessPhone?: string;
}

export function InvoiceTemplate({
  id = "invoice-pdf-content",
  invoiceNumber,
  client,
  items,
  subtotal,
  discount = 0,
  totalGst,
  grandTotal,
  businessState: propBusinessState,
  businessName: propBusinessName,
  businessAddress: propBusinessAddress,
  businessGstin: propBusinessGstin,
  businessPhone: propBusinessPhone,
}: InvoiceTemplateProps) {
  const businessName = propBusinessName || "GSTMate Pro";
  const businessState = propBusinessState || "Karnataka";
  const businessAddress = propBusinessAddress || "Your Business Address Line 1";
  const businessGstin = propBusinessGstin || "29AAAAA0000A1Z5";
  const businessPhone = propBusinessPhone || "";

  const isSameState = client.state === businessState;

  // Modern colors based on the image (Blue/Indigo primary)
  const colors = {
    white: "#ffffff",
    black: "#000000",
    gray900: "#111827",
    gray800: "#1f2937",
    gray600: "#4b5563",
    gray500: "#6b7280",
    gray400: "#9ca3af",
    gray100: "#f3f4f6",
    gray50: "#f9fafb",
    border: "#e5e7eb",
    primary: "#6366f1", // Indigo-500
    accent: "#4f46e5", // Indigo-600
  };

  return (
    <div 
      id={id} 
      className="p-10 max-w-[800px] mx-auto bg-white" 
      style={{ 
        minHeight: '1120px', 
        color: colors.gray900,
        fontFamily: "'Inter', sans-serif",
        lineHeight: "1.5"
      }}
    >
      {/* Top Border Accent */}
      <div style={{ height: "6px", backgroundColor: colors.accent, margin: "-40px -40px 40px" }} />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-16">
        <div>
          <div 
            className="inline-block px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-6" 
            style={{ backgroundColor: colors.accent, color: colors.white }}
          >
            Official Tax Invoice
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            #{invoiceNumber}
          </h1>
          <p className="text-xs font-medium text-gray-500">
            Issued on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="text-right">
          <h2 className="text-xl font-bold tracking-tight mb-2" style={{ color: colors.accent }}>
            {businessName}
          </h2>
          <div className="text-[11px] text-gray-500 space-y-1">
            <p>{businessAddress}</p>
            <p>{businessState}, India</p>
            <p className="font-bold text-gray-900 mt-2">GSTIN: {businessGstin}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Billed To</p>
          <h3 className="text-xl font-bold mb-1">{client.name}</h3>
          <div className="text-xs text-gray-500 space-y-1">
            <p>{client.state}, India</p>
            {client.email && <p className="text-accent font-medium" style={{ color: colors.accent }}>{client.email}</p>}
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Payment Details</p>
          <div className="text-sm space-y-2">
            <p><span className="font-bold">Place of Supply:</span> {client.state}</p>
            <p><span className="font-bold">Due Date:</span> Upon Receipt</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</th>
              <th className="text-center py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Qty</th>
              <th className="text-right py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
              <th className="text-center py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">GST %</th>
              <th className="text-right py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-6">
                  <p className="font-bold text-gray-900">{item.description}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Standard service/product delivery</p>
                </td>
                <td className="py-6 text-center font-bold">{item.quantity}</td>
                <td className="py-6 text-right font-medium">INR {item.price.toLocaleString()}</td>
                <td className="py-6 text-center font-bold text-accent" style={{ color: colors.accent }}>{item.gstRate}%</td>
                <td className="py-6 text-right font-bold">INR {(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="flex justify-end mb-16">
        <div className="w-full max-w-[320px] space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="font-bold text-gray-900">INR {subtotal.toLocaleString()}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Discount</span>
              <span className="font-bold text-accent" style={{ color: colors.accent }}>-INR {discount.toLocaleString()}</span>
            </div>
          )}

          <div className="pt-4 border-t border-dashed border-gray-200">
            {items.map((item, idx) => {
              const gstAmount = (item.quantity * item.price) * (item.gstRate / 100);
              if (gstAmount === 0) return null;
              const type = isSameState ? "GST" : "IGST";
              return (
                <div key={idx} className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500 font-medium">{type} ({item.gstRate}%)</span>
                  <span className="font-bold text-gray-900">INR {gstAmount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t-2 border-gray-100 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1" style={{ color: colors.accent }}>Total Amount</p>
              <p className="text-[10px] text-gray-400">Includes all taxes</p>
            </div>
            <div className="text-4xl font-black tracking-tighter text-accent" style={{ color: colors.accent }}>
              INR {grandTotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Final Footer */}
      <div className="mt-auto pt-12 border-t-4 border-gray-900">
        <div className="flex justify-between items-start">
          <div className="max-w-[400px]">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3">Terms & Notes</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Please process payment within 15 days. This is a computer-generated tax invoice and does not require a physical signature.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2">Thank You</p>
            <p className="text-sm font-bold text-accent" style={{ color: colors.accent }}>{businessName} Team</p>
          </div>
        </div>
      </div>
    </div>
  );
}
