import axios from "axios";

// const baseURL = "http://127.0.0.1:8000/";
const baseURL = "https://automations-apis.herokuapp.com/";

const getAxiosIncetent = () => {
  const token = localStorage.getItem("token");
  if (token === null || token === undefined) {
    return axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
  } else {
    return axios.create({
      baseURL: baseURL,
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
  }
};

const request = getAxiosIncetent();

export default request;
