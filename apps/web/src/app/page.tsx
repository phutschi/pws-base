import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";

import { ThemeToggle } from "~/shared/components/theme-toggle";

export default function HomePage() {
	return (
		<div className="flex min-h-screen flex-col bg-linear-to-br from-background to-muted">
			{/* Header */}
			<header className="border-b border-border bg-card/80 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600" />
							<span className="text-xl font-semibold text-foreground">
								pws base
							</span>
						</div>
						<nav className="flex items-center gap-4">
							<div className="hidden items-center gap-8 md:flex">
								<Button variant="ghost" size="sm" asChild>
									<a href="#features">Features</a>
								</Button>
								<Button variant="ghost" size="sm" asChild>
									<a href="#docs">Docs</a>
								</Button>
								<Button variant="ghost" size="sm" asChild>
									<a href="#about">About</a>
								</Button>
							</div>
							<ThemeToggle />
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<main className="mx-auto flex-1 max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="py-24 text-center sm:py-32">
					<Badge variant="secondary" className="mb-4">
						New: Next.js 16 Ready
					</Badge>
					<h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
						Build faster with{" "}
						<span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							pws base
						</span>
					</h1>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
						A modern, production-ready boilerplate with Next.js, tRPC, Drizzle
						ORM, and Tailwind CSS. Everything you need to ship your next
						project.
					</p>
					<div className="mt-10 flex items-center justify-center gap-4">
						<Button
							size="lg"
							className="bg-linear-to-r from-blue-600 to-purple-600"
						>
							Get Started
						</Button>
						<Button variant="outline" size="lg">
							View on GitHub
						</Button>
					</div>
				</div>

				<Separator className="my-12" />

				{/* Features Grid */}
				<div id="features" className="pb-24">
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						<Card className="transition-all hover:shadow-md">
							<CardHeader>
								<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
									<svg
										className="h-6 w-6 text-blue-600 dark:text-blue-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>Lightning Fast</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<CardTitle className="text-xl">Lightning Fast</CardTitle>
								<CardDescription>
									Built on Next.js 15 with optimized performance out of the box.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="transition-all hover:shadow-md">
							<CardHeader>
								<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 dark:bg-purple-500/20">
									<svg
										className="h-6 w-6 text-purple-600 dark:text-purple-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>Type-Safe</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										/>
									</svg>
								</div>
								<CardTitle className="text-xl">Type-Safe</CardTitle>
								<CardDescription>
									End-to-end type safety with TypeScript and tRPC for
									bulletproof APIs.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="transition-all hover:shadow-md">
							<CardHeader>
								<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 dark:bg-green-500/20">
									<svg
										className="h-6 w-6 text-green-600 dark:text-green-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>Modern Database</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
										/>
									</svg>
								</div>
								<CardTitle className="text-xl">Modern Database</CardTitle>
								<CardDescription>
									Drizzle ORM with PostgreSQL for a powerful, flexible data
									layer.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-border bg-card">
				<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
					<p className="text-center text-sm text-muted-foreground">
						© 2025 pws base. Built with ❤️ by pw software.
					</p>
				</div>
			</footer>
		</div>
	);
}
