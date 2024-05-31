// ApplicationController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";
import excel from 'exceljs';

export const exportApplicationsToExcel = async (req, res, next) => {
  try {
    const applications = await Application.find().populate('jobId'); // Populate job details
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define worksheet headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Cover Letter', key: 'coverLetter', width: 50 },
      { header: 'Job Title', key: 'jobTitle', width: 20 }
    ];

    // Add application data to worksheet
    applications.forEach((application) => {
      worksheet.addRow({
        name: application.name,
        email: application.email,
        phone: application.phone,
        address: application.address,
        coverLetter: application.coverLetter,
        jobTitle: application.jobId.title // Assuming jobId contains job details
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Send file to client
    res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};


export const getJobApplications = catchAsyncErrors(async (req, res, next) => {
  const jobId = req.params.id;
  const applications = await Application.find({ jobId }).populate('applicantID.user');
  res.status(200).json({
    success: true,
    applications,
  });
});

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "TPO") {
    return next(
      new ErrorHandler("TPO not allowed to access this resource.", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Student",
  };
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobTitle = jobDetails.title;

  const employerID = {
    user: jobDetails.postedBy,
    role: "TPO",
  };

  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume ||
    !jobTitle
  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  const application = await Application.create({
    name,
    jobTitle,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    jobId,
  });

  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});




// Employer get all applications handler
export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Student") {
      return next(
        new ErrorHandler("Student not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    let applications = await Application.find({ "applicantID.user": _id }).lean();

    // Fetch job titles for each application
    const jobIds = applications.map(app => app.jobId);
    const jobs = await Job.find({ _id: { $in: jobIds } });
    const jobMap = jobs.reduce((map, job) => {
      map[job._id] = job.title;
      return map;
    }, {});

    // Add job titles to the applications
    applications = applications.map(app => ({
      ...app,
      jobTitle: jobMap[app.jobId] || "Job Title Not Found"
    }));

    res.status(200).json({
      success: true,
      applications,
    });
  }
);


// Jobseeker delete application handler
export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);
