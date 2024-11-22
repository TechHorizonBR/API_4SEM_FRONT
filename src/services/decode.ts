import {jwtDecode} from "jwt-decode";

export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error: any) {
    console.error("Error to decode token:", error);
    return null;
  }
};