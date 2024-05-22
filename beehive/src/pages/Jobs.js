import Footerbar from '../components/Footerbar';
import JobListing from '../components/JobListing';
import Navbar from '../components/Navbar';
import '../components/JobListing.css';
import React from 'react'

export default function Jobs() {
  return (
    <div>
      <Navbar />
      <div className="Jobs">
        <JobListing />
      </div>
      <Footerbar />
    </div>
  )
}
