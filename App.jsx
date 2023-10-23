import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button, Modal, TouchableHighlight, FlatList, SafeAreaView } from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import tw, { useDeviceContext, useAppColorScheme } from "twrnc";
import Icon from 'react-native-vector-icons/AntDesign';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

export default function App() {

  const db = SQLite.openDatabase('example3.db');

  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState({
    title: "",
    description: "",
    color: "#E0FBFF" ,
  });

  const [showModal, setShowModal] = useState(false);

  const onSelectColor = ({ hex }) => {
    // do something with the selected color.
    setCurrentTodo({...currentTodo, color: hex});
  };


  const handleChangeTitle = (value) => {
    setCurrentTodo({ ...currentTodo, title: value });
  };

  const handleChangeDescription = (value) => {
    setCurrentTodo({ ...currentTodo, description: value });
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY, title TEXT, description TEXT, color TEXT)"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM words",
        null,
        (txObj, resultSet) => setTodos(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });

    console.log(todos);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading Words...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }


  const addTodo = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO words (title, description, color) values (?,?,?)",
        [currentTodo.title, currentTodo.description, currentTodo.color],
        (txObj, resultSet) => {
          let existingTodos = [...todos];
          existingTodos.push({ id: resultSet.insertId, ...currentTodo });
          setTodos(existingTodos);
          setCurrentTodo({
            title: "",
            description: "",
            color: "",
          });
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const completeTodo = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM words WHERE id = ?",
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingTodos = [...todos].filter((todo) => todo.id !== id);
            setTodos(existingTodos);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const updateWord = (id) => {
    console.log('inicio');
    db.transaction(tx => {
      console.log(`${currentTodo.title} | ${currentTodo.description} | ${currentTodo.color} | ${id}`);
      tx.executeSql('UPDATE words SET title = ?, description = ?, color = ? WHERE id = ?',
        [currentTodo.title, currentTodo.description, currentTodo.color, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log('hecho');
            let existingWords = [...todos];
            const indexToUpdate = existingWords.findIndex(word => word.id === id);
            currentTodo.id = id;
            existingWords[indexToUpdate] = currentTodo;
            console.log('------asddasdsa----------');
            console.log(existingWords);
            setTodos(existingWords);
            setCurrentTodo({
              title: "",
              description: "",
              color: "",
            });
          }
        },
        (txObj, error) => console.log(error))
      }
    );
  }

  return (
    <View style={tw`bg-white h-full`}>
      <View
        style={tw`bg-white shadow-2xl py-10 px-10 mt-10 mb-5 mx-3 gap-5 rounded-xl`}
      >
        <TextInput
          style={tw`bg-slate-300 p-2 rounded-sm`}
          value={currentTodo.title.toString()}
          placeholder="Title"
          onChangeText={handleChangeTitle}
        />
        <TextInput
          style={tw`bg-slate-300 p-2 rounded-sm`}
          value={currentTodo.description.toString()}
          placeholder="Description"
          multiline
          numberOfLines={3}
          onChangeText={handleChangeDescription}
        />
        <View style={tw`mx-auto w-1/2`}>
          <Button
            title="Color Picker"
            onPress={() => setShowModal(true)}
            color={"#003f69"}
          />
        </View>

        <TouchableHighlight
          style={tw`rounded-xl bg-[#260d33] p-1`}
          onPress={addTodo}
        >
          <Text style={tw`text-white font-bold text-lg text-center uppercase`}>
            Add Word
          </Text>
        </TouchableHighlight>
      </View>

      <Text style={tw`text-center text-xl uppercase border-b-2 mx-4 font-bold`}>
        Words / Phrases
      </Text>

      <FlatList
        data={todos}
        renderItem={({ item }) => {
          console.log(item, item.id);
          return (
            <View
              key={item.id}
              style={tw`flex-row items-center justify-between mx-4 mt-5 p-4 gap-2 rounded-md bg-[${item.color ? item.color : '#E0FBFF'}]`}
            >
              <Text style={tw`text-black`}>{item.title}</Text>
              <Icon name="arrowright" size={20} color="#000000" />
              <Text style={tw`text-black flex-1 m-4`}>{item.description}</Text>
              <TouchableHighlight
                title=""
                onPress={() => updateWord(item.id)}
                style={tw`bg-[#260d33] p-2 rounded-lg`}
              >
                <Icon name="edit" size={20} color="#FFFFFF" />
              </TouchableHighlight>
              <TouchableHighlight
                title=""
                onPress={() => completeTodo(item.id)}
                style={tw`bg-[#260d33] p-2 rounded-lg`}
              >
                <Icon name="delete" size={20} color="#FFFFFF" />
              </TouchableHighlight>
            </View>
          );
        }}
      />

      <Modal
        visible={showModal}
        animationType="slide"
        style={tw`bg-blue-600 w-full h-full`}
      >
        <ColorPicker
          style={tw`m-10 p-10 gap-5`}
          value="red"
          onComplete={onSelectColor}
        >
          <Preview />
          <Panel1 />
          <HueSlider />
          <OpacitySlider />
        </ColorPicker>
        <View style={tw`mx-auto w-1/2`}>
          <Button title="Pick Color" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 8,
  },
});