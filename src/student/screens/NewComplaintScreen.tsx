import React, { useState } from "react";
import TextField from "../../components/TextField";
import {
  ComplaintData,
  CourseUploadData,
  useComplaintClientStore,
} from "../../clients/complaintClientStore";
import { useAlert } from "../../providers/AlertContext";
import { ClipLoader } from "react-spinners";

const categories = [
  { id: 1, name: "Hall" },
  { id: 2, name: "Course" },
  { id: 3, name: "Bursary" },
];

const priorities = [
  { id: 1, name: "Critical" },
  { id: 2, name: "High" },
  { id: 3, name: "Medium" },
  { id: 4, name: "Low" },
];

export default function NewComplaintScreen() {
  const {
    loading,
    setIsComplaintDialogOpen,
    submitComplaint,
    submitCourseUpload,
  } = useComplaintClientStore();
  const { showAlert } = useAlert();
  const [isCourseUpload, setIsCourseUpload] = useState(false);
  const [complaintData, setComplaintData] = useState<ComplaintData>({
    title: "",
    description: "",
    categoryId: 0,
    priorityId: 0,
  });
  const [courseUploadData, setCourseUploadData] = useState<CourseUploadData>({
    level: 0,
    academicYear: new Date().getFullYear(),
    reason: "",
    courseTitle: "",
    courseCode: "",
    totalUnitsForSemester: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    let isSubmitted: boolean;
    e.preventDefault();
    // Handle form submission
    console.log({
      ...complaintData,
      courseUploadData: isCourseUpload ? courseUploadData : undefined,
    });

    if (isCourseUpload) {
      isSubmitted = await submitCourseUpload(courseUploadData);
    } else {
      isSubmitted = await submitComplaint(complaintData);
    }

    if (isSubmitted) {
      showAlert("Complaint submitted successfully", "success");
      setIsComplaintDialogOpen(false);
    } else {
      showAlert("Failed to submit complaint", "error");
    }
  };

  const ButtonData = () => {
    if (loading) {
      return <ClipLoader color="white" size={20} />;
    } else {
      return <div>Submit Complaint</div>;
    }
  };

  return (
    <div className="min-h-screen bg-off-white p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-primary-black mb-6">
          Submit a New Complaint
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-black">
              Complaint Category
            </label>
            <select
              className="w-full rounded-lg border-1 border-border-color p-3 focus:outline-none focus:ring-2 focus:ring-primary-purple"
              value={complaintData.categoryId}
              onChange={(e) => {
                const categoryId = parseInt(e.target.value);
                setComplaintData({ ...complaintData, categoryId });
                setIsCourseUpload(categoryId === 2); // 2 is Course category
              }}
            >
              <option value={0}>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course Upload Specific Fields */}
          {isCourseUpload && (
            <div className="space-y-4 p-4 bg-faint-red rounded-lg">
              <h2 className="text-xl font-semibold text-primary-black mb-4">
                Course Upload Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  hint="Level"
                  type="number"
                  value={courseUploadData.level.toString()}
                  onChange={(value) =>
                    setCourseUploadData({
                      ...courseUploadData,
                      level: parseInt(value),
                    })
                  }
                />
                <TextField
                  hint="Academic Year"
                  type="number"
                  value={courseUploadData.academicYear.toString()}
                  onChange={(value) =>
                    setCourseUploadData({
                      ...courseUploadData,
                      academicYear: parseInt(value),
                    })
                  }
                />
                <TextField
                  hint="Course Title"
                  value={courseUploadData.courseTitle}
                  onChange={(value) =>
                    setCourseUploadData({
                      ...courseUploadData,
                      courseTitle: value,
                    })
                  }
                  required
                />
                <TextField
                  hint="Course Code"
                  value={courseUploadData.courseCode}
                  onChange={(value) =>
                    setCourseUploadData({
                      ...courseUploadData,
                      courseCode: value,
                    })
                  }
                />
                <TextField
                  hint="Total Units for Semester"
                  type="number"
                  value={courseUploadData.totalUnitsForSemester.toString()}
                  onChange={(value) =>
                    setCourseUploadData({
                      ...courseUploadData,
                      totalUnitsForSemester: parseInt(value),
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-4">
            <TextField
              hint="Title"
              borderRadius="rounded-lg"
              value={complaintData.title}
              onChange={(value) =>
                setComplaintData({ ...complaintData, title: value })
              }
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-black">
                Description
              </label>
              <textarea
                className="font-jaka w-full rounded-lg border-1 border-border-color p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary-purple"
                value={
                  isCourseUpload
                    ? courseUploadData.reason
                    : complaintData.description
                }
                onChange={(e) => {
                  if (isCourseUpload) {
                    setCourseUploadData({
                      ...courseUploadData,
                      reason: e.target.value,
                    });
                  } else {
                    setComplaintData({
                      ...complaintData,
                      description: e.target.value,
                    });
                  }
                }}
                required
              />
            </div>

            {/* Priority Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-black">
                Priority Level
              </label>
              <select
                className="w-full rounded-lg border-1 border-border-color p-3 focus:outline-none focus:ring-2 focus:ring-primary-purple"
                value={complaintData.priorityId}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    priorityId: parseInt(e.target.value),
                  })
                }
                required
              >
                <option value={0}>Select Priority</option>
                {priorities.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-black">
                Attach File (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle file upload logic here
                      setComplaintData({
                        ...complaintData,
                        fileUrl: file,
                      });
                    }
                  }}
                />
                <div className="w-full rounded-lg border border-border-color p-3 flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary-purple">
                  <span className="border-primary-purple border-1 text-primary-black px-4 py-1 rounded-md text-sm">
                    Choose File
                  </span>
                  <span className="text-gray-500 text-sm">
                    {complaintData.fileUrl?.name || "No file selected"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary-purple text-white py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            <ButtonData />
          </button>
        </form>
      </div>
    </div>
  );
}
