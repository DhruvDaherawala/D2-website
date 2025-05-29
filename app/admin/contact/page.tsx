"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContentForm from "@/components/admin/ContentForm";
import { toast } from "sonner";
import { ContactContent } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contact data
  useEffect(() => {
    async function fetchContact() {
      try {
        const response = await fetch("/api/content/contact");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setContactContent(data[0]);
          }
        } else {
          toast.error("Failed to fetch contact content");
        }
      } catch (error) {
        console.error("Error fetching contact content:", error);
        toast.error("An error occurred while fetching contact content");
      } finally {
        setIsLoading(false);
      }
    }

    fetchContact();
  }, []);

  const handleSaveSuccess = () => {
    toast.success("Contact content updated successfully");
    router.refresh();
  };

  // Form fields for contact content
  const contactFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      placeholder: "Get in Touch",
      required: true,
    },
    {
      name: "subtitle",
      label: "Subtitle",
      type: "text" as const,
      placeholder: "We'd love to hear from you",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "contact@example.com",
      required: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text" as const,
      placeholder: "+1 (555) 123-4567",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      type: "textarea" as const,
      placeholder: "123 Main St, City, State, ZIP",
      required: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Contact Section</h1>
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
            <CardTitle className="text-white">Edit Contact Information</CardTitle>
            <CardDescription>
              Update your contact details that appear on the website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentForm
              title="Contact Information"
              fields={contactFields}
              initialData={contactContent || undefined}
              collection="contact"
              onSuccess={handleSaveSuccess}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
} 