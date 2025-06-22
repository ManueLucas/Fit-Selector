import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import "./OutfitViewer.css";

function OutfitViewer({ 
  shirtId, 
  pantsId, 
  shoesId, 
  jacketId, 
  accessoriesId,
  // New props for direct base64 images
  shirtImage,
  pantsImage,
  shoesImage,
  jacketImage,
  accessoriesImage,
  isVisible, 
  onClose 
}) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [images, setImages] = useState({
    shirt: null,
    pants: null,
    shoes: null,
    jacket: null,
    accessories: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImage = async (imageId, imageType) => {
    if (!imageId || !isSignedIn || !isLoaded) return null;

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not available");

      const response = await fetch(
        `http://localhost:8000/image/${imageId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${imageType} image`);
      }

      // const imageBase64 = await response.text();
      const imageBase64 = await response.json();
      console.log("test")
      console.log(imageBase64)
      return imageBase64;
    } catch (err) {
      console.error(`Error fetching ${imageType} image:`, err);
      throw err;
    }
  };

  const fetchAllImages = async () => {
    if (!isSignedIn || !isLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const imagePromises = [];
      const imageTypes = [];

      if (shirtId) {
        imagePromises.push(fetchImage(shirtId, "shirt"));
        imageTypes.push("shirt");
      }
      if (pantsId) {
        imagePromises.push(fetchImage(pantsId, "pants"));
        imageTypes.push("pants");
      }
      if (shoesId) {
        imagePromises.push(fetchImage(shoesId, "shoes"));
        imageTypes.push("shoes");
      }
      if (jacketId) {
        imagePromises.push(fetchImage(jacketId, "jacket"));
        imageTypes.push("jacket");
      }
      if (accessoriesId) {
        imagePromises.push(fetchImage(accessoriesId, "accessories"));
        imageTypes.push("accessories");
      }

      const results = await Promise.allSettled(imagePromises);
      const newImages = { ...images };

      results.forEach((result, index) => {
        const imageType = imageTypes[index];
        if (result.status === "fulfilled" && result.value) {
          newImages[imageType] = result.value;
        }
      });

      setImages(newImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If base64 images are provided directly, use them
    if (shirtImage || pantsImage || shoesImage || jacketImage || accessoriesImage) {
      setImages({
        shirt: shirtImage || null,
        pants: pantsImage || null,
        shoes: shoesImage || null,
        jacket: jacketImage || null,
        accessories: accessoriesImage || null,
      });
      console.log(shoesImage)
      return;
    }

    // Otherwise, fetch images using IDs
    if (isVisible && isSignedIn && isLoaded) {
      fetchAllImages();
    }
  }, [
    isVisible, isSignedIn, isLoaded, 
    shirtId, pantsId, shoesId, jacketId, accessoriesId,
    shirtImage, pantsImage, shoesImage, jacketImage, accessoriesImage
  ]);

  if (!isVisible) return null;

  if (!isLoaded || loading) {
    return (
      <div className="popup-overlay">
        <div className="popup outfit-viewer">
          <div>Loading outfit...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup outfit-viewer">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        
        <h3>Your Outfit</h3>
        
        {error && <p className="error-message">Error: {error}</p>}
        
        <div className="outfit-grid">
          {/* Shirt - Top */}
          <div className="outfit-item shirt-position">
            {images.shirt ? (
              <img
                src={`data:image/png;base64,${images.shirt}`}
                alt="Shirt"
                className="outfit-image"
              />
            ) : (
              <div className="placeholder">No Shirt</div>
            )}
            <span className="item-label">Shirt</span>
          </div>

          {/* Jacket - Left */}
          <div className="outfit-item jacket-position">
            {images.jacket ? (
              <img
                src={`data:image/png;base64,${images.jacket}`}
                alt="Jacket"
                className="outfit-image"
              />
            ) : (
              <div className="placeholder">No Jacket</div>
            )}
            <span className="item-label">Jacket</span>
          </div>

          {/* Pants - Center */}
          <div className="outfit-item pants-position">
            {images.pants ? (
              <img
                src={`data:image/png;base64,${images.pants}`}
                alt="Pants"
                className="outfit-image"
              />
            ) : (
              <div className="placeholder">No Pants</div>
            )}
            <span className="item-label">Pants</span>
          </div>

          {/* Accessories - Right */}
          <div className="outfit-item accessories-position">
            {images.accessories ? (
              <img
                src={`data:image/png;base64,${images.accessories}`}
                alt="Accessories"
                className="outfit-image"
              />
            ) : (
              <div className="placeholder">No Accessories</div>
            )}
            <span className="item-label">Accessories</span>
          </div>

          {/* Shoes - Bottom */}
          <div className="outfit-item shoes-position">
            {images.shoes ? (
              <img
                src={`data:image/png;base64,${images.shoes}`}
                alt="Shoes"
                className="outfit-image"
              />
            ) : (
              <div className="placeholder">No Shoes</div>
            )}
            <span className="item-label">Shoes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutfitViewer;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "@clerk/clerk-react";
// import "./outfitviewer.css"; // We'll need some CSS for the layout

// function OutfitViewer({ 
//   shirtId, 
//   pantsId, 
//   shoesId, 
//   jacketId, 
//   accessoriesId, 
//   isVisible, 
//   onClose 
// }) {
//   const { isLoaded, isSignedIn, getToken } = useAuth();
//   const [images, setImages] = useState({
//     shirt: null,
//     pants: null,
//     shoes: null,
//     jacket: null,
//     accessories: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchImage = async (imageId, imageType) => {
//     if (!imageId || !isSignedIn || !isLoaded) return null;

//     try {
//       const token = await getToken();
//       if (!token) throw new Error("Authentication token not available");

//       const response = await fetch(
//         `http://localhost:8000/image/${imageId}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch ${imageType} image`);
//       }

//       const imageBase64 = await response.text();
//       return imageBase64;
//     } catch (err) {
//       console.error(`Error fetching ${imageType} image:`, err);
//       throw err;
//     }
//   };

//   const fetchAllImages = async () => {
//     if (!isSignedIn || !isLoaded) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const imagePromises = [];
//       const imageTypes = [];

//       if (shirtId) {
//         imagePromises.push(fetchImage(shirtId, "shirt"));
//         imageTypes.push("shirt");
//       }
//       if (pantsId) {
//         imagePromises.push(fetchImage(pantsId, "pants"));
//         imageTypes.push("pants");
//       }
//       if (shoesId) {
//         imagePromises.push(fetchImage(shoesId, "shoes"));
//         imageTypes.push("shoes");
//       }
//       if (jacketId) {
//         imagePromises.push(fetchImage(jacketId, "jacket"));
//         imageTypes.push("jacket");
//       }
//       if (accessoriesId) {
//         imagePromises.push(fetchImage(accessoriesId, "accessories"));
//         imageTypes.push("accessories");
//       }

//       const results = await Promise.allSettled(imagePromises);
//       const newImages = { ...images };

//       results.forEach((result, index) => {
//         const imageType = imageTypes[index];
//         if (result.status === "fulfilled" && result.value) {
//           newImages[imageType] = result.value;
//         }
//       });

//       setImages(newImages);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isVisible && isSignedIn && isLoaded) {
//       fetchAllImages();
//     }
//   }, [isVisible, isSignedIn, isLoaded, shirtId, pantsId, shoesId, jacketId, accessoriesId]);

//   if (!isVisible) return null;

//   if (!isLoaded || loading) {
//     return (
//       <div className="popup-overlay">
//         <div className="popup outfit-viewer">
//           <div>Loading outfit...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="popup-overlay">
//       <div className="popup outfit-viewer">
//         <button className="close-button" onClick={onClose}>
//           ×
//         </button>
        
//         <h3>Your Outfit</h3>
        
//         {error && <p className="error-message">Error: {error}</p>}
        
//         <div className="outfit-grid">
//           {/* Shirt - Top */}
//           <div className="outfit-item shirt-position">
//             {images.shirt ? (
//               <img
//                 src={`data:image/png;base64,${images.shirt}`}
//                 alt="Shirt"
//                 className="outfit-image"
//               />
//             ) : (
//               <div className="placeholder">No Shirt</div>
//             )}
//             <span className="item-label">Shirt</span>
//           </div>

//           {/* Jacket - Left */}
//           <div className="outfit-item jacket-position">
//             {images.jacket ? (
//               <img
//                 src={`data:image/png;base64,${images.jacket}`}
//                 alt="Jacket"
//                 className="outfit-image"
//               />
//             ) : (
//               <div className="placeholder">No Jacket</div>
//             )}
//             <span className="item-label">Jacket</span>
//           </div>

//           {/* Pants - Center */}
//           <div className="outfit-item pants-position">
//             {images.pants ? (
//               <img
//                 src={`data:image/png;base64,${images.pants}`}
//                 alt="Pants"
//                 className="outfit-image"
//               />
//             ) : (
//               <div className="placeholder">No Pants</div>
//             )}
//             <span className="item-label">Pants</span>
//           </div>

//           {/* Accessories - Right */}
//           <div className="outfit-item accessories-position">
//             {images.accessories ? (
//               <img
//                 src={`data:image/png;base64,${images.accessories}`}
//                 alt="Accessories"
//                 className="outfit-image"
//               />
//             ) : (
//               <div className="placeholder">No Accessories</div>
//             )}
//             <span className="item-label">Accessories</span>
//           </div>

//           {/* Shoes - Bottom */}
//           <div className="outfit-item shoes-position">
//             {images.shoes ? (
//               <img
//                 src={`data:image/png;base64,${images.shoes}`}
//                 alt="Shoes"
//                 className="outfit-image"
//               />
//             ) : (
//               <div className="placeholder">No Shoes</div>
//             )}
//             <span className="item-label">Shoes</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OutfitViewer;