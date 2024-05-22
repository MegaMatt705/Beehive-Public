import Footerbar from '../components/Footerbar';
import Navbar from '../components/Navbar';
import './PostCreate.css';
import { useState } from 'react';
import { posts } from "../components/PostData";
import { Link } from 'react-router-dom';
import React from 'react';

export default function PostCreate() {

  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = React.createRef();

  // const updatePosts = (imagePath) => {
  //   posts.push({
  //     id: posts.length + 1,
  //     imageUrl: imagePath,
  //   });
  // };

  const handleImageUpload = async () => {
    if (!selectedImages) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImages[0]);

    try {
      const response = await fetch('http://localhost:3001/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data.message);

        // updatePosts(data.imagePath);

        setSelectedImages([]); // clear the selected images
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to upload image. Server response: ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setSelectedImages([selectedImage]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.target.reset();
    setSelectedImages([]);
  };

  return (
    <>
      <Navbar />
      <div className="post-create">
        <form onSubmit={handleSubmit}>
          <div className="image-form">
            <label className="postCreation-title">Images</label>
            <input type="file" required="required" multiple="multiple" ref={fileInputRef} onChange={handleImageChange}/>
            <div className="uploadImage">
              <Link to="/Profile">
                <button className="postBtn" type="button" onClick={handleImageUpload}>
                  Upload images
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
      <Footerbar />
    </>
  );
}
