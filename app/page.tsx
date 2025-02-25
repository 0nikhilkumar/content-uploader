"use client";

import React, { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import VideoFeed from "./components/VideoFeed";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function Home() {
	const [videos, setVideos] = useState<IVideo[]>([]);
	const [loadingVideos, setLoadingVideos] = useState(true);
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const data = await apiClient.getVideos();
				setVideos(data);
			} catch (error) {
				console.error("Error fetching videos:", error);
			} finally {
				setLoadingVideos(false);
			}
		};
		fetchVideos();
	}, []);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	if (status === "loading" || loadingVideos) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoaderCircle className="animate-spin" />
			</div>
		);
	}

	return (
		<main className="container mx-auto px-4 py-8">
			{session && <VideoFeed videos={videos} />}
		</main>
	);
}
