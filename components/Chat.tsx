"use client";

import { useUser } from "@clerk/nextjs";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "user", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    if (!snapshot) return;

    console.log("Updated snapshot", snapshot.docs);
    // const lastMessage = messages.pop();
  }, [snapshot]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const question = input;
    setInput("");

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        role: "human",
        message: question,
        createdAt: new Date(),
      },
      {
        role: "ai",
        message: "Thinking...",
        createdAt: new Date(),
      },
    ]);
    startTransition(async () => {
      const { success, message } = await askQuestion(id, question);
      if (!success) {
        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: "ai",
              message: `Ooops...${message}`,
              createdAt: new Date(),
            },
          ])
        );
      }
    });
  };
  return (
    <div className=" flex h-full flex-col overflow-scroll">
      <div className="w-full flex-1"></div>
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 m-2 flex space-x-2 rounded-md bg-gray-100 p-5"
      >
        <Input
          placeholder="Ask a Question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-indigo-600" />
          ) : (
            "Ask"
          )}
          Ask
        </Button>
      </form>
    </div>
  );
}

export default Chat;
