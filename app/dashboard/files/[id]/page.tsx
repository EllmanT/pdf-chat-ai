import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import React from "react";

async function ChatToFilePage({ params: { id } }: { params: { id: string } }) {
  auth.protect();
  const { userId } = await auth();

  const ref = await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .get();

  const url = ref.data()?.dowloadUrl;
  return (
    <div className="grid h-full overflow-hidden lg:grid-cols-5">
      <div className="col-span-5 overflow-y-auto lg:col-span-2"></div>
      <div className="col-span-5 overflow-auto border-r-2 bg-gray-100 lg:-order-1 lg:col-span-3 lg:border-indigo-600"></div>
    </div>
  );
}

export default ChatToFilePage;
