import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

interface InvoiceData {
  invoiceNumber: string;
  clientId: {
    name: string;
    state: string;
    email?: string;
    address?: string;
    gstin?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    price: number;
    gstRate: number;
  }>;
  subtotal: number;
  discount: number;
  taxDetails: Array<{
    rate: number;
    cgst: number;
    sgst: number;
    igst: number;
  }>;
  grandTotal: number;
  createdAt: string;
  businessDetails?: {
    name?: string;
    address?: string;
    state?: string;
    gstin?: string;
  };
}

const generateHtml = (invoice: InvoiceData) => {
  console.log("PDF INPUT:", JSON.stringify(invoice, null, 2));

  const businessName = invoice.businessDetails?.name || "Yaarwin";
  const businessAddress = invoice.businessDetails?.address || "Yaarwin HQ, Business Park";
  const businessState = invoice.businessDetails?.state || "Rajasthan";
  const businessGstin = invoice.businessDetails?.gstin || "08ABCDE1234F1Z5";
  
  const clientName = invoice.clientId?.name || "Client Name";
  const clientState = invoice.clientId?.state || "Rajasthan";
  const clientEmail = invoice.clientId?.email;
  
  const isIgst = businessState !== clientState;

  if (!invoice.items || !Array.isArray(invoice.items)) {
    console.warn("WARNING: Invoice items missing or invalid, using empty array");
  }

  const itemsHtml = (invoice.items || []).map(item => `
    <tr>
      <td class="px-4 py-4 text-[10px] text-gray-700 font-bold border-r border-gray-100">${item.description}</td>
      <td class="px-4 py-4 text-center text-[10px] text-gray-600 font-bold border-r border-gray-100">${item.quantity}</td>
      <td class="px-4 py-4 text-right text-[10px] text-gray-600 font-bold border-r border-gray-100">₹${item.price.toLocaleString('en-IN')}</td>
      <td class="px-4 py-4 text-center text-[10px] text-gray-500 font-bold border-r border-gray-100">${item.gstRate}%</td>
      <td class="px-4 py-4 text-right text-[10px] text-gray-900 font-black">₹${(item.quantity * item.price * (1 + item.gstRate/100)).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const taxRowsHtml = (invoice.taxDetails || []).map(tax => `
    <div class="flex justify-between items-center text-[9px] mb-1">
      <span class="text-gray-400 font-bold uppercase tracking-widest">GST ${tax.rate}%</span>
      <div class="text-right">
        ${!isIgst ? `
          <p class="text-gray-500">CGST: ₹${(tax.cgst || 0).toLocaleString('en-IN')}</p>
          <p class="text-gray-500">SGST: ₹${(tax.sgst || 0).toLocaleString('en-IN')}</p>
        ` : `
          <p class="text-gray-500">IGST: ₹${(tax.igst || 0).toLocaleString('en-IN')}</p>
        `}
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
        .font-dancing { font-family: 'Dancing Script', cursive; }
        @page { size: A4; margin: 0; }
        .break-inside-avoid { break-inside: avoid; }
      </style>
    </head>
    <body class="bg-white p-0 m-0">
      <div class="w-[210mm] min-h-[297mm] mx-auto p-12 relative flex flex-col">
        <!-- Modern Header -->
        <div class="flex justify-between items-start mb-12">
          <div>
            <div class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] mb-4">
              <div class="w-1.5 h-1.5 rounded-full bg-white mr-2"></div>
              Official Tax Invoice
            </div>
            <h1 class="text-5xl font-black tracking-tighter mb-3 text-gray-900 leading-none">
              #${invoice.invoiceNumber}
            </h1>
            <div class="flex items-center space-x-2">
              <div class="w-8 h-[1px] bg-gray-300"></div>
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400">
                Issued ${new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div class="text-right">
            <div class="bg-gray-900 text-white p-5 rounded-2xl inline-block shadow-xl">
              <h2 class="text-xl font-black tracking-tight mb-1">${businessName}</h2>
              <div class="text-[9px] text-gray-300 space-y-0.5 font-medium uppercase tracking-wider">
                <p>${businessAddress}</p>
                <p>${businessState}, India</p>
                <div class="pt-2 mt-2 border-t border-gray-700">
                  <p class="font-black text-white text-[10px]">GSTIN: ${businessGstin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-10 mb-12 border-y border-gray-100 py-8 break-inside-avoid">
          <div>
            <p class="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Client Information</p>
            <h3 class="text-xl font-black mb-1 text-gray-900">${clientName}</h3>
            <div class="text-[9px] text-gray-500 space-y-0.5 font-bold uppercase tracking-widest">
              <p class="flex items-center"><span class="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-[7px]">📍</span>${clientState}, India</p>
              ${clientEmail ? `<p class="flex items-center text-indigo-600"><span class="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center mr-2 text-[7px]">✉️</span>${clientEmail}</p>` : ''}
            </div>
          </div>
          
          <div class="flex justify-end">
            <div class="text-right">
              <p class="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Payment Schedule</p>
              <div class="space-y-3">
                <div>
                  <p class="text-[9px] font-black text-gray-400 uppercase">Place of Supply</p>
                  <p class="text-xs font-black text-gray-900">${clientState}</p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-gray-400 uppercase">Payment Terms</p>
                  <p class="text-xs font-black text-indigo-600">Due Upon Receipt</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table Section -->
        <div class="mb-10 overflow-hidden rounded-lg border border-gray-200 break-inside-avoid">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900 border-r border-gray-200">DESCRIPTION</th>
                <th class="text-center px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900 border-r border-gray-200">QTY</th>
                <th class="text-right px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900 border-r border-gray-200">PRICE</th>
                <th class="text-center px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900 border-r border-gray-200">GST %</th>
                <th class="text-right px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-900">TOTAL</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <!-- Summary Section -->
        <div class="flex justify-end mb-12 break-inside-avoid">
          <div class="w-full max-w-[320px] p-5 rounded-2xl bg-gray-50">
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Subtotal</span>
                <span class="font-black text-gray-900">INR ${(invoice.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              
              ${(invoice.discount || 0) > 0 ? `
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Discount</span>
                  <span class="font-black text-emerald-600">-INR ${(invoice.discount || 0).toLocaleString('en-IN')}</span>
                </div>
              ` : ''}

              <div class="pt-3 border-t border-gray-200">
                ${taxRowsHtml}
              </div>

              <div class="pt-5 border-t-2 border-gray-900 flex justify-between items-end">
                <div>
                  <p class="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-0.5">Grand Total</p>
                  <p class="text-[8px] font-bold text-gray-400 uppercase tracking-tight">All taxes included</p>
                </div>
                <div class="text-2xl font-black tracking-tighter text-gray-900">
                  INR ${(invoice.grandTotal || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Final Footer -->
        <div class="mt-auto break-inside-avoid">
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex justify-between items-start">
            <div class="max-w-[400px]">
              <p class="text-[9px] font-black uppercase tracking-widest mb-3 text-gray-400">Notes & Information</p>
              <p class="text-[10px] text-gray-500 leading-relaxed font-medium">
                Thank you for your business. This invoice is digitally generated and valid without a physical signature.
              </p>
            </div>
            <div class="text-right">
              <p class="text-[9px] font-black uppercase tracking-widest mb-3 text-gray-400">Authorized Signatory</p>
              <div class="mb-3">
                <p class="text-lg font-black text-gray-900 font-dancing">
                  ${businessName}
                </p>
              </div>
              <p class="text-[9px] font-black text-indigo-600 uppercase tracking-widest">${businessName} Management</p>
            </div>
          </div>
          <div class="mt-6 text-center">
            <p class="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">
              Generated via GSTMate Pro • Efficiency Simplified
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generates a PDF buffer from invoice data using Puppeteer-core and @sparticuz/chromium.
 * This is the highly optimized "Option 1" for Cloud/Serverless environments like Render.
 */
export const generateInvoicePdf = async (invoice: InvoiceData): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    args: (chromium as any).args,
    defaultViewport: (chromium as any).defaultViewport,
    executablePath: await (chromium as any).executablePath(),
    headless: (chromium as any).headless,
  });

  try {
    const page = await browser.newPage();
    const html = generateHtml(invoice);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    return Buffer.from(pdf);
  } catch (error) {
    console.error('Cloud PDF Generation Error:', error);
    throw error;
  } finally {
    await browser.close();
  }
};
