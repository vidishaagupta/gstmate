import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="glass-card-strong p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient opacity-5" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Start creating invoices <span className="text-gradient">now</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
              Join thousands of businesses using GSTMate for effortless GST invoicing.
            </p>
            <div className="mt-8">
              <Button variant="hero" size="lg" asChild>
                <Link to="/dashboard">
                  Get Started Free <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
