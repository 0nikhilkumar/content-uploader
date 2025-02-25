import React, { useState } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import { IProfileUser } from "@/lib/api-client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";


interface ProfileEditFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: IProfileUser) => void;
	initialData: IProfileUser;
}

export function ProfileEditForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
}: ProfileEditFormProps) {
	const [formData, setFormData] = useState<IProfileUser>(initialData);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);

	const onError = (err: { message: string }) => {
		setError(err.message);
		setUploading(false);
		setUploadProgress(0);
	};

	const handleSuccess = (response: IKUploadResponse) => {
		setUploading(false);
		setError(null);
		setUploadProgress(0);
		setFormData((prev) => ({
			...prev,
			avatar: response.url,
            fileId: response.fileId,
		}));
	};

	const handleStartUpload = () => {
		setUploading(true);
		setError(null);
		setUploadProgress(0);
	};

	const handleProgress = (evt: ProgressEvent) => {
		if (evt.lengthComputable) {
			const percentComplete = (evt.loaded / evt.total) * 100;
			setUploadProgress(Math.round(percentComplete));
		}
	};

	const validateFile = (file: File) => {
		const validTypes = ["image/jpeg", "image/png", "image/webp"];
		if (!validTypes.includes(file.type)) {
			setError("Please upload a valid image file (JPEG, PNG, or WebP)");
			return false;
		}
		if (file.size > 5 * 1024 * 1024) {
			setError("File size must be less than 5MB");
			return false;
		}
		return true;
	};

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-0">
			<div className="bg-gray-900 rounded-lg w-full max-w-md p-4 sm:p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto scrollbar-hide">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-200 transition-colors">
					<X size={24} />
				</button>

				<h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-4 sm:mb-6 pr-8">
					Edit Profile
				</h2>

				{error && (
					<div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
					<div className="flex justify-center">
						<div className="relative">
							<img
								src={formData.avatar}
								alt="Profile"
								className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-800 shadow-lg"
							/>
							<label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors cursor-pointer">
								<span className="sr-only">Change avatar</span>
								{uploading ? (
									<Loader2 size={20} className="animate-spin" />
								) : (
									<Camera size={20} />
								)}
								<IKUpload
									accept="image/*"
									onError={onError}
									onSuccess={handleSuccess}
									onUploadStart={handleStartUpload}
									onUploadProgress={handleProgress}
									validateFile={validateFile}
									fileName="avatar"
									useUniqueFileName={true}
									folder="reels-pro/avatar"
									className="hidden"
									disabled={uploading}
								/>
							</label>
							{uploading && uploadProgress > 0 && (
								<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
									Uploading... {uploadProgress}%
								</div>
							)}
						</div>
					</div>

					<div className="flex gap-2">
						<div>
							<label
								htmlFor="firstname"
								className="block text-sm font-medium text-gray-300">
								First Name
							</label>
							<input
								type="text"
								id="firstname"
								value={formData.firstname}
								onChange={(e) =>
									setFormData({ ...formData, firstname: e.target.value })
								}
								className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm sm:text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="lastname"
								className="block text-sm font-medium text-gray-300">
								Last Name
							</label>
							<input
								type="text"
								id="lastname"
								value={formData.lastname}
								onChange={(e) =>
									setFormData({ ...formData, lastname: e.target.value })
								}
								className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm sm:text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
								required
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-300">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm sm:text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="bio"
							className="block text-sm font-medium text-gray-300">
							Bio
						</label>
						<textarea
							id="bio"
							value={formData.bio}
							onChange={(e) =>
								setFormData({ ...formData, bio: e.target.value })
							}
							rows={3}
							className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm sm:text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="order-2 sm:order-1 sm:flex-1 rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
							Cancel
						</button>
						<button
							type="submit"
							disabled={uploading}
							className="order-1 sm:order-2 sm:flex-1 rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
