//axios library to fetch the api
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_SERVER_URL;

//url : crm/api/v1/tickets
// to fetch the api there is an Authorization
// Authorisation:x-access-token:token,userId:userid
//there is a delay in fecthing the api if there is a delay the ui will not be able to render anything throw an error
//so use async await
// post api:allow the user to create a ticket
//put api:allow the engineer ,user to edit the ticket
// post api : allow the user to create a ticket
// url : crm/api/v1/tickets
// Authorization : x-access-token : token

// put api : allow the engineer,user to edit the ticket
// url : crm/api/v1/tickets/${id}
// Authorization : x-access-token : token , userId: userid
export async function fetchTicket(data) {
  return await axios.get(
    `${API_BASE_URL}/crm/api/v1/tickets`,
    {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    },
    {
      userId: localStorage.getItem("userId"),
    }
  );
}
