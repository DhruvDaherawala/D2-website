"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContentForm from "@/components/admin/ContentForm";
import { toast } from "sonner";
import { HeroContent } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function HeroPage() {
  const router = useRouter();
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hero data
  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await fetch("/api/content/hero");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setHeroContent(data[0]);
          }
        } else {
          toast.error("Failed to fetch hero content");
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
        toast.error("An error occurred while fetching hero content");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHero();
  }, []);

  const handleSaveSuccess = () => {
    toast.success("Hero content updated successfully");
    router.refresh();
  };

  // Form fields for hero content
  const heroFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      placeholder: "Main Headline",
      required: true,
    },
    {
      name: "subtitle",
      label: "Subtitle",
      type: "textarea" as const,
      placeholder: "Supporting text for the headline",
      required: true,
    },
    {
      name: "buttonText",
      label: "Button Text",
      type: "text" as const,
      placeholder: "Get Started",
      required: true,
    },
    {
      name: "buttonLink",
      label: "Button Link",
      type: "text" as const,
      placeholder: "#services",
      required: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Hero Section</h1>
        <Button onClick={() => router.push("/admin/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Edit Hero Content</CardTitle>
            <CardDescription>
              Update the main section that appears at the top of your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentForm
              title="Hero Content"
              fields={heroFields}
              initialData={heroContent || undefined}
              collection="hero"
              onSuccess={handleSaveSuccess}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
} 