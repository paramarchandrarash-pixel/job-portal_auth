// Role buttons
const employerBtn = document.getElementById("employerBtn");
const jobseekerBtn = document.getElementById("jobseekerBtn");
const selectedRole = document.getElementById("selectedRole");

// OTP section
const phoneInput = document.getElementById("phoneInput");
const otpInput = document.getElementById("otpInput");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const message = document.getElementById("message");

// Forms
const jobseekerForm = document.getElementById("jobseekerForm");
const employerForm = document.getElementById("employerForm");

// Jobseeker fields
const jsName = document.getElementById("js_name");
const jsEmail = document.getElementById("js_email");
const jsPhone = document.getElementById("js_phone");
const jsSkills = document.getElementById("js_skills");
const jsEducation = document.getElementById("js_education");
const jsExperience = document.getElementById("js_experience");
const jsAddress = document.getElementById("js_address");
const jsResume = document.getElementById("js_resume");
const saveJobseeker = document.getElementById("saveJobseeker");

// Employer fields
const empCompany = document.getElementById("emp_company");
const empEmail = document.getElementById("emp_email");
const empPhone = document.getElementById("emp_phone");
const empType = document.getElementById("emp_type");
const empAddress = document.getElementById("emp_address");
const empDesc = document.getElementById("emp_desc");
const empWebsite = document.getElementById("emp_website");
const empPerson = document.getElementById("emp_person");
const saveEmployer = document.getElementById("saveEmployer");

// Current role
let currentRole = "";
const demoOtp = "251201";

// =========================
// Role Selection
// =========================
jobseekerBtn.addEventListener("click", () => {
  currentRole = "Jobseeker";
  selectedRole.innerText = "Selected Role: Jobseeker";

  jobseekerForm.classList.remove("hidden");
  employerForm.classList.add("hidden");

  jobseekerBtn.style.background = "#0f8b4c";
  employerBtn.style.background = "#23408e";
});

employerBtn.addEventListener("click", () => {
  currentRole = "Employer";
  selectedRole.innerText = "Selected Role: Employer";

  employerForm.classList.remove("hidden");
  jobseekerForm.classList.add("hidden");

  employerBtn.style.background = "#0f8b4c";
  jobseekerBtn.style.background = "#23408e";
});

// =========================
// OTP Demo
// =========================
sendOtpBtn.addEventListener("click", () => {
  const phone = phoneInput.value.trim();

  if (phone === "") {
    message.style.color = "red";
    message.innerText = "Please enter phone number.";
    return;
  }

  if (currentRole === "") {
    message.style.color = "red";
    message.innerText = "Please select role first.";
    return;
  }

  message.style.color = "green";
  message.innerText = "Demo OTP sent successfully. Use 251201";
});

verifyOtpBtn.addEventListener("click", () => {
  const enteredOtp = otpInput.value.trim();

  if (enteredOtp === "") {
    message.style.color = "red";
    message.innerText = "Please enter OTP.";
    return;
  }

  if (enteredOtp === demoOtp) {
    message.style.color = "green";
    message.innerText = "OTP verified successfully.";
  } else {
    message.style.color = "red";
    message.innerText = "Invalid OTP.";
  }
});

// =========================
// Jobseeker Save -> Backend
// =========================
saveJobseeker.addEventListener("click", () => {
  const name = jsName.value.trim();
  const email = jsEmail.value.trim();
  const phone = jsPhone.value.trim();
  const skills = jsSkills.value.trim();
  const education = jsEducation.value.trim();
  const experience = jsExperience.value.trim();
  const address = jsAddress.value.trim();
  const resumeFile = jsResume.files[0];

  if (
    name === "" ||
    email === "" ||
    phone === "" ||
    skills === "" ||
    education === "" ||
    experience === "" ||
    address === ""
  ) {
    alert("Please fill all Jobseeker fields.");
    return;
  }

  if (!resumeFile) {
    alert("Please upload resume.");
    return;
  }

  fetch("http://localhost:5000/save-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      role: "Jobseeker",
      name,
      email,
      phone,
      skills,
      education,
      experience,
      address,
      resumeName: resumeFile.name
    })
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      console.log("Jobseeker response:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to save jobseeker profile.");
    });
});

// =========================
// Employer Save -> Backend
// =========================
saveEmployer.addEventListener("click", () => {
  const company = empCompany.value.trim();
  const email = empEmail.value.trim();
  const phone = empPhone.value.trim();
  const type = empType.value.trim();
  const address = empAddress.value.trim();
  const desc = empDesc.value.trim();
  const website = empWebsite.value.trim();
  const person = empPerson.value.trim();

  if (
    company === "" ||
    email === "" ||
    phone === "" ||
    type === "" ||
    address === "" ||
    desc === "" ||
    website === "" ||
    person === ""
  ) {
    alert("Please fill all Employer fields.");
    return;
  }

  fetch("http://localhost:5000/save-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      role: "Employer",
      company,
      email,
      phone,
      type,
      address,
      desc,
      website,
      person
    })
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      console.log("Employer response:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to save employer profile.");
    });
});
