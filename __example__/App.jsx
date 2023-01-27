"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const Screen1_1 = tslib_1.__importDefault(require("./Screen1"));
const Screen2_1 = tslib_1.__importDefault(require("./Screen2"));
function App() {
    const [screen, setScreen] = (0, react_1.useState)(1);
    return (<react_native_1.SafeAreaView style={styles.safeAreaView}>
      <Screen1_1.default />
      <Screen2_1.default />
    </react_native_1.SafeAreaView>);
}
exports.default = App;
const styles = react_native_1.StyleSheet.create({
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
