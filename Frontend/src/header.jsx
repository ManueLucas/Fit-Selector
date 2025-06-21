import ProtectedContent from "./ProtectedContent";
import "./index.css";

import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/clerk-react";
export default function () {
    return (
        <>
            <header>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                    <ProtectedContent />
                </SignedIn>
                <h1 id="h1-name">Fit Selector</h1>
                <h2 id="h2-slogan">your fit. your way.</h2>
            </header>
        </>
    );
}
