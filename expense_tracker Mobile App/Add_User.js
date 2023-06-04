import validator from "validator";
import axios from "axios";
import { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import Loading from "./Loading";

const Add_User = ({ navigation }) => {
  const [Name, setname] = useState("");
  const [Password, setpassword] = useState("");
  const [RePassword, setrepassword] = useState("");
  const [Email, setemail] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [navi, setnavi] = useState(0);
  const register = () => {
    if (Email === "" && Password === "" && RePassword === "" && Name === "") {
      alert("Please fill out all the field");
    } else {
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
          var k = { userid: 1, Name: Name, Password: Password, Email: Email };
          setnavi(1);
          axios
            .post(" http://192.168.55.12:5000/add_user", k)
            .then((Response) => {
              setnavi(0);
              if (Response.data === "User created successfully") {
                alert(Response.data);
                setname("");
                setpassword("");
                setemail("");
                setrepassword("");

                navigation.navigate("Login");
              } else {
                alert(Response.data);
              }
            })
            .catch((e) => {
              setnavi(0);
              Alert.alert("Server error", "Sorry! Try again");
            });
        }
      } else {
        setErrorMessage("Is Not Strong Password");
      }
    }
  };
  if (navi === 0) {
    return (
      <>
        <ScrollView style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              marginTop: "10%",
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
            Welcome to Expense Tracker !
          </Text>
          <Text
            style={{
              marginTop: "10%",
              textAlign: "center",
              fontSize: 20,
              fontFamily: "serif",
            }}
          >
            Create Your Account
          </Text>
          <View style={styles.register}>
            <Text
              style={{
                marginLeft: "2%",
                textAlign: "center",
                marginTop: "4%",
                fontWeight: "bold",
                fontFamily: "serif",
              }}
            >
              UserName
            </Text>
            <View style={styles.input}>
              <TextInput
                placeholder="  UserName"
                value={Name}
                onChangeText={(e) => setname(e)}
              />
            </View>
            <Text
              style={{
                marginLeft: "2%",
                textAlign: "center",
                marginTop: "4%",
                fontWeight: "bold",
                fontFamily: "serif",
              }}
            >
              Password
            </Text>
            <View style={styles.input}>
              <TextInput
                placeholder="  Enter the Password"
                value={Password}
                onChangeText={(e) => setpassword(e)}
              />
            </View>
            <Text style={{ textAlign: "center", color: "red" }}>
              {errorMessage}
            </Text>

            <Text
              style={{
                marginLeft: "2%",
                textAlign: "center",
                marginTop: "4%",
                fontWeight: "bold",
                fontFamily: "serif",
              }}
            >
              Retype Password
            </Text>
            <View style={styles.input}>
              <TextInput
                placeholder="  Retype the password"
                value={RePassword}
                onChangeText={(e) => setrepassword(e)}
              />
            </View>
            <Text style={{ textAlign: "center", color: "red" }}>{error}</Text>

            <Text
              style={{
                marginLeft: "2%",
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
          </View>
          <View style={styles.regbut}>
            <Button
              onPress={() => register()}
              title="Create user"
              color={"black"}
            />
          </View>
        </ScrollView>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default Add_User;
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
    justifyContent: "center",
  },
  register: {
    flex: 1,
    marginTop: "5%",
  },
  regbut: {
    alignItems: "center",
    marginTop: "25%",
  },
});
