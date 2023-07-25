import React, { useState } from "react";
import { Link } from "react-router-dom";
import AWS from "aws-sdk";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { ADD_USER } from "../utils/mutations";

function Signup(props) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    profilePicUrl: "",
    // Add other form fields here
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("form state", formState);

    try {
      const response = await handleImageUpload(selectedFile);

      const { data } = await addUser({
        variables: {
          ...formState,
          profilePicUrl: response.Location,
        },
      });

      Auth.login(data.addUser.token);
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (file) => {
    // AWS S3 Configuration
    const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME;
    const region = process.env.REACT_APP_AWS_BUCKET_REGION;
    const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY;
    const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;

    console.log(bucketName);
    AWS.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: bucketName,
      Key: file.name,
      Body: file,
    };

    try {
      const response = await s3.upload(params).promise();
      console.log("Upload successful:", response.Location);

      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    await handleImageUpload(selectedFile);
  };
  return (
    <div className="flex flex-col items-center justify-center  background-darkBlue">
      <h1 className="display: inline text-7xl font-bold text-center mb-2 mt-20 color-yellow">
        COHORT RETORT
      </h1>

      <p className="display: inline; text-2xl tenxt-center mb-10 text-white">
        Connect with your classmates
      </p>

      <div
        className="container w-full max-w-md background-medBlue p-5 mb-32
   rounded-lg shrink-1 "
      >
        <form className="mt-4" onSubmit={handleFormSubmit}>
          <div className="flex flex-col mb-4">
            <input
              placeholder="UserName"
              required
              name="username"
              type="username"
              id="username"
              value={formState.username}
              onChange={handleChange}
              className="border border-blue-300 p-2 mt-2 rounded-md "
            />
            <label
              className="text-white text-lg after:content-['*'] after:ml-0.5 after:text-red-500"
              htmlFor="UserName"
            >
              UserName
            </label>
          </div>
          <div className="flex flex-col mb-4">
            <input
              placeholder="youremail@test.com"
              required
              name="email"
              type="email"
              id="email"
              value={formState.email}
              onChange={handleChange}
              className="border border-blue-300 p-2 mt-2 rounded-md"
            />
            <label
              className="text-white text-lg after:content-['*'] after:ml-0.5 after:text-red-500"
              htmlFor="email"
            >
              Email
            </label>
          </div>
          <div className="flex flex-col mb-4">
            <input
              placeholder="******"
              required
              name="password"
              type="password"
              id="password"
              value={formState.password}
              onChange={handleChange}
              className="border border-blue-300 p-2 mt-2 rounded-md"
            />
            <label
              className="text-white text-lg after:content-['*'] after:ml-0.5 after:text-red-500"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="flex flex-col mb-4">
            <input
              placeholder="Linkedin URL"
              name="linkedin"
              type="url"
              id="linkedin"
              value={formState.linkedin}
              onChange={handleChange}
              className="border border-blue-300 p-2 mt-2 rounded-md"
            />
            <label className="text-white text-lg" htmlFor="email">
              Linkedin URL
            </label>
          </div>
          <div className="flex flex-col mb-4">
            <input
              placeholder="Github URL"
              name="github"
              type="url"
              id="github"
              value={formState.github}
              onChange={handleChange}
              className="border border-blue-300 p-2 mt-2 rounded-md"
            />
            <label className="text-white text-lg" htmlFor="github">
              Github URL
            </label>
          </div>
          <div className="flex flex-col mb-4">
            <input
              placeholder="Personal Website"
              name="website"
              type="url"
              id="website"
              value={formState.website}
              onChange={handleChange}
              className="border border-blue-300 p-2 mt-2 rounded-md"
            />
            <label className="text-white text-lg" htmlFor="website">
              Personal Website
            </label>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                name="profilePicUrl"
              />
              {selectedFile && (
                <div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    style={{ width: "300px", height: "auto" }}
                  />
                </div>
              )}
              {uploadProgress > 0 && (
                <div>Upload Progress: {uploadProgress}%</div>
              )}
              <button type="button" onClick={handleUpload}>
                Upload Image
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              className="background-yellow text-black py-2 px-4 rounded hover:background-darkBlue hover:text-white text-bold"
              type="submit"
            >
              Sign Up
            </button>

            {/* add navigation to back button */}
            <Link
              to="/login"
              className="background-yellow text-black py-2 px-4 rounded hover:background-darkBlue hover:text-white text-bold"
            >
              Back
            </Link>
          </div>
          <div className="">
            <p className="text-m text-white flex items-center justify-center mt-6">
              Have an account?&nbsp;&nbsp;
              <Link
                to="/login"
                className="color-yellow hover:color-dkblue focus:text-sky-400"
              >
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
