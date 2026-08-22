import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="pl-[240px] h-screen flex flex-col">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 pb-8 bg-surface-container-lowest">
        <div className="flex flex-col w-full h-full relative max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
