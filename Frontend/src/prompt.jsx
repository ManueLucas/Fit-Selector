import { useState } from "react";
import OutfitViewer from './OutfitViewer';

export default function Prompt({ activeMode, inputValue, onInputChange }) {
    const [showOutfit, setShowOutfit] = useState(false);
    const [outfitIds, setOutfitIds] = useState({
        shirt: "123",
        pants: "456", 
        shoes: "789",
        jacket: "101",
        accessories: "112"
    });

    return (
        <>
            <div>
            <div id="div-input">
                <input
                    type="text"
                    placeholder="e.g. I want to look like Chris Hemsworth!"
                    name=""
                    id="input-fit"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                />
                {activeMode === "generate" && (
                    <div id="generate-button-div">
                        <button id="generate-button" onClick={() => setShowOutfit(true)}>Generate</button>
                    </div>
                )}
            </div>

            <OutfitViewer
                shirtId={outfitIds.shirt}
                pantsId={outfitIds.pants}
                shoesId={outfitIds.shoes}
                jacketId={outfitIds.jacket}
                accessoriesId={outfitIds.accessories}
                isVisible={showOutfit}
                onClose={() => setShowOutfit(false)}
            />

            </div>
        </>
    );
}


// export default function () {
//     return (
//         <>
//            {/* <h1 id="h1-question">
//                 What kind of fit do you want to wear today?
//             </h1>*/}
//             <div id="div-input">
//                 <input
//                     type="text"
//                     placeholder="e.g. I want to look like Chris Hemsworth!"
//                     name=""
//                     id="input-fit"
//                 />
//                 <div id="generate-button-div">
//                     <button id="generate-button">
//                         Generate
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// }
