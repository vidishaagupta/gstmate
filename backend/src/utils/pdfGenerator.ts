import puppeteer from 'puppeteer';

interface InvoiceData {
  invoiceNumber: string;
  clientId: {
    name: string;
    state: string;
    email?: string;
    address?: string;
    gstin?: string;
  };
  items: any[];
  subtotal: number;
  discount: number;
  totalGst: number;
  grandTotal: number;
  createdAt: Date;
  businessName?: string;
  businessAddress?: string;
  businessGstin?: string;
  businessState?: string;
  businessPhone?: string;
}

const generateHtml = (invoice: InvoiceData): string => {
  const businessName = invoice.businessName || 'GSTMate Pro';
  const businessAddress = invoice.businessAddress || 'Business Address';
  const businessGstin = invoice.businessGstin || 'GSTIN-PENDING';
  const businessState = invoice.businessState || 'State';
  const businessPhone = invoice.businessPhone || '';

  const itemsHtml = invoice.items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td class="right">${item.quantity}</td>
      <td class="right">₹${item.price.toLocaleString('en-IN')}</td>
      <td class="right">${item.gstRate}%</td>
      <td class="last">₹${(item.quantity * item.price).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; margin: 0; padding: 40px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .business-info h1 { margin: 0; color: #4f46e5; font-size: 24px; }
        .business-info p { margin: 4px 0; font-size: 12px; color: #666; }
        .invoice-meta { text-align: right; }
        .invoice-meta h2 { margin: 0; font-size: 20px; }
        .invoice-meta p { margin: 4px 0; font-size: 12px; }
        .details-grid { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .bill-to h3 { font-size: 10px; text-transform: uppercase; color: #999; margin-bottom: 8px; }
        .bill-to p { margin: 4px 0; font-size: 13px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f9fafb; text-align: left; padding: 12px; font-size: 10px; text-transform: uppercase; border-bottom: 2px solid #111; }
        td { padding: 12px; font-size: 12px; border-bottom: 1px solid #eee; }
        .right { text-align: right; }
        .last { text-align: right; font-weight: bold; }
        .totals { margin-left: auto; width: 250px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 12px; }
        .grand-total { border-top: 2px solid #eee; margin-top: 10px; padding-top: 10px; font-size: 16px; font-weight: bold; color: #4f46e5; }
        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="business-info">
          <h1>${businessName}</h1>
          <p>${businessAddress}</p>
          <p>${businessState}, India</p>
          <p>GSTIN: ${businessGstin}</p>
          ${businessPhone ? `<p>Phone: ${businessPhone}</p>` : ''}
        </div>
        <div class="invoice-meta">
          <h2>INVOICE</h2>
          <p># ${invoice.invoiceNumber}</p>
          <p>Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <div class="details-grid">
        <div class="bill-to">
          <h3>Billed To</h3>
          <p>${invoice.clientId.name}</p>
          <p>${invoice.clientId.address || ''}</p>
          <p>${invoice.clientId.state}, India</p>
          ${invoice.clientId.gstin ? `<p>GSTIN: ${invoice.clientId.gstin}</p>` : ''}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="right">Qty</th>
            <th class="right">Price</th>
            <th class="right">GST %</th>
            <th class="last">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal</span>
          <span>₹${invoice.subtotal.toLocaleString('en-IN')}</span>
        </div>
        ${invoice.discount > 0 ? `
          <div class="total-row" style="color: #4f46e5;">
            <span>Discount</span>
            <span>-₹${invoice.discount.toLocaleString('en-IN')}</span>
          </div>
        ` : ''}
        <div class="total-row">
          <span>Total GST</span>
          <span>₹${invoice.totalGst.toLocaleString('en-IN')}</span>
        </div>
        <div class="total-row grand-total">
          <span>Grand Total</span>
          <span>₹${invoice.grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>This is a computer-generated document.</p>
      </div>
    </body>
    </html>
  `;
};

let browserInstance: any = null;

const getBrowser = async () => {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  }
  return browserInstance;
};

export const generateInvoicePdf = async (invoice: InvoiceData): Promise<Buffer> => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    const html = generateHtml(invoice);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
};
