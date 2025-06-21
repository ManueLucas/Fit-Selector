import { useState } from "react";
import "./index.css";
import Header from "./header";
import Options from "./options";

function App() {
    return (
        <>
            <h1 id="h1-name">Fit Selector</h1>
            <h2 id="h2-slogan">your fit. your way.</h2>

            <h1 id="h1-question">
                What kind of fit do you want to wear today?
            </h1>
            <div id="div-input">
                <input type="text" placeholder="e.g. I want to look like Chris Hemsworth!" name="" id="input-fit" />
            </div>
            <div id="div-input-file">
                <input type="file" id="input-file" />
            </div>
        </>
    );
}

export default App;

// <Header />

// <main>
//   <Options />
// </main>
