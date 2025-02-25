"use client";

import { apiClient, IProfileUser } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { useNotification } from "../components/Notifications";
import { ProfileEditForm } from "../components/ProfileEditForm";
import ProfileVideoImage from "../components/ProfileVideoImage";
import { useSession } from "next-auth/react";
import { LoaderCircle, Settings } from "lucide-react";
import { IKImage } from "imagekitio-next";

function Profile() {
	const { status } = useSession();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { showNotification } = useNotification();
	const [userProfile, setUserProfile] = useState<IProfileUser | null>(null);
	const [posts, setPosts] = useState<number>(0);
	const [profile, setProfile] = useState<IProfileUser>({
		firstname: "",
		lastname: "",
		email: "",
		bio: "",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	});

	useEffect(() => {
		const getUserProfileData = async () => {
			try {
				const response = await apiClient.getProfile();
				setUserProfile(response);
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};
		getUserProfileData();
	}, []);

	useEffect(() => {
		if (userProfile) {
			setProfile({
				firstname: userProfile.firstname,
				lastname: userProfile.lastname,
				email: userProfile.email,
				bio: userProfile.bio || "Frontend Developer & UI/UX Enthusiast",
				avatar: userProfile?.avatar || profile.avatar,
			});
		}
	}, [userProfile]);

	const handleProfileUpdate = async (data: typeof profile) => {
		try {
			await apiClient.updateProfile(data);
			showNotification("Profile updated successfully", "success");
			setProfile(data);
			setIsOpen(false);
		} catch (error) {
			showNotification("Failed to update profile", "error");
		}
	};

	const handleEditClick = () => {
		if (userProfile) {
			setIsOpen(true);
		} else {
			showNotification("Profile data not loaded yet!", "error");
		}
	};

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoaderCircle className="animate-spin" />
			</div>
		);
	}

	const getImagePath = (url: string) => {
		const urlParts = url.split("/");
		return urlParts.slice(urlParts.indexOf("reels-pro")).join("/");
	};

	return (
		<div className="h-full w-full flex flex-col items-center px-4 sm:px-10 md:px-20">
			<div className="py-6 bg-slate-800 rounded-lg w-full">
				<div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start p-4 md:p-6 w-full">
					{/* Avatar Section */}
					<div className="avatar">
						<div className="mask mask-squircle w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
							{profile?.avatar?.includes("imagekit") ? (
								<IKImage
									path={getImagePath(profile?.avatar)}
									alt="Profile"
									className="w-full h-full object-cover"
									width={150}
									height={150}
									loading="lazy"
								/>
							) : (
								<img
									src={profile.avatar}
									alt="Profile"
									className="w-full h-full object-cover"
								/>
							)}
						</div>
					</div>

					<div className="flex flex-col mt-2 items-center md:items-start text-center md:text-left w-full">
						<h1 className="text-sm font-semibold text-white">
							{profile.firstname} {profile.lastname}
						</h1>
						<h2 className="text-sm w-fit text-gray-300 mt-2 bg-black rounded-full px-2 py-1">
							@{profile.email.split("@")[0]}
						</h2>
						<p className="text-gray-400 mt-2 text-lg">{profile.bio}</p>
					</div>

					<div className="flex flex-col items-end md:justify-end w-fit md:w-full">
						<button
							onClick={handleEditClick}
							className="bg-black text-white px-4 py-2 w-fit rounded-md hover:bg-gray-700 transition duration-300 flex items-center gap-2">
							Edit Profile <Settings className="w-4" />
						</button>
                        <div className="mt-2 flex justify-center md:justify-start">
							<button className="btn px-7">
								Posts: <div className="badge">{posts}</div>
							</button>
						</div>
					</div>
				</div>
			</div>

			{isOpen && (
				<ProfileEditForm
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					onSubmit={handleProfileUpdate}
					initialData={profile}
				/>
			)}

			<ProfileVideoImage setPosts={setPosts} />
		</div>
	);
}

export default Profile;
