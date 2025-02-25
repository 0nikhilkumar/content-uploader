"use client";

import VideoComponent from "@/app/components/VideoComponent";
import { IVideo } from "@/models/Video";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VideoPage() {
	const [video, setVideo] = useState<IVideo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { id } = useParams();

	useEffect(() => {

		const fetchVideo = async () => {
			try {
				const response = await fetch(`/api/videos/${id}`);
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error || "Video not found");
				}
				setVideo(data);
			} catch (err) {
				console.error("Fetch Error:", err);
				setError(err instanceof Error ? err.message : "Failed to load video");
			} finally {
				setLoading(false);
			}
		};

		fetchVideo();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoaderCircle className="animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
					<p className="text-muted-foreground">{error}</p>
				</div>
			</div>
		);
	}

	if (!video) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-2">Video Not Found</h2>
					<p className="text-muted-foreground">
						The requested video could not be found.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto">
			<div className="max-w-xs mx-auto h-fit w-fit">
				<VideoComponent video={video} />
			</div>
		</div>
	);
}
