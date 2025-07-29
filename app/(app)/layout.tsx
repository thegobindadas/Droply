"use client";

import React, { useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/types";



export default function AppLayout({ children }: { children: React.ReactNode }) {

    const { isSignedIn, user, isLoaded } = useUser();
    const { signOut } = useClerk();

    const [userData, setUserData] = useState<UserProfile>({
        name: undefined,
        firstName: undefined,
        lastName: undefined,
        emailAddress: undefined,
        avatar: undefined,
    });

    const pathname = usePathname();
  
    // Authentication pages that should be centered
    const authPages = ["/sign-in", "/sign-up", "/forgot-password"];
    
    // Determine if content should be centered
    const shouldCenter = authPages.includes(pathname);


    const handleLogout = async () => {
        await signOut({ redirectUrl: "/sign-in" });

        setUserData({
            name: undefined,
            firstName: undefined,
            lastName: undefined,
            emailAddress: undefined,
            avatar: undefined,
        })
    };


    useEffect(() => {
        if (user && isSignedIn) {
            setUserData({
                name: user?.fullName || `${user.firstName} ${user.lastName}` || "User",
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                emailAddress: user?.primaryEmailAddress?.emailAddress || "",
                avatar: user?.imageUrl || "https://unsplash.com/photos/a-yellow-sign-with-a-smiley-face-on-it-P4RcBNbRl60",
            })
        }

        console.log("User : ", user);
        console.log("Is Signed In : ", isSignedIn);
    }, [user, isLoaded, isSignedIn]);
    

    if (!isLoaded) {
        return <div>Loading...</div>;
    }



    return (
        <div className="min-h-screen bg-black">
            <Header
                user={userData}
                onLogout={handleLogout}
            />

            <main className="relative flex-1">
                {shouldCenter ? 
                    (
                        // Centered layout for auth pages
                        <div className="flex items-center justify-center min-h-screen px-4 py-8">
                            <div className="w-full max-w-md">
                                {children}
                            </div>
                        </div>
                    ) : (
                        // Full-width layout for other pages
                        <div className="w-full">
                            {children}
                        </div>
                    )
                }
            </main>
        </div>
    );
}