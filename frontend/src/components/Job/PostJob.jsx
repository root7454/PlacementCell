import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import "../Application/dj.css";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [expiryDate, setExpiryDate] = useState(""); // Change type to string
  const [isSubmitting, setIsSubmitting] = useState(false); // Define isSubmitting state

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  if (!isAuthorized || (user && user.role !== "TPO")) {
    navigateTo("/");
  }

  const handleJobPost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set isSubmitting to true when form is submitted
    try {
      const formattedExpiryDate = new Date(expiryDate).toISOString(); // Format the expiry date
      const jobData = salaryType === "Fixed Salary"
        ? { title, description, category, country, city, location, fixedSalary, expiryDate: formattedExpiryDate }
        : { title, description, category, country, city, location, salaryFrom, salaryTo, expiryDate: formattedExpiryDate };
  
      await axios.post("http://localhost:4000/api/v1/job/post", jobData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Job posted successfully!");
      navigateTo("/job/getall");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setIsSubmitting(false); // Reset isSubmitting to false when request is complete
    }
  };
  return (
    <div id="profile" className="main job_post page">
      <div className="container">
        <h3>POST NEW JOB</h3>
        <form onSubmit={handleJobPost}>
          <div className="card mb-4">
            <div className="card-body">
              <div className="form-group mb-3">
                <label>Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control"
                  placeholder="Job Title"
                />
              </div>
              <div className="form-group mb-3">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Category</option>
                  <option value="Graphics & Design">Graphics & Design</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Frontend Web Development">Frontend Web Development</option>
                  <option value="MERN Stack Development">MERN Stack Development</option>
                  <option value="Account & Finance">Account & Finance</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Video Animation">Video Animation</option>
                  <option value="MEAN Stack Development">MEAN Stack Development</option>
                  <option value="MEVN Stack Development">MEVN Stack Development</option>
                  <option value="Data Entry Operator">Data Entry Operator</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-control"
                  placeholder="Country"
                />
              </div>
              <div className="form-group mb-3">
                <label>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control"
                  placeholder="City"
                />
              </div>
              <div className="form-group mb-3">
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                  placeholder="Location"
                />
              </div>
              <div className="form-group mb-3">
                <label>Salary Type</label>
                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                  className="form-control"
                >
                  <option value="default">Select Salary Type</option>
                  <option value="Fixed Salary">Fixed Salary</option>
                  <option value="Ranged Salary">Ranged Salary</option>
                </select>
              </div>
              {salaryType === "Fixed Salary" ? (
                <div className="form-group mb-3">
                  <label>Fixed Salary (LPA)</label>
                  <input
                    type="number"
                    value={fixedSalary}
                    onChange={(e) => setFixedSalary(e.target.value)}
                    className="form-control"
                    placeholder="Enter Fixed Salary in LPA"
                  />
                </div>
              ) : salaryType === "Ranged Salary" ? (
                <div className="form-group mb-3">
                  <label>Salary Range (LPA)</label>
                  <div className="d-flex">
                    <input
                      type="number"
                      value={salaryFrom}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                      className="form-control me-2"
                      placeholder="Salary From (LPA)"
                    />
                    <input
                      type="number"
                      value={salaryTo}
                      onChange={(e) => setSalaryTo(e.target.value)}
                      className="form-control"
                      placeholder="Salary To (LPA)"
                    />
                  </div>
                </div>
              ) : null}
<div className="form-group mb-3">
  <label>Expiry Date</label>
  <input
    type="date" // Change type to date
    value={expiryDate}
    onChange={(e) => setExpiryDate(e.target.value)}
    className="form-control"
    required
  />
</div>
              <div className="form-group mb-3">
                <label>Job Description</label>
                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  placeholder="Job Description"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Post Job"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
