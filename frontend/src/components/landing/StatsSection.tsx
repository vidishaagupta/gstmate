import { IndianRupee, Zap, ShieldCheck, Users } from "lucide-react";

const stats = [
  { icon: IndianRupee, value: "₹50L+", label: "Invoices Generated" },
  { icon: Zap, value: "3x", label: "Faster Billing" },
  { icon: ShieldCheck, value: "100%", label: "GST Compliant" },
  { icon: Users, value: "10k+", label: "Happy Users" },
];

export function StatsSection() {
  return (
    <section id="stats" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="hero-gradient rounded-3xl p-12 md:p-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-primary-foreground">{s.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
