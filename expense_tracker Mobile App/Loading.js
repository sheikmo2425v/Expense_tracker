import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
const Loading = () => {
  return (
    <>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
      </View>
    </>
  );
};

export default Loading;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(251,233,209)",
    alignItems: "center",
    justifyContent: "center",
  },
});
