import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "../ui/sonner";

interface ProvidersProps {
	children: ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			enableSystem
		>
			{children}

			<Toaster />
		</ThemeProvider>
	);
}
