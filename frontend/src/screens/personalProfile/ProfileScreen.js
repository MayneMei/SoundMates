// ProfileScreen.js
import React, {useState} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';

const ProfileScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    // 根据滑动距离切换页面
    if (yOffset > 0) {
      setCurrentPage(2);
    } else {
      setCurrentPage(1);
    }
  };

  return (
    <ScrollView style={styles.container} onScroll={handleScroll}>
      {currentPage === 1 ? <FirstPage /> : <SecondPage />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProfileScreen;
