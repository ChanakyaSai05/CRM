import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function userSignUp(data) {
  return await axios.post(`${API_BASE_URL}/crm/api/v1/auth/signup`, data);
}

export async function userSignIn(data) {
  return await axios.post(`${API_BASE_URL}/crm/api/v1/auth/signin`, data);
}
