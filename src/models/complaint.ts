import { ComplaintResponse } from "../clients/complaintClientStore";
import { ComplaintAssignment } from "./complaintAssignment";
import { ComplaintCategory } from "./complaintCategory";

export class Complaint {
  id: string;
  studentId: number;
  category?: ComplaintCategory;
  priorityId: number | null;
  title: string;
  description: string;
  fileUrl: string | null;
  status: string;
  complaintAssignment: ComplaintAssignment | null;
  createdAt: Date;

  constructor(
    id: string,
    studentId: number,
    category: ComplaintCategory,
    priorityId: number | null,
    title: string,
    description: string,
    fileUrl: string | null,
    status: string,
    complaintAssignment: ComplaintAssignment | null,
    createdAt: Date
  ) {
    this.id = id;
    this.studentId = studentId;
    this.category = category;
    this.priorityId = priorityId;
    this.title = title;
    this.description = description;
    this.fileUrl = fileUrl;
    this.status = status;
    this.complaintAssignment = complaintAssignment;
    this.createdAt = createdAt;
  }

  static fromJson(json: ComplaintResponse): Complaint {
    return new Complaint(
      json.id,
      json.student_id,
      ComplaintCategory.fromJson(json.category),
      json.priority_id,
      json.title,
      json.description,
      json.file_url,
      json.status,
      json.complaint_assignment
        ? ComplaintAssignment.fromJson(json.complaint_assignment)
        : null,
      new Date(json.created_at)
    );
  }

  toJson(): object {
    return {
      id: this.id,
      student_id: this.studentId,
      category_id: this.category?.toJson(),
      priority_id: this.priorityId,
      title: this.title,
      description: this.description,
      file_url: this.fileUrl,
      status: this.status,
      created_at: this.createdAt.toISOString(),
    };
  }
}
