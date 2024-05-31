import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import ResumeModal from "./ResumeModal";
import toast from "react-hot-toast";

const MyApplications = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          user && user.role === "TPO"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall",
          { withCredentials: true }
        );

        console.log("Raw Response Data: ", response.data);

        // Extract unique job titles for TPO filtering
        if (user.role === "TPO") {
          const uniqueJobTitles = [
            ...new Set(response.data.applications.map(app => app.jobTitle))
          ];
          setJobTitles(uniqueJobTitles);
        }

        setApplications(response.data.applications);
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          console.error("Error fetching applications:", error);
        }
      }
    };
    if (user) {
      fetchData();
    } else {
      navigateTo("/");
    }
  }, [user, navigateTo]);

  const deleteApplication = async (applicationId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/application/delete/${applicationId}`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setApplications((prev) => prev.filter((application) => application._id !== applicationId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting application");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Filter applications based on selected job title
  const filteredApplications = selectedJobTitle
    ? applications.filter(app => app.jobTitle === selectedJobTitle)
    : applications;

  return (
    <section id="profile" className="main">
      <div className="container">
        <h1>{user && user.role === "Student" ? "My Applications" : "Applications From Students"}</h1>
        {user.role === "TPO" && (
          <div>
            <label htmlFor="jobTitleFilter">Filter by Job Title:</label>
            <select
              id="jobTitleFilter"
              value={selectedJobTitle}
              onChange={(e) => setSelectedJobTitle(e.target.value)}
            >
              <option value="">All Job Titles</option>
              {jobTitles.map((title, index) => (
                <option key={index} value={title}>{title}</option>
              ))}
            </select>
          </div>
        )}
        {filteredApplications.length <= 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          filteredApplications.map((element) => (
            <ApplicationCard
              key={element._id}
              element={element}
              deleteApplication={deleteApplication}
              openModal={openModal}
              userRole={user.role}
            />
          ))
        )}
      </div>
      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
    </section>
  );
};

const ApplicationCard = ({ element, deleteApplication, openModal, userRole }) => {
 
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>Cover Letter:</span> {element.coverLetter}</p>
        <p><span>Job Title:</span> {element.jobTitle}</p>
      </div>
      <div className="resume">
        <img src={element.resume.url} alt="resume" onClick={() => openModal(element.resume.url)} />
      </div>
      {userRole === "Student" && (
        <div className="btn_area">
          <button onClick={(e) => {
            e.preventDefault();
            deleteApplication(element._id);
          }}>Delete Application</button>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
