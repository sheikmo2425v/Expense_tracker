import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";

import {
  Button,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { TableView } from "react-native-responsive-table";
const Investment = () => {
  const [total, settotal] = useState(0);
  const [userid, setuserid] = useState(1);
  const [Name, setName] = useState();
  const [data, setdata] = useState([]);
  const [data2, setdata2] = useState([]);
  const [Sh0, setsh0] = useState(false);

  useEffect(() => {
    axios
      .post("http://192.168.55.12:5000/gettotal_invest", { userid: userid })
      .then((res) => {
        settotal(res.data["total"]);
        setdata(res.data["data"]);
      });
  }, []);
  console.log(data);
  const getabout = (e) => {
    axios
      .post("http://192.168.55.12:5000/about", { userid: userid, wi: e })
      .then((res) => {
        setdata2(res.data);
        console.log(res.data);
      });
  };

  return (
    <>
      <ScrollView style={styles.main}>
        <View>
          <View>
            <Text
              style={{
                marginTop: "10%",
                marginLeft: "5%",
                fontFamily: "serif",
                fontWeight: "bold",
              }}
            >
              Total: {total}
            </Text>
          </View>

          <View style={styles.investment}>
            <DataTable>
              <DataTable.Header
                style={{
                  backgroundColor: "rgba(239, 140, 11,0.5)",
                  borderBottomColor: "black",
                  borderBottomWidth: 2,
                }}
              >
                <DataTable.Title>Id</DataTable.Title>
                <DataTable.Title>Userid</DataTable.Title>
                <DataTable.Title>Amount</DataTable.Title>
                <DataTable.Title>Where_invest</DataTable.Title>
              </DataTable.Header>
              {data.map((d) => {
                console.log(d);
                return (
                  <DataTable.Row onPress={() => (getabout(d[3]), setsh0(true))}>
                    <DataTable.Cell>{d[0]} </DataTable.Cell>
                    <DataTable.Cell>{d[1]}</DataTable.Cell>
                    <DataTable.Cell>{d[2]}</DataTable.Cell>
                    <DataTable.Cell>{d[3]}</DataTable.Cell>
                  </DataTable.Row>
                );
              })}
            </DataTable>
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

            <View style={styles.investment}>
              <DataTable>
                <DataTable.Header
                  style={{
                    backgroundColor: "rgba(239, 140, 11,0.5)",
                    borderBottomColor: "black",
                    borderBottomWidth: 2,
                  }}
                >
                  <DataTable.Title>Id</DataTable.Title>
                  <DataTable.Title>Userid</DataTable.Title>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title>Amount</DataTable.Title>
                  <DataTable.Title>Where_invest</DataTable.Title>
                  <DataTable.Title>Bank/Cash</DataTable.Title>
                  <DataTable.Title>Date</DataTable.Title>
                </DataTable.Header>
                {data2.map((d) => {
                  console.log(d);
                  return (
                    <DataTable.Row>
                      <DataTable.Cell>{d[0]} </DataTable.Cell>
                      <DataTable.Cell>{d[1]}</DataTable.Cell>
                      <DataTable.Cell>{d[2]}</DataTable.Cell>
                      <DataTable.Cell>{d[3]}</DataTable.Cell>
                      <DataTable.Cell>{d[4]}</DataTable.Cell>
                      <DataTable.Cell>{d[6]}</DataTable.Cell>
                      <DataTable.Cell>{d[5]}</DataTable.Cell>
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
};

export default Investment;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "rgb(251,233,209)",
  },
  investment: {
    marginTop: "10%",
    marginLeft: "2%",
    marginRight: "2%",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "black",
  },
});
