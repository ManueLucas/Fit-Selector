import ProtectedContent from "./ProtectedContent";
import "./index.css";

import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    RedirectToSignIn
} from "@clerk/clerk-react";


export default function () {
    return (
        <>
            <header>
                <div id="login-section">
                    <SignedOut>
                        {/*<RedirectToSignIn />*/}
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        
                        <UserButton />
                        {/*<ProtectedContent />*/}
                    </SignedIn>


                </div>
                <h1 id="h1-name">Fit Selector</h1>
                <h2 id="h2-slogan">your fit. your way.</h2>{" "}
            </header>
        </>
    );
}
