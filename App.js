import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [requestData, setRequestData] = useState([]);

  const errorHandler = (e) => {
    setShowLoadingSpinner(false);
    console.log(e);
  };

  const searchInputHandler = (userInput) => {
    if (userInput !== '' && userInput) {
      setSearchText(text);
    }
  };

  const requestHandler = async () => {
    setShowLoadingSpinner(!showLoadingSpinner);

    const result = await fetch(`https://npiregistry.cms.hhs.gov/api/?first_name=${searchText}&city=&lim
    it=20&version=2.1`).catch((e) => {
      return errorHandler(e);
    });

    const resultData = await result.json().catch((e) => {
      return errorHandler(e);
    });

    setRequestData(JSON.parse(resultData));
    setShowLoadingSpinner(false);
    setSearchText(null);

    console.log(requestData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TextInput
          placeholder="Enter Name Here"
          onChangeText={searchInputHandler}
        ></TextInput>
        <TouchableOpacity>
          <Button title="Search" onPress={requestHandler} />
        </TouchableOpacity>
      </View>
      <LoadingIcon showLoadingSpinner={showLoadingSpinner} />
      <View>
        <FlatList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 150,
  },
});
