import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { posts } from "./PostData";
import * as AIcons from "react-icons/ai";
import * as FIcons from "react-icons/fa";
import './Post.css'; // Create a Post.css file for styling

function Post() {
  // Likes
  const initialLikes = JSON.parse(localStorage.getItem('likes')) || Array(posts.length).fill(0);
  const initialComments = JSON.parse(localStorage.getItem('comments')) || Array(posts.length).fill([]);
  const [imageUrls, setImageUrls] = useState([]);

  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState(Array(posts.length).fill(''));

  const handleLike = (postIndex) => {
    setLikes(prevLikes => {
      const newLikes = [...prevLikes];
      newLikes[postIndex] += 1;
      return newLikes;
    });
  };

  const handleCommentSubmit = (postIndex) => {
    const newComments = [...comments];
    const newCommentText = commentText[postIndex];
  
    if (!Array.isArray(newComments[postIndex])) {
      newComments[postIndex] = [];
    }
  
    if (newCommentText) {
      newComments[postIndex] = [...newComments[postIndex], newCommentText];
      setComments(newComments);
  
      // Reset the comment input for the post
      const newCommentTextArray = [...commentText];
      newCommentTextArray[postIndex] = '';
      setCommentText(newCommentTextArray);
    }
  };

  const handleCommentInputChange = (e, index) => {
    const updatedCommentText = [...commentText];
    updatedCommentText[index] = e.target.value;
    setCommentText(updatedCommentText);
  };

  function handleIconClick() {
    // need function for comments
    console.log('Icon clicked!');
  }

  const fetchImages = async () => {
    try {
      await checkGfsStatus();
      const response = await fetch('http://localhost:3001/get-image-filenames');
      const data = await response.json();
      const images = data.images.map(image => {
        const base64Image = `data:${image.contentType};base64,${image.data}`;
        return {
          userId: image.userId,
          username: image.username,
          filename: image.filename,
          data: base64Image,
          contentType: image.contentType,
        };
      });
      setImageUrls(images);
    } catch (error) {
      console.error('Error fetching image data:', error.message);
    }
  };
  function checkGfsStatus() {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3001/gfs-status')
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ready') {
            resolve();
          } else {
            setTimeout(() => checkGfsStatus().then(resolve).catch(reject), 1000);  // check again after 1 second
          }
        })
        .catch(reject);
    });
  }

  
  useEffect(() => {
    localStorage.setItem('likes', JSON.stringify(likes));
    localStorage.setItem('comments', JSON.stringify(comments));
    fetchImages();
  }, [likes, comments]);

  // Hide likes
  const[showLike,setShow1]=useState(true);

  const toggleHideLike = () => {
    setShow1(!showLike); // Toggle hide like 
  };
  // // Hide Comments
  const[showComment,setShow]=useState(true);

  const toggleHideComment = () => {
    setShow(!showComment); // Toggle hide like 
  };


  return (

    <div className="post">
      {/* Add your post content here */}

      {imageUrls.slice().reverse().map((imageUrl, index) => {
        const commentsLength = comments[index]?.length || 0;
       
        return (

          <div className="post-container" key={index}>
            <p className="username-post">{imageUrl.username}</p>
            <img className="post-image" src={imageUrl.data} />
            <p className="post-caption"></p>

            {/* Like button and like count */}
            <div className="post-like">
              <AIcons.AiOutlineHeart className="like-button" onClick={() => handleLike(index)} />
              {showLike &&<span className="like-count"> {likes[index]} {likes[index] === 1 ? 'like' : 'likes'} </span>}
              
              
              <div className="comment-count">
                {commentsLength}
                <span><FIcons.FaRegComment className="comment-icon" onClick={handleIconClick} /></span>
              </div>

              <p className="comment-section">Comments</p>

              {showComment && <div className="comment-display">
                {comments[index]?.map((comment, i) => (
                  <p key={i}>{comment}</p>
                ))}
              </div>}

              <input className="comment" placeholder="Write comment here" value={commentText[index]}
                onChange={(e) => handleCommentInputChange(e, index)} />

              
              <button className="comment-btn" type="button" onClick={() => handleCommentSubmit(index)}> Post </button>
              {/* Hide likes button */}
      <div>
      <button type='button' className="hide-likescomment-button" onClick={(toggleHideLike)}>
        {showLike===true? 'Hide Likes' : 'Show Likes'}
      </button>
      

      {/* Hide Comments Button */}  
      <button type='button' className="hide-likescomment-button" onClick={(toggleHideComment)}>
        {showComment===true? 'Hide Comments' : 'Show Comments'}
      </button>
      </div>

            </div>
      
          </div>
          
        );
      })}
        <Link to="/Post">
    <button className='createPostImg'>
      <AIcons.AiOutlinePlus/>
      </button>
    </Link>
    </div>
    
  );
}

export default Post;
