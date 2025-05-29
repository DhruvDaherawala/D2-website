"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText, Image, LayoutDashboard, Settings } from "lucide-react";

export default function DashboardPage() {
  const [totalServices, setTotalServices] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [servicesRes, projectsRes] = await Promise.all([
          fetch("/api/content/services"),
          fetch("/api/content/projects"),
        ]);

        if (servicesRes.ok && projectsRes.ok) {
          const services = await servicesRes.json();
          const projects = await projectsRes.json();

          setTotalServices(services.length);
          setTotalProjects(projects.length);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/" target="_blank">
                Visit Website
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Services"
            value={isLoading ? "Loading..." : totalServices.toString()}
            description="Total services"
            icon={<FileText className="h-5 w-5 text-white" />}
            href="/admin/services"
          />
          <StatsCard
            title="Projects"
            value={isLoading ? "Loading..." : totalProjects.toString()}
            description="Total projects"
            icon={<FileText className="h-5 w-5 text-white" />}
            href="/admin/projects"
          />
          <StatsCard
            title="Media"
            value="Media Library"
            description="Manage uploads"
            icon={<Image className="h-5 w-5 text-white" />}
            href="/admin/media"
          />
          <StatsCard
            title="Settings"
            value="Site Settings"
            description="Configure website"
            icon={<Settings className="h-5 w-5 text-white" />}
            href="/admin/settings"
          />
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="recent">Recent Changes</TabsTrigger>
            <TabsTrigger value="quick">Quick Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DashboardCard
                title="Hero Section"
                description="Edit the main hero banner"
                href="/admin/hero"
              />
              <DashboardCard
                title="Services"
                description="Manage service offerings"
                href="/admin/services"
              />
              <DashboardCard
                title="About"
                description="Update company information"
                href="/admin/about"
              />
              <DashboardCard
                title="Projects"
                description="Showcase your work"
                href="/admin/projects"
              />
              <DashboardCard
                title="Contact"
                description="Update contact details"
                href="/admin/contact"
              />
              <DashboardCard
                title="Footer"
                description="Edit footer content"
                href="/admin/footer"
              />
            </div>
          </TabsContent>
          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  View your recent content changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Activity tracking will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quick" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">Add New Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/services?action=new">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Service
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">Add New Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/projects?action=new">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">Upload Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/media?action=upload">
                      <PlusCircle className="mr-2 h-4 w-4" /> Upload Files
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsCard({ title, value, description, icon, href }: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-gray-400">{description}</p>
        <Button variant="link" asChild className="p-0 mt-2 h-auto text-primary">
          <Link href={href}>Manage →</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function DashboardCard({ title, description, href }: { 
  title: string; 
  description: string; 
  href: string;
}) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <Button asChild>
          <Link href={href}>Edit</Link>
        </Button>
      </CardContent>
    </Card>
  );
} 