import Footerbar from '../components/Footerbar';
import Navbar from '../components/Navbar';
import React from 'react'
import './AboutUs.css';

export default function AboutUs() {
  return (
    <div>
      <Navbar />
      <div className="AboutUs">
       <h1></h1>
<div class="members">
   <a href="Satvik/index.html"><button class="button1">Satvik Verma</button></a> 
   <a href="Matthew/mxhAbout.html"><button class="button2">Matthew Hernandez</button></a> 
   <a href="Benjamin/Benjamin.html"><button class="button3">Benjamin Dinh</button></a> 
   <a href="Pearl/index.html"><button class="button4">Pearl Anyanwu </button></a>  
   <a href="Sungmu/index.html"><button class="button5">Sungmu Cho</button></a>  
   <a href="Aaron/myAbout.html"><button class="button6">Aaron Pham</button></a>  
</div>
      </div>
      <Footerbar />
    </div>
  )
}
