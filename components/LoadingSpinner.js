import React from 'react';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingSpinner = (props) => {
  return (
    <Text style={styles.loadingSpinner}>
      {props.showLoadingSpinner ? <ActivityIndicator /> : null}
    </Text>
  );
};

const styles = StyleSheet.create({
  loadingSpinner: {
    marginTop: 30,
  },
});

export default LoadingSpinner;
