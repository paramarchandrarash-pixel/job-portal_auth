import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBCCCxJbYXotK5_CIyh2te4DWe38-KxprM",
  authDomain: "job-portal-9ad19.firebaseapp.com",
  projectId: "job-portal-9ad19",
  storageBucket: "job-portal-9ad19.firebasestorage.app",
  messagingSenderId: "949819860973",
  appId: "1:949819860973:web:48b3b3421ba78737d769e4",
  measurementId: "G-GEEWTPP2JE"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let selectedRole = "";
let confirmationResultGlobal = null;

// Elements
const employerBtn = document.getElementById("employerBtn");
const jobseekerBtn = document.getElementById("jobseekerBtn");
const selectedRoleText = document.getElementById("selectedRole");
const phoneNumberInput = document.getElementById("phoneNumber");
const otpCodeInput = document.getElementById("otpCode");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const message = document.getElementById("message");

// Role selection
employerBtn.addEventListener("click", () => {
  selectedRole = "employer";
  selectedRoleText.innerText = "Employer";
  employerBtn.classList.add("active");
  jobseekerBtn.classList.remove("active");
});

jobseekerBtn.addEventListener("click", () => {
  selectedRole = "jobseeker";
  selectedRoleText.innerText = "Jobseeker";
  jobseekerBtn.classList.add("active");
  employerBtn.classList.remove("active");
});

// Setup reCAPTCHA
function setupRecaptcha() {
  if (window.recaptchaVerifier) {
    return;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "normal",
    callback: () => {
      console.log("reCAPTCHA solved");
    },
    "expired-callback": () => {
      message.innerText = "reCAPTCHA expired. Refresh the page and try again.";
    }
  });
}

// Send OTP
sendOtpBtn.addEventListener("click", async () => {
  const phoneNumber = phoneNumberInput.value.trim();

  if (!selectedRole) {
    message.innerText = "Please select Employer or Jobseeker first.";
    return;
  }

  if (!phoneNumber) {
    message.innerText = "Please enter phone number.";
    return;
  }

  if (!phoneNumber.startsWith("+")) {
    message.innerText = "Phone number must start with country code. Example: +919876543210";
    return;
  }

  try {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    confirmationResultGlobal = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    message.innerText = "OTP sent successfully.";
  } catch (error) {
    console.error("Send OTP Error:", error);
    message.innerText = "Error sending OTP: " + error.message;
  }
});

// Verify OTP
verifyOtpBtn.addEventListener("click", async () => {
  const otpCode = otpCodeInput.value.trim();
  const phoneNumber = phoneNumberInput.value.trim();

  if (!confirmationResultGlobal) {
    message.innerText = "Please send OTP first.";
    return;
  }

  if (!otpCode) {
    message.innerText = "Please enter OTP.";
    return;
  }

  try {
    const result = await confirmationResultGlobal.confirm(otpCode);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        phone: phoneNumber,
        role: selectedRole,
        createdAt: new Date().toISOString()
      });
    } else {
      await setDoc(userRef, {
        uid: user.uid,
        phone: phoneNumber,
        role: selectedRole,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    message.innerText = `Login successful. Role saved as ${selectedRole}.`;

    // Optional redirect
    // if (selectedRole === "employer") {
    //   window.location.href = "employer.html";
    // } else {
    //   window.location.href = "jobseeker.html";
    // }

  } catch (error) {
    console.error("Verify OTP Error:", error);
    message.innerText = "OTP verification failed: " + error.message;
  }
});