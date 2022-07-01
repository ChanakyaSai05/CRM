import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function getAllUsers() {
  return await axios.get(`${API_BASE_URL}/crm/api/v1/users`, {
    //after users/${userId} we get  data specfific like if we are in admin we get admin data otherwise all data
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  });
}

export async function userUpdation(userId, data) {
  return await axios.put(
    `${API_BASE_URL}/crm/api/v1/users/${userId}`,
    data,
    {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }
    // {
    //   userId: localStorage.getItem("userId"),
    // }
  );
}
//update user details
//method: put
//func :(userId,data);
//url:/crm/api/v1/users/userId
//headers:token
//userId:body
export async function getCurrUser(userId) {
  return await axios.get(`${API_BASE_URL}/crm/api/v1/users/${userId}`, {
    //after users/${userId} we get  data specfific like if we are in admin we get admin data otherwise all data
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  });
}
