import { create } from "zustand";
import axios from "axios";
import { Student } from "../models/student";
import { Staff } from "../models/staff";

interface AuthClientStore {
  loading: boolean;
  studentLogin: (email: string, password: string) => Promise<boolean>;
  updateStudentProfilePicture: (file: File) => Promise<boolean>;
  staffLogin: (
    email: string,
    password: string
  ) => Promise<{ result: boolean; staffRoleId: number | null }>;
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
  departmentStaffs: Staff[];
  getAllDepartmentStaff: () => Promise<void>;
  logout: () => Promise<void>;
}

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export const useAuthClientStore = create<AuthClientStore>((set, get) => ({
  loading: false,
  studentLogin: async (email, password) => {
    set({ loading: true });

    try {
      // Create form data
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const { data } = await api.post("/student/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!data) {
        console.error("No data received from server");
        return false;
        // throw new Error("No data received from server");
      }

      const token = data.data.access_token;
      const studentData = data.data.student;
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
  updateStudentProfilePicture: async (file: File) => {
    set({ loading: true });

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profile_picture", file);

      const { data, status } = await api.patch(
        "/student/update-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data) {
        console.error("No data received from server");
        return false;
      }

      if (status !== 200) {
        console.error("Something went wrong");
        console.error(data);
        return false;
      }

      const student = (() => {
        const storedData = localStorage.getItem("user");
        if (!storedData) return null;

        const parsedData = JSON.parse(storedData);
        return Student.fromJson(parsedData);
      })();

      student!.profileImage = data.data.profile_picture_url;
      console.log(student);

      localStorage.setItem("user", JSON.stringify(student?.toJson()));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  getAllDepartmentStaff: async () => {
    console.log("Waht a life");
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/complaint/get-department-staff", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response); // Debugging

      if (response.status !== 200 || !response.data) {
        console.error("Invalid API response", response);
        return;
      }

      const staffs = response.data.data || []; // Ensure it's an array
      console.log("Staff List:", staffs);
      localStorage.setItem("staff-members", JSON.stringify(staffs));
      set({ departmentStaffs: staffs });
    } catch (err) {
      console.error("Error fetching department staff:", err);
    }
  },

  staffLogin: async (email, password) => {
    set({ loading: true });

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const { data } = await api.post("/staff/login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!data) {
        console.error("No data received from server");
        return { result: false, staffRoleId: null };
        // throw new Error("No data received from server");
      }

      const token = data.data.access_token;
      const staffData = data.data.staff;
      const staff = Staff.fromJson(staffData);

      // Store the token if your APIs one
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(staff.toJson()));
      }

      if (staff.role.id < 4) {
        console.log("We are admin");
        await get().getAllDepartmentStaff();
      }

      return { result: true, staffRoleId: staff.role.id };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data);
        // throw new Error(error.response?.data?.message || "Login failed");
      }
      // throw error;
      return { result: false, staffRoleId: null };
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

      const { data, status } = await api.patch(
        "/staff/update-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data) {
        console.error("No data received from server");
        return false;
      }

      if (status !== 200) {
        console.error("Something went wrong");
        console.error(data);
        return false;
      }

      const staff = (() => {
        const storedData = localStorage.getItem("user");
        if (!storedData) return null;

        const parsedData = JSON.parse(storedData);
        return Staff.fromJson(parsedData);
      })();

      staff!.imageUrl = data.data.profile_picture_url;
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
      const { data, status } = await api.post(
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

      if (status !== 201) {
        return false;
        throw new Error("Student Creation Failed");
      }

      // * Student is logged in
      console.log(data);
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

      const { status } = await api.post("/staff", body, {
        headers: { "Content-Type": "application/json" },
      });

      if (status !== 201) {
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
  departmentStaffs: JSON.parse(localStorage.getItem("staff-members") || "[]"),
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
