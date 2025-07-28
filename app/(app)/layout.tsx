"use client";

import React, { useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import { UserProfile } from "@/types";



export default function AppLayout({ children }: { children: React.ReactNode }) {

    const { isSignedIn, user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const [userData, setUserData] = useState<UserProfile>({
        name: "",
        firstName: "",
        lastName: "",
        emailAddress: "",
        avatar: "",
    });


    const handleLogout = async () => {
        await signOut({ redirectUrl: "/sign-in" });
    };


    useEffect(() => {
        if (user) {
            setUserData({
                name: user.fullName || `${user.firstName} ${user.lastName}` || "User",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                emailAddress: user?.primaryEmailAddress?.emailAddress || "",
                avatar: user.imageUrl || "https://unsplash.com/photos/a-yellow-sign-with-a-smiley-face-on-it-P4RcBNbRl60",
            })
        }
    }, [user, isLoaded, isSignedIn]);
    

    if (!isLoaded) {
        return <div>Loading...</div>;
    }



    return (
        <div className="bg-black min-h-screen flex flex-col">
            <Header
                user={userData}
                onLogout={handleLogout}
            />

            <div className="flex-1 overflow-auto">
                <div className="p-8 max-w-6xl mx-auto h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}