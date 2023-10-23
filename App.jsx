import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  TouchableHighlight,
  FlatList,
} from "react-native";
// import ColorPicker, { Panel1, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import { uid } from "uid";
import Icon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import data from "./db.json";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState(data.words);
  const [currentTodo, setCurrentTodo] = useState({
    title: "",
    description: "",
    color: "#E0FBFF",
  });

  // const [showModal, setShowModal] = useState(false);

  // const onSelectColor = ({ hex }) => {
  //   if (hex) {
  //     setCurrentTodo({ ...currentTodo, color: hex });
  //   }
  // };

  const handleChangeTitle = (value) => {
    setCurrentTodo({ ...currentTodo, title: value });
  };

  const handleChangeDescription = (value) => {
    setCurrentTodo({ ...currentTodo, description: value });
  };

  useEffect(() => {
    const saveDataToStorage = async () => {
      try {
        await AsyncStorage.setItem("data", JSON.stringify(data));
      } catch (error) {
        console.error("Error al guardar los datos: ", error);
      }
    };

    saveDataToStorage();
  }, [todos]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading Todos...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  const addTodo = () => {
    let existingTodos = [...todos];
    existingTodos.push({ id: uid(), ...currentTodo });
    setTodos(existingTodos);
    setCurrentTodo({
      title: "",
      description: "",
      color: "",
    });
  };

  const completeTodo = (id) => {
    let existingTodos = [...todos].filter((todo) => todo.id !== id);
    setTodos(existingTodos);
  };

  const updateWord = (id) => {
    let existingWords = [...todos];
    const indexToUpdate = existingWords.findIndex((word) => word.id === id);
    currentTodo.id = id;
    existingWords[indexToUpdate] = currentTodo;
    setTodos(existingWords);
    setCurrentTodo({
      title: "",
      description: "",
      color: "",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={currentTodo.title.toString()}
          placeholder="Title"
          onChangeText={handleChangeTitle}
        />
        <TextInput
          style={styles.input}
          value={currentTodo.description.toString()}
          placeholder="Description"
          multiline
          numberOfLines={3}
          onChangeText={handleChangeDescription}
        />
        {/* <View style={styles.colorPickerButtonContainer}>
          <Button
            title="Color Picker"
            onPress={() => setShowModal(true)}
            color="#003f69"
          />
        </View> */}

        <TouchableHighlight
          style={styles.addButton}
          onPress={addTodo}
        >
          <Text style={styles.addButtonText}>Add Word</Text>
        </TouchableHighlight>
      </View>

      <Text style={styles.heading}>Words / Phrases</Text>

      <FlatList
        style={{width: '90%'}}
        data={todos}
        renderItem={({ item }) => {
          return (
            <View
              key={item.id}
              style={[styles.listItem, { backgroundColor: item.color || "#E0FBFF" }]}
            >
              <Text style={styles.listItemText}>{item.title}</Text>
              <Icon name="arrowright" size={20} color="#000" />
              <Text style={styles.listItemText}>{item.description}</Text>
              <TouchableHighlight
                title=""
                onPress={() => updateWord(item.id)}
                style={styles.editButton}
              >
                <Icon name="edit" size={20} color="#FFF" />
              </TouchableHighlight>
              <TouchableHighlight
                title=""
                onPress={() => completeTodo(item.id)}
                style={styles.deleteButton}
              >
                <Icon name="delete" size={20} color="#FFF" />
              </TouchableHighlight>
            </View>
          );
        }}
      />

      {/* <Modal
        visible={showModal}
        animationType="slide"
      >
         <ColorPicker
          style={{margin: 20}}
          value="red"
          onComplete={onSelectColor}
        >
          <Preview />
          <Panel1 />
          <HueSlider />
          <OpacitySlider />
        </ColorPicker>
        <View style={{margin: 'auto', width: '50%'}}>
          <Button title="Pick Color" onPress={() => setShowModal(false)} />
        </View>
      </Modal> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    gap: 10,
    width: '100%',
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 20,
    marginTop: 10,
    marginBottom: 5,
    margin: 3,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#B9B9B9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  colorPickerButtonContainer: {
    width: "100%",
    alignSelf: "center",
  },
  addButton: {
    backgroundColor: "#260d33",
    padding: 5,
    borderRadius: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 2,
    margin: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: 'center',
    margin: 10,
    padding: 5,
    borderRadius: 5,
    width: '100%'
  },
  listItemText: {
    color: "black",
    flex: 1,
    margin: 4,
  },
  editButton: {
    backgroundColor: "#260d33",
    padding: 10,
    borderRadius: 10,
    marginRight: 5
  },
  deleteButton: {
    backgroundColor: "#260d33",
    padding: 10,
    borderRadius: 10,
  },
  modalContainer: {
    width: "100%",
    height: "100%",
  },
});
