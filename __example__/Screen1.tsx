import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SharedCounterState } from "./State";

export default function Screen1() {
  const [localCounter, setLocalCounter] = useState(0);
  const [sharedCounterState, setSharedCounterState] =
    SharedCounterState.useState("sharedCounter");

  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        <Text>Local Counter</Text>
        <Pressable
          style={styles.button}
          onPress={() => setLocalCounter(localCounter + 1)}
        >
          <Text>Up</Text>
        </Pressable>
        <Text>{localCounter}</Text>
        <Pressable
          style={styles.button}
          onPress={() => setLocalCounter(localCounter - 1)}
        >
          <Text>Down</Text>
        </Pressable>
      </View>

      <View style={styles.counterContainer}>
        <Text>Shared State Counter</Text>
        <Pressable
          style={styles.button}
          onPress={() =>
            setSharedCounterState({
              sharedCounter: sharedCounterState.sharedCounter + 1,
            })
          }
        >
          <Text>Up</Text>
        </Pressable>
        <Text>{sharedCounterState.sharedCounter}</Text>
        <Pressable
          style={styles.button}
          onPress={() =>
            setSharedCounterState({
              sharedCounter: sharedCounterState.sharedCounter - 1,
            })
          }
        >
          <Text>Down</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  counterContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
