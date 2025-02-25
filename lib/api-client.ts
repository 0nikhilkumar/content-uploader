import { IUser } from "@/models/User";
import { IVideo } from "@/models/Video";

export interface IProfileUser {
    firstname?: string;
    lastname?: string;
    email: string;
    bio?: string;
    avatar?: string;
    fileId?: string;
}

export interface VideoUpdateFormData {
    id: string;
    title?: string;
    description?: string;
}

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
	method?: "GET" | "POST" | "PUT" | "DELETE";
	body?: any;
	headers?: Record<string, string>;
};

class ApiClient {
	private async fetch<T>(
		endpoint: string,
		options: FetchOptions = {}
	): Promise<T> {
		const { method = "GET", body, headers = {} } = options;

		const defaultHeaders = {
			"Content-Type": "application/json",
			...headers,
		};

		const res = await fetch(`/api${endpoint}`, {
			method,
			headers: defaultHeaders,
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!res.ok) {
			throw new Error(await res.text());
		}

		return res.json();
	}

	async getVideos() {
		return this.fetch<IVideo[]>("/videos");
	}

	async getAVideo(id: string) {
		return this.fetch<IVideo>(`/videos/${id}`);
	}

	async createVideo(videoData: VideoFormData) {
		return this.fetch("/videos", {
			method: "POST",
			body: videoData,
		});
	}

    async getMyVideos() {
        return this.fetch<IVideo[]>("/myvideos");
    }

    async updateAVideoData(data: VideoUpdateFormData) {
        return this.fetch("/videos", {
            method: "PUT",
            body: data
        });
    }

    async deleteAVideo(id: string) {
        return this.fetch("/videos", {
            method: "DELETE",
            body: id
        })
    }

    async generate(image: string, imageType: string, type: string) {
        return this.fetch("/generate", {
            method: "POST",
            body: {image, imageType, type}
        });
    }

    async getProfile() {
        return this.fetch<IProfileUser>("/profile");
    }

    async updateProfile(data: IProfileUser) {
        return this.fetch("/profile", {
            method: "PUT",
            body: data
        });
    }

}

export const apiClient = new ApiClient();
