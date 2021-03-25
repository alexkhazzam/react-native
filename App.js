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
  const [showAllPersonInfo, setShowAllPersonInfo] = useState(false);
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

    userInput = userInput.trim();

    if (userInput !== '' && userInput) {
      setSearchTextHelper(userInput);
    }
  };

  const inputNameHandler = () => {
    return {
      firstName: /\s/g.test(SEARCHTEXT) ? SEARCHTEXT.split(' ')[0] : SEARCHTEXT,
      lastName: /\s/g.test(SEARCHTEXT) ? SEARCHTEXT.split(' ')[1] : '',
    };
  };

  const requestHandler = async (organizationSearched) => {
    setShowLoadingSpinner(!showLoadingSpinner);
    setRequestData([]);

    let url = 'https://npiregistry.cms.hhs.gov/api/';

    if (organizationSearched) {
      url += `?organization_name=${SEARCHTEXT}&city=&lim
      it=${20}&version=${2.1}`;
    } else {
      url += `?first_name=${inputNameHandler().firstName}&last_name=${
        inputNameHandler().lastName
      }&city=&lim
        it=${20}&version=${2.1}`;
    }
    const result = await fetch(url).catch((e) => {
      errorHandler(e);
    });

    const resultData = await result.json().catch((e) => {
      errorHandler(e);
    });

    console.log(url);
    console.log(resultData);

    if (!requestHasError) {
      requestDataHandler(resultData);
    }
  };

  const requestDataHandler = (data) => {
    const res = data.results;
    for (let i = 0; i < res.length; i++) {
      for (let k = 0; k < res[i].addresses.length; k++) {
        const p = res[i].addresses[k];

        const briefPersonSummary = {
          ['First Name']: inputNameHandler().firstName,
          ['Last Name']: inputNameHandler().lastName,
          address_1: p.address_1,
          state: p.state,
          city: p.city,
        };

        delete p.address_1;
        delete p.city;
        delete p.state;

        setRequestData((data) => [
          ...data,
          {
            key: Math.random().toString(),
            personSummary: p,
            briefPersonSummary: briefPersonSummary,
          },
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

  const showPersonInfoHandler = (e) => {
    setShowAllPersonInfo(!showAllPersonInfo);
    console.log(showAllPersonInfo);
    e.stopPropgation();
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Person Or Organiztion Name"
          onChangeText={searchInputHandler}
          value={isRequestDataDisplayed ? '' : null}
        ></TextInput>
        <TouchableOpacity>
          <Button title="Search Person" onPress={() => requestHandler(false)} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button
            title="Search Organization"
            onPress={() => requestHandler(true)}
          />
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
                {Object.entries(data.item.briefPersonSummary).map(
                  ([key, value]) => (
                    <View>
                      <Text>
                        <Text style={styles.resultItem}>{key}: </Text> {value}
                      </Text>
                    </View>
                  )
                )}
                {Object.entries(data.item.personSummary).map(([key, value]) => (
                  <View
                    style={
                      showAllPersonInfo
                        ? { display: 'flex' }
                        : { display: 'none' }
                    }
                  >
                    <Text>
                      <Text style={styles.resultItem}>{key}: </Text> {value}
                    </Text>
                  </View>
                ))}
                <Button
                  title={showAllPersonInfo ? 'Show Less' : 'Show More'}
                  onPress={(e) => showPersonInfoHandler(e)}
                />
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
