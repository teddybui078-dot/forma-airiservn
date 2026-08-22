"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, LineChart, History, TrendingUp, Users, Settings, HelpCircle, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/analysis", label: "Analysis", icon: Video },
  { href: "/insights", label: "Insights", icon: LineChart },
  { href: "/history", label: "History", icon: History },
  { href: "/performance", label: "Performance", icon: TrendingUp },
];

const FOOTER_ITEMS = [
  { href: "/team", label: "Invite team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-background z-50 flex flex-col py-lg border-r border-outline-variant/20">
      <div className="px-6 mb-8 flex items-center gap-2">
        <span className="font-headline-md text-primary text-xl tracking-tight">Forma</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[14px] ${
                active
                  ? "bg-surface-container text-primary font-medium"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-1 px-3">
        {FOOTER_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-[14px]"
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
        <div className="mt-4 pt-4 border-t border-outline-variant/20 px-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center overflow-hidden">
            <User size={18} className="text-primary" />
          </div>
          <span className="text-[14px] text-on-surface font-medium truncate">Athlete</span>
        </div>
      </div>
    </aside>
  );
}
