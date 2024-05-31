import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import ResumeModal from "../Application/ResumeModal";
import toast from "react-hot-toast";

const JobApplications = () => {
  const { id } = useParams(); // jobId from URL
  const { user } = useContext(Context);
  const navigateTo = useNavigate();
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/application/job/${id}/applications`, { withCredentials: true });

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
  }, [user, navigateTo, id]);

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section id="profile" className="main">
      <div className="container">
        <h1>Applications for Job ID: {id}</h1>
        {applications.length <= 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map((element) => (
            <ApplicationCard
              key={element._id}
              element={element}
              openModal={openModal}
            />
          ))
        )}
      </div>
      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
    </section>
  );
};

const ApplicationCard = ({ element, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Job Title:</span> {element.jobTitle}</p>
      </div>
      <div className="resume">
        <img src={element.resume.url} alt="resume" onClick={() => openModal(element.resume.url)} />
      </div>
    </div>
  );
};

export default JobApplications;
