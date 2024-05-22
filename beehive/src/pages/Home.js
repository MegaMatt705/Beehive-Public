import React from 'react';
import Navbar from '../components/Navbar';
import Footerbar from '../components/Footerbar';
import Post from '../components/post'; // You'll need a Post component

function Home() {
  return (
    <>
    <div>
      <Navbar />
      <div className="home">
          <Post />
        </div>

      <Footerbar />

      </div>

    </>
  );
}

export default Home;
