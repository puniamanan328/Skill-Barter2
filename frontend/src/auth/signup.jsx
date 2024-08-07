import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import CustomNavbar from "../shared/Navbar";

function SignupForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    otp: "",
  });
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "phoneNumber") {
      if (/^\d{10}$/.test(value)) {
        setPhoneError("");
      } else {
        setPhoneError("Phone number must be exactly 10 digits.");
      }
    }
  };

  const handleSendOtp = async () => {
    try {
      await axios.post("http://localhost:8000/api/users/send-otp/", {
        phone_number: formData.phoneNumber,
      });
      setOtpSent(true);
      setMessage("OTP sent successfully!");
    } catch (error) {
      setMessage("Error sending OTP");
      console.error(error.response ? error.response.data : error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.otp
    ) {
      setMessage("Please fill all the fields");
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "Password must contain at least one capital letter, one number, one special character, and be at least 8 characters long"
      );
      return;
    }

    if (phoneError) {
      setMessage(phoneError);
      return;
    }

    setPasswordError("");
    setMessage("");

    const data = new FormData();
    data.append("full_name", formData.fullName);
    data.append("email", formData.email);
    data.append("phone_number", formData.phoneNumber);
    data.append("password", formData.password);
    data.append("otp", formData.otp);
    if (selectedImage) {
      data.append("profile_picture", selectedImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/signup/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Signup successful!");
      navigate("/registration");
    } catch (error) {
      setMessage("Error during signup");
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <CustomNavbar className="fixed-top" />
      <div
        className="container d-flex justify-content-center align-items-start vh-100 pt-2"
        style={{ marginTop: "70px", marginBottom: "70px" }}
      >
        <div className="card p-4 w-100" style={{ maxWidth: "600px" }}>
          <h3 className="text-center mb-4">Sign Up</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName" className="font-weight-bold">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                autoComplete="off"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="font-weight-bold">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={otpSent}
              />
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={handleSendOtp}
                disabled={otpSent}
              >
                Send OTP
              </button>
            </div>
            {otpSent && (
              <div className="form-group">
                <label htmlFor="otp" className="font-weight-bold">
                  OTP
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  name="otp"
                  placeholder="Enter the OTP"
                  autoComplete="off"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="phoneNumber" className="font-weight-bold">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number"
                autoComplete="off"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              {phoneError && (
                <small className="text-danger">{phoneError}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="font-weight-bold">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="off"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {passwordError && (
                <small className="text-danger">{passwordError}</small>
              )}
              <small className="form-text text-muted">
                Password must contain at least one capital letter, one number,
                one special character, and be at least 8 characters long.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="profilePicture" className="font-weight-bold">
                Profile Picture
              </label>
              <div className="d-block">
                <input
                  type="file"
                  className="form-control-file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="profilePicture"
                  className="btn btn-success mt-2"
                  style={{ cursor: "pointer" }}
                >
                  Choose File
                </label>
              </div>
              {selectedImage && (
                <div className="mt-2 text-center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      maxHeight: "200px",
                      marginTop: "10px",
                    }}
                  />
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign Up
            </button>
            {message && <p className="mt-3 text-center">{message}</p>}
            <p className="mt-3 text-center">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignupForm;
