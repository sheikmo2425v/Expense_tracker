import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import Add_User from "./Add_User";
import Home from "./Home";
import Investment from "./Investment";
import Login from "./Login";
import Register from "./Register";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Main = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={({ navigation }) => ({
              headerLeft: null,
            })}
          />

          <Stack.Screen name="Register" component={Register} />

          <Stack.Screen name="Investment" component={Investment} />
          <Stack.Screen name="Add_user" component={Add_User} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Main;
