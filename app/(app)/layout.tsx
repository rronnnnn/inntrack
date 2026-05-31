import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      <div className="pb-[calc(env(safe-area-inset-bottom,0px)+64px)]">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
