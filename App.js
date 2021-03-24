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

export default function App() {
  const [requestHasError, setRequestHasError] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [isRequestDataDisplayed, setIsRequestDataDisplayed] = useState(false);
  const [searchTextPlaceholder, setSearchTextPlaceholder] = useState(undefined);
  const [SEARCHTEXT, SETSEARCHTEXT] = useState(undefined);
  const [requestData, setRequestData] = useState([]);

  const errorHandler = (e) => {
    setShowLoadingSpinner(false);
    setRequestHasError(true);
  };

  const searchInputHandler = (userInput) => {
    setRequestHasError(false);
    setIsRequestDataDisplayed(false);

    if (userInput !== '' && userInput) {
      setSearchTextHelper(userInput);
    }
  };

  const requestHandler = async () => {
    setShowLoadingSpinner(!showLoadingSpinner);
    setRequestData([]);

    let result;
    let resultData;

    try {
      result = await fetch(`https://npiregistry.cms.hhs.gov/api/?first_name=${SEARCHTEXT}&city=&lim
      it=${20}&version=${2.1}`);
      resultData = await result.json();
    } catch (e) {
      errorHandler(e);
    }

    if (!requestHasError) {
      requestDataHandler(resultData);
    }
  };

  const requestDataHandler = (data) => {
    const res = data.results;
    for (let i = 0; i < res.length; i++) {
      for (let k = 0; k < res[i].addresses.length; k++) {
        setRequestData((data) => [
          ...data,
          { key: Math.random().toString(), person: res[i].addresses[k] }, // FlatList's keyExtractor will look for "key" property by default
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
      {requestHasError ? (
        <Text style={styles.errorMessage}>
          Oops! An error occurred, please try again later!
        </Text>
      ) : null}
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
              {/* Note that RequestData.length <= 20 because we are setting the limit query param to 20 requests */}
            </Text>
          ) : null}
        </View>
        <View style={styles.resultWrapper}>
          <FlatList
            data={requestData}
            keyExtractor={(personObj) => personObj.key}
            renderItem={(data) => (
              <View style={styles.result}>
                <Image source={require('./assets/images/doctors-bag.png')} />
                {Object.entries(data.item.person).map(([key, value]) => (
                  <Text>
                    {/* Wrapping in double text in order to style key
                    individually */}
                    <Text style={styles.resultItem}>{key}: </Text> {value}
                  </Text>
                ))}
              </View>
            )}
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
  errorMessage: {
    color: 'red',
  },
  result: {
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
  },
  resultItem: {
    fontWeight: 'bold',
  },
});
