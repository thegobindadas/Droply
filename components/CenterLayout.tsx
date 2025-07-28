"use client"

import React from "react";

export default function CenterLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-lg">{children}</div>
        </div>
    )
}