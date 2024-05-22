import './Settings.css'; // Create a CSS file for the Settings component
import App from '../App';
import React, { useState, useEffect } from 'react';
import Footerbar from '../components/Footerbar';
import Navbar from '../components/Navbar';
import Post from '../components/post';
import * as AIcons from "react-icons/ai";
import * as FIcons from "react-icons/fa";
import * as BIcons from "react-icons/bs";
import * as RIcons from "react-icons/ri";

function Settings() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    return storedDarkMode ? storedDarkMode === 'true' : false;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    localStorage.setItem('darkMode', String(newDarkMode));
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode'); // Apply dark mode styles to the body
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.classList.add('dark-mode'); // Apply dark mode styles to the root element
      }
    } else {
      document.body.classList.remove('dark-mode'); // Remove dark mode styles from the body
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.classList.remove('dark-mode'); // Remove dark mode styles from the root element
      }
    }
  }, [darkMode]);

  // // 1. State Management Likes
  // const [showLike, setShow1] = useState(false);

  // // 2. Click Handling Likes
  // const toggleHideLike = () => {
  //   setShow1(!showLike); // Toggle hide like 
  // };
  
  
  // // 1. State Management Comments
  // const[showComment,setShow]=useState(false);

  // // 2. Click Handling Comments
  // const toggleHideComment = () => {
  //   setShow(!showComment); // Toggle hide comment 
  // };
  

  return (
    <>
      <Navbar />
      

      <div className="new-settings">
      <form className="settings-form">
        <section>
          <header>
            <h4>Features</h4>
            <small>Adjust setting features</small>
          </header>
          
          <fieldset>
            
            <div class="fieldset-item">
              <picture>
              <BIcons.BsFillLightbulbFill/>
              </picture>
              
             
          <label>Dark Mode</label>
          <label class="switch">
  <input type='checkbox'
            checked={darkMode}
            onChange={toggleDarkMode} />
  <span class="slider round"></span>
</label>
            </div>

            {/* <div class="fieldset-item">
              <picture>
              <AIcons.AiFillHeart/>
              </picture>
                <label>Hide Likes</label>
                <label class="switch">
                <input type="checkbox"
              
              />
  <span class="slider round"></span>
</label>
              </div>

            <div class="fieldset-item">
              <picture>
              <FIcons.FaComments/>
              </picture>
                <label>Hide Comments</label>

                 

                <label class="switch">
  <input type="checkbox" 
              
              />
  <span class="slider round"></span>
</label>
              </div> */}
          </fieldset>
        </section>


<section>
          <header>
            <h4>Policy</h4>
            <small>Check out policies</small>
          </header>
          
          <fieldset>
            
            <div class="fieldset-item">
              <picture>
              <RIcons.RiFilePaper2Line/>
              </picture>
          <label>Cookie Policy</label>
    
            </div>

            <div class="fieldset-item">
              <picture>
              <RIcons.RiFilePaper2Line/>
              </picture>
                <label>Terms of Use</label>
              
              </div>

            <div class="fieldset-item">
              <picture>
              <RIcons.RiFilePaper2Line/>
              </picture>
                <label>Privacy Policy</label>
                
              </div>
            
              <div class="fieldset-item">
              <picture>
              <RIcons.RiFilePaper2Line/>
              </picture>
                <label>Imprint</label>
                
              </div>

              <div class="fieldset-item">
              <picture>
              <RIcons.RiFilePaper2Line/>
              </picture>
                <label>Do not sell my personal information</label>
                
              </div>

          </fieldset>
        </section>
      </form>
    </div>

    </>
  );
}

export default Settings;
