import Sidebar from "@/app/components/Sidebar";

export const metadata = {
  title: "Dashboard - Career Suite",
  description: "Your personal career development dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  );
}
