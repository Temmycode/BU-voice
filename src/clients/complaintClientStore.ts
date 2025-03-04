import { create } from "zustand";
import { Complaint } from "../models/complaint";
import axios, { AxiosError } from "axios";
import { complaintStatus } from "../constants/constants";

export interface ComplaintData {
  title: string;
  description: string;
  categoryId: number;
  priorityId: number;
  fileUrl?: File;
  courseUploadData?: CourseUploadData;
}

export interface CourseUploadData {
  level: number;
  academicYear: number;
  reason: string;
  courseTitle: string;
  courseCode: string;
  totalUnitsForSemester: number;
}

interface ComplaintClient {
  loading: boolean;
  isComplaintDialogOpen: boolean;
  setIsComplaintDialogOpen: (value: boolean) => void;
  filter?: string;
  setFilter: (value: string) => void;
  complaints: Complaint[];
  searchedComplaints: Complaint[];
  originalComplaints?: Complaint[];
  filterComplaint: () => void;
  searchComplaint: (searchQuery: string) => void;
  getStudentsComplaints: () => Promise<void>;
  submitComplaint: (complaintData: ComplaintData) => Promise<boolean>;
  submitCourseUpload: (uploadData: CourseUploadData) => Promise<boolean>;
}

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

export const useComplaintClientStore = create<ComplaintClient>((set, get) => ({
  loading: false,
  isComplaintDialogOpen: false,
  setIsComplaintDialogOpen(value: boolean) {
    set({ isComplaintDialogOpen: value });
  },
  filter: undefined,
  complaints: [],
  searchedComplaints: [],
  originalComplaints: [],
  filterComplaint: () => {
    const currentFilter = get().filter;
    const originalComplaints = get().originalComplaints;

    console.log(currentFilter);

    if (!currentFilter || !originalComplaints) {
      console.log("something");
      return;
    }

    if (currentFilter === complaintStatus[0]) {
      set({ complaints: originalComplaints });
      return;
    }

    const filteredComplaints = originalComplaints.filter((complaint) => {
      console.log(complaint);
      const status = complaint.complaintAssignment?.status?.toLowerCase();
      // console.log(complaint.complaintAssignment);
      return status === currentFilter.toLowerCase();
    });

    console.log(filteredComplaints);

    set({ complaints: filteredComplaints });
  },
  searchComplaint: (searchQuery: string) => {
    set({ loading: true });

    try {
      const originalComplaints = get().originalComplaints;

      if (!originalComplaints) return;

      if (!searchQuery) {
        set({ complaints: originalComplaints });
        return;
      }

      const searchedComplaints = originalComplaints.filter((complaint) => {
        const title = complaint.title.toLowerCase();
        const description = complaint.description.toLowerCase();
        return title.includes(searchQuery) || description.includes(searchQuery);
      });

      set({ complaints: searchedComplaints });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
  setFilter: (value: string) => {
    set({ filter: value });
    get().filterComplaint();
  },
  getStudentsComplaints: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      console.log(token);

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get("/complaint/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        console.log("An error occured");
      }

      const complaints = response.data.data.map((complaint: any) =>
        Complaint.fromJson(complaint)
      );
      console.log(complaints);

      // Store both original and filtered complaints
      set({
        complaints,
        originalComplaints: complaints,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          // Handle unauthorized error
          localStorage.removeItem("token"); // Clear invalid token
          // set({ error: "Session expired. Please login again." });
          // Optionally redirect to login page
          window.location.href = "/login";
        } else {
          // set({ error: error.message || "Failed to fetch complaints" });
        }
      } else {
        // set({ error: "An unexpected error occurred" });
      }
      console.error("Complaint fetch error:", error);
    } finally {
      set({ loading: false });
    }
  },
  submitComplaint: async (complaintData: ComplaintData) => {
    set({ loading: true });

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", complaintData.title);
      formData.append("description", complaintData.description);
      formData.append("category_id", complaintData.categoryId.toString());
      formData.append("priority_id", complaintData.priorityId.toString());
      if (complaintData.fileUrl) {
        formData.append("file", complaintData.fileUrl);
      }

      const response = await api.post("/complaint", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        console.error("No data received from server");
        return false;
      }

      if (response.status !== 201) {
        console.error("Something went wrong");
        console.error(response.data);
        return false;
      }

      get().getStudentsComplaints();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  submitCourseUpload: async (uploadData: CourseUploadData) => {
    set({ loading: true });
    const body = {
      level: uploadData.level,
      academic_year: uploadData.academicYear,
      reason: uploadData.reason,
      course_title: uploadData.courseTitle,
      course_code: uploadData.courseCode,
      total_units_for_the_semester: uploadData.totalUnitsForSemester,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/complaint/course-upload", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      if (response.status !== 201) {
        console.error("An error occurred");
        return false;
      }

      get().getStudentsComplaints();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
