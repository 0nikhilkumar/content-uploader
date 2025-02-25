"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { HardDriveUpload, User, Menu } from "lucide-react";
import { useNotification } from "./Notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
	const { data: session } = useSession();
	const { showNotification } = useNotification();
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
			showNotification("Signed out successfully", "success");
			router.push("/login");
		} catch {
			showNotification("Failed to sign out", "error");
		}
	};

	return (
		<div className="navbar bg-base-300 sticky top-0 z-40 px-4 md:px-8">
			<div className="container mx-auto flex items-center justify-between w-full">
				{/* Left Section */}
				<div className="flex items-center gap-4">
					<button
						className="md:hidden btn btn-ghost btn-circle"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						<Menu className="w-6 h-6" />
					</button>
					<Link
						href="/"
						className="btn btn-ghost text-xl gap-2 normal-case font-bold rounded"
						prefetch={true}
						onClick={() => showNotification("Welcome to Home Page", "info")}
					>
						<HardDriveUpload className="w-5 h-5" />
						Content Uploader
					</Link>
				</div>

				{/* Desktop Menu */}
				<div className="hidden md:flex items-center gap-4">
					{session?.user.firstname && (
						<div className="hidden md:block">
							{session.user.firstname} {session.user.lastname}
						</div>
					)}
					<div className="dropdown dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle"
						>
							<User className="w-5 h-5" />
						</div>
						<ul
							tabIndex={0}
							className="dropdown-content z-[1] shadow-lg bg-base-100 rounded-box w-64 mt-4 py-2"
						>
							{session ? (
								<>
									<li className="px-4 py-1">
										<span className="text-sm opacity-70">
											{session.user?.email}
										</span>
									</li>
									<div className="divider my-1"></div>
									<li>
										<Link
											href="/profile"
											className="px-4 py-2 hover:bg-base-200 block w-full"
											onClick={() => showNotification("My Profile", "info")}
										>
											Profile
										</Link>
									</li>
									<li>
										<Link
											href="/upload"
											className="px-4 py-2 hover:bg-base-200 block w-full"
											onClick={() =>
												showNotification("Upload Content", "info")
											}
										>
											Upload Content
										</Link>
									</li>
									<li>
										<button
											onClick={handleSignOut}
											className="px-4 py-2 text-error hover:bg-base-200 w-full text-left"
										>
											Sign Out
										</button>
									</li>
								</>
							) : (
								<li>
									<Link
										href="/login"
										className="px-4 py-2 hover:bg-base-200 block w-full"
										onClick={() =>
											showNotification("Please sign in to continue", "info")
										}
									>
										Login
									</Link>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{menuOpen && (
				<div className="md:hidden absolute top-16 left-0 w-full bg-base-200 shadow-md z-50">
					<ul className="flex flex-col gap-2 py-4 px-6">
						<li>
							<Link
								href="/profile"
								className="block py-2"
								onClick={() => {
									setMenuOpen(false);
									showNotification("My Profile", "info");
								}}
							>
								Profile
							</Link>
						</li>
						<li>
							<Link
								href="/upload"
								className="block py-2"
								onClick={() => {
									setMenuOpen(false);
									showNotification("Upload Content", "info");
								}}
							>
								Upload Content
							</Link>
						</li>
						<li>
							{session ? (
								<button
									onClick={() => {
										handleSignOut();
										setMenuOpen(false);
									}}
									className="w-full text-left text-error py-2"
								>
									Sign Out
								</button>
							) : (
								<Link
									href="/login"
									className="block py-2"
									onClick={() => {
										setMenuOpen(false);
										showNotification(
											"Please sign in to continue",
											"info"
										);
									}}
								>
									Login
								</Link>
							)}
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
