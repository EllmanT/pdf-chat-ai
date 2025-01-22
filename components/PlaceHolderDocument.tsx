"use client";
import React from "react";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function PlaceHolderDocument() {
  const router = useRouter();

  const HandleClick = () => {
    router.push("/dashboard/upload");
  };
  return (
    <Button
      onClick={HandleClick}
      className="flex h-80 w-64 flex-col items-center rounded-xl bg-gray-200 text-gray-400 drop-shadow-md "
    >
      <PlusCircleIcon className="size-16" />
      <p>Add a document</p>
    </Button>
  );
}

export default PlaceHolderDocument;
