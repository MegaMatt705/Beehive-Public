import React from 'react'
import Navbar from '../components/Navbar';
import { Link, useNavigate  } from 'react-router-dom'
import { useState } from 'react';

export default function EditProfile() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [newBio, setNewBio] = useState(''); 
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate(); 

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setSelectedImage(selectedImage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    updateProfilePicture();
    navigate('/Profile');
  };

  const updateBio = async () => {
    try {
      if (newBio.trim() !== '') {
      const response = await fetch('http://localhost:3001/api/v1/auth/update-bio', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newBio }), 
      });

      if (response.status === 200) {
        console.log('Bio updated successfully');
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to update bio. Server response: ${errorText}`);
      }
    }
    else {
        console.log('No bio changes to update');
      }
    } catch (error) {
      console.error('Error updating bio:', error.message);
    }
  };

  const updateProfilePicture = async () => {
    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append('newProfilePicture', selectedImage);
  
        const imageResponse = await fetch('http://localhost:3001/api/v1/auth/update-profile-picture', {
          method: 'POST',
          credentials: 'include',
          body: formData,  
        });
  
      
        if (imageResponse.ok) {
         
          const data = await imageResponse.json();
          setProfilePicture(`data:${data.contentType};base64,${data.image}`);
          console.log('Profile picture updated successfully');
        } else {
          const errorText = await imageResponse.text();
          throw new Error(`Failed to update profile picture. Server response: ${errorText}`);
        }
      } else {
        console.log('No profile picture selected');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error.message);
    }
  };


  return (
    <div>
       <Navbar />

       <div className="post-create">
       <form onSubmit={handleSubmit} onClick={updateBio}> 
          <div className="image-form">
            Change profile picture here
            <div className="user-profile-img">
            <input className='file-input'
              type="file"
              accept="image/*"
              onChange={handleImageChange}/>
            </div> 
            Update bio 
            <div className="user-bio">
            <input type="text-area" 
             placeholder="Update your bio"
             value={newBio}
             onChange={(e) => setNewBio(e.target.value)}/>
            </div>

            <div className="uploadImage">
           
              <button className="postBtn" type="submit">
                Update Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
