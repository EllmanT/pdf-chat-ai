"use client";

import useUpload, { StatusText } from "@/hooks/useUpload";
import {
  CheckCheckIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";

import { useDropzone } from "react-dropzone";
function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const router = useRouter();
  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);
    const file = acceptedFiles[0];

    if (file) {
      await handleUpload(file);
    } else {
      // do something
    }
  }, []);
  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: <RocketIcon className="size-20 text-indigo-600" />,
    [StatusText.UPLOADED]: (
      <CheckCheckIcon className="size-20 text-indigo-600" />
    ),
    [StatusText.SAVING]: <SaveIcon className="size-20 text-indigo-600" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="size-20 animate-bounce text-indigo-600" />
    ),
  };
  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col items-center justify-center gap-5">
          <div
            className={`radial-progress border-4 border-indigo-600 bg-indigo-300 text-white ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={{
              // @ts-ignore
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress}%
          </div>

          {
            // @ts-ignore
            statusIcons[status!]
          }
          <p className="animate-pulse text-indigo-600">
            {String(status) ?? ""}
          </p>
        </div>
      )}
      {!uploadInProgress && (
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
      )}
    </div>
  );
}

export default FileUploader;
