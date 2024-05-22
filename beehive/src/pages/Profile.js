import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footerbar from "../components/Footerbar";
import { Link } from "react-router-dom";
import * as AIcons from "react-icons/ai";
import { FaArrowUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import "./Profile.css";

function Profile() {
  const [usernameData, setUsernameData] = useState({});
  const [userId, setUserId] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [newBio, setNewBio] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [friendCount, setFriendCount] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showSideContainer, setShowSideContainer] = useState(false);

  const toggleSideContainer = () => {
    setShowSideContainer(!showSideContainer);
  };

  const closeSideContainer = () => {
    setShowSideContainer(false);
  };

  const fetchUsername = async (signal) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/auth/profile",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setUsernameData(data);
      } else {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch user information. Server response: ${errorText}`
        );
      }
    } catch (error) {
      throw error;
    }
  };

  // Fetch Users Function
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/friends/list-users",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserList(data);
        setShowModal(true);
      } else {
        console.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add Friend Function
  const addFriend = async (friendId) => {
    const isAlreadyFriend = friendsList.some(friend => friend.userId === friendId);
    if (isAlreadyFriend) {
      alert("That user is already your friend!");
      return;
    }
    try {
      setIsAddingFriend(true);
      const response = await fetch(
        "http://localhost:3001/api/v1/friends/add-friend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendId }),
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("Friend request sent successfully!");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to add friend.";
        console.error("Server responded with error:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      alert("An error occurred while trying to add friend.");
    } finally {
      setIsAddingFriend(false);
    }
  };

  const fetchFriendsList = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/friends/friends-list",
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch friends list.");
      }

      const friends = await response.json();
      setFriendsList(friends);
    } catch (error) {
      console.error("Error fetching friends list:", error);
      alert("An error occurred while trying to fetch the friends list.");
    }
  };

  // Fetch the friend count
  const fetchFriendCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/friends/count",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFriendCount(data.count);
      } else {
        console.error("Failed to fetch friend count.");
      }
    } catch (error) {
      console.error("Error fetching friend count:", error);
    }
  };

  // const renderUserList = () => {
  //   return (
  //     <ul>
  //       {userList.map((user) => {
  //         const isAlreadyFriend = friendsList.some(friend => friend.userId === user._id);
  //         if (isAlreadyFriend) return null; // Skip rendering if already a friend
  
  //         return (
  //           <li key={user._id}>
  //             {user.username}
  //             <button onClick={() => addFriend(user._id)} disabled={isAddingFriend}>
  //               {isAddingFriend ? "Adding..." : "+"}
  //             </button>
  //           </li>
  //         );
  //       })}
  //     </ul>
  //   );
  // };

  const renderFriendsList = () => {
    if (friendsList.length === 0) return null;
    return (
      <div className="modal-backdrop">
        <div className="friend-list-modal">
          <h2>My Friends</h2>
          <ul>
            {friendsList.map((friend) => (
              <li key={friend.userId}>
                {friend.username}
                <button
                  onClick={() => deleteFriend(friend.userId)}
                  className="friend-action-btn friend-delete-btn"
                >
                  Delete Friend
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => setFriendsList([])} className="close-btn">
            Close
          </button>
        </div>
      </div>
    );
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/friends/requests",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to fetch friend requests. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      alert("An error occurred while trying to fetch friend requests.");
    }
  };

  const handleAccept = async (friendshipId) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/friends/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendshipId }),
          credentials: "include",
        }
      );
      if (response.ok) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== friendshipId)
        );
        alert("Friend request accepted!");
        fetchFriendCount();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to accept friend request.");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("An error occurred while trying to accept the friend request.");
    }
  };

  const handleReject = async (friendshipId) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/friends/reject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendshipId }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== friendshipId)
        );
        alert("Friend request rejected.");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to reject friend request.");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      alert("An error occurred while trying to reject the friend request.");
    }
  };

  const deleteFriend = async (friendId) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/friends/delete-friend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendId }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete friend.");
      }

      setFriendsList(
        friendsList.filter((friend) => friend.userId !== friendId)
      );
    } catch (error) {
      console.error("Error deleting friend:", error);
      alert("An error occurred while trying to delete the friend.");
    }
  };

  const fetchUserId = async (signal) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/auth/id",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        return data; 
      } else {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch user information. Server response: ${errorText}`
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchImages = async () => {
    try {
      console.log("Fetching images...");
      const userId = await fetchUserId();
      console.log("User ID:", userId);

      await checkGfsStatus();
      const response = await fetch(`http://localhost:3001/user-images/${userId}`);
      const data = await response.json();
      const images = data.images.map((image) => {
        const base64Image = `data:${image.contentType};base64,${image.data}`;
        return base64Image;
      });
      setImageUrls(images);
    } catch (error) {
      console.error('Error fetching image data:', error.message);
    }
  };
  
  function checkGfsStatus() {
    return new Promise((resolve, reject) => {
      fetch("http://localhost:3001/gfs-status")
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "ready") {
            resolve();
          } else {
            setTimeout(
              () => checkGfsStatus().then(resolve).catch(reject),
              1000
            ); // check again after 1 second
          }
        })
        .catch(reject);
    });
  }

  const fetchBio = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/bio', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setNewBio(data.bio);
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to fetch bio. Server response: ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching bio:', error.message);
    }
  };

  const fetchProfilePicture = async () => {
  try {
    console.log('Fetching profile picture...');
    const response = await fetch('http://localhost:3001/api/v1/auth/profilePicture', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'image/jpeg', 
      },
    });

    if (response.status === 200) {
    
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setProfilePicture(base64data);
        console.log('Profile picture fetched successfully!');
      };
      reader.readAsDataURL(blob);
    } else {
      const errorText = await response.text();
      throw new Error(`Failed to fetch profile picture. Server response: ${errorText}`);
    }
  } catch (error) {
    console.error('Error fetching profile picture:', error.message);
  }
};

  useEffect(() => {
  const controller = new AbortController();
  fetchFriendCount();
  fetchFriendRequests();
  fetchUsername(controller.signal)
    .then(() => {
      if (controller.signal.aborted) {
        console.log('Fetch Cancelled');
      } else {
        fetchBio();
        fetchImages();
        fetchProfilePicture();
      }
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        console.log('Fetch Cancelled');
      } else {
        console.error('Error fetching user information: ', error.message);
      }
    });
  return () => {
    controller.abort();
  };
}, []);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    // Handle image upload and update the 'image' state
    // You can use the FormData approach to send the image to the server
  };

  return (
    <>
      <Navbar />

<div class="container1">

<div class="profile">

  <div class="profile-image">
    <button
          className="toggle-side-container-btn"
          onClick={toggleSideContainer}
        >
         Friends
        </button>

        <div className={`side-container ${showSideContainer ? "show" : ""}`}>
          {/* Content of the side container */}
          <button className="close-side-container-btn" onClick={closeSideContainer}>
          <IoMdClose />
            </button>
          <h3>Friends</h3>
          <button className="profile-add-friend-btn" onClick={fetchUsers}>
        Add Friend
      </button>
      {showModal && (
        <div className="modal-backdrop">
          <div className="user-list-modal">
            <ul>
              {userList.map((user) => (
                <li key={user._id}>
                  {user.username}
                  <button className="user-list-btn-add"
                    onClick={() => addFriend(user._id)}
                    disabled={isAddingFriend}
                  >
                    {isAddingFriend ? "Adding..." : "+"}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <div>
        <button className="view-friends-btn" onClick={fetchFriendsList}>
          View Friends
        </button>
        {renderFriendsList()}
      </div>

      <div className="friend-requests">
        {friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <div key={request.id} className="friend-request-item">
              <p>{request.username}</p>
              <div>
                <button
                  onClick={() => handleAccept(request.id)}
                  className="request-action-btn request-accept-btn"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="request-action-btn request-reject-btn"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="friend-req">No friend requests.</p>
        )}
      </div>
          {/* Add any additional content you want to display in the side container */}
        </div>




  <img src={profilePicture || require("../images/def.jpg")} alt="User Avatar" />

  </div>

          <div class="profile-user-settings">
            <h1 class="profile-user-name">{usernameData.username}</h1>
            <Link to="/EditProfile">
              <button class="profile-edit-btn">Edit Profile</button>
            </Link>
          </div>

          <div class="profile-stats">
            <ul>
              <li>
                <span class="profile-stat-count">{imageUrls.length}</span> posts
              </li>
              <li onClick={fetchFriendsList}>
                <span class="profile-stat-count">{friendCount}</span> friends
                {renderFriendsList()}
              </li>
            </ul>
          </div>

          <div class="profile-bio">
                          
                          <p>{newBio}</p>
                        </div>
                      
                      </div>

        <div class="grid-container">
          {imageUrls.map((imageUrl, index) => {
            return (
              <div className="grid-images" key={index}>
                <img
                  className="grid-image"
                  src={imageUrl}
                  alt={`Image ${index}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Profile;
