import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { Alert } from "react-bootstrap";


const Home = () => {
  const [Balance, setbalance] = useState("0");
  const [Cash, setcash] = useState("0");
  const [Bank, setbank] = useState("0");
  const [amount, setamount] = useState(0);
  const [Sh0, setsh0] = useState("none");
  const [Sh1, setsh1] = useState("none");
  const [Sh2, setsh2] = useState("none");
  const [Sh3, setsh3] = useState("none");
  const [Sh4, setsh4] = useState("none");
  const [Sh5, setsh5] = useState("none");
  const [toinex, settoinex] = useState("");
  const [type, settype] = useState([]);
  const [vl, setvl] = useState(0);
  const [c_b, setc_b] = useState("cash");
  const [c_b2, setc_b2] = useState("Bank");
  const [data, setdata] = useState([]);
  const [es, setes] = useState("");
  const [tempdata, settempdata] = useState([]);
  const nav = useNavigate();
  const [balance2, setbalnce2] = useState(0);
  const [income, setincome] = useState(0);
  const [expense, setexpense] = useState(0);
  const [userid, setuserid] = useState(localStorage.getItem("userid"));
  const [Name, setName] = useState(localStorage.getItem("name"));
  const [k, setk] = useState(0);
  const [inve, setinve] = useState(["Mutual Fund"]);
  const [wi, setwi] = useState("");
  const [navi, setnavi] = useState(0);
  useEffect(() => {
    getdata(0);
  }, []);
  useEffect(() => {
    if (localStorage.getItem("userid") === null) {
      nav("/Logreg");
    } else {
      setnavi(1);
      axios
        .post("http://127.0.0.1:5000/suggestion")
        .then((res) => {
          setnavi(0);

          var d = [];
          res.data["sugges"].map((s) => {
            d.push(s[0]);
          });
          settype(d);
          var e = [];
          res.data["inve"].map((s) => {
            e.push(s[0]);
          });
          setinve(e);
        })
        .catch((e) => {
          setnavi(0);
          alert("Server error" );
        });
      get_blance();
    }
  }, []);
  const get_blance = () => {
    setnavi(1);
    axios
      .post(" http://127.0.0.1:5000/getbalnce", {
        userid: userid,
      })
      .then((res) => {
        setnavi(0);
        setbalance(res.data["bal"]);
        setcash(res.data["cash"]);
        setbank(res.data["bank"]);
      })
      .catch((e) => {
        setnavi(0);
        alert("Server error");
      });
  };
  const update = (e) => {
    if (e === 0) {
      var t = "income";
    } else if (e == 1) {
      var t = "expense";
    }

    var k = {
      userid: userid,
      type: t,
      amount: amount,
      toinex: toinex,
      bank_cash: c_b,
      Name: Name,
    };
    setnavi(1);
    axios.post("http://127.0.0.1:5000/store_data", k).then((res) => {
      setnavi(0);
      if (res.data != "not enough amount available for expense") {
        setamount("");
        settoinex("");

        setsh0("none");
        setsh1("none");
        setsh4("none");
        setsh5("none");
        alert(res.data);
        get_blance();
        getdata(es);
      } else {
        alert(res.data);
      }
    });
  };
  const getdata = (e) => {
    setes(e);
    if (e != 3 && e != 4) {
      var k = { userid: userid, category: "", month: "" };
      axios
        .post(" http://127.0.0.1:5000/get_data", k)
        .then((res) => {
          setnavi(0);

          settempdata(res.data["data"]);
          setsh3(true);
          var inc = res.data["data"].filter((s) => s[4] === "income");
          var exp = res.data["data"].filter((s) => s[4] === "expense");
          const sumin = inc.reduce(
            (acc, transaction) => acc + transaction[2],
            0
          );
          setincome(sumin);
          const sumex = exp.reduce(
            (acc, transaction) => acc + transaction[2],
            0
          );
          setexpense(sumex);
          setbalnce2(sumin + sumex);
          if (e === 0) {
            setdata(res.data["data"]);
          } else if (e === 1) {
            setdata(inc);
          } else if (e === 2) {
            setdata(exp);
          }
        })

        .catch((e) => {
          alert("Server error");
        });
    } else if (e === 3) {
      var k = { userid: userid, month: "current" };
      axios.post(" http://127.0.0.1:5000/get_data", k).then((res) => {
        var d = res.data["data"];
        setdata(res.data["data"]);
        var inc = d.filter((s) => s[4] === "income");
        var exp = d.filter((s) => s[4] === "expense");
        const sumin = inc.reduce((acc, transaction) => acc + transaction[2], 0);
        setincome(sumin);
        const sumex = exp.reduce((acc, transaction) => acc + transaction[2], 0);
        setexpense(sumex);
        setbalnce2(sumin + sumex);
        setsh3(true);
      });
    } else if (e === 4) {
      var k = { userid: userid, month: "last" };
      axios.post(" http://127.0.0.1:5000/get_data", k).then((res) => {
        var d = res.data["data"];
        setdata(res.data["data"]);
        var inc = d.filter((s) => s[4] === "income");
        var exp = d.filter((s) => s[4] === "expense");
        const sumin = inc.reduce((acc, transaction) => acc + transaction[2], 0);
        setincome(sumin);
        const sumex = exp.reduce((acc, transaction) => acc + transaction[2], 0);
        setexpense(sumex);
        setbalnce2(sumin + sumex);
        setsh3(true);
      });
    }
  };
  const del = (e) => {
    var k = {
      userid: userid,
      type: e[4],
      amount: e[2],
      toinex: e[1],
      c_b: e[3],
      id: e[7],
    };
    setsh3(false);
    setnavi(1);
    axios.post("http://127.0.0.1:5000/delete", k).then((res) => {
      setnavi(0);
      if (res.data === "deleted") {
        getdata(es);

        get_blance();
      } else {
        alert(res.data);
      }
    });
  };
  const show = () => {
    if (vl === 0) {
      setsh3("");
      setvl(1);
    } else {
      setsh3("none");
      setvl(0);
    }
  };
  const move = () => {
    var k = {
      userid: userid,
      amount: amount,
      bank_cash: c_b,
      bank_cash2: c_b2,
    };
    setnavi(1);
    axios.post("http://127.0.0.1:5000/move", k).then((res) => {
      setnavi(0);
      if (res.data != "not enough amount available for move") {
        setamount("");
        settoinex("");

        setsh5("none");
        alert(res.data);
        getdata(es);
        get_blance();
      } else {
        alert(res.data);
      }
    });
  };
  const invest = () => {
    var k = {      
      userid: userid,
      amount: amount,
      wi: wi,
      bank_cash: c_b,
      Name: Name,
    };
    setnavi(1);
    axios.post("http://127.0.0.1:5000/investment", k).then((res) => {
      console.log(res.data);
      setnavi(0);
      if (res.data === "updated") {
        setamount("");
        setwi("");
        setsh0("none");
        setsh1("none");
        setsh4("none");
        setsh5("none");
        alert(res.data);
        getdata(es);
        get_blance();
      } else {
        alert(res.data);
      }
    });
  };
  if (navi === 0) {
    return (
      <>
        <div className=" border p-3 container-fluid mainbg ">
          <div className="l btn-group">
            <button className="btn btn-dark " onClick={() => nav("/invest")}>
              Investment
            </button>
            <button
              className="btn btn-dark col"
              onClick={() => nav("/Add_user")}
            >
              Add_User
            </button>
            <button
              className=" btn   btn-dark col"
              onClick={() => nav("/Logreg")}
            >
              Logout
            </button>
          </div>
          <br />
          <div className="row  bor4">
            <br />
            <h4 className="col">
              {" "}
              <b>Welcome to Expense tracker</b>
            </h4>

            <br />
          </div>
          <div className="  bor3    ">
            <p>
              <b>Balance:{Balance}</b>
            </p>
            <br />
            <p>
              <b>Cash:{Cash}</b>
            </p>
            <br />
            <p>
              <b>Bank:{Bank}</b>
            </p>
          </div>

          <div className="center   ">
            <div className="btn-group">
              <button
                className="btn btn-dark "
                onClick={() => (
                  setsh0(""), setsh1("none"), setsh4("none"), setsh5("none")
                )}
              >
                {" "}
                Income
              </button>
              <button
                className="btn btn-dark "
                onClick={() => (
                  setsh1(""), setsh0("none"), setsh4("none"), setsh5("none")
                )}
              >
                Expense
              </button>
              <button
                className="btn btn-dark "
                onClick={() => (
                  setsh4(""), setsh0("none"), setsh1("none"), setsh5("none")
                )}
              >
                Investment
              </button>
              <button
                className="btn btn-dark "
                onClick={() => (
                  setsh5(""), setsh0("none"), setsh1("none"), setsh4("none")
                )}
              >
                Move Money
              </button>
              <button
                className="btn btn-dark  "
                onClick={() => (
                  setsh1("none"), setsh0("none"), setsh4("none"), setsh5("none")
                )}
              >
                Hide
              </button>
            </div>
          </div>
          {/* income */}
          <div className="bor" style={{ display: Sh0 }}>
            <h6>Income Here</h6>
            <hr />
            <label htmlFor="amount">
              <b>Amount</b>
            </label>
            <br />
            <input
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              className="form-control"
              type="number"
              value={amount}
              onChange={(e) => setamount(e.target.value)}
              id="amount"
            />
            <br />
            <label htmlFor="toinex">
              <b>Type of Income </b>
            </label>
            <input
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              list="toinexlist"
              name=""
              id="toinex"
              className="form-control"
              placeholder="Enter type of Income"
              value={toinex}
              onChange={(e) => settoinex(e.target.value)}
            />
            <datalist
              name="toinex"
              id="toinexlist"
              style={{ background: "LightGray" }}
            >
              {type.map((t) => {
                return (
                  <>
                    {" "}
                    <option value={t}>{t}</option>
                  </>
                );
              })}
            </datalist>
            <br />{" "}
            <label htmlFor="type">
              <b>Cash/Bank</b>
            </label>
            <select
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              className="form-control"
              value={c_b}
              onChange={(e) => setc_b(e.target.value)}
              id="type"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
            </select>
            <br />
            <button className="btn btn-dark col" onClick={() => update(0)}>
              Add Income
            </button>
          </div>
          {/* expense  */}
          <div className="bor" style={{ display: Sh1 }}>
            <h6>Expense Here</h6>
            <hr />
            <label htmlFor="amount">
              <b>Amount</b>
            </label>
            <br />
            <input
              type="number"
              className="form-control"
              value={amount}
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              onChange={(e) => setamount(e.target.value)}
              id="amount"
            />
            <br />
            <label htmlFor="toinex">
              <b>Type of Expense </b>
            </label>

            <input
              list="toinexlist"
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              name=""
              id="toinex"
              value={toinex}
              className="form-control"
              placeholder="Enter type of Expense"
              onChange={(e) => settoinex(e.target.value)}
            />
            <datalist
              name="toinex"
              id="toinexlist"
              style={{ background: "LightGray" }}
            >
              {type.map((t) => {
                return (
                  <>
                    <option value={t}>{t}</option>
                  </>
                );
              })}
            </datalist>
            <br />
            <label htmlFor="type">
              <b>Cash/Bank</b>
            </label>
            <select
              className="form-control"
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              value={c_b}
              onChange={(e) => setc_b(e.target.value)}
              id="type"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
            </select>
            <br />

            <button className="btn btn-dark " onClick={() => update(1)}>
              Add Expense
            </button>
          </div>
          {/* Investment */}
          <div className="bor" style={{ display: Sh4 }}>
            <h6>Investment Here</h6>
            <hr />
            <label htmlFor="amount">
              <b>Amount</b>
            </label>
            <br />
            <input
              type="number"
              className="form-control"
              value={amount}
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              onChange={(e) => setamount(e.target.value)}
              id="amount"
            />
            <br />
            <label htmlFor="wi">
              <b>Where you Invest </b>
            </label>

            <input
              list="wilist"
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              name=""
              id="wi"
              value={wi}
              className="form-control"
              placeholder="Enter where you invest"
              onChange={(e) => setwi(e.target.value)}
            />
            <datalist name="wi" id="wilist" style={{ background: "LightGray" }}>
              {inve.map((t) => {
                return (
                  <>
                    {" "}
                    <option value={t}>{t}</option>
                  </>
                );
              })}
            </datalist>
            <br />
            <label htmlFor="type">
              <b>Cash/Bank</b>
            </label>
            <select
              className="form-control"
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              value={c_b}
              onChange={(e) => setc_b(e.target.value)}
              id="type"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
            </select>
            <br />

            <button className="btn btn-dark " onClick={() => invest()}>
              Add Expense
            </button>
          </div>
          {/* move money bank to cash or cash to bank */}
          <div className="bor" style={{ display: Sh5 }}>
            <h6>Move amount</h6>
            <hr />
            <label htmlFor="amount">
              <b>Amount</b>
            </label>
            <br />
            <input
              type="number"
              className="form-control"
              value={amount}
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              onChange={(e) => setamount(e.target.value)}
              id="amount"
            />
            <br />
            <label htmlFor="type">
              <b>From</b>
            </label>
            <select
              className="form-control"
              style={{
                border: "2px solid black",
                backgroundColor: "rgba(239, 140, 11,0.5)",
              }}
              value={c_b}
              onChange={(e) => setc_b(e.target.value)}
              id="type"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
            </select>
            <br />

            <button className="btn btn-dark " onClick={() => move()}>
              Move
            </button>
          </div>
          {/* table menu */}
          <div className="vh btn-group">
            <button className="btn btn-dark" onClick={() => show()}>
              Menu
            </button>
            <button
              className="btn btn-dark"
              style={{ display: Sh3 }}
              onClick={() => setsh2("none")}
            >
              Hide
            </button>
          </div>
          <div className="vh" style={{ display: Sh3 }}>
            <div className=" btn-group ">
              <button
                className="  btn btn-dark "
                onClick={() => (getdata(0), setsh2(""))}
              >
                View All
              </button>
              <button
                className="  btn btn-dark"
                onClick={() => (getdata(1), setsh2(""))}
              >
                Income
              </button>
              <button
                className="  btn btn-dark"
                onClick={() => (getdata(2), setsh2(""))}
              >
                Expense
              </button>
              <button
                className="  btn btn-dark"
                onClick={() => (getdata(3), setsh2(""))}
              >
                This month
              </button>
              <button
                className="  btn btn-dark"
                onClick={() => (getdata(4), setsh2(""))}
              >
                Last month
              </button>
            </div>
          </div>
          <div className="bor2" style={{ display: Sh2 }}>
            <div className="row">
              <h5 className="col">Income:{income}</h5>
              <h5 className="col">Expense:{expense}</h5>
              <h5 className="col">Balance:{balance2}</h5>
            </div>
            <table className="table table-dark table-hover ">
              <tr className="bg-secondary ">
                <th>Date</th>
                <th>Name</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Bank/Cash</th>
                <th>Expense/Income</th>
                <th>Delete</th>
              </tr>
              <tbody>
                {data.map((d) => {
                  return (
                    <>
                      <tr key={d[5]}>
                        <td>
                          <b>{d[0]}</b>
                        </td>
                        <td>{d[6]}</td>
                        <td>{d[1]}</td>
                        <td>{d[2]}</td>
                        <td>{d[3]}</td>
                        <td>{d[4]}</td>
                        <td>
                          <button
                            className="btn btn-dark"
                            onClick={() => del(d)}
                          >
                            Delete
                          </button>
                        </td>
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
        <Loading />;
      </>
    );
  }
};

export default Home;
