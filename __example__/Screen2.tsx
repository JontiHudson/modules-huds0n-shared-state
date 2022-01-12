import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SharedCounterState } from "./State";

export default class Screen2 extends React.Component<
  {},
  { localCounter: number }
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      localCounter: 0,
    };
  }

  componentDidMount() {
    SharedCounterState.register(this);
  }

  componentWillUnmount() {
    SharedCounterState.unregister(this);
  }

  render() {
    const { localCounter } = this.state;
    const { sharedCounter } = SharedCounterState.state;

    return (
      <View style={styles.container}>
        <View style={styles.counterContainer}>
          <Text>Local Counter</Text>
          <Pressable
            style={styles.button}
            onPress={() => this.setState({ localCounter: localCounter + 1 })}
          >
            <Text>Up</Text>
          </Pressable>
          <Text>{localCounter}</Text>
          <Pressable
            style={styles.button}
            onPress={() => this.setState({ localCounter: localCounter - 1 })}
          >
            <Text>Down</Text>
          </Pressable>
        </View>

        <View style={styles.counterContainer}>
          <Text>Shared State Counter</Text>
          <Pressable
            style={styles.button}
            onPress={() =>
              SharedCounterState.setState({ sharedCounter: sharedCounter + 1 })
            }
          >
            <Text>Up</Text>
          </Pressable>
          <Text>{sharedCounter}</Text>
          <Pressable
            style={styles.button}
            onPress={() =>
              SharedCounterState.setState({ sharedCounter: sharedCounter - 1 })
            }
          >
            <Text>Down</Text>
          </Pressable>
        </View>
      </View>
    );
  }
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
