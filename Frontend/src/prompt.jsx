export default function () {
    return (
        <>
           {/* <h1 id="h1-question">
                What kind of fit do you want to wear today?
            </h1>*/}
            <div id="div-input">
                <input
                    type="text"
                    placeholder="e.g. I want to look like Chris Hemsworth!"
                    name=""
                    id="input-fit"
                />
                <div id="generate-button-div">
                    
                    <button id="generate-button">
                        Generate
                    </button>

                </div>
            </div>
        </>
    );
}
