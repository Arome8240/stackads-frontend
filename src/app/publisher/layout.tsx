import PublisherSidebar from "@/components/publisher/PublisherSidebar";
import PublisherNav from "@/components/publisher/PublisherNav";

export default function PublisherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#07070f]">
      <PublisherSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PublisherNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
