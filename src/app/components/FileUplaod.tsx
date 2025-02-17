"use client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";


export default function FileUplaod({onSuccess}: {onSuccess: (response: IKUploadResponse) => void}) {
    const [uploading, setUploading] = useState(false);
    const  [error, setError] = useState<string | null>(null);

    const onError = (error: {message : string}) => {
        setError(error.message);
        setUploading(false);
    }

    const handleSuccess = (response: IKUploadResponse) => {
        // console.log(response);
        setUploading(false);
        setError(null);
        onSuccess(response);
    }

    const handleStartUpload= () => {
        setUploading(true);
        setError(null);
    }
  return (
    <div className="space-y-2">
        <IKUpload
            fileName="test.jpg"
            useUniqueFileName={false}
            onError={onError}
            onSuccess={handleSuccess}
            onUploadStart={handleStartUpload}
            validateFile={(file: File) => {
                const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
                if (!allowedTypes.includes(file.type)) {
                    setError("Invalid file type. Please upload an image file.");
                }

                if(file.size > 1024 * 1024 * 5){
                    setError("File size exceeds 5MB. Please upload a smaller file.");
                }
                return true;
            }}  
        />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}