export class Student {
  id: number;
  matricNo: string;
  fullName: string;
  email: string;
  department: string;
  school: string;
  hallName: string;
  profileImage: string | null;
  createdAt: Date;

  constructor(data: {
    id: number;
    matricNo: string;
    fullName: string;
    email: string;
    department: string;
    school: string;
    hallName: string;
    profileImage: string | null;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.matricNo = data.matricNo;
    this.fullName = data.fullName;
    this.email = data.email;
    this.department = data.department;
    this.school = data.school;
    this.hallName = data.hallName;
    this.profileImage = data.profileImage;
    this.createdAt = data.createdAt;
  }

  static fromJson(json: any): Student {
    console.log(`The data {json.created_at}`);
    const createdAt =
      typeof json.created_at === "string"
        ? new Date(json.created_at)
        : json.created_at;

    if (!(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      console.warn("Invalid date format received:", json.created_at);
      throw new Error("Invalid date format received");
    }

    return new Student({
      id: json.id,
      matricNo: json.matric_no,
      fullName: json.fullname,
      email: json.email,
      department: json.department,
      school: json.school,
      hallName: json.hallname,
      profileImage: json.profile_image,
      createdAt,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      matric_no: this.matricNo,
      fullname: this.fullName,
      email: this.email,
      department: this.department,
      school: this.school,
      hallname: this.hallName,
      profile_image: this.profileImage,
      created_at: this.createdAt.toISOString(),
    };
  }
}
