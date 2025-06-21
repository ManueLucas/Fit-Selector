import { useState } from "react";
import "./index.css";

import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/clerk-react";

import ProtectedContent from "./ProtectedContent";

function App() {
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
            </header>
            <h1 id="h1-name">Fit Selector</h1>
            <h2 id="h2-slogan">your fit. your way.</h2>

            <h1 id="h1-question">
                What kind of fit do you want to wear today?
            </h1>
            <div id="div-input">
                <input
                    type="text"
                    placeholder="e.g. I want to look like Chris Hemsworth!"
                    name=""
                    id="input-fit"
                />
            </div>
            <div id="div-all-inputs">


                {/* <input class="option" type="file" id="input-file" /> */}

                <label for="input-file" class="custom-file-label">Choose File</label>
                <input type="file" id="input-file" class="hidden-file-input" />

                <button class="option" id="button-reset">Reset Preferences</button>
                <button class="option" id="button-generate">Generate Fit</button>
                <button class="option" id="button-random">I'm Feeling Adventurous</button>
            </div>
        </>
    );
}

export default App;

// <Header />

// <main>
//   <Options />
// </main>
