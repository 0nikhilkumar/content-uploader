"use client";

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useNotification } from "../components/Notifications";
import { Spotlight } from "../components/ui/spotlight-new";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>("");
	const { showNotification } = useNotification();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();
		if (password !== confirmPassword) {
			setLoading(false);
			showNotification("Passwords do not match", "error");
			return;
		}

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password, firstname, lastname }),
			});

			const data = await res.json();

			if (!res.ok) {
				setLoading(false);
				throw new Error(data.error || "Registration failed");
			}

			showNotification("Registration successful! Please log in.", "success");
			router.push("/login");
		} catch (error) {
			setLoading(false);
			showNotification(
				error instanceof Error ? error.message : "Registration failed",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative overflow-hidden max-w-md w-full mx-auto rounded-none md:rounded-2xl border-gray-600 border p-4 md:p-8 shadow-input bg-white dark:bg-black">
			<Spotlight />
			<h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
				Sign Up
			</h2>
			<div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

			<form className="my-8" onSubmit={handleSubmit}>
				<div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
					<LabelInputContainer>
						<Label htmlFor="firstname">First name</Label>
						<Input
							value={firstname}
							id="firstname"
							placeholder="Tyler"
							type="text"
							required
							onChange={(e) => setFirstname(e.target.value)}
						/>
					</LabelInputContainer>
					<LabelInputContainer>
						<Label htmlFor="lastname">Last name</Label>
						<Input
							value={lastname}
							required
							onChange={(e) => setLastname(e.target.value)}
							id="lastname"
							placeholder="Durden"
							type="text"
						/>
					</LabelInputContainer>
				</div>
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
				<LabelInputContainer className="mb-4">
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						required
						id="confirmPassword"
						placeholder="••••••••"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</LabelInputContainer>

				<button
					className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
					type="submit">
					{loading ? (
						<LoaderCircle className="animate-spin mx-auto" />
					) : (
						<p>Sign Up &rarr;</p>
					)}

					<BottomGradient />
				</button>
				<p className="text-center mt-4">
					Already have an account?{" "}
					<Link href="/login" className="text-blue-500 hover:text-blue-600">
						Login
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
