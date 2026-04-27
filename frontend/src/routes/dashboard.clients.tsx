import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/features/clients/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/clients")({
  component: ClientsPage,
});

interface Client {
  _id: string;
  name: string;
  gstin: string;
  email: string;
  state: string;
  address?: string;
}

function ClientsPage() {
  const { data: clients = [], isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState({ name: "", gstin: "", email: "", state: "", address: "" });

  const filtered = clients.filter((c: Client) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || (c.gstin && c.gstin.includes(search))
  );

  const openAdd = () => { setEditing(null); setForm({ name: "", gstin: "", email: "", state: "", address: "" }); setModalOpen(true); };
  const openEdit = (c: Client) => { setEditing(c); setForm({ name: c.name, gstin: c.gstin, email: c.email, state: c.state, address: c.address || "" }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.state) {
      toast.error("Please fill in required fields (Name, Email, State).");
      return;
    }
    
    try {
      if (editing) {
        await updateClient.mutateAsync({ id: editing._id, ...form });
        toast.success("Client updated successfully.");
      } else {
        await createClient.mutateAsync(form);
        toast.success("Client created successfully.");
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || "Failed to save client.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient.mutateAsync(id);
        toast.success("Client deleted.");
      } catch (err: any) {
        toast.error("Failed to delete client.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Client</Button>
      </div>

      <div className="bg-background rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Name</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase">GSTIN</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Email</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase hidden lg:table-cell">State</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: Client) => (
              <tr key={c._id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium">{c.name}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground font-mono text-xs">{c.gstin || "N/A"}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground hidden md:table-cell">{c.email}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground hidden lg:table-cell">{c.state}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">No clients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-background rounded-xl border shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">{editing ? "Edit Client" : "Add Client"}</h3>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>GSTIN</Label><Input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} /></div>
              <div><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>State *</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button 
                  className="flex-1" 
                  onClick={handleSave}
                  disabled={createClient.isPending || updateClient.isPending}
                >
                  {(createClient.isPending || updateClient.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
