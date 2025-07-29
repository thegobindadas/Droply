"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import BottomGradient from "./BottomGradient";
import Link from "next/link";
import { UserSignUpData } from "@/types";


interface SignUpFormProps {
    handleSignUpWithEmail: (formData: UserSignUpData) => void;
    isLoading?: boolean;
    signupError: string;
}



function SignUpForm({handleSignUpWithEmail, isLoading, signupError}: SignUpFormProps) {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [formData, setFormData] = useState<UserSignUpData>({
        firstName: "",
        lastName: "",
        emailAddress: "",
        password: "",
    })


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        try {

            handleSignUpWithEmail(formData);
            console.log("Form submitted:", formData);
        } catch (err: any) {
            setError(err.message);
        }
    };



    return (
        <div className="w-full max-w-lg">
            {/* Main Signup Card with Fixed Height */}
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
                <div className="text-center mb-8">
                    
                    {/* Signup Section Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            <span className="text-white font-bold drop-shadow-lg">
                                Create your account
                            </span>
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            Unlock powerful tools for media processing and collaboration
                        </p>
                    </div>  
                    
                    {/* Fixed Height Error Container */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        (signupError || error)
                            ? "max-h-20 opacity-100 mb-4 transform translate-y-0" 
                            : "max-h-0 opacity-0 mb-0 transform -translate-y-2"
                    }`}>
                        <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/50 backdrop-blur-sm">
                            <p className="text-red-400 text-sm font-medium">{signupError || error}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Name Fields Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                                className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="emailAddress" className="block text-sm font-medium text-white mb-2">
                            Email Address
                        </label>
                        <input
                            id="emailAddress"
                            name="emailAddress"
                            type="email"
                            value={formData.emailAddress}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Create a password"
                                className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Clerk Captcha */}
                    <div id="clerk-captcha" className="hidden"></div>

                    {/* Sign Up Button */}
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className="relative group w-full h-12 overflow-hidden rounded-lg font-medium text-white bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 border border-gray-600/30 hover:border-gray-500/40 shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-800/40 transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98] transform-gpu cursor-pointer"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Account...
                            </span>
                            ) : (
                            "Create Account"
                        )}
                        <BottomGradient />
                    </button>
                </div>
            </div>

            {/* Login Prompt */}
            <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link href={"/sign-in"} className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium focus:outline-none focus:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}



export default SignUpForm