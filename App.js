import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';

import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [searchText, setSearchText] = useState(false);
  const [requestData, setRequestData] = useState([]);
  const [requestDataDisplayed, setRequestDataDisplayed] = useState(false);

  const errorHandler = (e) => {
    setShowLoadingSpinner(false);
    console.log(e);
  };

  const searchInputHandler = (userInput) => {
    setRequestDataDisplayed(false);
    if (userInput !== '' && userInput) {
      setSearchText(userInput);
    }
  };

  const requestHandler = async () => {
    setShowLoadingSpinner(!showLoadingSpinner);
    setRequestData([]);

    const result = await fetch(`https://npiregistry.cms.hhs.gov/api/?first_name=${searchText}&city=&lim
    it=${20}&version=${2.1}`).catch((e) => {
      return errorHandler(e);
    });

    const resultData = await result.json().catch((e) => {
      return errorHandler(e);
    });

    requestDataHandler(resultData);
  };

  const requestDataHandler = (data) => {
    const d = [];
    const res = data.results;
    for (let i = 0; i < res.length; i++) {
      for (let k = 0; k < res[i].addresses.length; k++) {
        setRequestData((data) => [...data, res[i].addresses[k]]);
      }
    }

    setRequestDataDisplayed(true);
    setShowLoadingSpinner(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Name Here"
          onChangeText={searchInputHandler}
          value={requestDataDisplayed ? '' : null}
        ></TextInput>
        <TouchableOpacity>
          <Button title="Search" onPress={requestHandler} />
        </TouchableOpacity>
        {requestDataDisplayed ? (
          <Text>
            {requestData.length} results found for "{searchText}"
          </Text>
        ) : null}
      </View>
      <LoadingSpinner showLoadingSpinner={showLoadingSpinner} />
      <View></View>
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
  textInput: {
    textAlign: 'center',
  },
});
