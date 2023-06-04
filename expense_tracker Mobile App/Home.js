import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import DatalistInput from "@avul/react-native-datalist-input";
import { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Loading from "./Loading";

const Home = ({ navigation }) => {
  const route = useRoute();
  const [Balance, setbalance] = useState("0");
  const [Cash, setcash] = useState("0");
  const [Bank, setbank] = useState("0");
  const [amount, setamount] = useState(0);
  const [Sh0, setsh0] = useState(false);
  const [Sh1, setsh1] = useState(false);
  const [Sh2, setsh2] = useState(false);
  const [Sh3, setsh3] = useState(false);
  const [Sh4, setsh4] = useState(false);
  const [Sh5, setsh5] = useState(false);
  const [toinex, settoinex] = useState("");
  const [type, settype] = useState([]);
  const [navi, setnavi] = useState();
  const [c_b, setc_b] = useState("cash");
  const [data, setdata] = useState([]);
  const [es, setes] = useState("");
  const [balance2, setbalnce2] = useState(0);
  const [income, setincome] = useState(0);
  const [expense, setexpense] = useState(0);
  const [userid, setuserid] = useState(route.params.id);

  const [Name, setName] = useState(route.params.name);

  const [mig, setmig] = useState(0);
  const [inve, setinve] = useState(["Mutual Fund"]);
  const [wi, setwi] = useState("");

  const [tempdata, settempdata] = useState([]);
  const key = "data";
  const logout = (e) => {
    AsyncStorage.removeItem(key)
      .then(() => navigation.navigate("Login"))
      .catch((error) => console.error("Error removing data:", error));
  };
  useEffect(() => {
    setnavi(1);
    axios
      .post("http://192.168.55.12:5000/suggestion")
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
        Alert.alert("Server error", "Sorry! Try again");
      });
    get_blance();
  }, []);
  const get_blance = () => {
    console.log(userid);
    setnavi(1);
    axios
      .post(" http://192.168.55.12:5000/getbalnce", {
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
        Alert.alert("Server error", "Sorry! Try again");
      });
  };

  const update = (e) => {
    if (e === 0) {
      var t = "income";

      console.log(k);
    } else if (e == 1) {
      var t = "expense";
    }
    console.log(k);
    var k = {
      userid: userid,
      type: t,
      amount: amount,
      toinex: toinex,
      bank_cash: c_b,
      Name: Name,
    };
    setnavi(1);
    axios
      .post(" http://192.168.55.12:5000/store_data", k)
      .then((res) => {
        setnavi(0);
        if (res.data != "no amount available for expense") {
          setamount("");
          settoinex("");
          setsh0(false);
          setsh1(false);
          setsh4(false);
          setsh5(false);
          alert(res.data);
          getdata(es);
          get_blance();
        } else {
          alert(res.data);
        }
      })
      .catch((e) => {
        setnavi(0);
        Alert.alert("Server error", "Sorry! Try again");
      });
  };
  const getdata = (e) => {
    setsh2(true);
    setes(e);
    setnavi(1);
    if (e != 3 && e != 4) {
      var k = { userid: userid, category: "", month: "" };
      axios
        .post(" http://192.168.55.12:5000/get_data", k)
        .then((res) => {
          setnavi(0);

          settempdata(res.data["data"]);
        })
        .catch((e) => {
          Alert.alert("Server error", "Sorry! Try again");
        });
      var inc = tempdata.filter((s) => s[4] === "income");
      var exp = tempdata.filter((s) => s[4] === "expense");
      const sumin = inc.reduce((acc, transaction) => acc + transaction[2], 0);
      setincome(sumin);
      const sumex = exp.reduce((acc, transaction) => acc + transaction[2], 0);
      setexpense(sumex);
      setbalnce2(sumin - sumex);
    }
    if (e === 0) {
      setdata(tempdata);
    } else if (e === 1) {
      setdata(inc);
    } else if (e === 2) {
      setdata(exp);
    } else if (e === 3) {
      var k = { userid: userid, month: "current" };
      axios
        .post(" http://192.168.55.12:5000/get_data", k)
        .then((res) => {
          setnavi(0);
          var d = res.data["data"];
          setdata(res.data["data"]);
          var inc = d.filter((s) => s[4] === "income");
          var exp = d.filter((s) => s[4] === "expense");
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
          setbalnce2(sumin - sumex);
        })
        .catch((e) => {
          Alert.alert("Server error", "Sorry! Try again");
        });
    } else if (e === 4) {
      var k = { userid: userid, month: "last" };
      axios
        .post(" http://192.168.55.12:5000/get_data", k)
        .then((res) => {
          setnavi(0);
          var d = res.data["data"];
          setdata(res.data["data"]);
          var inc = d.filter((s) => s[4] === "income");
          var exp = d.filter((s) => s[4] === "expense");
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
          setbalnce2(sumin - sumex);
        })
        .catch((e) => {
          setnavi(0);
          Alert.alert("Server error", "Sorry! Try again");
        });
    }
  };

  const del = (e) => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete " + e[1] + " _" + e[4] + "?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            var k = {
              userid: userid,
              type: e[4],
              amount: e[2],
              toinex: e[1],
              c_b: e[3],
              id: e[7],
            };
            console.log(k);
            setnavi(0);
            axios
              .post(" http://192.168.55.12:5000/delete", k)
              .then((res) => {
                setnavi(1);
                if (res.data !== "you used your money") {
                  Alert.alert("Success", "Data has been deleted!");
                  setsh3(false);
                  get_blance();
                  getdata(0);
                } else {
                  alert("Can't delete! you used your money");
                }
              })
              .catch((e) => {
                setnavi(1);
                Alert.alert("Server error", "Sorry! Try again");
              });
          },
        },
      ]
    );
  };

  const move = () => {
    var k = {
      userid: userid,
      amount: amount,
      bank_cash: c_b,
    };
    setnavi(1);
    axios
      .post("http://192.168.55.12:5000/move", k)
      .then((res) => {
        setnavi(0);
        if (res.data != "not enough amount available for move") {
          setamount("");
          settoinex("");
          setnavi(1);
          setsh5(false);
          alert(res.data);
          getdata(es);
          get_blance();
        } else {
          alert(res.data);
        }
      })
      .catch((e) => {
        setnavi(1);
        Alert.alert("Server error", "Sorry! Try again");
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

    axios
      .post("http://192.168.55.12:5000/investment", k)
      .then((res) => {
        console.log(res.data);
        setnavi(0);
        if (res.data === "updated") {
          setamount("");
          setnavi(1);
          setwi("");
          setsh0(false);
          setsh1(false);
          setsh4(false);
          setsh5(false);
          alert(res.data);
          getdata(es);
          get_blance();
        } else {
          alert(res.data);
        }
      })
      .catch((e) => {
        Alert.alert("Server error", "Sorry! Try again");
        setnavi(1);
      });
  };

  if (navi === 0) {
    return (
      <>
        <ScrollView style={styles.main}>
          <View style={styles.buttonlog}>
            <Button
              title="Investment"
              onPress={() => navigation.navigate("Investment")}
              color={"black"}
            />
            <Button
              title="Add User"
              onPress={() => navigation.navigate("Add_user")}
              color={"black"}
            />
            <Button title="Logout" onPress={() => logout()} color={"black"} />
          </View>
          <View style={styles.welcome}>
            <Text
              style={{
                fontFamily: "serif",
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Welcome to Expense Tracker
            </Text>
          </View>
          <View style={styles.bcb}>
            <Text style={{ marginLeft: "2%", fontFamily: "serif" }}>
              Balance: {Balance}
            </Text>
            <Text
              style={{
                marginLeft: "2%",
                marginTop: "1%",
                fontFamily: "serif",
              }}
            >
              Cash: {Cash}
            </Text>
            <Text
              style={{
                marginLeft: "2%",
                marginTop: "1%",
                fontFamily: "serif",
              }}
            >
              Bank: {Bank}
            </Text>
          </View>
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => setsh0(!Sh0)}
                title="Income"
                color={"black"}
              />

              <Button
                onPress={() => setsh1(!Sh1)}
                title="Expense"
                color={"black"}
              />
              <Button
                title="Investment"
                onPress={() => setsh4(!Sh4)}
                color={"black"}
              />
              <Button
                title="Transfer"
                onPress={() => setsh5(!Sh5)}
                color={"black"}
              />
            </View>
          </View>

          {Sh0 && (
            <View>
              <Ionicons
                name="close-circle"
                size={30}
                style={{ marginLeft: "3%", marginTop: "5%" }}
                onPress={() => setsh0(false)}
              />
              <Text
                style={{
                  marginTop: "5%",
                  fontFamily: "serif",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Income here
              </Text>

              <Text
                style={{
                  marginLeft: "4%",
                  fontFamily: "serif",
                  marginTop: "5%",
                }}
              >
                Enter your Amount
              </Text>

              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={(e) => setamount(e)}
              />

              <Text style={{ marginLeft: "4%", fontFamily: "serif" }}>
                Purpose
              </Text>

              <DatalistInput
                style={styles.dl}
                value={toinex}
                onChangeText={(text) => settoinex(text)}
                data={type}
              />
              <Text style={{ marginLeft: "4%", fontFamily: "serif" }}>
                Cash/Bank
              </Text>

              <View style={styles.cb}>
                <RadioButton.Group
                  onValueChange={(value) => setc_b(value)}
                  value={c_b}
                >
                  <RadioButton.Item label="Cash" value="cash" />
                  <RadioButton.Item label="Bank" value="bank" />
                </RadioButton.Group>
              </View>
              <View style={styles.add}>
                <Button
                  title="Add Income"
                  color={"black"}
                  onPress={() => update(0)}
                />
              </View>
            </View>
          )}
          {Sh1 && (
            <View>
              <Ionicons
                name="close-circle"
                size={30}
                style={{ marginLeft: "3%", marginTop: "5%" }}
                onPress={() => setsh1(false)}
              />
              <Text
                style={{
                  marginTop: "5%",
                  fontFamily: "serif",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Expense here
              </Text>
              <Text
                style={{
                  marginLeft: "4%",
                  marginTop: "5%",
                  fontFamily: "serif",
                }}
              >
                Enter your Amount
              </Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={(e) => setamount(e)}
              />

              <Text style={{ marginLeft: "4%", fontFamily: "serif" }}>
                Purpose
              </Text>

              <DatalistInput
                style={styles.dl}
                value={toinex}
                onChangeText={(text) => settoinex(text)}
                data={type}
                // style={}
                // containerStyle={styles.containerStyle}
              />
              <Text style={{ marginLeft: "4%", fontFamily: "serif" }}>
                Cash/Bank
              </Text>
              <View style={styles.cb}>
                <RadioButton.Group
                  onValueChange={(value) => setc_b(value)}
                  value={c_b}
                >
                  <RadioButton.Item label="Cash" value="cash" />
                  <RadioButton.Item label="Bank" value="bank" />
                </RadioButton.Group>
              </View>
              <View style={styles.add}>
                <Button
                  title="Add Expense"
                  color={"black"}
                  onPress={() => update(1)}
                />
              </View>
            </View>
          )}

          {Sh4 && (
            <View>
              <Ionicons
                name="close-circle"
                size={30}
                style={{ marginLeft: "3%", marginTop: "5%" }}
                onPress={() => setsh4(false)}
              />
              <Text
                style={{
                  marginTop: "5%",
                  fontFamily: "serif",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Investment here
              </Text>
              <Text
                style={{
                  marginLeft: "4%",
                  marginTop: "5%",
                  fontFamily: "serif",
                }}
              >
                Enter your Amount
              </Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={(e) => setamount(e)}
              />
              <Text style={{ marginLeft: "4%", fontFamily: "serif" }}>
                Investment Type
              </Text>

              <DatalistInput
                style={styles.dl}
                value={wi}
                onChangeText={(text) => setwi(text)}
                data={inve}
                // style={}
                // containerStyle={styles.containerStyle}
              />
              <Text style={{ marginLeft: "4%", fontFamily: "serif" }}>
                Cash/Bank
              </Text>
              <View style={styles.cb}>
                <RadioButton.Group
                  onValueChange={(value) => setc_b(value)}
                  value={c_b}
                >
                  <RadioButton.Item label="Cash" value="cash" />
                  <RadioButton.Item label="Bank" value="bank" />
                </RadioButton.Group>
              </View>
              <View style={styles.add}>
                <Button
                  title="Add Investment"
                  color={"black"}
                  onPress={() => invest()}
                />
              </View>
            </View>
          )}
          {Sh5 && (
            <View>
              <Ionicons
                name="close-circle"
                size={30}
                style={{ marginLeft: "3%", marginTop: "5%" }}
                onPress={() => setsh5(false)}
              />
              <Text
                style={{
                  marginTop: "5%",
                  fontFamily: "serif",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Transfer here
              </Text>
              <Text
                style={{
                  marginLeft: "4%",
                  marginTop: "5%",
                  fontFamily: "serif",
                }}
              >
                Enter your Amount
              </Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={(e) => setamount(e)}
              />
              <Text style={{ marginLeft: "4%", fontFamily: "serif" }}>
                Transfer From
              </Text>
              <View style={styles.cb}>
                <RadioButton.Group
                  onValueChange={(value) => setc_b(value)}
                  value={c_b}
                >
                  <RadioButton.Item label="Cash" value="cash" />
                  <RadioButton.Item label="Bank" value="bank" />
                </RadioButton.Group>
              </View>
              <View style={styles.add}>
                <Button
                  title="Transfer"
                  color={"black"}
                  onPress={() => move()}
                />
              </View>
            </View>
          )}
          <View style={styles.container}>
            <View>
              <View style={styles.menu}>
                <Button
                  onPress={() => setsh3(!Sh3)}
                  title="Menu"
                  color={"black"}
                />
              </View>
              {Sh3 && (
                <View>
                  <View style={styles.all}>
                    <Button
                      onPress={() => getdata(0)}
                      title="View all"
                      color={"black"}
                    />
                    <Button
                      onPress={() => getdata(1)}
                      title="Income"
                      color={"black"}
                    />
                    <Button
                      onPress={() => getdata(2)}
                      title="Expense"
                      color={"black"}
                    />

                    <Button
                      onPress={() => getdata(3)}
                      title="This Month"
                      color={"black"}
                    />

                    <Button
                      onPress={() => getdata(4)}
                      title="Last Month"
                      color={"black"}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
          {Sh2 && (
            <View>
              <Ionicons
                name="close-circle"
                size={30}
                style={{ marginLeft: "3%", marginTop: "5%" }}
                onPress={() => setsh2(false)}
              />
              <View style={styles.ieb}>
                <Text
                  style={{
                    marginLeft: "2%",
                    marginTop: "1%",
                    fontFamily: "serif",
                  }}
                >
                  Income: {income}
                </Text>
                <Text
                  style={{
                    marginLeft: "2%",
                    marginTop: "1%",
                    fontFamily: "serif",
                  }}
                >
                  Expense: {expense}
                </Text>
                <Text
                  style={{
                    marginLeft: "2%",
                    marginTop: "1%",
                    fontFamily: "serif",
                  }}
                >
                  Balance: {balance2}
                </Text>
              </View>

              <View style={styles.table}>
                <DataTable>
                  <DataTable.Header
                    style={{
                      backgroundColor: "rgba(239, 140, 11,0.5)",
                      borderBottomColor: "black",
                      borderBottomWidth: 2,
                    }}
                  >
                    <DataTable.Title>Date</DataTable.Title>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title>Purpose</DataTable.Title>
                    <DataTable.Title>Amount</DataTable.Title>
                    <DataTable.Title>Bank/cash</DataTable.Title>
                    <DataTable.Title>Expense/Income</DataTable.Title>
                    <DataTable.Title>Delete</DataTable.Title>
                  </DataTable.Header>
                  {data.map((d) => {
                    console.log(d);
                    return (
                      <DataTable.Row>
                        <DataTable.Cell>{d[0]} </DataTable.Cell>
                        <DataTable.Cell>{d[6]}</DataTable.Cell>
                        <DataTable.Cell>{d[1]}</DataTable.Cell>
                        <DataTable.Cell>{d[2]}</DataTable.Cell>
                        <DataTable.Cell>{d[3]}</DataTable.Cell>
                        <DataTable.Cell>{d[4]}</DataTable.Cell>
                        <View style={styles.delete}>
                          <Button
                            title="Delete"
                            onPress={() => del(d)}
                            color={"black"}
                          />
                        </View>
                      </DataTable.Row>
                    );
                  })}
                </DataTable>
              </View>
            </View>
          )}
        </ScrollView>
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

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dl: {
    height: 40,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    marginLeft: "4%",
    marginRight: "3%",
    backgroundColor: "rgba(239, 140, 11,0.5)",
    marginTop: "2%",
  },
  main: {
    flex: 1,
    backgroundColor: "rgb(251,233,209)",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    marginTop: "3%",
  },
  cb: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    marginLeft: "4%",
    marginRight: "3%",
    backgroundColor: "rgba(239, 140, 11,0.5)",
    marginTop: "2%",
  },
  delete: {
    marginTop: "2%",
  },
  ieb: {
    marginTop: "8%",
    margin: "2%",
  },
  all: {
    flex: 1,
    flexDirection: "column",
    alignContent: "flex-start",
    marginRight: "65%",
  },
  buttonlog: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: "3%",
    marginLeft: "32%",
  },
  welcome: {
    flex: 1,
    marginTop: "5%",
    backgroundColor: "rgba(239, 140, 11,0.5)",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: "2%",
  },
  bcb: {
    justifyContent: "center",
    margin: "2%",
  },
  menu: {
    flex: 1,
    flexDirection: "column",
    alignContent: "flex-start",
    marginRight: "65%",
    marginTop: "10%",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "white",
  },
  input: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    marginLeft: "4%",
    marginRight: "3%",
    backgroundColor: "rgba(239, 140, 11,0.5)",
    marginTop: "2%",
    height: 40,
  },
  table: {
    marginTop: "4%",
    marginLeft: "2%",
    marginRight: "2%",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "black",
  },
  add: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "4%",
  },
});
