// SecondPage.js
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const SecondPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      {/* Other elements for the second page */}
      {/* You can use Image component for images */}
      <Image
        source={{uri: 'https://via.placeholder.com/20x12'}}
        style={styles.image}
      />
      {/* Add other elements */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: 'black',
  },
  circle: {
    width: 40,
    height: 40,
    left: 176,
    top: 886,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 9999,
  },
  image: {
    width: 20,
    height: 12,
    left: 0,
    top: 0,
    position: 'absolute',
  },
  // Add other styles as needed
});

export default SecondPage;
