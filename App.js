import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Text,
  Modal,
  Image,
  TouchableHighlight,
} from 'react-native';

import LoadingSpinner from './components/LoadingSpinner';
import Person from './components/Person';

export default function App() {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [requestDataDisplayed, setRequestDataDisplayed] = useState(false);
  const [displayName, setDisplayName] = useState(undefined);
  const [searchText, setSearchText] = useState(undefined);
  const [requestData, setRequestData] = useState([]);

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
    const res = data.results;
    for (let i = 0; i < res.length; i++) {
      for (let k = 0; k < res[i].addresses.length; k++) {
        setRequestData((data) => [
          ...data,
          { key: Math.random().toString(), person: res[i].addresses[k] },
        ]);
      }
    }

    const enteredName = searchText;

    setSearchText(undefined);
    setDisplayName(enteredName);
    setShowLoadingSpinner(false);
    setRequestDataDisplayed(true);
  };

  const closeModal = () => {
    setRequestDataDisplayed(false);
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
      </View>
      <LoadingSpinner showLoadingSpinner={showLoadingSpinner} />
      <Modal animationType={'slide'} visible={requestDataDisplayed}>
        <View style={styles.goBackWrapper}>
          <TouchableHighlight onPress={closeModal}>
            <View>
              <Image
                source={require('./assets/images/left-arrow.png')}
                style={styles.goBack}
              />
              <Text>Go Back</Text>
            </View>
          </TouchableHighlight>
          {requestDataDisplayed ? (
            <Text style={styles.resultInformation}>
              {requestData.length} results found for "{displayName}"
            </Text>
          ) : null}
        </View>
        <View style={styles.resultWrapper}>
          <FlatList
            data={requestData}
            renderItem={(data) => <Person data={data.item} />}
          />
        </View>
      </Modal>
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
  resultWrapper: {
    alignItems: 'center',
  },
  goBackWrapper: {
    marginLeft: 30,
    marginTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultInformation: {
    color: 'navy',
    marginLeft: 10,
  },
  goBack: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
});
