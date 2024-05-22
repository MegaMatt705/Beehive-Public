import React from 'react'
import './Footerbar.css'


function Footerbar() {

  return (
  <div className="footer-bar">
    <div className='footer-section-padding'>
      <div className='footer-links'>
        <div className='footer-link-divs'>
          <h4>Company</h4>
          <a href='/careers'>
            <p>Careers</p>
          </a>
          <a href='/aboutus'>
            <p>About Us</p>
          </a>
        </div>

        <div className='footer-link-divs'>
          <h4>Contact Us</h4>
          <a>
            <p>Sample@sfsu.edu</p>
          </a>
          <a>
            <p>(415)123-1234</p>
          </a>
          <a>
            <p>1234 Random St. SanFrancisco, CA 94521</p>
          </a>
        </div>

        <div className='footer-link-divs'>
          <h4>Privacy&Security</h4>
          <a href="/privacy">
            <p>Privacy Policy</p>
          </a>
          <a href="/privacy">
            <p>Social Media Policy</p>
          </a>
          <a href="/privacy">
            <p>Copyright Notice</p>
          </a>
        </div>

        <div className='footer-link-divs'>
          <h4>Support</h4>
          <a href='/faq'>
            <p>Frequently Asked Questions</p>
          </a>
          <a href='/report'>
            <p>Report A Problem</p>
          </a>
        </div>

        <div className='footer-link-divs'>
          <h4>Coming Soon</h4>
        </div>

      {/* <hr></hr> */}

          <p className='copyright'>
          &copy; {new Date().getFullYear()} BeeHive | All Rights Reserved.
          </p>
      </div>
    </div>
  </div>
  )
}

export default Footerbar
