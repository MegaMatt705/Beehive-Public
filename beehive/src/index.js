// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { DarkModeProvider, useDarkMode } from './DarkModeContext';
import reportWebVitals from './reportWebVitals';

function Main() {
  const { darkMode } = useDarkMode();

  return (
    <React.StrictMode>
      <div id="root" className={darkMode ? 'dark-mode' : ''}>
        <App />
      </div>
    </React.StrictMode>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <DarkModeProvider>
    <Main />
  </DarkModeProvider>
);

reportWebVitals();

// window.onload=function(){
//   const wrapper = document.querySelector('.wrapper');
// const loginLink = document.querySelector('.login-link');
// const registerLink = document.querySelector('.register-link');
// const btnPopup = document.querySelector('.loginBtn');
// const iconClose = document.querySelector('.close-icon');

// registerLink.addEventListener('click',()=>{
//     wrapper.classList.add('active');
// });

// loginLink.addEventListener('click',()=>{
//     wrapper.classList.remove('active');
// });

// btnPopup.addEventListener('click',()=>{
//     wrapper.classList.add('active-popup');
// });

// iconClose.addEventListener('click',()=>{
//     wrapper.classList.remove('active-popup');
// });
// }