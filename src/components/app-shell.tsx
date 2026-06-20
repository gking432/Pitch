"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Brush, Gauge, Handshake, Home, LayoutDashboard, Megaphone, Route, Store } from "lucide-react";

const navItems = [
  { href: "/app/command-center", label: "Strategy Center", icon: LayoutDashboard },
  { href: "/app/campaigns", label: "Campaign Strategy", icon: Megaphone },
  { href: "/app/relationships", label: "Relationship Strategy", icon: Handshake },
  { href: "/app/distribution", label: "Distribution Strategy", icon: Store },
  { href: "/app/creative-studio", label: "Creative System", icon: Brush },
  { href: "/app/performance", label: "Targets + Measurement", icon: Gauge },
  { href: "/app/action-queue", label: "AI Integrations", icon: Bot },
  { href: "/", label: "Public Pitch", icon: Home }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-mark">
            <span>DC</span>
            <span>Growth Engine</span>
          </div>
          <div className="sidebar-subtitle">
            Strategy operating system: campaign briefs, channel playbooks, target metrics, and AI-enabled workflows.
          </div>
        </div>
        <nav className="sidebar-nav" aria-label="App navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link className={`sidebar-link ${active ? "active" : ""}`} href={href} key={href}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-subtitle">
          <Route size={16} style={{ verticalAlign: "middle" }} /> Use this like a clickable case study: strategy,
          execution plans, target metrics, and AI-enabled operating workflows.
        </div>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
