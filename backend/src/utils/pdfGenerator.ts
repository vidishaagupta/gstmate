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
  const businessState = invoice.businessState || 'Karnataka';
  const businessPhone = invoice.businessPhone || '';
  const isSameState = invoice.clientId.state === businessState;

  const itemsHtml = invoice.items.map(item => `
    <tr>
      <td class="description">
        <div class="main">${item.description}</div>
        <div class="sub">Standard service/product delivery</div>
      </td>
      <td class="qty">${item.quantity}</td>
      <td class="price">INR ${item.price.toLocaleString('en-IN')}</td>
      <td class="gst">${item.gstRate}%</td>
      <td class="total">INR ${(item.quantity * item.price).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const taxRowsHtml = invoice.items.map(item => {
    const gstAmount = (item.quantity * item.price) * (item.gstRate / 100);
    if (gstAmount === 0) return '';
    const type = isSameState ? "GST" : "IGST";
    return `
      <div class="summary-row">
        <span class="label">${type} (${item.gstRate}%)</span>
        <span class="value font-bold">INR ${gstAmount.toLocaleString('en-IN')}</span>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; }
        body { 
          font-family: 'Inter', -apple-system, sans-serif; 
          color: #111827; 
          margin: 0; 
          padding: 0; 
          line-height: 1.5;
          -webkit-print-color-adjust: exact;
        }
        .page {
          padding: 50px;
          min-height: 1120px;
          display: flex;
          flex-direction: column;
        }
        .top-accent {
          height: 6px;
          background-color: #4f46e5;
          margin: -50px -50px 50px -50px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 60px;
        }
        .badge {
          display: inline-block;
          background: #4f46e5;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
        }
        .invoice-id {
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin: 0 0 8px 0;
        }
        .issue-date {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
        }
        .business-info { text-align: right; }
        .business-name {
          font-size: 20px;
          font-weight: 800;
          color: #4f46e5;
          margin: 0 0 8px 0;
        }
        .business-details {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.6;
        }
        .gstin-box {
          font-weight: 700;
          color: #111827;
          margin-top: 8px;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 60px;
        }
        .section-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
          margin-bottom: 12px;
        }
        .billed-name {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        .billed-details {
          font-size: 12px;
          color: #6b7280;
        }
        .payment-details {
          text-align: right;
          font-size: 14px;
        }
        .payment-details p { margin: 8px 0; }
        .font-bold { font-weight: 700; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        th {
          text-align: left;
          padding: 16px 0;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
          border-bottom: 2px solid #f3f4f6;
        }
        td { padding: 24px 0; border-bottom: 1px solid #f9fafb; }
        .description .main { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
        .description .sub { font-size: 10px; color: #9ca3af; }
        .qty { text-align: center; font-weight: 700; }
        .price { text-align: right; font-weight: 500; }
        .gst { text-align: center; font-weight: 700; color: #4f46e5; }
        .total { text-align: right; font-weight: 700; }
        
        .summary-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 60px;
        }
        .summary-box { width: 320px; }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .summary-row.discount { color: #4f46e5; }
        .summary-divider {
          border-top: 1px dashed #e5e7eb;
          margin: 16px 0;
        }
        .grand-total-container {
          border-top: 2px solid #f3f4f6;
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .total-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #4f46e5;
          margin-bottom: 4px;
        }
        .total-sublabel { font-size: 10px; color: #9ca3af; }
        .total-value {
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #4f46e5;
        }
        
        .footer {
          margin-top: auto;
          border-top: 4px solid #111827;
          padding-top: 48px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .terms-box { max-width: 400px; }
        .terms-label { font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
        .terms-text { font-size: 11px; color: #6b7280; line-height: 1.6; }
        .thanks-box { text-align: right; }
        .thanks-label { font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
        .thanks-team { font-size: 14px; font-weight: 700; color: #4f46e5; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="top-accent"></div>
        
        <div class="header">
          <div>
            <div class="badge">Official Tax Invoice</div>
            <h1 class="invoice-id">#${invoice.invoiceNumber}</h1>
            <div class="issue-date">Issued on ${new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div class="business-info">
            <h2 class="business-name">${businessName}</h2>
            <div class="business-details">
              <p>${businessAddress}</p>
              <p>${businessState}, India</p>
              <p class="gstin-box">GSTIN: ${businessGstin}</p>
            </div>
          </div>
        </div>
        
        <div class="details-grid">
          <div>
            <div class="section-label">Billed To</div>
            <h3 class="billed-name">${invoice.clientId.name}</h3>
            <div class="billed-details">
              <p>${invoice.clientId.state}, India</p>
              ${invoice.clientId.email ? `<p style="color: #4f46e5; font-weight: 500;">${invoice.clientId.email}</p>` : ''}
            </div>
          </div>
          <div class="payment-details">
            <div class="section-label">Payment Details</div>
            <p><span class="font-bold">Place of Supply:</span> ${invoice.clientId.state}</p>
            <p><span class="font-bold">Due Date:</span> Upon Receipt</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 45%;">Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: center;">GST %</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="summary-container">
          <div class="summary-box">
            <div class="summary-row">
              <span class="label" style="color: #6b7280;">Subtotal</span>
              <span class="value font-bold">INR ${invoice.subtotal.toLocaleString('en-IN')}</span>
            </div>
            ${invoice.discount > 0 ? `
              <div class="summary-row discount">
                <span class="label">Discount</span>
                <span class="value font-bold">-INR ${invoice.discount.toLocaleString('en-IN')}</span>
              </div>
            ` : ''}
            
            <div class="summary-divider"></div>
            ${taxRowsHtml}
            
            <div class="grand-total-container">
              <div>
                <div class="total-label">Total Amount</div>
                <div class="total-sublabel">Includes all taxes</div>
              </div>
              <div class="total-value">INR ${invoice.grandTotal.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="terms-box">
            <div class="terms-label">Terms & Notes</div>
            <div class="terms-text">
              Please process payment within 15 days. This is a computer-generated tax invoice and does not require a physical signature.
            </div>
          </div>
          <div class="thanks-box">
            <div class="thanks-label">Thank You</div>
            <div class="thanks-team">${businessName} Team</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export let browserInstance: any = null;

export const initBrowser = async () => {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  }
  return browserInstance;
};

const getBrowser = async () => {
  return await initBrowser();
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
