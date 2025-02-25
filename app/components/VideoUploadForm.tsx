"use client";

import { apiClient } from "@/lib/api-client";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { ChartNoAxesGantt, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "./FileUpload";
import { useNotification } from "./Notifications";

interface VideoFormData {
	title: string;
	description: string;
	videoUrl: string;
	thumbnailUrl: string;
    fileId: string;
}

export default function VideoUploadForm() {
	const [loading, setLoading] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState(false);
    const [loadingDescription, setLoadingDescription] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const { showNotification } = useNotification();
	const [selectedMedia, setSelectedMedia] = useState<"video" | "image">(
		"video"
	);
	const [bufferImage, setBufferImage] = useState<string | null>("");
	const [imageType, setImageType] = useState<string | null>("");

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<VideoFormData>({
		defaultValues: {
			title: "",
			description: "",
			videoUrl: "",
			thumbnailUrl: "",
            fileId: "",
		},
	});

	const generateAiTitle = async (type: string) => {
		if (!bufferImage || !imageType) {
			showNotification("Please upload an image first", "error");
			setLoading(false);
			return;
		}

		showNotification(`Generating ${type}...`, "info");

        if (type === "title") setLoadingTitle(true);
        if (type === "description") setLoadingDescription(true);
		try {
			const response = await apiClient.generate(bufferImage, imageType, type);

			if (type === "title") {
				setValue("title", response as string);
			} else if (type === "description") {
				setValue("description", response as string);
			}
		} catch (error) {
			console.log(error);
			showNotification(`Failed to generate ${type}`, "error");
		} finally {
            if (type === "title") setLoadingTitle(false);
            if (type === "description") setLoadingDescription(false);
		}
	};

	const handleUploadSuccess = (response: IKUploadResponse) => {
        setValue("fileId", response.fileId);
		setValue("videoUrl", response.filePath);
		setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
		showNotification("Video uploaded successfully!", "success");
	};

	const handleUploadProgress = (progress: number) => {
		setUploadProgress(progress);
	};

	const onSubmit = async (data: VideoFormData) => {
		if (!data.videoUrl) {
			showNotification("Please upload a video first", "error");
			return;
		}

		setLoading(true);
		try {
			await apiClient.createVideo(data);
			showNotification("Video published successfully!", "success");

			setValue("title", "");
			setValue("description", "");
			setValue("videoUrl", "");
			setValue("thumbnailUrl", "");
			setUploadProgress(0);
		} catch (error) {
			showNotification(
				error instanceof Error ? error.message : "Failed to publish video",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="form-control">
				<label className="label">Title</label>
				<div className="relative w-full">
					<input
						type="text"
						className={`input input-bordered w-full pr-10 ${
							errors.title ? "input-error" : ""
						}`}
						{...register("title", { required: "Title is required" })}
					/>

					{selectedMedia === "image" && (
						<div className="group absolute right-3 top-1/2 transform -translate-y-1/2">
							{loadingTitle ? (
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							) : (
                                <ChartNoAxesGantt onClick={() => generateAiTitle("title")}
                                className="cursor-pointer text-gray-500 hover:text-gray-700" />
							)}
							<span className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
								Generate Title
							</span>
						</div>
					)}
				</div>
				{errors.title && (
					<span className="text-error text-sm mt-1">
						{errors.title.message}
					</span>
				)}
			</div>

			<div className="form-control">
				<label className="label">Description</label>
				<div className="w-full relative">
					<textarea
						className={`textarea textarea-bordered h-24 w-full pr-10 ${
							errors.description ? "textarea-error" : ""
						}`}
						{...register("description", {
							required: "Description is required",
						})}
					/>
					{selectedMedia === "image" && (
						<div className="group absolute right-3 top-1/2 transform -translate-y-1/2">
							{loadingDescription ? (
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							) : (
                                <ChartNoAxesGantt onClick={() => generateAiTitle("description")}
                                className="cursor-pointer text-gray-500 hover:text-gray-700" />
							)}
							<span className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
								Generate Description
							</span>
						</div>
					)}
				</div>
				{errors.description && (
					<span className="text-error text-sm mt-1">
						{errors.description.message}
					</span>
				)}
			</div>

			<div className="flex gap-4">
				<div className="form-control">
					<label className="label cursor-pointer gap-4">
						<span className="label-text">Video</span>
						<input
							type="radio"
							name="radio-10"
							value={"video"}
							className="radio checked:bg-blue-500"
							onChange={() => setSelectedMedia("video")}
							defaultChecked
						/>
					</label>
				</div>
				<div className="form-control">
					<label className="label cursor-pointer gap-4">
						<span className="label-text">Image</span>
						<input
							type="radio"
							name="radio-10"
							value={"image"}
							className="radio checked:bg-blue-500"
							onChange={() => setSelectedMedia("image")}
						/>
					</label>
				</div>
			</div>

			<div className="form-control">
				<label className="label">
					Upload {selectedMedia === "video" ? "Video" : "Image"}
				</label>
				<FileUpload
					fileType={selectedMedia}
					onSuccess={handleUploadSuccess}
					onProgress={handleUploadProgress}
					setBufferImage={setBufferImage}
					setImageType={setImageType}
				/>
				{uploadProgress > 0 && (
					<div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
						<div
							className="bg-primary h-2.5 rounded-full transition-all duration-300"
							style={{ width: `${uploadProgress}%` }}
						/>
					</div>
				)}
			</div>

			<button
				type="submit"
				className="btn btn-primary btn-block"
				disabled={loading || !uploadProgress}>
				{loading ? (
					<>
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						Publishing {selectedMedia === "video" ? "Video" : "Image"}...
					</>
				) : (
					`${selectedMedia === "video" ? "Publish Video" : "Publish Image"}`
				)}
			</button>
		</form>
	);
}
