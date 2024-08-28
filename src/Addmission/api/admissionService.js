// src/api/admissionService.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8085",
});

const admissionService = {
  saveAdmission: async (admissionData) => {
    try {
      const response = await axiosInstance.post(
        "/saveAdmission",
        admissionData
      );
      return response.data;
    } catch (error) {
      throw new Error("Error saving admission");
    }
  },
  getAllAdmissions: async () => {
    try {
      const response = await axiosInstance.get("/getAdmissionStudent");
      return response.data;
    } catch (error) {
      throw new Error("Error fetching admissions");
    }
  },
  getAdmissionById: async (sid) => {
    try {
      const response = await axiosInstance.get(`/getAdmissionById/${sid}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching admission by ID");
    }
  },
  updateAdmission: async (admissionData, sid) => {
    try {
      const response = await axiosInstance.put(
        `/UpdateAdmission/${sid}`,
        admissionData
      );
      return response.data;
    } catch (error) {
      throw new Error("Error updating admission");
    }
  },
  deleteAdmission: async (sid) => {
    try {
      await axiosInstance.delete(`/deleteAdmission/${sid}`);
    } catch (error) {
      throw new Error("Error deleting admission");
    }
  },
  patchAdmission: async (sid, admissionData) => {
    try {
      const response = await axiosInstance.patch(
        `/patchAdmission/${sid}`,
        admissionData
      );
      return response.data;
    } catch (error) {
      throw new Error("Error patching admission");
    }
  },
};

export default admissionService;
