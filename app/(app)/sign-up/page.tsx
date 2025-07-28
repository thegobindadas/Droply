"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SignUpForm from "@/components/SignUpForm";
import VerifyForm from "@/components/VerifyForm";
import { UserSignUpData } from "@/types";



function SigninPage() {

    const router = useRouter();
    const { isLoaded, setActive, signUp } = useSignUp();

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [verifying, setVerifying] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error , setError] = useState<string>("");


    // Email validation function
    const validateEmail = (emailAddress: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailAddress);
    };


    const handleSignUpWithEmail = async (
        formData: UserSignUpData
    ) => {
        
        if (!isLoaded && !signUp) {
            return;
        }

        setIsLoading(true);
        setError("");
        
        try {

            if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.password) {
                setError("All fields are required");
                setIsLoading(false);
                return;
            }

            if (!validateEmail(formData.emailAddress)) {
                setError("Please enter a valid email address");
                setIsLoading(false);
                return;
            }

            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters long");
                setIsLoading(false);
                return;
            }


            await signUp.create({
                firstName: formData.firstName,
                lastName: formData.lastName,
                emailAddress: formData.emailAddress,
                password: formData.password,
            });
            

            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // set the email address
            setEmailAddress(signUp?.emailAddress || formData?.emailAddress);

            // change the UI to our pending section.
            setVerifying(true);

        } catch (err: any) {
            setError(err.errors[0].message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }


    const handleVerify = async (otp: string) => {

        if (!isLoaded && !signUp) return;

        setIsLoading(true);
        setError("");

        try {

            if (otp.length !== 6) {
                setError("Please enter the complete 6-digit verification code.");
                setIsLoading(false);
                return;
            }

            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: otp,
            })


            if (signUpAttempt.status !== "complete") {
                console.error(JSON.stringify(signUpAttempt, null, 2));
                setError(JSON.stringify(signUpAttempt, null, 2))
            }

            if (signUpAttempt.status === "complete") {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.push("/home")
            }

        } catch (err: any) {
            if (err.errors[0].code === "form_code_incorrect" && err.errors[0].longMessage === "Incorrect code") {
                setError("Oops! That code doesn’t match. Please re-enter the correct code.")
            } else {
                setError(err.errors[0].message || "Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }


    const handleResendCode = async () => {

        if (!isLoaded) return;

        try {

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

        } catch (err: any) {
            setError(err.errors[0].message || "Failed to resend code. Please try again.");
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            {!verifying ?
                (
                    <SignUpForm 
                        handleSignUpWithEmail={handleSignUpWithEmail}
                        isLoading={isLoading}
                        signupError={error}
                    />
                ) : (
                    <VerifyForm
                        emailAddress={emailAddress}
                        handleVerify={handleVerify}
                        isLoading={isLoading}
                        veficationError={error}
                        handleResendCode={handleResendCode}
                    />
                )
            }
        </div>
    )
}



export default SigninPage