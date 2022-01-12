import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import Screen1 from "./Screen1";
import Screen2 from "./Screen2";

export default function App() {
  const [screen, setScreen] = useState(1);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Screen1 />
      <Screen2 />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  safeAreaView: { flex: 1 },
  screenContainer: { flex: 1 },
});
