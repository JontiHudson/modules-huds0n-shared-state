"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importStar)(require("react"));
const react_native_1 = require("react-native");
const State_1 = require("./State");
function Screen1() {
    const [localCounter, setLocalCounter] = (0, react_1.useState)(0);
    const [sharedCounterState, setSharedCounterState] = State_1.SharedCounterState.useState("sharedCounter");
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.counterContainer}>
        <react_native_1.Text>Local Counter</react_native_1.Text>
        <react_native_1.Pressable style={styles.button} onPress={() => setLocalCounter(localCounter + 1)}>
          <react_native_1.Text>Up</react_native_1.Text>
        </react_native_1.Pressable>
        <react_native_1.Text>{localCounter}</react_native_1.Text>
        <react_native_1.Pressable style={styles.button} onPress={() => setLocalCounter(localCounter - 1)}>
          <react_native_1.Text>Down</react_native_1.Text>
        </react_native_1.Pressable>
      </react_native_1.View>

      <react_native_1.View style={styles.counterContainer}>
        <react_native_1.Text>Shared State Counter</react_native_1.Text>
        <react_native_1.Pressable style={styles.button} onPress={() => setSharedCounterState({
            sharedCounter: sharedCounterState.sharedCounter + 1,
        })}>
          <react_native_1.Text>Up</react_native_1.Text>
        </react_native_1.Pressable>
        <react_native_1.Text>{sharedCounterState.sharedCounter}</react_native_1.Text>
        <react_native_1.Pressable style={styles.button} onPress={() => setSharedCounterState({
            sharedCounter: sharedCounterState.sharedCounter - 1,
        })}>
          <react_native_1.Text>Down</react_native_1.Text>
        </react_native_1.Pressable>
      </react_native_1.View>
    </react_native_1.View>);
}
exports.default = Screen1;
const styles = react_native_1.StyleSheet.create({
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
