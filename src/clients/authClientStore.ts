import { create } from "zustand";
import axios from "axios";
import { Student } from "../models/student";
import { Staff } from "../models/staff";

interface AuthClientStore {
  loading: boolean;
  studentLogin: (email: string, password: string) => Promise<boolean>;
  staffLogin: (email: string, password: string) => Promise<boolean>;
  updateStaffProfilePicture: (file: File) => Promise<boolean>;
  createStudent: (
    fullname: string,
    matricNo: string,
    school: string,
    email: string,
    password: string,
    department: string,
    hallname: string
  ) => Promise<boolean>;
  createStaff: (
    email: string,
    fullname: string,
    department: string,
    role: number,
    password: string,
    hall?: string
  ) => Promise<boolean>;

  logout: () => Promise<void>;
}

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export const useAuthClientStore = create<AuthClientStore>((set) => ({
  loading: false,
  studentLogin: async (email, password) => {
    set({ loading: true });

    try {
      // Create form data
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/student/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data) {
        console.error("No data received from server");
        return false;
        // throw new Error("No data received from server");
      }

      const token = response.data.data.access_token;
      const studentData = response.data.data.student;
      const student = Student.fromJson(studentData);

      // Store the token if your API returns one
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(student.toJson()));
      }
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data);
        // throw new Error(error.response?.data?.message || "Login failed");
      }
      // throw error;
      return false;
    } finally {
      set({ loading: false });
    }
  },
  staffLogin: async (email, password) => {
    set({ loading: true });

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/staff/login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data) {
        console.error("No data received from server");
        return false;
        // throw new Error("No data received from server");
      }

      const token = response.data.data.access_token;
      const staffData = response.data.data.staff;
      const staff = Staff.fromJson(staffData);

      // Store the token if your API returns one
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(staff.toJson()));
      }
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data);
        // throw new Error(error.response?.data?.message || "Login failed");
      }
      // throw error;
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateStaffProfilePicture: async (file: File) => {
    set({ loading: true });

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await api.patch(
        "/staff/update-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        console.error("No data received from server");
        return false;
      }

      if (response.status !== 200) {
        console.error("Something went wrong");
        console.error(response.data);
        return false;
      }

      const staff = (() => {
        const storedData = localStorage.getItem("user");
        if (!storedData) return null;

        const parsedData = JSON.parse(storedData);
        return Staff.fromJson(parsedData);
      })();

      staff!.imageUrl = response.data.data.profile_picture_url;
      console.log(staff);

      JSON.stringify(staff?.toJson());
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  createStudent: async (
    fullname: string,
    matricNo: string,
    school: string,
    email: string,
    password: string,
    department: string,
    hallname: string
  ) => {
    set({ loading: true });
    try {
      const response = await api.post(
        "/student",
        {
          fullname,
          matric_no: matricNo,
          school,
          email,
          password,
          department,
          hallname,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status !== 201) {
        return false;
        throw new Error("Student Creation Failed");
      }

      // * Student is logged in
      console.log(response.data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createStaff: async (
    email: string,
    fullname: string,
    department: string,
    role: number,
    password: string,
    hall?: string
  ) => {
    console.log("I was pressed");
    set({ loading: true });
    try {
      let body;
      if (role === 1 || role === 4) {
        body = {
          email,
          fullname,
          department: "Hall",
          role,
          password,
          hall,
        };
      } else if (role === 3 || role === 6) {
        body = {
          email,
          fullname,
          department: "Bursary",
          role,
          password,
        };
      } else {
        body = {
          email,
          fullname,
          department,
          role,
          password,
          hall,
        };
      }

      const response = await api.post("/staff", body, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 201) {
        throw new Error("Creating Staff Failed");
      }

      // * Staff has been created

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
