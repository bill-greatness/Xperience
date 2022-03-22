/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Layout from "./app/layout";
import Login from "./app/screens/Login";
import { StatusBar, useColorScheme } from "react-native";
import "react-native-gesture-handler";
import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";
import { getToken } from "./app/components/functions";
const App = () => {
  const isDarkMode = useColorScheme() === "dark";
  const [isLogged, setLogged] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        messaging()
          .getToken()
          .then(async (token) => {
            await getToken(user.uid, token);
          });
        setLogged(true);
        return messaging().onTokenRefresh((token) => getToken(user.uid, token));
      } else {
        setLogged(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {isLogged ? <Layout /> : <Login />}
    </NavigationContainer>
  );
};

export default App;
