import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import "../Application/dj.css";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized || (user && user.role !== "TPO")) {
    navigateTo("/");
  }

  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/job/update/${jobId}`,
        updatedJob,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setEditingMode(null);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const res = await axios.delete(`http://localhost:4000/api/v1/job/delete/${jobId}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) => (job._id === jobId ? { ...job, [field]: value } : job))
    );
  };

  return (
    <div id="profile" className="main myJobs page">
      <div style={{width:"100%"}}>
        <h3 className="text-center my-4">Your Posted Jobs</h3>
        {myJobs.length > 0 ? (
          <div className="row">
            {myJobs.map((element) => (
              <div className="col-md-6" key={element._id}>
                <div className="card mb-4 shadow">
                  <div className="card-body">
                    <div className="form-group mb-3">
                      <label>Title</label>
                      <input
                        type="text"
                        className="form-control"
                        disabled={editingMode !== element._id}
                        value={element.title}
                        onChange={(e) => handleInputChange(element._id, "title", e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Country</label>
                      <input
                        type="text"
                        className="form-control"
                        disabled={editingMode !== element._id}
                        value={element.country}
                        onChange={(e) => handleInputChange(element._id, "country", e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control"
                        disabled={editingMode !== element._id}
                        value={element.city}
                        onChange={(e) => handleInputChange(element._id, "city", e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Category</label>
                      <select
                        className="form-control"
                        disabled={editingMode !== element._id}
                        value={element.category}
                        onChange={(e) => handleInputChange(element._id, "category", e.target.value)}
                      >
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
                      <label>Salary</label>
                      {element.fixedSalary ? (
                        <input
                          type="number"
                          className="form-control"
                          disabled={editingMode !== element._id}
                          value={element.fixedSalary}
                          onChange={(e) => handleInputChange(element._id, "fixedSalary", e.target.value)}
                        />
                      ) : (
                        <div className="d-flex">
                          <input
                            type="number"
                            className="form-control me-2"
                            disabled={editingMode !== element._id}
                            value={element.salaryFrom}
                            onChange={(e) => handleInputChange(element._id, "salaryFrom", e.target.value)}
                          />
                          <input
                            type="number"
                            className="form-control"
                            disabled={editingMode !== element._id}
                            value={element.salaryTo}
                            onChange={(e) => handleInputChange(element._id, "salaryTo", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label>Expired</label>
                      <select
                        className="form-control"
                        disabled={editingMode !== element._id}
                        value={element.expired}
                        onChange={(e) => handleInputChange(element._id, "expired", e.target.value)}
                      >
                        <option value={true}>TRUE</option>
                        <option value={false}>FALSE</option>
                      </select>
                    </div>
                    <div className="form-group mb-3">
                      <label>Description</label>
                      <textarea
                        rows={5}
                        className="form-control"
                        disabled={editingMode !== element._id}
                        value={element.description}
                        onChange={(e) => handleInputChange(element._id, "description", e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Location</label>
                      <textarea
                        rows={5}
                        className="form-control"
                        disabled={editingMode !== element._id}
                        value={element.location}
                        onChange={(e) => handleInputChange(element._id, "location", e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-between">
                      {editingMode === element._id ? (
                        <>
                          <button onClick={() => handleUpdateJob(element._id)} className="btn btn-success">
                            <FaCheck />
                          </button>
                          <button onClick={handleDisableEdit} className="btn btn-danger">
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleEnableEdit(element._id)} className="btn btn-primary">
                          Edit
                        </button>
                      )}
                      <button onClick={() => handleDeleteJob(element._id)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">You've not posted any jobs or may have deleted all your jobs!</p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
