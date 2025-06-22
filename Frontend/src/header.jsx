import ProtectedContent from "./ProtectedContent";
import "./index.css";
import Logo from "./logo";

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
                        <SignInButton id="signin-button"/>
                    </SignedOut>
                    <SignedIn>
                        
                        <UserButton />
                        {/*<ProtectedContent />*/}
                    </SignedIn>


                </div>
                <div id="logo-container">
                    <Logo className="main-logo" />
                    <h1 id="h1-name">Fit Selector</h1>
                </div>
                <h2 id="h2-slogan">your fit. your way.</h2>{" "}
            </header>
        </>
    );
}
