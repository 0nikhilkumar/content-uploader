"use client";

import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
	onSuccess: (res: IKUploadResponse) => void;
	onProgress?: (progress: number) => void;
	fileType?: "image" | "video";
    setBufferImage: React.Dispatch<React.SetStateAction<string | null>>;
    setImageType: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function FileUpload({
	onSuccess,
	onProgress,
	fileType = "image",
    setBufferImage,
    setImageType
}: FileUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onError = (err: { message: string }) => {
		setError(err.message);
		setUploading(false);
	};

	const handleSuccess = (response: IKUploadResponse) => {
		setUploading(false);
		setError(null);
		onSuccess(response);
	};

	const handleStartUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if(fileType==="image"){
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
    
                const reader = new FileReader();
                reader.readAsDataURL(file);
    
                reader.onload = () => {
                    const base64String = reader.result?.toString().split(",")[1] || "";
                    setBufferImage(base64String);
                    console.log(base64String);
                };
            }
        }
		setUploading(true);
		setError(null);
	};

	const handleProgress = (evt: ProgressEvent) => {
		if (evt.lengthComputable && onProgress) {
			const percentComplete = (evt.loaded / evt.total) * 100;
			onProgress(Math.round(percentComplete));
		}
	};

	const validateFile = (file: File) => {
        console.log(file);
        console.log(fileType);
		if (fileType === "video") {
			if (!file.type.startsWith("video/")) {
				setError("Please upload a valid video file");
				return false;
			}
			if (file.size > 150 * 1024 * 1024) {
				setError("Video size must be less than 150MB");
				return false;
			}
		} else {
			const validTypes = ["image/jpeg", "image/png", "image/webp"];
            setImageType(file.type);
			if (!validTypes.includes(file.type)) {
				setError("Please upload a valid image file (JPEG, PNG, or WebP)");
				return false;
			}
			if (file.size > 5 * 1024 * 1024) {
				setError("File size must be less than 5MB");
				return false;
			}
		}
		return true;
	};

	return (
		<div className="space-y-2">
			<IKUpload
				fileName={fileType === "video" ? "video" : "image"}
				onError={onError}
				onSuccess={handleSuccess}
				onUploadStart={handleStartUpload}
				onUploadProgress={handleProgress}
				accept={fileType === "video" ? "video/*" : "image/*"}
				className="file-input file-input-bordered w-full"
				validateFile={validateFile}
				useUniqueFileName={true}
				folder={fileType === "video" ? "reels-pro/videos" : "reels-pro/images"}
			/>

			{uploading && (
				<div className="flex items-center gap-2 text-sm text-primary">
					<Loader2 className="w-4 h-4 animate-spin" />
					<span>Uploading...</span>
				</div>
			)}

			{error && <div className="text-error text-sm">{error}</div>}
		</div>
	);
}
