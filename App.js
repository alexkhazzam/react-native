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
  const [isRequestDataDisplayed, setIsRequestDataDisplayed] = useState(false);
  const [searchTextPlaceholder, setSearchTextPlaceholder] = useState(undefined);
  const [SEARCHTEXT, SETSEARCHTEXT] = useState(undefined);
  const [requestData, setRequestData] = useState([]);

  const errorHandler = (e) => {
    setShowLoadingSpinner(false);
    console.log(e);
  };

  const searchInputHandler = (userInput) => {
    setIsRequestDataDisplayed(false);

    if (userInput !== '' && userInput) {
      setSearchTextHelper(userInput);
    }
  };

  const requestHandler = async () => {
    setShowLoadingSpinner(!showLoadingSpinner);
    setRequestData([]);

    const result = await fetch(`https://npiregistry.cms.hhs.gov/api/?first_name=${SEARCHTEXT}&city=&lim
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
          { key: Math.random().toString(), person: res[i].addresses[k] }, // Need to add key property because FlatList's key extractor looks for it by default
        ]);
      }
    }

    const enteredName = SEARCHTEXT;

    setSearchTextHelper(undefined);
    setSearchTextPlaceholder(enteredName);
    setShowLoadingSpinner(false);
    closeModal(true);
  };

  const closeModal = (bool) => {
    setIsRequestDataDisplayed(bool);
  };

  const setSearchTextHelper = (input) => {
    SETSEARCHTEXT(input);
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Name Here"
          onChangeText={searchInputHandler}
          value={isRequestDataDisplayed ? '' : null}
        ></TextInput>
        <TouchableOpacity>
          <Button title="Search" onPress={requestHandler} />
        </TouchableOpacity>
      </View>
      <LoadingSpinner showLoadingSpinner={showLoadingSpinner} />
      <Modal animationType={'slide'} visible={isRequestDataDisplayed}>
        <View style={styles.goBackWrapper}>
          <TouchableHighlight onPress={closeModal.bind(this, false)}>
            <View>
              <Image
                source={require('./assets/images/left-arrow.png')}
                style={styles.goBackBtn}
              />
            </View>
          </TouchableHighlight>
          {isRequestDataDisplayed ? (
            <Text>
              <Text style={styles.requestDataLength}>
                {requestData.length === 0 ? 'No' : requestData.length}
              </Text>
              &nbsp;
              {requestData.length === 0
                ? 'Results Found!'
                : `Results Found For "${searchTextPlaceholder}"!`}
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
  goBackWrapper: {
    marginTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackBtn: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  requestDataLength: {
    fontWeight: 'bold',
  },
  resultWrapper: {
    alignItems: 'center',
  },
});
