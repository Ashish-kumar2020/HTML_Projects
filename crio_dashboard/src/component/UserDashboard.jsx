import { useState } from "react";

import axios from "axios";
function UserDashboard() {
  const [avatar,setAvatar] = useState("https://placehold.co/600x400");
  const [email,setEmail] = useState("");
  const [name,setName] = useState("");

  const handleButtonClick = async (e) => {
    console.log(e.target.value);
    const value = e.target.value;
    try {
      const response = await axios.get(`https://reqres.in/api/users/${value}`, {
        headers: {
          "x-api-key": "free_user_3FTEp5jf3GoyDg0KPWNqAqAliJg",
        },
      });
      console.log(response?.data?.data)
      setAvatar(response?.data?.data.avatar);
      setEmail(response?.data?.data.email);
      let userName = response?.data?.data?.first_name + response?.data?.data?.first_name.last_name;
      setName(userName);
    } catch (error) {
      
     if(error.response?.status === 404){
      alert("Faild to fetch data");
     }else{
      console.log("Somethingh went wrong")
     }
    }
  };
  return (
    <>
      <h1>User Dashboard</h1>
      <section>
        <div onClick={handleButtonClick}>
          <button type="button" value="1">
            1
          </button>
          <button type="button" value="2">
            2
          </button>
          <button type="button" value="3">
            3
          </button>
          <button type="button" value="100">
            100
          </button>
        </div>
        <div>
          <div>
            <label htmlFor="email">Email : </label>
            <span id="email">{email}</span>
          </div>
          <div>
            <label htmlFor="name">Name : </label>
            <span id="name">{name}</span>
          </div>
        </div>
        <div>
          <img src={avatar} alt="" />
        </div>
      </section>
    </>
  );
}

export default UserDashboard;
