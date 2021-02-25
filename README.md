</p>

<h2 align="center">@huds0n/shared-state</h3>

</p>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/JontiHudson/modules-huds0n-shared-state.svg)](https://github.com/JontiHudson/modules-huds0n-shared-state/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/JontiHudson/modules-huds0n-shared-state.svg)](https://github.com/JontiHudson/modules-huds0n-shared-state/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">A simple yet powerful React state management module, fully integrated with hooks and typescript.</br>
<b>Turning</b></br>
<i>const [state, setState] = useState(initialState);</i></br>
<b>Into</b></br>
<i>const [state, setState] = GlobalState.useState();</i>
</p>

</br>

## 📝 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting_started)
- [Basic Usage](#basic_usage)
  - [Creating a Shared State](#basic_creating)
  - [Accessing State](#basic_accessing)
  - [Updating State](#basic_updating)
  - [Functional Component Integration](#basic_functional)
  - [Class Component Integration](#basic_class)
- [Advanced Usage](#advanced_usage)
  - [Update Keys](#advanced_update_keys)
  - [State Listeners](#advanced_state_listeners)
  - [Using Typescript](#advanced_typescript)
  - [Data Persist](#advanced_data_persist)
  - [Delayed Initialization](#advanced_delayed_initialization)
- [Reference](#reference)
  - [Properties](#reference_properties)
  - [Methods](#reference_methods)
- [Example](#example)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

</br>

## 🧐 About <a name = "about"></a>

Global state management is one of the core aspects of nearly all React Native projects, especially as they grow in size.

**Shared States** solves this problem by declaring your shared state variables outside of your components. Then, using familiar syntax to React, registering components for updates on **shared state** change.

</br>

## ✅ List of Features <a name = "features"></a>

- **Simple:** _Uses similar structure and syntax to standard React._
- **Fast:** _Optimize components to only update when is necessary._
- **Powerful:** _Seemlessly integrate state change with both UI and logic._
- **Versatile:** _Have a single global state, or split it in multiple shared states._
- **Persistant:** _Combine with a **Shared State Store** to presist data._
- **Type-Safe:** _Fully integrated with typescript out-of-the-box._

</br>

## 🏁 Getting Started <a name = "getting_started"></a>

### **Prerequisites**

Works with any project implementing React 16.8 onwards

</br>

### **Installing**

```
npm i @huds0n/shared-state
```

</br>

## 🧑‍💻 Basic Usage <a name="basic_usage"></a>

### **Creating a Shared State**<a name="basic_creating"></a>

```js
import { SharedState } from "@huds0n/shared-state";

const ExampleState = new SharedState({
  username: null,
  password: null
  ...ect
});
```

</br>

### **Accessing State**<a name="basic_accessing"></a>

```js
const { username, password } = ExampleState.state;
```

</br>

### **Updating State**<a name="basic_updating"></a>

Like regular state, direct mutation will not cause components to update. Instead the **setState** method is used.

```js
ExampleState.setState({
  username: 'john.doe',
  password: '******',
});
```

**setState** can take either the whole or a partial state, updating only the props that are passed. Like regular state, **Shared State** uses shallow comparison to detect state changes.

</br>

### **Function Components Integration**<a name="basic_functional"></a>

```js
function exampleFunctionComponent() {
  const [state, setState] = ExampleState.useState();

  // Or if you want to be more specific

  const [username, setUsername] = ExampleState.useProp('username');
}
```

</br>

### **Class Components Integration**<a name="basic_class"></a>

```js
componentDidMount() {
  ExampleState.register(this);
}

componentWillUnmount() {
  ExampleState.unregister(this);
}
```

</br>

## 🧑‍🔬 Advanced Usage <a name="advanced_usage"></a>

### **Update Keys**<a name="advanced_update_keys"></a>

Registration of a component to a shared state causes automatic re-rendering on any state change. To select specific props to cause re-render an **update key** (string) or **keys** (array of strings) can be passed to the **register** and **useState** methods.

```js
ExampleState.register(this, 'username');
```

_This class component would only update on username change._

```js
Example.useState(['username', 'password']);
```

_This function component would update on either username or password change._

<br>

### **State Listeners**<a name="advanced_state_listeners"></a>

State changes can be used to trigger logic as well.

```js
const removeListener = ExampleState.addListener(
  ['username'],
  (newState, prevState) => {
    if (prevState.user === null) {
      // Runs when user changes from null
    }
  },
);
```

_Then to remove the listener._

```js
removeListener();
```

<br>

### **Using Typescript**<a name="advanced_typescript"></a>

**Shared State** has been built from the ground up to use typescript. It will predict state type structure automatically from the initial state. However, in cases where state props can be multiple types you will need to pass in declarative typings when instantiating the state.

```ts
type ExampleStateType = {
  username: null | string,
  password: null | string,
  ...ect
}

const ExampleState = new SharedState<ExampleStateType>({
  username: null,
  password: null,
  ...ect
});
```

<br>

### **Data Persist**<a name="advanced_data_persist"></a>

Due to the varying storage modules available, **Shared State**'s **initializeStorage** accepts a create store function. In this example we will use the store created for React Native's **AsyncStorage**: [@huds0n/shared-state-store-rn](https://github.com/JontiHudson/modules-huds0n-shared-state-store-rn).

```js
import { createStoreRN } from '@huds0n/shared-state-store-rn';

ExampleState.initializeStorage(createStoreRN({ storeName: 'ExampleState' }));
```

_This will automatically reset the state from saved data._

```js
ExampleState.save();
```

_Now the state will be saved._

<br>

### **Delayed Initialization**<a name="advanced_delayed_initialization"></a>

Sometimes a shared state's **initial state** is unknown until runtime. In these cases _null_ can be passed and the **initialize** method is used later.

```js
const ExampleState = new SharedState(null);
```

_At this point trying to access or update state will throw an error._

```js
ExampleState.initialize({
  username: 'john.doe',
  password: '******',
  ...ect,
});
```

_Now the state will work as normal._

<br>

## 📖 Reference <a name="reference"></a>

### **Properties**<a name="reference_properties"></a>

| Prop                      | Description                                                                                 | Type                                      |
| ------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [state](#basic_accessing) | current state                                                                               | _state **object**_                        |
| prevState                 | previous state</br>_(**undefined** if no state change yet has occurred)_                    | _state **object**_</br>or _**undefined**_ |
| isInitialized             | **false** if [delayed initialization](#advanced_delayed_initialization), otherwise **true** | _**boolean**_                             |

</br>

### **Methods**<a name="reference_methods"></a>

| Methods/_Param_                                             | Description                                                                                                                                                             | Return/_Type_                                                        |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **[addListener](#advanced_state_listeners)**                | **Adds listener to trigger on state changes</br> Returns remove listener function**                                                                                     | **() => boolean**                                                    |
| _trigger_                                                   | _Defines which state changes the listener triggers on_                                                                                                                  | **_[Update Key](#advanced_update_keys)_**                            |
| _callback_                                                  | _Called everytime the trigger changes occur_                                                                                                                            | _(current: **State**, prev: **Partial State**) => **void**_          |
|                                                             |                                                                                                                                                                         |                                                                      |
| **[initialize](#advanced_delayed_initialization)**          | **Used to set the default state for unintialized Shared States**                                                                                                        | -                                                                    |
| _initialState_                                              | _The initial state_                                                                                                                                                     | _**State**_                                                          |
|                                                             |                                                                                                                                                                         |                                                                      |
| **initializeOnMount**                                       | **Hook that automatically initializes state on component mount**                                                                                                        | **[State, SetStateFn]**                                              |
| _initialState_                                              | _The intial state.</br>Like the useState hook, it can calculated on mount using a callback_                                                                             | _**State** or () => **State**_                                       |
| _updateKey(s) (optional)_                                   | _If present then the component will re-render on key trigger_                                                                                                           | **_[Update Key](#advanced_update_keys)_**                            |
|                                                             |                                                                                                                                                                         |                                                                      |
| **[initializeStorage](#advanced_data_persist)</br>(async)** | **Resets store to saved data</br>Enables state to be saved using save method</br>Returns true if successful**                                                           | **Promise\<boolean>**                                                |
| _createStore_                                               | _Plug-in function that integrates state with a specific storage module_                                                                                                 | _**Create Store Function**_                                          |
|                                                             |                                                                                                                                                                         |                                                                      |
| **refresh**                                                 | **Forces all registered components to re-render**                                                                                                                       | -                                                                    |
|                                                             |                                                                                                                                                                         |                                                                      |
| **[register](#basic_class)**                                | **Registers class components to re-render on state change</br>Use in either constructor or componentDidMount methods**                                                  | -                                                                    |
| _component_                                                 | _To link the class component **this** needs to be passed into the function_                                                                                             | _**this**_                                                           |
| _updateKey(s) (optional)_                                   | _If present then the component will only re-render on key trigger_                                                                                                      | **_[Update Key](#advanced_update_keys)_**                            |
|                                                             |                                                                                                                                                                         |                                                                      |
| **removeAllListeners**                                      | **Clears all listeners started by the addListener method**                                                                                                              | -                                                                    |
|                                                             |                                                                                                                                                                         |                                                                      |
| **reset**                                                   | **Resets state back to the default state</br>Deletes or updates stored state depending on reset state**                                                                 | -                                                                    |
| _resetState (optional)_                                     | _If present, becomes the State's new default state_                                                                                                                     | _**State**_                                                          |
|                                                             |                                                                                                                                                                         |                                                                      |
| **save (async)**                                            | **Saves the current state to store if initializeStorage has been performed</br>Returns true if successful**                                                             | Promise \<boolean>                                                   |
|                                                             |                                                                                                                                                                         |
| **setProp**                                                 | **Update a single property of the state</br>Shallow comparison is used to detect/trigger re-renders**                                                                   | -                                                                    |
| _propName_                                                  | _Defines which property to update_                                                                                                                                      | _**key of State**_                                                   |
| _newValue_                                                  | _Property's new value_                                                                                                                                                  | _propType_                                                           |
|                                                             |                                                                                                                                                                         |                                                                      |
| **[setState](#basic_updating)**                             | **Updates state by combining the newState with the current state</br>Shallow comparison evaluates updated state</br>Updated state triggers re-renders and is returned** | **Partial State**                                                    |
| _newState_                                                  | _The new state to _                                                                                                                                                     | _**key of State**_                                                   |
| _newValue_                                                  | _Property's new value_                                                                                                                                                  | _propType_                                                           |
|                                                             |                                                                                                                                                                         |                                                                      |
| **toString**                                                | Returns the current state in as a JSON string                                                                                                                           | string                                                               |
|                                                             |                                                                                                                                                                         |                                                                      |
| **[unregister](#basic_class)**                              | **Un-registers class components from re-rendering on state change</br>Use in componentWillMount methods</br>Failure of this will result in memory leaks**               | -                                                                    |
| _component_                                                 | _To un-link the class component **this** needs to be passed into the function_                                                                                          | _**this**_                                                           |
|                                                             |                                                                                                                                                                         |
| **[useProp](#basic_functional)**                            | **Hook to register functional component to State</br>Returns array of prop value and prop setter, similar to useState**                                                 | **[prop, setPropFn]**                                                |
| _updateKey(s) (optional)_                                   | _If present then the component will only re-render on key trigger_                                                                                                      | **_[Update Key](#advanced_update_keys)_**                            |
|                                                             |                                                                                                                                                                         |                                                                      |
| **[useState](#basic_functional)**                           | **Hook to register functional component to State</br>Returns array of state and state setter</br>Allows additional optimization with the shouldUpdate param**           | **[state, setStateFn]**                                              |
| _updateKey(s) (optional)_                                   | _If present then the component will only re-render on key trigger_                                                                                                      | **_[Update Key](#advanced_update_keys)_**                            |
| _shouldUpdateFn</br>(optional)_                             | _Run when triggered by State</br>The component will on then update if function return **true**_                                                                         | _(newState: **State**, prevState: **Partial State**) => **boolean**_ |

</br>

## 📲 Example <a name = "example"></a>

Clone or fork the repo at [https://github.com/JontiHudson/modules-huds0n-shared-state](https://github.com/JontiHudson/modules-huds0n-shared-state)

Go to the **\_\_example\_\_** folder. Run **npm install** to install the expo project, then **expo start** to launch the example.

</br>

## ✍️ Authors <a name = "authors"></a>

- [@JontiHudson](https://github.com/JontiHudson) - Idea & Initial work
- [@MartinHudson](https://github.com/martinhudson) - Support & Development

See also the list of [contributors](https://github.com/JontiHudson/modules-huds0n-shared-state/contributors) who participated in this project.

</br>

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Special thanks to my fiance, Arma, who has been so patient with all my extra-curricular work.
