"use client";

import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "~/shared/lib/auth-client";

export default function SignUpPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const result = await signUp.email({
				email,
				password,
				name,
			});

			if (result.error) {
				setError(result.error.message ?? "Failed to sign up");
			} else {
				router.push("/");
				router.refresh();
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md p-6">
				<h1 className="mb-6 text-2xl font-bold">Sign Up</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							autoComplete="name"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="email"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete="new-password"
							minLength={8}
						/>
					</div>
					{error && <div className="text-sm text-red-600">{error}</div>}
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Creating account..." : "Sign Up"}
					</Button>
				</form>
				<p className="mt-4 text-center text-sm text-gray-600">
					Already have an account?{" "}
					<a href="/auth/signin" className="text-blue-600 hover:underline">
						Sign in
					</a>
				</p>
			</Card>
		</div>
	);
}
