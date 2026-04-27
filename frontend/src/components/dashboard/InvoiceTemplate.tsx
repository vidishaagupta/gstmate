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
      className="p-8 max-w-[800px] mx-auto bg-white flex flex-col" 
      style={{ 
        minHeight: '1120px', 
        color: colors.gray900,
        fontFamily: "'Inter', sans-serif",
        lineHeight: "1.5"
      }}
    >
      {/* Top Border Accent */}
      <div style={{ height: "10px", backgroundColor: colors.accent, margin: "-32px -32px 32px" }} />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-12">
        <div className="relative">
          <div 
            className="inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm" 
            style={{ backgroundColor: colors.accent, color: colors.white }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white mr-2 animate-pulse" />
            Official Tax Invoice
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-3 text-gray-900 leading-none">
            #{invoiceNumber}
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-[1px] bg-gray-300" />
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Issued {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="bg-gray-900 text-white p-5 rounded-2xl inline-block shadow-xl">
            <h2 className="text-xl font-black tracking-tight mb-1">
              {businessName}
            </h2>
            <div className="text-[9px] text-gray-300 space-y-0.5 font-medium uppercase tracking-wider">
              <p>{businessAddress}</p>
              <p>{businessState}, India</p>
              <div className="pt-2 mt-2 border-t border-gray-700">
                <p className="font-black text-white text-[10px]">GSTIN: {businessGstin}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-10 mb-12 border-y border-gray-100 py-8">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Client Information</p>
          <h3 className="text-xl font-black mb-1 text-gray-900">{client.name}</h3>
          <div className="text-[9px] text-gray-500 space-y-0.5 font-bold uppercase tracking-widest">
            <p className="flex items-center"><span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-[7px]">📍</span>{client.state}, India</p>
            {client.email && <p className="flex items-center" style={{ color: colors.accent }}><span className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center mr-2 text-[7px]">✉️</span>{client.email}</p>}
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Payment Schedule</p>
            <div className="space-y-3">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase">Place of Supply</p>
                <p className="text-xs font-black text-gray-900">{client.state}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase">Payment Terms</p>
                <p className="text-xs font-black text-accent" style={{ color: colors.accent }}>Due Upon Receipt</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mb-10 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: colors.gray50 }}>
              <th className="text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900 border-r border-gray-200">DESCRIPTION</th>
              <th className="text-center px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900 border-r border-gray-200">QTY</th>
              <th className="text-right px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900 border-r border-gray-200">PRICE</th>
              <th className="text-center px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900 border-r border-gray-200">GST %</th>
              <th className="text-right px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-4 border-r border-gray-200">
                  <p className="font-bold text-gray-900 text-sm">{item.description}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5 uppercase font-medium tracking-tight">Standard product/service delivery</p>
                </td>
                <td className="px-4 py-4 text-center font-black text-gray-900 border-r border-gray-200 text-sm">{item.quantity}</td>
                <td className="px-4 py-4 text-right font-medium text-gray-700 border-r border-gray-200 text-sm">{item.price.toLocaleString()}</td>
                <td className="px-4 py-4 text-center font-black text-accent border-r border-gray-200 text-sm" style={{ color: colors.accent }}>{item.gstRate}%</td>
                <td className="px-4 py-4 text-right font-black text-gray-900 text-sm">{(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="flex justify-end mb-12">
        <div className="w-full max-w-[320px] p-5 rounded-2xl" style={{ backgroundColor: colors.gray50 }}>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Subtotal</span>
              <span className="font-black text-gray-900">INR {subtotal.toLocaleString()}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Discount</span>
                <span className="font-black text-emerald-600">-INR {discount.toLocaleString()}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200">
              {(items || []).map((item, idx) => {
                const gstAmount = (item.quantity * item.price) * (item.gstRate / 100);
                if (gstAmount === 0) return null;
                const type = isSameState ? "GST" : "IGST";
                return (
                  <div key={idx} className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">{type} ({item.gstRate}%)</span>
                    <span className="font-black text-gray-900">INR {gstAmount.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-5 border-t-2 border-gray-900 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-0.5" style={{ color: colors.accent }}>Grand Total</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">All taxes included</p>
              </div>
              <div className="text-2xl font-black tracking-tighter text-gray-900">
                INR {grandTotal.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Footer */}
      <div className="mt-auto">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex justify-between items-start">
          <div className="max-w-[400px]">
            <p className="text-[9px] font-black uppercase tracking-widest mb-3 text-gray-400">Notes & Information</p>
            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
              Thank you for your business. This invoice is digitally generated and valid without a physical signature.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest mb-3 text-gray-400">Authorized Signatory</p>
            <div className="mb-3">
              <p className="text-lg font-black text-gray-900" style={{ fontFamily: "'Dancing Script', cursive" }}>
                {businessName}
              </p>
            </div>
            <p className="text-[9px] font-black text-accent uppercase tracking-widest" style={{ color: colors.accent }}>{businessName} Management</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">
            Generated via GSTMate Pro • Efficiency Simplified
          </p>
        </div>
      </div>
    </div>
  );
}
