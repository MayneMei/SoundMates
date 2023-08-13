// src/components/FirstPage.js
import React, {useState} from 'react';
import {View, Button, Modal, Text, TouchableOpacity} from 'react-native';

const FirstPage = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* Buttons to open modal */}
      <Button title="Top Artists" onPress={openModal} />
      <Button title="Top Songs" onPress={openModal} />
      <Button title="Recently Most Played" onPress={openModal} />
      <Button title="Top Albums" onPress={openModal} />
      <Button title="Top Genre" onPress={openModal} />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'white',
              padding: 20,
            }}>
            <Text>Modal Content - Display Your Data Here</Text>
            <TouchableOpacity onPress={closeModal} style={{marginTop: 20}}>
              <Text style={{color: 'blue'}}>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FirstPage;
