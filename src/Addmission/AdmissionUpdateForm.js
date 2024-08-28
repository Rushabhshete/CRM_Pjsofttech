// src/components/UpdateForm.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../api/axiosConfig";
import axiosInstance from "../Addmission/api/axiosConfig";
import admissionService from "../Addmission/api/admissionService";
const UpdateForm = () => {
  const [studentData, setStudentData] = useState({});
  const { sid } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axiosInstance.get(`/getAdmissionById/${sid}`);
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data", error);
      }
    };
    fetchStudent();
  }, [sid]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await admissionService.updateAdmission(studentData, sid);
      navigate("/"); // Updated navigation to use navigate function
    } catch (error) {
      console.error("Error updating student", error);
    }
  };
  return (
    <div>
      <h2>Update Student</h2>
      <form onSubmit={handleSubmit}>
        {/* Updated value attributes to use correct state properties */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={studentData.name || ""}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="status1"
          placeholder="Status"
          value={studentData.status1 || ""}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="scourses"
          placeholder="Courses"
          value={studentData.scourses || ""}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mob"
          placeholder="Mobile Number"
          value={studentData.mob || ""}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="pendingAmount"
          placeholder="Pending Amount"
          value={studentData.pendingAmount || ""}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={studentData.duration || ""}
          onChange={handleChange}
          required
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};
export default UpdateForm;
