"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    label: "Animales",
    href: "/animales",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    label: "Corrales",
    href: "/corrales",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    label: "Alertas",
    href: "/alertas",
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  },
  {
    label: "Configuraci&oacute;n",
    href: "/configuracion",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

export default function Sidebar({
  collapsed,
  open,
  onToggle,
  onClose,
}: {
  collapsed: boolean;
  open?: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200/80 flex flex-col z-40",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-x-hidden",
          "max-lg:translate-x-[-100%] max-lg:data-[open=true]:translate-x-0",
          collapsed ? "lg:w-16" : "lg:w-60"
        )}
        data-open={open ? true : undefined}
      >
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          <div className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 px-2.5 pb-2",
            "transition-all duration-200 overflow-hidden",
            collapsed && "lg:opacity-0 lg:h-0 lg:pb-0"
          )}>
            Principal
          </div>

          {menu.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap",
                  "transition-all duration-150 no-underline",
                  active
                    ? "bg-green-dark/8 text-green-dark font-semibold"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                )}
                title={item.label}
              >
                <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[18px] h-[18px] stroke-current fill-none shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className={cn(
                  "text-[14px] transition-all duration-200 overflow-hidden",
                  collapsed && "lg:opacity-0 lg:w-0"
                )}>
                  {item.label}
                </span>
                {item.href === "/alertas" && (
                  <span className={cn(
                    "ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold leading-none shrink-0 shadow-sm",
                    collapsed && "lg:absolute lg:top-1 lg:right-1"
                  )}>
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <button
            onClick={onToggle}
            className={cn(
              "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl border border-gray-200/80 bg-gray-50/80 cursor-pointer text-sm text-gray-500 font-sans transition-all",
              "hover:bg-gray-100 hover:text-gray-600 hover:border-gray-300",
              collapsed && "lg:justify-center lg:px-2.5"
            )}
          >
            <svg viewBox="0 0 24 24" className={cn(
              "w-[15px] h-[15px] stroke-current shrink-0 transition-transform duration-300",
              collapsed && "lg:rotate-180"
            )}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <span className={cn(
              "transition-opacity duration-200",
              collapsed && "lg:hidden"
            )}>
              Colapsar
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
