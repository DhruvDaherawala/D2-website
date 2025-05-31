"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { SquareStack, BookOpen, Users, FileText } from "lucide-react";

export default function AdminDashboard() {
  const { status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-white text-md font-medium">Projects</CardTitle>
            <SquareStack className="text-blue-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Manage Projects</div>
            <p className="text-sm text-gray-400 mt-1">
              Add, edit and delete projects in your portfolio
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/admin/projects"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Manage Projects
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-white text-md font-medium">Content</CardTitle>
            <FileText className="text-green-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Website Content</div>
            <p className="text-sm text-gray-400 mt-1">
              Manage website sections, text and images
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/admin/content"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Edit Content
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-white text-md font-medium">User Inquiries</CardTitle>
            <Users className="text-yellow-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Contact Forms</div>
            <p className="text-sm text-gray-400 mt-1">
              View and manage submitted contact forms
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/admin/contacts"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              View Messages
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-white text-md font-medium">Documentation</CardTitle>
            <BookOpen className="text-purple-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Admin Guide</div>
            <p className="text-sm text-gray-400 mt-1">
              Learn how to manage your website content
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/admin/docs"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              View Guide
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 