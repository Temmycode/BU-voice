import { ComplaintAssignmentResponse } from "../clients/complaintClientStore";
import { Staff } from "./staff";

export class ComplaintAssignment {
  id: number;
  staff: Staff;
  complaintId: number;
  status: string;
  response: string | null; // Staff's response to the student
  internalNotes: string | null; // Notes visible only to staff
  assignedAt: Date;
  updatedAt: Date; // When the assignment was last updated
  resolvedAt: Date | null;
  expectedResolutionDate: Date | null; // When the complaint is expected to be resolved
  followUpActions: string | null; // Any follow-up actions needed
  attachments: string[] | null; // URLs to any files attached by staff

  constructor(
    id: number,
    staff: Staff,
    complaintId: number,
    status: string,
    response: string | null,
    internalNotes: string | null,
    assignedAt: Date,
    updatedAt: Date,
    resolvedAt: Date | null,
    expectedResolutionDate: Date | null,
    followUpActions: string | null,
    attachments: string[] | null
  ) {
    this.id = id;
    this.staff = staff;
    this.complaintId = complaintId;
    this.status = status;
    this.response = response;
    this.internalNotes = internalNotes;
    this.assignedAt = assignedAt;
    this.updatedAt = updatedAt;
    this.resolvedAt = resolvedAt;
    this.expectedResolutionDate = expectedResolutionDate;
    this.followUpActions = followUpActions;
    this.attachments = attachments;
  }

  static fromJson(json: ComplaintAssignmentResponse): ComplaintAssignment {
    return new ComplaintAssignment(
      json.id,
      Staff.fromJson(json.staff),
      json.complaint_id,
      json.status,
      json.response,
      json.internal_notes,
      new Date(json.assigned_at),
      new Date(json.updated_at),
      json.resolved_at ? new Date(json.resolved_at) : null,
      json.expected_resolution_date
        ? new Date(json.expected_resolution_date)
        : null,
      json.follow_up_actions,
      json.attachments
    );
  }
}
