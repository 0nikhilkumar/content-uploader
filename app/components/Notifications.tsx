"use client";

import React, { createContext, useContext, useState } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface INotifcaion {
	message: string;
	type: NotificationType;
	id: number;
}

interface NotificationTypeContext {
	showNotification: (message: string, type: NotificationType) => void;
}

const NotificationsContext = createContext<NotificationTypeContext | undefined>(
	undefined
);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {

	const [notification, setNotification] = useState<INotifcaion | null>(null);
    
	const showNotification = (message: string, type: NotificationType) => {
		const id = Date.now();
		setNotification({ message, type, id });
		setTimeout(() => {
			setNotification((current) => (current?.id === id ? null : current));
		}, 3000);
	};
	return (
		<NotificationsContext.Provider value={{ showNotification }}>
			{children}
			{notification && (
				<div className="toast toast-bottom toast-end z-[100] text-center">
					<div className={`alert ${getAlertClass(notification.type)}`}>
						<span>{notification.message}</span>
					</div>
				</div>
			)}
		</NotificationsContext.Provider>
	);
}

function getAlertClass(type: NotificationType) {
	switch (type) {
		case "success":
			return "alert-success";
		case "error":
			return "alert-error";
		case "warning":
			return "alert-warning";
		case "info":
			return "alert-info";
		default:
			return "alert-info";
	}
}

export function useNotification() {
	const context = useContext(NotificationsContext);
	if (context === undefined) {
		throw new Error(
			"use Notification must be used within a NotificationProvider"
		);
	}
	return context;
}
