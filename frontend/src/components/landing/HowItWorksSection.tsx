import { UserPlus, FileText, Share2 } from "lucide-react";

const steps = [
  { icon: UserPlus, step: "01", title: "Add Client & Items", description: "Enter client details and your products with GST rates." },
  { icon: FileText, step: "02", title: "Generate Invoice", description: "GSTMate auto-calculates taxes and generates a professional invoice." },
  { icon: Share2, step: "03", title: "Share & Get Paid", description: "Send via WhatsApp, download PDF, and track payment status." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">How it works</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Three simple steps
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              <div className="mx-auto mb-6 relative">
                <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <s.icon className="h-10 w-10 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
