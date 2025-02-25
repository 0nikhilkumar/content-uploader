"use client";

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useNotification } from "../components/Notifications";
import { Spotlight } from "../components/ui/spotlight-new";
import { Eye, EyeOff } from "lucide-react";

export default function SignupFormDemo() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const { showNotification } = useNotification();
	const { data: session, status } = useSession();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setLoading(true);
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				showNotification(result.error, "error");
			} else {
				showNotification("Login Successful!", "success");
				router.push("/");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<div className="relative overflow-hidden max-w-md w-full mx-auto rounded-none md:rounded-2xl border-gray-600 border p-4 md:p-8 shadow-input bg-white dark:bg-black">
			<Spotlight />
			<h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
				Sign In
			</h2>
			<div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

			<form className="my-8" onSubmit={handleSubmit}>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="email">Email Address</Label>
					<Input
						value={email}
						required
						onChange={(e) => setEmail(e.target.value)}
						id="email"
						placeholder="projectmayhem@fc.com"
						type="email"
					/>
				</LabelInputContainer>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="password">Password</Label>
					<div className="relative">
						<Input
							value={password}
							required
							onChange={(e) => setPassword(e.target.value)}
							id="password"
							placeholder="••••••••"
							type={showPassword ? "text" : "password"}
							className="pr-10"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-3 flex items-center text-gray-500">
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
				</LabelInputContainer>

				<button
					className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
					type="submit">
					{loading ? (
						<LoaderCircle className="animate-spin mx-auto" />
					) : (
						<p>Sign In &rarr;</p>
					)}
					<BottomGradient />
				</button>
				<p className="text-center mt-4">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="text-blue-500 hover:text-blue-600">
						Sign Up
					</Link>
				</p>
			</form>
		</div>
	);
}

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("flex flex-col space-y-2 w-full", className)}>
			{children}
		</div>
	);
};
