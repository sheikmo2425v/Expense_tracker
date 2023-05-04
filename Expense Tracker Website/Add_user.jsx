import { useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Add_User = () => {
  const [Name, setname] = useState("");
  const [Password, setpassword] = useState("");
  const [RePassword, setrepassword] = useState("");
  const [Email, setemail] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();
  const register = () => {
    if (
      validator.isStrongPassword(Password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setErrorMessage("");
      if (Password !== RePassword) {
        setError("Passwords do not match");
        return;
      } else {
        setError("");
        var k = {
          userid: localStorage.getItem("userid"),
          Name: Name,
          Password: Password,
          Email: Email,
        };
        axios.post("http://127.0.0.1:5000/add_user", k).then((Response) => {
          if (Response.data === "User created successfully") {
            alert(Response.data);
            setname("");
            setpassword("");
            setemail("");
            setrepassword("");

            setError("");
            setErrorMessage("");
            nav("/");
          } else {
            alert(Response.data);
          }
        });
      }
    } else {
      setErrorMessage("Is Not Strong Password");
    }
  };
  return (
    <>
      <div className="container-fluid  mainbg">
        <button className="btn  btn-dark" onClick={() => nav("/")}>
          Back
        </button>

        <div className="bor center">
          <h5>Add User</h5>
          <hr />
          <label htmlFor="Name">
            <b>Name</b>
          </label>
          <br />
          <input
            type="text"
            style={{
              border: "2px solid black",
              backgroundColor: "rgba(239, 140, 11,0.5)",
            }}
            placeholder="Enter your Name"
            className="form-control"
            id="Name"
            value={Name}
            onChange={(e) => setname(e.target.value)}
          />
          <br />
          <label htmlFor="psd">
            <b>Password</b>
          </label>
          <br />
          <input
            type="password"
            style={{
              border: "2px solid black",
              backgroundColor: "rgba(239, 140, 11,0.5)",
            }}
            placeholder="Enter your Password"
            className="form-control"
            value={Password}
            id="psd"
            onChange={(e) => setpassword(e.target.value)}
          />

          {errorMessage === "" ? null : (
            <span style={{ color: "red" }}>{errorMessage}</span>
          )}
          <br />
          <label htmlFor="rpsd">
            <b>Retype-Password</b>
          </label>
          <br />
          <input
            type="password"
            style={{
              border: "2px solid black",
              backgroundColor: "rgba(239, 140, 11,0.5)",
            }}
            placeholder="Enter your Password again"
            className="form-control"
            id="rpsd"
            value={RePassword}
            onChange={(e) => setrepassword(e.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}

          <br />
          <label htmlFor="Email">
            <b>Email ID</b>
          </label>
          <br />
          <input
            type="text"
            style={{
              border: "2px solid black",
              backgroundColor: "rgba(239, 140, 11,0.5)",
            }}
            placeholder="Enter your Email"
            className="form-control"
            id="Email"
            value={Email}
            onChange={(e) => setemail(e.target.value)}
          />
          <br />

          <input type="Submit" className="btn btn-dark" onClick={register} />
        </div>
      </div>
    </>
  );
};

export default Add_User;
