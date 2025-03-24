import { ComplaintCategoryResponse } from "../clients/complaintClientStore";

export class ComplaintCategory {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromJson(json: ComplaintCategoryResponse): ComplaintCategory {
    return new ComplaintCategory(json.id, json.name);
  }

  toJson(): object {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
