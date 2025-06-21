export default function () {
    return (
        <>
            <div id="slogan">
                <h2>
                    your <u>fit</u>. your way.
                </h2>
            </div>

            <div id="div-all">
                <div id="div-add" class="div-mini">
                    <h3>
                        Got a new <u>fit</u> to add to your collection? Add it
                        now!
                    </h3>
                    <div id="add-buttons">
                        <input type="image"/>
                        <button>Add a Dress</button>
                    </div>
                </div>
                <div id="div-preferences" class="div-mini">
                    <h3>
                        Got a preferred <u>fashion</u> style? Add it below!
                    </h3>
                    <div id="pref-buttons">
                        <input
                            type="text"
                            placeholder="e.g. goth, modern"
                        />
                        <button>Submit Style Preference</button>
                    </div>
                </div>
                <div id="div-generate" class="div-mini">
                    <h3>Let's see what you got!</h3>
                    <button>Generate Outfit</button>
                </div>
            </div>
        </>
    );
}
