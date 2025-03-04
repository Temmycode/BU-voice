export class Staff {
  id: number;
  email: string;
  fullname: string;
  role: string;
  createdAt: Date;

  constructor(
    id: number,
    email: string,
    fullname: string,
    role: string,
    createdAt: Date
  ) {
    this.id = id;
    this.email = email;
    this.fullname = fullname;
    this.role = role;
    this.createdAt = createdAt;
  }

  static fromJson(json: any): Staff {
    return new Staff(
      json.id,
      json.email,
      json.fullname,
      json.role.name,
      new Date(json.created_at)
    );
  }
}
