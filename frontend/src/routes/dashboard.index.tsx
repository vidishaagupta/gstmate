import { createFileRoute } from '@tanstack/react-router'
import { IndianRupee, TrendingUp, Clock, AlertTriangle, FileText, Loader2, Download, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoices, downloadInvoice, useDeleteInvoice, useUpdateInvoiceStatus } from "@/features/invoices/api";
import { useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { InvoiceTemplate } from "@/components/dashboard/InvoiceTemplate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const statusStyles: Record<string, string> = {
  paid: "bg-success/10 text-success",
  sent: "bg-info/10 text-info",
  draft: "bg-muted text-muted-foreground",
  overdue: "bg-destructive/10 text-destructive",
};

function DashboardHome() {
  const { data: invoices = [], isLoading } = useInvoices();
  const deleteInvoice = useDeleteInvoice();
  const updateStatus = useUpdateInvoiceStatus();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [invoiceToDownload, setInvoiceToDownload] = useState<any>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (invoice: any) => {
    setDownloadingId(invoice._id);
    try {
      await downloadInvoice(invoice._id);
      toast.success("Invoice download started!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInvoice.mutateAsync(id);
      toast.success("Invoice deleted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Failed to delete invoice");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'sent' : 'paid';
    setStatusUpdatingId(id);
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const stats = useMemo(() => {
    const totalBilled = invoices.reduce((sum: number, inv: any) => sum + inv.grandTotal, 0);
    const paid = invoices.filter((inv: any) => inv.status === 'paid').reduce((sum: number, inv: any) => sum + inv.grandTotal, 0);
    const pending = invoices.filter((inv: any) => inv.status === 'sent' || inv.status === 'draft').reduce((sum: number, inv: any) => sum + inv.grandTotal, 0);
    const overdue = invoices.filter((inv: any) => inv.status === 'overdue').reduce((sum: number, inv: any) => sum + inv.grandTotal, 0);

    return [
      { icon: IndianRupee, label: "Total Billed", value: `₹${totalBilled.toLocaleString()}`, color: "text-primary", bg: "bg-primary/10" },
      { icon: TrendingUp, label: "Paid", value: `₹${paid.toLocaleString()}`, color: "text-success", bg: "bg-success/10" },
      { icon: Clock, label: "Pending", value: `₹${pending.toLocaleString()}`, color: "text-warning", bg: "bg-warning/10" },
      { icon: AlertTriangle, label: "Overdue", value: `₹${overdue.toLocaleString()}`, color: "text-destructive", bg: "bg-destructive/10" },
    ];
  }, [invoices]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card) => (
          <div key={card.label} className="bg-background rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-10 w-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Invoices */}
      <div className="bg-background rounded-xl border">
        <div className="p-5 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Recent Invoices</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((inv: any) => (
                <tr key={inv._id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{(inv.clientId as any)?.name || "N/A"}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 text-sm font-medium">₹{inv.grandTotal.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(inv._id, inv.status)}
                        disabled={statusUpdatingId === inv._id}
                        className={`h-8 gap-1.5 font-bold transition-all ${
                          inv.status === 'paid' 
                            ? 'border-warning/50 text-warning hover:bg-warning/10' 
                            : 'border-success/50 text-success hover:bg-success/10'
                        }`}
                      >
                        {statusUpdatingId === inv._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : inv.status === 'paid' ? (
                          <>
                            <XCircle className="h-3.5 w-3.5" />
                            Unpaid
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Paid
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(inv)}
                        disabled={downloadingId === inv._id}
                        className="h-8 w-8 hover:bg-primary/10 text-muted-foreground hover:text-primary"
                        title="Download PDF"
                      >
                        {downloadingId === inv._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-4 w-4" />}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            title="Delete Invoice"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete invoice {inv.invoiceNumber}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(inv._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">No invoices yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
