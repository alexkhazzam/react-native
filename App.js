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
  Switch,
  TouchableHighlight,
} from 'react-native';

import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const [requestHasError, setRequestHasError] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [organizationWasSearched, setOrganizationWasSearched] = useState(false);
  const [isRequestDataDisplayed, setIsRequestDataDisplayed] = useState(false);
  const [showAllPersonInfo, setShowAllPersonInfo] = useState(false);
  const [searchTextPlaceholder, setSearchTextPlaceholder] = useState(undefined);
  const [SEARCHTEXT, SETSEARCHTEXT] = useState(undefined);
  const [organizationData, setOrganizationData] = useState([]);
  const [personData, setPersonData] = useState([]);

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

  const requestHandler = () => {
    setPersonData([]);
    setOrganizationData([]);
    setShowLoadingSpinner(!showLoadingSpinner);
    setShowAllPersonInfo(false);

    let url = 'https://npiregistry.cms.hhs.gov/api/';

    if (organizationWasSearched) {
      url += `?organization_name=${SEARCHTEXT}&city=&lim
      it=${20}&version=${2.1}`;
    } else {
      url += `?first_name=${inputNameHandler().firstName}&last_name=${
        inputNameHandler().lastName
      }&city=&lim
        it=${20}&version=${2.1}`;
    }

    fetch(url)
      .then((result) => {
        result.json().then((resultData) => {
          requestDataHandler(resultData);
        });
      })
      .catch((e) => {
        return errorHandler(e);
      });
  };

  const requestDataHandler = (responseData) => {
    const data = { ...responseData };
    if (organizationWasSearched === false) {
      for (let i = 0; i < data.results.length; i++) {
        for (let k = 0; k < data.results[i].addresses.length; k++) {
          const p = data.results[i].addresses[k];

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

          setPersonData((d) => [
            ...d,
            {
              key: Math.random().toString(),
              personSummary: p,
              briefPersonSummary: briefPersonSummary,
            },
          ]);
        }
      }
    } else {
      for (const obj in data.results) {
        const org = data.results[obj].basic;

        delete org.name;

        const briefOrgSummary = {
          authorized_official_first_name: org.authorized_official_first_name,
          authorized_official_last_name: org.authorized_official_last_name,
          organization_name: org.organization_name,
        };

        delete org.authorized_official_first_name;
        delete org.authorized_official_last_name;
        delete org.organization_name;

        setOrganizationData((d) => [
          ...d,
          {
            key: Math.random().toString,
            orgSummary: org,
            briefOrgSummary: briefOrgSummary,
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
  };

  const dataSearchedHandler = (data) => {
    if (data) {
      setOrganizationWasSearched(true);
    } else {
      setOrganizationWasSearched(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.textInput}
          placeholder={
            organizationWasSearched
              ? 'Enter Organization Name'
              : 'Enter Person Name'
          }
          onChangeText={searchInputHandler}
          value={isRequestDataDisplayed ? '' : null}
        ></TextInput>
        <TouchableOpacity>
          <Button
            title={
              organizationWasSearched ? 'Search Organization' : 'Search Person'
            }
            onPress={() => requestHandler()}
          />
        </TouchableOpacity>
        <View style={styles.toggleBtnWrapper}>
          <TouchableOpacity>
            <View>
              <Switch
                value={organizationWasSearched}
                onValueChange={dataSearchedHandler}
              ></Switch>
            </View>
          </TouchableOpacity>
        </View>
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
              <Text style={styles.personData}>
                {personData.length === 0 ? 'No' : personData.length}
              </Text>
              &nbsp;
              {personData.length === 0
                ? 'Results Found!'
                : `Results Found For "${searchTextPlaceholder}"!`}
            </Text>
          ) : null}
        </View>
        <View style={styles.resultWrapper}>
          <FlatList
            data={organizationWasSearched ? organizationData : personData}
            keyExtractor={(personObj) => personObj.key}
            renderItem={(data) => (
              <View style={styles.result}>
                <Image source={require('./assets/images/doctors-bag.png')} />
                {Object.entries(
                  organizationWasSearched
                    ? data.item.briefOrgSummary
                    : data.item.briefPersonSummary
                ).map(([key, value]) => (
                  <View>
                    <Text>
                      <Text style={styles.resultItem}>{key}: </Text> {value}
                    </Text>
                  </View>
                ))}
                {Object.entries(
                  organizationWasSearched
                    ? data.item.orgSummary
                    : data.item.personSummary
                ).map(([key, value]) => (
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
  toggleBtnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
