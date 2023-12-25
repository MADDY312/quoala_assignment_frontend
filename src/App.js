// import './App.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import ImageUploader from './Components/sender';

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/products" element={<ImageUploader />} />
//       </Routes>
//     </Router>
//   );
// }
import './App.css';
import React, { useState, useEffect } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [userDataList, setUserDataList] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    // Make an API call to retrieve the list of previously uploaded data
    fetch('http://localhost:5000/alluser')
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the retrieved data
        setUserDataList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []); // Empty dependency array to ensure the effect runs only once on component mount

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (image) {
      // Send the image to the Flask backend
      fetch('http://localhost:5000/get_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: image.toString('base64') }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the backend
          console.log(data);
          // Update the list of uploaded data after successful upload
          setUploadedImages([...uploadedImages, data]);
          // Set the API response to be displayed on the screen
          setApiResponse(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div>
      <div>
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleUpload}>Upload Image</button>
      </div>
      
      <div>
        <h2>Previously Uploaded Data</h2>
        {userDataList.map((userData) => (
          <div key={userData.id}>
            <div>
              <strong>ID:</strong> {userData.id}
            </div>
            <div>
              <strong>Name:</strong> {userData.first_name} {userData.last_name}
            </div>
            <div>
              <strong>Date of Birth:</strong> {userData.date_of_birth}
            </div>
            <div>
              <strong>Date of Expiry:</strong> {userData.date_of_expiry}
            </div>
            <div>
              <strong>Date of Issue:</strong> {userData.date_of_issue}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2>API Response</h2>
        {apiResponse && (
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

