import axios from "axios";
import { useEffect, useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
const Logreg = () => {
  const [Name, setname] = useState("");
  const [Password, setpassword] = useState("");
  const [RePassword, setrepassword] = useState("");
  const [Ph, setph] = useState("");
  const [Email, setemail] = useState("");
  const [Sh0, setsh0] = useState("none");
  const [Sh1, setsh1] = useState("none");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [navi, setnavi] = useState(0);
  const nav = useNavigate();
  useEffect(() => {
    localStorage.clear();
  });
  const navigate = (e) => {
    if (e === 0) {
      setsh0("");
      setsh1("none");
    } else if (e === 1) {
      setsh1("");
      setsh0("none");
    }
  };
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
        var k = { Name: Name, Password: Password, Ph: Ph, Email: Email };
        setnavi(1);
        axios.post("http://127.0.0.1:5000/register", k).then((Response) => {
          setnavi(0);
          if (Response.data === "account created successfully") {
            alert(Response.data);
            setname("");
            setpassword("");
            setemail("");
            setrepassword("");
            setph("");
            setsh0("");
            setsh1("none");
            setError("");
            setErrorMessage("");
          } else {
            alert(Response.data);
          }
        });
      }
    } else {
      setErrorMessage("Is Not Strong Password");
    }
  };
  const check = () => {
    var k = { Name: Email, Password: Password };
    setnavi(1);
    axios.post("http://127.0.0.1:5000/Check", k).then((Response) => {
      setnavi(0);
      if (Response.data === "No user found") {
        alert(Response.data);
      } else {
        setname("");
        setpassword("");
        localStorage.setItem("userid", Response.data["id"]);
        localStorage.setItem("name", Response.data["name"]);
        nav("/");
        console.log(localStorage);
      }
    });
  };
  if (navi === 0) {
    return (
      <>
        <div className="container-fluid center mainbg">
          <h3 className="bor4">Hi, Login Or register to go Home page</h3>
          <hr />
          <div className="btn-group center " style={{ marginTop: "2%" }}>
            <button className="btn btn-dark" onClick={() => navigate(0)}>
              Login
            </button>
            <button className="btn btn-dark" onClick={() => navigate(1)}>
              Registration
            </button>
          </div>
          <div className="bor " style={{ display: Sh0 }}>
            <h5>Login</h5>
            <hr />
            <label htmlFor="email">
              <b>Email</b>
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
              id="email"
              value={Email}
              onChange={(e) => setemail(e.target.value)}
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
              className="form-control"
              placeholder="Enter your Password"
              value={Password}
              onChange={(e) => setpassword(e.target.value)}
            />

            <br />
            <input onClick={check} type="Submit" className="btn btn-dark" />
          </div>
          <div className="bor" style={{ display: Sh1 }}>
            <h5>Registration</h5>
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
            <label htmlFor="Phone">
              <b> Phone</b>
            </label>
            <br />
            <input
              type="text"
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              placeholder="Enter your Phone Number"
              className="form-control"
              id="Phone"
              value={Ph}
              onChange={(e) => setph(e.target.value)}
            />
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
  } else {
    return (
      <>
        <Loading />
      </>
    );
  }
};

export default Logreg;
