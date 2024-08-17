import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
    title: "Sign Up | ComplaintSense",
    description: "Register to use your AI tool to streamline complaint handling.",
};

export default function SignUpPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-4 top-4 md:left-8 md:top-8"
                )}
            >
                <>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                </>
            </Link>
            <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
                <div className="flex flex-col gap-2 text-center">
                    {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome to ComplaintSense
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sign up for an account
                    </p>
                </div>


                <div className="flex w-full h-full items-center justify-center">
                    <SignUp fallbackRedirectUrl="/dashboard" signInUrl="/sign-in" />
                </div>


                {/*<p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/sign-in"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Already have an account? Sign In
                    </Link>
                </p>*/}
            </div>
        </div>
    );
}
