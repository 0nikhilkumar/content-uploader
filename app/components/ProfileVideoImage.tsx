"use client";

import React, { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import VideoFeed from "./VideoFeed";

function ProfileVideoImage({setPosts}: {setPosts: (posts: number) => void}) {
    const [type, setType] = useState<string>("video");
    const [videos, setVideos] = useState<IVideo[]>([]);
    const [loadingVideos, setLoadingVideos] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await apiClient.getMyVideos();
                setPosts(data.length)
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

    const filteredContent = videos.filter(item => {
        if (type === "video") {
            return item.videoUrl.includes("/videos");
        } else {
            return item.videoUrl.includes("/images");
        }
    });

    return (
			<div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4">
				<div className="flex gap-4 my-6">
					<div role="tablist" className="tabs tabs-boxed">
						<a onClick={() => setType("video")} role="tab" className={`tab ${type === "video" ? "tab-active" : ""}`}>
							Videos
						</a>
						<a onClick={() => setType("image")} role="tab" className={`tab ${type === "image" ? "tab-active" : ""}`}>
							Images
						</a>
					</div>
				</div>

				{filteredContent.length > 0 ? (
					<VideoFeed videos={filteredContent} />
				) : (
					<div className="text-center py-10">
						<p className="text-lg text-muted-foreground">
							No {type}s found in your profile
						</p>
					</div>
				)}
			</div>
		);
}

export default ProfileVideoImage;