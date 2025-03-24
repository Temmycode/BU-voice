export class Role {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromJson(json: any): Role {
    return new Role(json.id, json.name);
  }

  toJson(): object {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export class Staff {
  id: number;
  email: string;
  fullname: string;
  department: string;
  hallName: string | null;
  imageUrl: string;
  role: Role;
  created_at: Date;

  constructor(
    id: number,
    email: string,
    fullname: string,
    department: string,
    hallName: string | null,
    imageUrl: string,
    role: Role,
    created_at: Date
  ) {
    this.id = id;
    this.email = email;
    this.fullname = fullname;
    this.role = role;
    this.department = department;
    this.hallName = hallName;
    this.imageUrl = imageUrl;
    this.created_at = created_at;
  }

  static fromJson(json: any): Staff {
    return new Staff(
      json.id,
      json.email,
      json.fullname,
      json.department,
      json.hall_name,
      json.image_url,
      Role.fromJson(json.role),
      new Date(json.created_at)
    );
  }

  toJson(): object {
    return {
      id: this.id,
      email: this.email,
      fullname: this.fullname,
      department: this.department,
      hall_name: this.hallName,
      image_url: this.imageUrl,
      role: this.role.toJson(),
      created_at: this.created_at.toISOString(),
    };
  }
}
