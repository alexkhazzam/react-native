import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";

const Person = (props) => {
  return (
    <View style={styles.result}>
      <Image source={require("../assets/images/doctors-bag.png")} />
      <Text>
        <Text style={styles.resultItem}>address_1: </Text>
        {props.data.person.address_1}
      </Text>
      <Text>
        <Text style={styles.resultItem}>address_2:</Text>{" "}
        {props.data.person.address_2}
      </Text>
      <Text>
        <Text style={styles.resultItem}>address_purpose: </Text>
        {props.data.person.address_purpose}
      </Text>
      <Text>
        <Text style={styles.resultItem}>address_type:</Text>
        {props.data.person.address_type}
      </Text>
      <Text>
        <Text style={styles.resultItem}>city: </Text>
        {props.data.person.city}
      </Text>
      <Text>
        <Text style={styles.resultItem}>country_code: </Text>
        {props.data.person.country_code}
      </Text>
      <Text>
        <Text style={styles.resultItem}>fax_number: </Text>
        {props.data.person.fax_number}
      </Text>
      <Text>
        <Text style={styles.resultItem}>postal_code: </Text>
        {props.data.person.postal_code}
      </Text>
      <Text>
        <Text style={styles.resultItem}>state: </Text>
        {props.data.person.state}
      </Text>
      <Text>
        <Text style={styles.resultItem}>telephone_number: </Text>
        {props.data.person.telephone_number}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  result: {
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "grey",
  },
  resultItem: {
    fontWeight: "bold",
  },
});

export default Person;
