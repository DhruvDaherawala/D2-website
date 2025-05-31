"use client";

import ContentForm from "@/components/admin/ContentForm";

export default function ContactPage() {
  const formFields = [
    {
      name: "name",
      label: "Your Name",
      type: "text" as const,
      placeholder: "Enter your full name",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email" as const,
      placeholder: "your.email@example.com",
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text" as const,
      placeholder: "Your phone number (optional)",
    },
    {
      name: "subject",
      label: "Subject",
      type: "text" as const,
      placeholder: "What is your message regarding?",
      required: true,
    },
    {
      name: "message",
      label: "Message",
      type: "textarea" as const,
      placeholder: "Please provide details about your inquiry...",
      required: true,
    },
    {
      name: "projectInterest",
      label: "Project of Interest",
      type: "text" as const,
      placeholder: "Which project are you interested in? (optional)",
    },
  ];

  return (
    <div className="py-16 px-4 md:px-6 lg:px-8 mx-auto max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Contact Us</h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Have a question or interested in our services? Reach out to us using the form below.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ContentForm
          title="Contact Form"
          fields={formFields}
          collection="contacts"
          submitLabel="Send Message"
          onSuccess={() => {
            // This will be called after successful form submission
            console.log("Form submitted successfully");
          }}
        />
        
        <div className="mt-8 text-center text-gray-500">
          <p>We'll get back to you as soon as possible!</p>
        </div>
      </div>
    </div>
  );
} 