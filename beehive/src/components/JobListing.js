import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as OIcons from "react-icons/io";
import './JobListing.css';

export default function JobListing() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch the jobs when the component mounts
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/jobs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data); // Set the jobs in state
      } catch (error) {
        console.log("Fetching jobs failed", error);
      }
    };

    fetchJobs();
  }, []); // The empty array causes this effect to only run on mount

  return (
<>
<div>
<h3 className="job-l">Job Listings</h3>
  <ul class="cards">
  {jobs.map((job) => (
    <li class="cards_item">
      <div class="card">
        <div class="card_content" key={job._id}>
          <h2 class="card_title">{job.title}</h2>
          <div class="card_text">
            <p><b>Description: </b>{job.description}</p>
            <hr />
            <p><b>Location: </b>{job.location}</p>
          </div>
        </div>
      </div>
    </li>
      ))}
  </ul>

  <Link to="/JobCreate">
          <button className="createJob">
            <OIcons.IoIosCreate/>
          </button>
        </Link>
        </div>
        </>
  );
}
