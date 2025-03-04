import { Staff } from "./staff";

export class ComplaintAssignment {
  id: number;
  staff: Staff;
  complaintId: number;
  status: string;
  assignedAt: Date;
  resolvedAt: Date | null;

  constructor(
    id: number,
    staff: Staff,
    complaintId: number,
    status: string,
    assignedAt: Date,
    resolvedAt: Date | null
  ) {
    this.id = id;
    this.staff = staff;
    this.complaintId = complaintId;
    this.status = status;
    this.assignedAt = assignedAt;
    this.resolvedAt = resolvedAt;
  }

  static fromJson(json: any): ComplaintAssignment {
    return new ComplaintAssignment(
      json.id,
      json.staff,
      json.complaint_id,
      json.status,
      new Date(json.assigned_at),
      json.resolved_at ? new Date(json.resolved_at) : null
    );
  }
}
