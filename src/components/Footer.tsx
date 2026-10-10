import Link from "next/link";
import { Github, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-background-dark/80 text-[#f5f1e8]/70 py-12 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
        <div className="flex flex-col items-center md:items-start gap-3">
          <h2 className="text-2xl font-bold text-[#f5f1e8] tracking-tight">
            Kaidyn Wiki
          </h2>
          <p className="text-sm font-light">
            © {new Date().getFullYear()} ka1dyn. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-6">
            <Link
              href="https://github.com/ka1dyn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f5f1e8]/50 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:dm.kaidyn@gmail.com"
              className="text-[#f5f1e8]/50 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f5f1e8]/30">
            Design & Built by ka1dyn
          </p>
        </div>
      </div>
    </footer>
  );
}
