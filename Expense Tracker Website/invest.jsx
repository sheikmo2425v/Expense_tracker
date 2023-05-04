import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./loading";

const Investment = () => {
  const [total, settotal] = useState(0);
  const [userid, setuserid] = useState(localStorage.getItem("userid"));
  const [Name, setName] = useState(localStorage.getItem("name"));
  const [data, setdata] = useState([]);
  const [data2, setdata2] = useState([]);
  const [sh0, setsh0] = useState("none");
  const [navi, setnavi] = useState(0);
  const nav = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userid") === null) {
      nav("/Logreg");
    } else {
      setnavi(1);
      axios
        .post("http://127.0.0.1:5000/gettotal_invest", { userid: userid })
        .then((res) => {
          setnavi(0);
          settotal(res.data["total"]);
          setdata(res.data["data"]);
        });
    }
  }, []);
  const getabout = (e) => {
    setnavi(1);
    axios
      .post("http://127.0.0.1:5000/about", { userid: userid, wi: e })
      .then((res) => {
        setnavi(0);
        setdata2(res.data);
      });
  };
  if (navi === 0) {
    return (
      <>
        <div className="border p-3 container-fluid mainbg">
          <button className="btn btn-dark" onClick={() => nav("/")}>
            Back
          </button>
          <div className="  bor3    ">
            <p>
              <b>Total:{total}</b>
            </p>
            <br />
          </div>
          <div className="bor2">
            <table className="table table-dark table-hover  ">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Amount</th>
                  <th>Where_invest</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => {
                  return (
                    <>
                      <tr key={0} onClick={() => (getabout(d[3]), setsh0(""))}>
                        <td>{d[1]}</td>
                        <td>{d[2]}</td>
                        <td>{d[3]}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bor2" style={{ display: sh0 }}>
            <button
              style={{ float: "left" }}
              className="btn btn-dark"
              onClick={() => setsh0("none")}
            >
              Hide
            </button>
            <table className="table table-dark table-hover  ">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Where_invest</th>
                  <th> Bank/cash</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data2.map((d) => {
                  return (
                    <>
                      <tr key={0}>
                        <td>{d[2]}</td>
                        <td>{d[3]}</td>
                        <td>{d[4]}</td>
                        <td>{d[6]}</td>
                        <td>{d[5]}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
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

export default Investment;
