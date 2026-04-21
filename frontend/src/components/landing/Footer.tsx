import { Receipt } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <Receipt className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">GSTMate</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} GSTMate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
