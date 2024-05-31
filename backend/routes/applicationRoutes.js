// application.js
import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  getJobApplications,
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { exportApplicationsToExcel } from '../controllers/applicationController.js';

const router = express.Router();

router.post("/post", isAuthenticated, postApplication);
router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);
router.get("/job/:id/applications", isAuthenticated, getJobApplications);
router.get('/export', isAuthenticated, exportApplicationsToExcel);


export default router;
