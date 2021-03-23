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
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [searchText, setSearchText] = useState(undefined);
  const [displayName, setDisplayName] = useState(undefined);
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
            renderItem={(data) => (
              <View style={styles.result}>
                <Image source={require('./assets/images/doctors-bag.png')} />
                <Text>address_1: {data.item.person.address_1}</Text>
                <Text>address_2: {data.item.person.address_2}</Text>
                <Text>address_purpose: {data.item.person.address_purpose}</Text>
                <Text>address_type:{data.item.person.address_type}</Text>
                <Text>city: {data.item.person.city}</Text>
                <Text>country_code: {data.item.person.country_code}</Text>
                <Text>fax_number: {data.item.person.fax_number}</Text>
                <Text>postal_code: {data.item.person.postal_code}</Text>
                <Text>state: {data.item.person.state}</Text>
                <Text>
                  telephone_number: {data.item.person.telephone_number}
                </Text>
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
  resultWrapper: {
    alignItems: 'center',
  },
  result: {
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
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
