import React from 'react';
import Footerbar from '../components/Footerbar';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import '../components/JobListing.css';
import './JobCreate.css';

export default function JobCreate() {
  const navigate = useNavigate();

  const handleJobCreation = async () => {
    const title = document.getElementById("jobtitle").value;
    const description = document.getElementById("jobdesc").value;
    const location = document.getElementById("joblocation").value;

    try {
      const response = await fetch('http://localhost:3001/api/v1/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          description: description,
          location: location
        })
      });

      if (response.ok) {
        alert("Job added!");
        navigate("/Jobs");
      } else {
        alert("Error creating job 1.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating job.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="JobCreate">
        <div className="Job-form">
          <label className='job-info'>Title</label>
          <input id="jobtitle" placeholder="Title" type="text"></input>
          <label className='job-info'>Description</label>
          <input id="jobdesc" placeholder="Description" type="text"></input>
          <label className='job-info'>Location</label>
          <input id="joblocation" placeholder="Location" type="text"></input>
          <button className='btn' onClick={handleJobCreation}>
            Create
          </button>
        </div>
      </div>
      <Footerbar />
    </>
  );
}
