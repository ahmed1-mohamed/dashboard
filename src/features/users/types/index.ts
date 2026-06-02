export interface User {
  user_id: number;
  name: string;
  profile_picture: string;
  role_name: string;
  email: string;
  lastLogin: string;
  status: "Active" | "Inactive" | "Suspended";
}
