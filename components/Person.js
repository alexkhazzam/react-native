import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

const Person = (props) => {
  return (
    <View style={styles.result}>
      <Image source={require('../assets/images/doctors-bag.png')} />
      {Object.entries(props.data.person).map(([key, value]) => (
        <Text><Text style={styles.resultItem}>{key}: </Text>{value}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Person;
