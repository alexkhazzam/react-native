import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Text,
  ScrollView,
  Image,
} from 'react-native';

import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [searchText, setSearchText] = useState(undefined);
  const [displayName, setDisplayName] = useState('');
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
        res[i].addresses[k].key = Math.random();
        setRequestData((data) => [...data, res[i].addresses[k]]);
      }
    }

    const enteredName = searchText;

    setSearchText(undefined);
    setDisplayName(enteredName);
    setShowLoadingSpinner(false);
    setRequestDataDisplayed(true);
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
            {requestData.length} results found for "{displayName}"
          </Text>
        ) : null}
      </View>
      <LoadingSpinner showLoadingSpinner={showLoadingSpinner} />
      <ScrollView>
        {requestData.map((data) => (
          <View styles={styles.resultsWrapper} key={data.key}>
            <View style={styles.resultWrapper}>
              <View style={styles.result}>
                <Image source={require('./assets/images/doctors-bag.png')} />
                <Text>address_1: {data.address_1}</Text>
                <Text>address_2: {data.address_2}</Text>
                <Text>address_purpose: {data.address_purpose}</Text>
                <Text>address_type:{data.address_type}</Text>
                <Text>city: {data.city}</Text>
                <Text>country_code: {data.country_code}</Text>
                <Text>fax_number: {data.fax_number}</Text>
                <Text>postal_code: {data.postal_code}</Text>
                <Text>state: {data.state}</Text>
                <Text>telephone_number: {data.telephone_number}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
});
