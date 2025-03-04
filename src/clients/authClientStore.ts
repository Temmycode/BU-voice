import { create } from "zustand";
import axios from "axios";

interface AuthClientStore {
  loading: boolean;
  studentLogin: (email: string, password: string) => Promise<boolean>;
  staffLogin: (email: string, password: string) => Promise<void>;
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
  ) => Promise<void>;
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

      // Store the token if your API returns one
      if (token) {
        localStorage.setItem("token", token);
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

      if (response.status !== 200) {
        throw new Error("Login failed");
      }

      // Login the student
    } catch (err) {
      console.error(err);
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
    set({ loading: true });
    try {
      const response = await api.post("/staff", {
        email,
        fullname,
        department,
        role,
        password,
        hall,
      });

      if (response.status !== 201) {
        throw new Error("Creating Staff Failed");
      }

      // * Staff has been created
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
