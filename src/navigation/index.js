// --------------------------------------------------------------------
// SYSTEM COMPONENTS
// --------------------------------------------------------------------
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// --------------------------------------------------------------------
// SCREENS
// --------------------------------------------------------------------
import MarketScreen from "../screens/MarketScreen";

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MarketScreen">
        <Stack.Screen name="MarketScreen" component={MarketScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
