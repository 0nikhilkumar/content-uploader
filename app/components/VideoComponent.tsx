import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { IKImage, IKVideo } from "imagekitio-next";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useNotification } from "./Notifications";


export default function VideoComponent({ video }: { video: IVideo }) {

    const pathname = usePathname();
    const isProfilePage  = pathname === "/profile";
    const { showNotification } = useNotification();
	const [menuOpen, setMenuOpen] = useState(false);
	const [openAbove, setOpenAbove] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(video.title);
	const [description, setDescription] = useState(video.description);
	const [originalTitle, setOriginalTitle] = useState(video.title);
	const [originalDescription, setOriginalDescription] = useState(video.description);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleMenu = () => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			const spaceAbove = rect.top;
			setOpenAbove(spaceBelow < 100 && spaceAbove > 100);
		}
		setMenuOpen((prev) => !prev);
	};

	const handleEdit = () => {
		setIsEditing(true);
		setMenuOpen(false);
	};

	const handleSave = async (id: string) => {
        await apiClient.updateAVideoData({id, title, description});
        showNotification("Changed successfully!", "success");
		setIsEditing(false);
		setOriginalTitle(title);
		setOriginalDescription(description);
	};

	const handleCancel = () => {
		setTitle(originalTitle);
		setDescription(originalDescription);
		setIsEditing(false);
	};

	const handleDelete = async (id: string, type: string) => {
        console.log(id);
        const response = await apiClient.deleteAVideo(id);
        console.log(response);
        showNotification(`${type} deleted successfully!`, "success");
		setIsModalOpen(false);
	};

	return (
		<div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 relative">
			<figure className="relative px-4 pt-4">
				<Link href={`/videos/${video._id}`} className="relative group w-full">
					<div className="rounded-xl overflow-hidden relative w-full" style={{ aspectRatio: "9/16" }}>
						{video.videoUrl.includes("/videos") && (
							<IKVideo
								path={video.videoUrl}
								transformation={[{ height: "1920", width: "1080" }]}
								controls={video.controls}
								className="w-full h-full object-cover"
							/>
						)}
						{video.videoUrl.includes("/images") && (
							<IKImage
								path={video.videoUrl}
								alt="this is image"
								width={500}
								height={500}
								className="w-full h-full object-cover"
							/>
						)}
					</div>
				</Link>
			</figure>

			<div className="card-body p-4 relative">
				{isEditing ? (
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="input input-bordered w-full text-lg font-semibold"
					/>
				) : (
					<Link href={`/videos/${video._id}`} className="hover:opacity-80 transition-opacity">
						<h2 className="card-title text-lg">{originalTitle}</h2>
					</Link>
				)}

				{isEditing ? (
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="textarea textarea-bordered w-full text-sm mt-2"
					/>
				) : (
					<p className="text-sm text-base-content/70 line-clamp-2">{originalDescription}</p>
				)}

				{isEditing && (
					<div className="flex gap-2 mt-3">
						<button onClick={() => handleSave(video._id?.toString() || "")} className="btn btn-sm btn-primary">
							Save
						</button>
						<button onClick={handleCancel} className="btn btn-sm btn-secondary">
							Cancel
						</button>
					</div>
				)}

				{isProfilePage && (
					<div className="absolute bottom-4 right-4" ref={menuRef}>
						<button ref={buttonRef} className="p-2 rounded-full hover:bg-gray-700/40 transition" onClick={toggleMenu}>
							<MoreVertical className="w-5 h-5 text-gray-300" />
						</button>

						{menuOpen && (
							<div className={`absolute right-0 w-36 bg-base-200 shadow-lg rounded-md overflow-hidden z-50 transition-all ${openAbove ? "bottom-full mb-2" : "top-full mt-2"}`}>
								<button className="block w-full text-left px-4 py-2 text-sm hover:bg-base-300" onClick={handleEdit}>
									Edit
								</button>
								<button className="block w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-white" onClick={() => setIsModalOpen(true)}>
									Delete
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			{isModalOpen && (
				<dialog open className="modal modal-bottom sm:modal-middle">
					<div className="modal-box">
						<h3 className="font-bold text-lg">Confirm Delete</h3>
						<p className="py-4">Are you sure you want to delete this video?</p>
						<div className="modal-action">
							<button onClick={()=> handleDelete(video._id?.toString() || "", video.videoUrl.includes("/videos") ? "video" : "image")} className="btn btn-error">
								OK
							</button>
							<button onClick={() => setIsModalOpen(false)} className="btn">
								Close
							</button>
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
}
