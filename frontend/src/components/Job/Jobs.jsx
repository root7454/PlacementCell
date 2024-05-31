import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const { isAuthorized , user } = useContext(Context);
  const navigateTo = useNavigate();
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  useEffect(() => {
    try {
      axios
        .get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
          setIsLoading(false); // Update loading status when data is fetched
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  // Show loading indicator if data is still loading
  if (isLoading) {
    return (
      <div className="container">
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            aria-valuenow="100"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <section id="profile" className="main">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          <div className="row">
            {jobs.jobs &&
              jobs.jobs.map((element) => (
                <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2" key={element._id}>
                  <div className="card border-0 bg-light rounded shadow">
                    <div className="card-body p-4">
                      <span className="badge rounded-pill bg-primary float-md-end mb-3 mb-sm-0">Full time</span>
                      <p><strong>{element.category}</strong></p>
                      <h5>{element.title}</h5>
                      <div style={{margin:"20px"}} className="mt-3">
                        <span className="text-muted d-block"><i className="fa fa-home" aria-hidden="true"></i> <a href="#" target="_blank" className="text-muted">{element.company}</a></span>
                        <FontAwesomeIcon icon={faWallet} /> <span className="text-success">{element.fixedSalary}</span> LPA
                        <span className="text-muted"> {element.salaryFrom}  - {element.salaryTo}</span><br></br>
                        <span >Expiry Data: </span><span  target="_blank" className="text-muted">{element.expiryDate.split('T')[0]}</span>
                      </div>
                      <span style={{margin:"20px"}} className="mt-3">
                        {new Date(element.expiryDate) < new Date() ? (
                          <p className="text-danger">Job Is Expired</p>
                        ) : (
                          <Link to={`/job/${element._id}`} className="btn btn-primary">View Details</Link>
                        )}
                      </span>
                      {user && user.role === "Student" ? null :<span className="mt-3">
                        <Link to={`/job/${element._id}/applications`} className="btn btn-success">View Applicants</Link>
                      </span>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Jobs;
