"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  auth.protect();

  // turn a pdf into embeddings
  await generateEmbeddingsInPineconeVectorStore(docId);

  revalidatePath("/dashboard");
  return { completed: true };
}
