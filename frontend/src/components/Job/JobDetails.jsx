import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isJobExpired, setIsJobExpired] = useState(false); // State to track if the job is expired

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
        const expiryDate = new Date(res.data.job.expiryDate);
        const currentDate = new Date();
        if (expiryDate < currentDate) {
          setIsJobExpired(true); // Set isJobExpired to true if the expiry date has passed
        }
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          user && user.role === "TPO"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall",
          { withCredentials: true }
        );
        setApplications(response.data.applications);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          console.error("Error fetching applications:", error);
        }
      }
    };
    fetchData();
    if (!user) {
      navigateTo("/");
    }
  }, [user, navigateTo]);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <section id="profile" className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span>{job.title}</span>
          </p>
          <p>
            Category: <span>{job.category}</span>
          </p>
          <p>
            Country: <span>{job.country}</span>
          </p>
          <p>
            City: <span>{job.city}</span>
          </p>
          <p>
            Location: <span>{job.location}</span>
          </p>
          <p>
            Description: <span>{job.description}</span>
          </p>
          <p>
            Job Posted On: <span>{job.jobPostedOn}</span>
          </p>
          <p>
            Expiry Date: <span>{job.expiryDate}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>
                <span>{job.fixedSalary}</span>
                <span> LPA</span>
              </span>
            ) : (
              <span>
                <span>
                  {job.salaryFrom} - {job.salaryTo}
                </span>
                <span> LPA</span>
              </span>
            )}
          </p>
          {/* Render apply button if user is authorized, not a TPO, and the job is not expired */}
          {isAuthorized && user && user.role !== "TPO" && !isJobExpired && (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
