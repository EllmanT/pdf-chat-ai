import { Button } from "@/components/ui/button";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";

const features = [
  {
    name: "Store your PDF Docuemnts",
    description:
      "Keep all your important PDF files secure stored and easily accessible anytime anywhere",
    icon: GlobeIcon,
  },
];
export default function Home() {
  return (
    <main className="flex-1 overflow-scroll bg-gradient-to-bl from-white to-indigo-600 p-2 lg:p-5">
      <div className="rounded-md bg-white py-24  drop-shadow-xl sm:py-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Your Interactive Document Assistance
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your PDFs into an interactive conversations
            </p>
            <p>
              Introducing {""}
              <span className="font-bold text-indigo-600">Chat with PDF</span>
              <br />
              <br />
              Upload documents, our chatbot will answer your questions
              <span className="text-indigo-600">Chat with PDF</span> turn static
              documents into {""}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x
            </p>
          </div>
          <Button asChild className="mt-10">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
