import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, TrendingUp, IndianRupee, Users, LayoutDashboard } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-[0.07]" />
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-info/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-8 opacity-0 animate-fade-up">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
          <span className="text-sm font-medium text-primary">100% GST Compliant</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight opacity-0 animate-fade-up">
          Simplify GST Invoicing.
          <br />
          <span className="text-gradient">Boost Your Business</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-up-delayed">
          Create GST-compliant invoices, track payments, and share instantly — all from one beautiful dashboard.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up-delayed">
          <Button variant="hero" size="lg" asChild>
            <Link to="/dashboard">
              Go to Dashboard <LayoutDashboard className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-4 sm:mt-0 sm:ml-4">
            Learn More <ArrowRight className="ml-1 h-4 w-4 inline" />
          </a>
        </div>

        {/* Floating Elements */}
        <div className="relative mt-16 mx-auto max-w-4xl">
          {/* Dashboard Preview Card */}
          <div className="glass-card-strong p-1 rounded-2xl shadow-2xl">
            <div className="bg-background rounded-xl p-4 md:p-6">
              {/* Mini Dashboard */}
              <div className="flex gap-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { icon: IndianRupee, label: "Total Billed", value: "₹12,45,000", color: "text-primary" },
                  { icon: TrendingUp, label: "Paid", value: "₹9,80,000", color: "text-success" },
                  { icon: FileText, label: "Invoices", value: "284", color: "text-info" },
                  { icon: Users, label: "Clients", value: "52", color: "text-chart-3" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-muted/50 p-3 text-left">
                    <item.icon className={`h-4 w-4 ${item.color} mb-1`} />
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
              {/* Mini Table */}
              <div className="rounded-lg border overflow-hidden">
                <div className="grid grid-cols-4 gap-2 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <span>Invoice</span><span>Client</span><span>Amount</span><span>Status</span>
                </div>
                {[
                  { inv: "INV-001", client: "Acme Corp", amount: "₹24,500", status: "Paid", statusColor: "bg-success/15 text-success" },
                  { inv: "INV-002", client: "TechFlow", amount: "₹18,200", status: "Pending", statusColor: "bg-warning/15 text-warning" },
                  { inv: "INV-003", client: "DesignHub", amount: "₹31,000", status: "Paid", statusColor: "bg-success/15 text-success" },
                ].map((row) => (
                  <div key={row.inv} className="grid grid-cols-4 gap-2 px-4 py-2.5 text-xs border-t">
                    <span className="font-medium">{row.inv}</span>
                    <span className="text-muted-foreground">{row.client}</span>
                    <span className="font-medium">{row.amount}</span>
                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 font-bold ${row.statusColor}`}>{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
