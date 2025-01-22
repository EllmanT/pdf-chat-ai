"use client";

import { CircleArrowDown, RocketIcon } from "lucide-react";
import React, { useCallback } from "react";

import { useDropzone } from "react-dropzone";
function FileUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
  });
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className={`mt-10 flex h-96 w-[90%] items-center justify-center rounded-lg border-2 border-dashed border-indigo-600 p-10 text-indigo-600 ${
          isFocused || isDragActive ? "bg-indigo-300" : "bg-indigo-100"
        }`}
      >
        <input {...getInputProps()} />
        <div className=" flex flex-col items-center justify-center">
          {isDragActive ? (
            <>
              <RocketIcon className="size-20 animate-ping" />
              <p>Drop the files here ...</p>
            </>
          ) : (
            <>
              <CircleArrowDown className="size-20 animate-bounce" />
              <p>
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
