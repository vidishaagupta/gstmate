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

  // Safe colors for html2canvas (HEX instead of oklch)
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
    primary: "#4f46e5", // Indigo-600
    primaryLight: "#eef2ff", // Indigo-50
  };

  return (
    <div 
      id={id} 
      className="p-8 max-w-[800px] mx-auto" 
      style={{ 
        minHeight: '1120px', 
        backgroundColor: colors.white, 
        color: colors.gray900,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: "1.4"
      }}
    >
      {/* Top Bar Accent */}
      <div style={{ height: "4px", backgroundColor: colors.primary, margin: "-32px -32px 32px" }} />

      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <div 
            className="inline-block px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-sm" 
            style={{ backgroundColor: colors.primary, color: colors.white }}
          >
            Tax Invoice
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none" style={{ color: colors.gray900 }}>
            INVOICE
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold tracking-tight" style={{ color: colors.primary }}>
              #{invoiceNumber}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.gray500 }}>
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex flex-col items-end">
            <h2 className="text-2xl font-black tracking-tighter uppercase leading-tight" style={{ color: colors.gray900 }}>
              {businessName}
            </h2>
            <div className="h-1 w-12 bg-primary mt-1 mb-3" style={{ backgroundColor: colors.primary }} />
          </div>
          <div className="text-[11px] leading-relaxed font-medium" style={{ color: colors.gray600 }}>
            <p>{businessAddress}</p>
            <p>{businessState}, India</p>
            <div 
              className="mt-2 inline-block px-2 py-1 rounded-sm border font-bold" 
              style={{ borderColor: colors.border, color: colors.gray900, backgroundColor: colors.gray50 }}
            >
              GSTIN: {businessGstin}
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b" style={{ borderColor: colors.border }}>
        <div>
          <p className="text-[9px] uppercase tracking-[0.15em] font-black mb-2" style={{ color: colors.gray400 }}>Billed To</p>
          <p className="text-lg font-black mb-0.5">{client.name}</p>
          <div className="text-xs space-y-0.5" style={{ color: colors.gray600 }}>
            <p>{client.state}, India</p>
            {client.email && <p className="font-medium" style={{ color: colors.primary }}>{client.email}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.15em] font-black mb-2" style={{ color: colors.gray400 }}>Payment Details</p>
          <div className="text-xs space-y-0.5" style={{ color: colors.gray600 }}>
            <p><span className="font-bold" style={{ color: colors.gray900 }}>Place of Supply:</span> {client.state}</p>
            <p><span className="font-bold" style={{ color: colors.gray900 }}>Due Date:</span> Upon Receipt</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr>
            <th className="text-left py-3 px-0 text-[10px] font-black uppercase tracking-widest border-b-2" style={{ color: colors.gray900, borderColor: colors.gray900 }}>Description</th>
            <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest border-b-2" style={{ color: colors.gray900, borderColor: colors.gray900 }}>Qty</th>
            <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest border-b-2" style={{ color: colors.gray900, borderColor: colors.gray900 }}>Price</th>
            <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest border-b-2" style={{ color: colors.gray900, borderColor: colors.gray900 }}>GST %</th>
            <th className="text-right py-3 px-0 text-[10px] font-black uppercase tracking-widest border-b-2" style={{ color: colors.gray900, borderColor: colors.gray900 }}>Total</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: colors.border }}>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-4 px-0 align-top">
                <p className="font-bold text-sm" style={{ color: colors.gray900 }}>{item.description}</p>
              </td>
              <td className="py-4 px-4 text-right font-bold align-top text-sm">{item.quantity}</td>
              <td className="py-4 px-4 text-right font-bold align-top text-sm">₹{item.price.toLocaleString()}</td>
              <td className="py-4 px-4 text-right font-bold align-top text-sm" style={{ color: colors.primary }}>{item.gstRate}%</td>
              <td className="py-4 px-0 text-right font-black align-top text-sm">₹{(item.quantity * item.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div className="flex justify-end mt-8">
        <div className="w-full max-w-[280px] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold" style={{ color: colors.gray500 }}>Subtotal</span>
            <span className="font-bold">₹{subtotal.toLocaleString()}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between items-center text-xs text-primary">
              <span className="font-bold">Discount</span>
              <span className="font-bold">-₹{discount.toLocaleString()}</span>
            </div>
          )}
          
          <div className="space-y-1.5 py-2 border-y border-dashed" style={{ borderColor: colors.border }}>
            {items.map((item, idx) => {
              const gstAmount = (item.quantity * item.price) * (item.gstRate / 100);
              if (gstAmount === 0) return null;

              if (isSameState) {
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span style={{ color: colors.gray500 }}>CGST ({item.gstRate / 2}%)</span>
                      <span className="font-medium">₹{(gstAmount / 2).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span style={{ color: colors.gray500 }}>SGST ({item.gstRate / 2}%)</span>
                      <span className="font-medium">₹{(gstAmount / 2).toLocaleString()}</span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span style={{ color: colors.gray500 }}>IGST ({item.gstRate}%)</span>
                  <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-1">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.primary }}>Total Amount</p>
            </div>
            <div className="text-2xl font-black tracking-tighter" style={{ color: colors.primary }}>
              ₹{grandTotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t-2" style={{ borderColor: colors.gray900 }}>
        <div className="flex justify-between items-end">
          <div className="max-w-[280px]">
            <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: colors.gray900 }}>Terms & Notes</p>
            <p className="text-[10px] leading-relaxed" style={{ color: colors.gray500 }}>
              Please process payment within 15 days. This is a computer-generated tax invoice and does not require a physical signature.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.gray900 }}>Thank You</p>
            <p className="text-xs font-bold" style={{ color: colors.primary }}>{businessName} Team</p>
          </div>
        </div>
      </div>
    </div>
  );
}
