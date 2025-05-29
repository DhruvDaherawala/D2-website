"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Home,
  ListTodo,
  FileText,
  User,
  Mail,
  Settings,
  LogOut,
  Layers,
  Image
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  // Don't show the admin layout on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  
  // Show loading state while checking session
  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Redirect handled by middleware
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/hero", label: "Hero Section", icon: Home },
    { href: "/admin/services", label: "Services", icon: ListTodo },
    { href: "/admin/about", label: "About", icon: FileText },
    { href: "/admin/projects", label: "Projects", icon: Layers },
    { href: "/admin/contact", label: "Contact", icon: Mail },
    { href: "/admin/footer", label: "Footer", icon: FileText },
    { href: "/admin/media", label: "Media", icon: Image },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <span className="text-xl font-bold text-white">Admin Dashboard</span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive(item.href)
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <div className="flex items-center">
              <div>
                <div className="text-sm font-medium text-white">
                  {session?.user?.name || "Admin User"}
                </div>
                <div className="text-xs text-gray-400">
                  {session?.user?.email || "admin@example.com"}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-gray-400 hover:text-white"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <div className="bg-gray-800 border-b border-gray-700 md:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">Admin</span>
            </div>
            {/* Mobile menu button will go here if needed */}
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
} 