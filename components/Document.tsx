"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
function Document({
  id,
  name,
  size,
  downloadUrl,
}: {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
}) {
  const router = useRouter();

  return (
    <div className="group flex h-60 w-48 cursor-pointer flex-col justify-between rounded-xl bg-white p-4 drop-shadow-md transition-all hover:scale-105 hover:bg-indigo-600 hover:text-white">
      <div
        className="flex-1"
        onClick={() => {
          router.push(`/dashboard/files/${id}`);
        }}
      >
        <p className="line-clamp-2 font-semibold">{name}</p>
        <p className="text-sm text-gray-500 group-hover:text-indigo-100">
          {byteSize(size).value}KB
        </p>
      </div>
    </div>
  );
}

export default Document;
