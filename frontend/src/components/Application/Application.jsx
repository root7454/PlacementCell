import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [jobTitle, setJobTitle] = useState(""); // State to hold the job title
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if the form is submitting

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  // Fetch the job details when the component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/v1/job/${id}`, {
          withCredentials: true,
        });
        setJobTitle(data.job.title);
      } catch (error) {
        toast.error("Failed to fetch job details");
      }
    };

    fetchJobDetails();
  }, [id]);

  // Function to handle file input changes
  const handleFileChange = (event) => {
    const resume = event.target.files[0];
    setResume(resume);
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set the submitting state to true when the form is being submitted
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);
    formData.append("jobTitle", jobTitle); // Include job title in the form data
  
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      setIsSubmitting(false); // Set the submitting state to false after the form is submitted
      toast.success(data.message);
      navigateTo("/applications/me"); // Redirect to my applications page
    } catch (error) {
      setIsSubmitting(false); // Set the submitting state to false if there's an error
      toast.error(error.response.data.message);
    }
  };
  

  if (!isAuthorized || (user && user.role === "TPO")) {
    navigateTo("/");
  }

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          {jobTitle && (
            <div>
              <label style={{ textAlign: "start", display: "block", fontSize: "20px" }}>
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                readOnly
                style={{ width: "100%", marginBottom: "10px" }}
              />
            </div>
          )}
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <textarea
            placeholder="Cover Letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div>
            <label
              style={{ textAlign: "start", display: "block", fontSize: "20px" }}
            >
              Select Resume
            </label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Send Application"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Application;
