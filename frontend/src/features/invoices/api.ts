import { saveAs } from 'file-saver';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../../lib/api/client.js';
import { tokenStore } from '../../auth/tokenStore.js';

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => client.get('/invoices').then(r => r.data.data),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => client.get(`/invoices/${id}`).then(r => r.data.data),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => client.post('/invoices', body).then(r => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useUpdateInvoiceStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      client.patch(`/invoices/${id}/status`, { status }).then(r => r.data.data),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['invoices', data._id] });
    },
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => client.delete(`/invoices/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

const getApiBase = () =>
  (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001') + '/api/v1';

// Robust helper to check if a blob is actually a JSON error and trigger download with proper filename
async function handleBlobResponse(response: any, defaultFilename: string) {
  const data = response.data;
  
  // 1. If it's a JSON response disguised as a blob, it will be small and parseable
  if (data.type === 'application/json' || data.size < 1000) {
    try {
      const text = await data.text();
      const json = JSON.parse(text);
      if (json.success === false) {
        throw new Error(json.error?.message || 'Server returned an error');
      }
    } catch (e: any) {
      // If it's not valid JSON, it's likely a small PDF or some other binary data
      if (!(e instanceof SyntaxError)) throw e;
    }
  }

  // 2. Ensure we have a typed Blob
  const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
  
  // 3. Use file-saver for the download — more reliable for setting filenames from blobs across browsers
  const filename = defaultFilename.toLowerCase().endsWith('.pdf') ? defaultFilename : `${defaultFilename}.pdf`;
  saveAs(blob, filename);
}

// Downloads an existing PDF from the server.
export async function downloadInvoice(id: string) {
  try {
    const response = await client.get(`/invoices/${id}/download`, {
      responseType: 'blob',
    });
    
    // Extract filename from header if possible
    const contentDisposition = response.headers['content-disposition'];
    let filename = `Invoice-${id}.pdf`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match) filename = match[1];
    }

    await handleBlobResponse(response, filename);
  } catch (error: any) {
    console.error("Download failed:", error);
    throw error;
  }
}

// For previewing a new (unsaved) invoice, we POST to get a PDF.
export async function previewInvoiceReport(body: any, invoiceNumber: string) {
  const response = await client.post('/invoices/preview', body, {
    responseType: 'blob',
  });
  
  await handleBlobResponse(response, `Invoice-${invoiceNumber || 'Preview'}.pdf`);
}
