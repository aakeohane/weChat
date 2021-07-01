import React from 'react';
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {

  // Action Sheet for button left of chat box to do the following actions
  onActionPress = () => {
    const options = [
      'Choose From Library', 
      'Take Picture', 
      'Send Location', 
      'Cancel'
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },    
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
            console.log('Cancelled');
        }
      }
    )
  }

  // gives permission to choose only images from your library to send to chat
  pickImage = async () => {
    // expo permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    try {
      if (status === "granted") {
        // pick image
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));
        // cancelled
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // gives permission to use and launch camera and then send that picture in chat
  takePhoto = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    try {
      if (status === "granted") {
        // use camera
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));
        // cancelled
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // gives permission to use your location based on phone GPS and send that location in chat
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND); // still uses deprecated permissions??
      if (status === "granted") {
        // gets location
        const result = await Location.getCurrentPositionAsync({})
        .catch((error) => console.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const altitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /* takes images and turns them into "blobs" for firestore storage (renames them) and then
  downloads image URL to be sent/uploaded later */
  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  render() {
    return (
      <TouchableOpacity 
        style={[styles.container]} 
        onPress={this.onActionPress}
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Let’s you choose to send image, take picture with camera or your location."
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity> 
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 13,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
    bottom: '3%',
  },
 });

 CustomActions.contextTypes = {
   actionSheet: PropTypes.func,
 }