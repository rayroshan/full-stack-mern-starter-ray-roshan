import axios from "axios";

export const getUser = async (auth, realtime) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser || realtime) {
    let options = {
      method: "GET",
      url: `${process.env.BASE_URL}/api/users/getUserById`,
      params: {
        userId: auth.userId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    };
    const response = await axios.request(options);
    const data = response.data;
    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  } else {
    return storedUser;
  }
};
