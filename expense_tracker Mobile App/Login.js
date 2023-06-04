import axios from "axios";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect } from "react";
import { Alert } from "react-native";
import Loading from "./Loading";

const Login = ({ navigation }) => {
  const [Password, setpassword] = useState("");
  const [navi, setnavi] = useState(0);
  const [Email, setemail] = useState("");
  const key = "data";
  useEffect(() => {
    setnavi(1);
    AsyncStorage.getItem(key).then((value) => {
      logincheck(JSON.parse(value));
    });
  }, []);
  const logincheck = (e) => {
    setnavi(0);
    if (e !== null) {
      if (e.length != 0) {
        navigation.navigate("Home", {
          id: e[0],
          name: e[1],
        });
      }
    }
  };
  const check = () => {
    if (Email === "" && Password === "") {
      alert("Please fill out all the field");
    } else {
      var k = { Name: Email, Password: Password };
      setnavi(1);
      axios
        .post("http://192.168.55.12:5000/Check", k)
        .then((Response) => {
          setnavi(0);
          if (Response.data === "No user found") {
            alert(Response.data);
          } else {
            setemail("");
            setpassword("");
            var temp = {
              userid: Response.data["id"],
              username: Response.data["name"],
            };
            const key = "data";
            const value = JSON.stringify([
              Response.data["id"],
              Response.data["name"],
            ]);

            console.log(Response.data, temp);
            AsyncStorage.setItem(key, value)
              .then(() => console.log("Data stored"))
              .catch((error) => console.error("Error storing data:", error));

            navigation.navigate("Home", {
              id: Response.data["id"],
              name: Response.data["name"],
            });
          }
        })
        .catch((e) => {
          setnavi(0);
          Alert.alert("Server error", "Sorry! Try again");
        });
    }
  };
  if (navi === 0) {
    return (
      <>
        <ScrollView style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              marginTop: "20%",
              padding: 7,
              textAlign: "center",
              borderStyle: "solid",
              borderColor: "black",
              borderWidth: 1,
              backgroundColor: "rgba(239, 140, 11,0.5)",
              marginLeft: "1%",
              marginRight: "1%",
              fontFamily: "serif",
            }}
          >
            Welcome Back to Expense Tracker !
          </Text>
          <Text
            style={{
              marginTop: "20%",
              textAlign: "center",
              fontSize: 20,
              fontFamily: "serif",
            }}
          >
            Login to your Account
          </Text>

          <View style={styles.login}>
            <Text
              style={{
                textAlign: "center",
                marginTop: "4%",
                fontWeight: "bold",
                fontFamily: "serif",
              }}
            >
              Email
            </Text>
            <View style={styles.input}>
              <TextInput
                placeholder="  Enter Your Email"
                value={Email}
                onChangeText={(e) => setemail(e)}
              />
            </View>
            <Text
              style={{
                textAlign: "center",
                marginTop: "4%",
                fontWeight: "bold",
                fontFamily: "serif",
              }}
            >
              Password{" "}
            </Text>
            <View style={styles.input}>
              <TextInput
                placeholder="  Enter the Password"
                value={Password}
                onChangeText={(e) => setpassword(e)}
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "8%",
                fontSize: 18,
              }}
            >
              <View style={styles.logbut}>
                <Button onPress={check} title="Sign In" color={"black"} />
              </View>
              <View style={styles.logbut}>
                <Button
                  title="Create Account"
                  onPress={() => navigation.navigate("Register")}
                  color={"rgb(251,233,209)"}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(251,233,209)",
  },
  input: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    marginLeft: "6%",
    marginRight: "6%",
    height: "11%",
    marginTop: "2%",
    backgroundColor: "rgba(239, 140, 11,0.5)",
  },

  login: {
    flex: 1,
    marginTop: "10%",
  },
  logbut: {
    marginTop: "3%",
    alignItems: "center",
    height: 60,

    padding: 2,
  },
});
