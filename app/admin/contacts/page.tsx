"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { UserInquiry } from "@/lib/init-db";
import { ArrowLeft, Trash2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<UserInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<UserInquiry | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setLoading(true);
    try {
      const response = await fetch("/api/content/contacts");
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      // Sort by date, newest first
      data.sort((a: UserInquiry, b: UserInquiry) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setContacts(data);
    } catch (error) {
      toast.error("Error loading contacts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteContact(id: string) {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch(`/api/content/contacts?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      toast.success("Contact deleted successfully");
      fetchContacts();
    } catch (error) {
      toast.error("Error deleting contact");
      console.error(error);
    }
  }

  function formatDate(dateString: string | Date) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => router.push("/admin")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-white">Contact Form Submissions</h1>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">User Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : contacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Subject</TableHead>
                  <TableHead className="text-white w-32">Date</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium text-gray-300">
                      {contact.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {contact.email || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {contact.subject || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(contact.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => contact.id && deleteContact(contact.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No contact form submissions yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Contact Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Submitted on {selectedContact && formatDate(selectedContact.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Name</h3>
                  <p className="text-gray-300">{selectedContact.name || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-300">{selectedContact.email || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-300">{selectedContact.phone || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Project Interest</h3>
                  <p className="text-gray-300">{selectedContact.projectInterest || "N/A"}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Subject</h3>
                <p className="text-gray-300">{selectedContact.subject || "N/A"}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Message</h3>
                <div className="p-4 bg-gray-700 rounded-md whitespace-pre-wrap">
                  {selectedContact.message || "No message provided."}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedContact?.id) {
                  deleteContact(selectedContact.id);
                  setSelectedContact(null);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button variant="outline" onClick={() => setSelectedContact(null)}>
              Close
            </Button>
            {selectedContact?.email && (
              <Button 
                onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your inquiry"}`)}
              >
                <Mail className="h-4 w-4 mr-1" />
                Reply via Email
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 