import { useState } from 'react';
import { useAuth } from "@clerk/clerk-react";
import Selector from './selector';
import OutfitViewer from './OutfitViewer';

export default function Options({
    handleFileChange,
    showPopup,
    inputtedImage,
    handleCategorySelect,
    activeMode,
    onModeChange,
}) {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const [showRandomOutfit, setShowRandomOutfit] = useState(false);
    const [randomOutfitImages, setRandomOutfitImages] = useState({
        shirt: null,
        pants: null,
        shoes: null,
        jacket: null,
        accessories: null,
    });
    const [loadingRandomOutfit, setLoadingRandomOutfit] = useState(false);

    const fetchRandomItem = async (productType) => {
        if (!isSignedIn || !isLoaded) return null;

        try {
            const token = await getToken();
            if (!token) throw new Error("Authentication token not available");

            const response = await fetch(
                `http://localhost:8000/api/random_outfit/${productType}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                // If no items found for this category, return null
                if (response.status === 404) return null;
                throw new Error(`Failed to fetch random ${productType}`);
            }

            const imageBase64 = await response.json();
            return imageBase64;
        } catch (err) {
            console.error(`Error fetching random ${productType}:`, err);
            return null;
        }
    };

    const handleRandomize = async () => {
        console.log('Dice button clicked!');
        
        if (!isSignedIn || !isLoaded) {
            console.log("User not signed in");
            return;
        }

        setLoadingRandomOutfit(true);
        
        try {
            // Fetch random items for each category
            const [shirt, pants, shoes, jacket, accessories] = await Promise.all([
                fetchRandomItem("Shirt"),
                fetchRandomItem("Bottom"), // Assuming "Bottom" is used for pants
                fetchRandomItem("Shoes"),
                fetchRandomItem("Jacket"),
                fetchRandomItem("Accessory"), // Assuming "Accessory" is used
            ]);

            setRandomOutfitImages({
                shirt,
                pants,
                shoes,
                jacket,
                accessories,
            });

            setShowRandomOutfit(true);
        } catch (err) {
            console.error("Error generating random outfit:", err);
        } finally {
            setLoadingRandomOutfit(false);
        }
    };

    return (
        <>
            <div id="div-all-inputs">
                <label
                    htmlFor="input-file"
                    className="custom-file-label option"
                >
                    Add Image
                </label>
                <input
                    type="file"
                    id="input-file"
                    className="hidden-file-input"
                    onChange={handleFileChange}
                />

                <Selector
                    activeMode={activeMode}
                    onModeChange={onModeChange}
                    onRandomize={handleRandomize}
                    loading={loadingRandomOutfit}
                />
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>Is this clothe image a:</p>
                        <div className="popup-buttons">
                            <button
                                onClick={() => handleCategorySelect("Shirt")}
                            >
                                Shirt
                            </button>
                            <button
                                onClick={() => handleCategorySelect("Pants")}
                            >
                                Pants
                            </button>
                            <button
                                onClick={() => handleCategorySelect("Jacket")}
                            >
                                Jacket
                            </button>
                            <button
                                onClick={() =>
                                    handleCategorySelect("Accessory")
                                }
                            >
                                Accessory
                            </button>
                            <button
                                onClick={() => handleCategorySelect("Shoes")}
                            >
                                Shoes
                            </button>
                        </div>
                        {inputtedImage && (
                            <img
                                src={inputtedImage}
                                alt="Uploaded Image Preview"
                                className="popup-preview-image"
                            />
                        )}
                    </div>
                </div>
            )}

            <OutfitViewer
                shirtImage={randomOutfitImages.shirt}
                pantsImage={randomOutfitImages.pants}
                shoesImage={randomOutfitImages.shoes}
                jacketImage={randomOutfitImages.jacket}
                accessoriesImage={randomOutfitImages.accessories}
                isVisible={showRandomOutfit}
                onClose={() => setShowRandomOutfit(false)}
            />
        </>
    );
}

// import Selector from './selector';

// export default function Options({
//     handleFileChange,
//     showPopup,
//     inputtedImage,
//     handleCategorySelect,
//     activeMode,
//     onModeChange,
// }) {

//     // const handleModeChange = (mode) => {
//     //     console.log('Mode changed to:', mode);
//     //     // Handle the mode change logic here
//     // };

//     const handleRandomize = () => {
//         console.log('Dice button clicked!');
//         // Handle the randomize action here
//     };
//     return (
//         <>
//             <div id="div-all-inputs">
//                 <label
//                     htmlFor="input-file"
//                     className="custom-file-label option"
//                 >
//                     Add Image
//                 </label>
//                 <input
//                     type="file"
//                     id="input-file"
//                     className="hidden-file-input"
//                     onChange={handleFileChange}
//                 />

//                 <Selector
//                     activeMode={activeMode}
//                     onModeChange={onModeChange}
//                     onRandomize={handleRandomize}
//                 />


//                 {/*<button className="option" id="button-generate">
//                     Generate Fit
//                 </button>
//                 <button className="option" id="button-random">
//                     I'm Feeling Adventurous
//                 </button>*/}
//             </div>

//             {showPopup && (
//                 <div className="popup-overlay">
//                     <div className="popup">
//                         <p>Is this clothe image a:</p>
//                         <div className="popup-buttons">
//                             <button
//                                 onClick={() => handleCategorySelect("Shirt")}
//                             >
//                                 Shirt
//                             </button>
//                             <button
//                                 onClick={() => handleCategorySelect("Trouser")}
//                             >
//                                 Trouser
//                             </button>
//                             <button
//                                 onClick={() => handleCategorySelect("Jacket")}
//                             >
//                                 Jacket
//                             </button>
//                             <button
//                                 onClick={() =>
//                                     handleCategorySelect("Accessory")
//                                 }
//                             >
//                                 Accessory
//                             </button>
//                             <button
//                                 onClick={() => handleCategorySelect("Shoes")}
//                             >
//                                 Shoes
//                             </button>
//                         </div>
//                         {inputtedImage && (
//                             <img
//                                 src={inputtedImage}
//                                 alt="Uploaded Image Preview"
//                                 className="popup-preview-image"
//                             />
//                         )}
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
