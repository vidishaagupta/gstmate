import { Calculator, FileText, MessageCircle, Download, Users, BarChart3 } from "lucide-react";

const features = [
  { icon: Calculator, title: "GST Smart Calculation", description: "Auto-detect CGST, SGST or IGST based on client state. Accurate every time." },
  { icon: FileText, title: "Invoice Builder", description: "Beautiful, professional invoices with your branding in seconds." },
  { icon: MessageCircle, title: "WhatsApp Sharing", description: "Send invoices directly to clients via WhatsApp with one click." },
  { icon: Download, title: "PDF Export", description: "Download print-ready PDF invoices with full GST breakdowns." },
  { icon: Users, title: "Client Management", description: "Organize your clients with GSTIN, address, and payment history." },
  { icon: BarChart3, title: "Dashboard Analytics", description: "Track revenue, pending payments, and business growth at a glance." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to <span className="text-gradient">manage GST</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From invoice creation to payment tracking — GSTMate handles it all.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6 hover-lift cursor-default group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
