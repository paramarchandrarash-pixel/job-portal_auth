import { supabase } from "./supabase.js";
const employerBtn = document.getElementById("employerBtn");
const jobseekerBtn = document.getElementById("jobseekerBtn");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const phoneInput = document.getElementById("phone");
const otpInput = document.getElementById("otp");
const otpStatus = document.getElementById("otpStatus");
const phoneError = document.getElementById("phoneError");
const otpError = document.getElementById("otpError");


let generatedOtp = "1234";
let userRole = "";

function clearErrors() {
  phoneError.textContent = "";
  otpError.textContent = "";
}

function setActiveRole(role) {
  userRole = role;

  employerBtn.classList.remove("active");
  jobseekerBtn.classList.remove("active");

  if (role === "employer") {
    employerBtn.classList.add("active");
  } else {
    jobseekerBtn.classList.add("active");
  }
}

employerBtn.addEventListener("click", () => {
  setActiveRole("employer");
});

jobseekerBtn.addEventListener("click", () => {
  setActiveRole("jobseeker");
});

sendOtpBtn.addEventListener("click", () => {
  clearErrors();
  otpStatus.textContent = "";

  const phone = phoneInput.value.trim();

  if (userRole === "") {
    phoneError.textContent = "Please select Employer or Job Seeker first.";
    return;
  }

  if (phone === "") {
    phoneError.textContent = "Phone number is required.";
    return;
  }

  if (!/^[0-9]{10,13}$/.test(phone.replace("+91", "").trim())) {
    phoneError.textContent = "Enter a valid phone number.";
    return;
  }

  otpStatus.textContent = "OTP sent successfully.";
});

verifyOtpBtn.addEventListener("click", () => {
  clearErrors();

  const enteredOtp = otpInput.value.trim();

  if (userRole === "") {
    phoneError.textContent = "Please select Employer or Job Seeker first.";
    return;
  }

  if (enteredOtp === "") {
    otpError.textContent = "OTP is required.";
    return;
  }

  if (enteredOtp !== generatedOtp) {
    otpError.textContent = "Invalid OTP. Use demo OTP: 1234";
    return;
  }

  sessionStorage.setItem("otpVerified", "true");
  sessionStorage.setItem("userRole", userRole);

  if (userRole === "employer") {
    window.location.href = "employer.html";
  } else {
    window.location.href = "jobseeker.html";
  }
});
