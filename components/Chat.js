import React, { Component } from 'react';
import CustomActions from './CustomActions';
import { View, Platform, StyleSheet, KeyboardAvoidingView, LogBox } from 'react-native';
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import * as SecureStore from 'expo-secure-store'
// AsyncStorage get warning so I cant use it had to find alternative above
// import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
      image: null,
      user: {
        _id: '',
        name: '',
        avatar: '',
      }
    };

    // firebase adding credentials in order to connect to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyC-ss-crf_xOfKvWBN7wfTuj5WWPBIYZiY",
        authDomain: "test-8b6b2.firebaseapp.com",
        projectId: "test-8b6b2",
        storageBucket: "test-8b6b2.appspot.com",
        messagingSenderId: "829771573633",
        appId: "1:829771573633:web:5bb750d61146fd8a4ca080"
      });
    }

    // creates reference to collection made in Firestore called weChat throughout code
    this.referenceChatMessages = firebase.firestore().collection("weChat"); 

    //Ignores warnings
    LogBox.ignoreLogs([
      'Animated',
      'expo-permissions', 
      'Setting a timer'
    ]);
  }

  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `${name}'s Chat` });
    /* calls fetch method to determine if user is offline or online with isConnected boolean 
    allowing you to fetch data from Firestore if online or asyncStorage if not */
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true
        })
        console.log('online');
        // listens for authentication changes, such as the user being logged in.
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: name,
              avatar: 'https://placeimg.com/140/140/animals'
            },
            messages: [],
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false
        })
        console.log('offline');
        this.getMessages();
      }
    })
  }

  componentWillUnmount() {
    // Stop listening to authentication and collection changes 
    this.authUnsubscribe();
    this.unsubscribe();
  }

  // temporary storage of messages
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await SecureStore.getItemAsync('weChat')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // firebase storage
  saveMessages = async () => {
    try {
      const jsonValue = JSON.stringify(this.state.messages);
      await SecureStore.setItemAsync('weChat', jsonValue);
    } catch(error) {
      console.log(error.message)
    }
  };

  deleteMessages = async () => {
    try {
      await SecureStore.deleteItemAsync('weChat');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // pushed messages through from firebase storage database that were sent after leaving chat
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  // adds messages to the firestore database
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  // adds your own message to chat while saving to client side and database when you press send in chat
  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
        this.saveMessages();
      }
    );
  };

   // change text bubble color
  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#ffffff'
          },
        }}
      />
    )
  }

  // renders input toolbar through gifted chat props only when online, disappears when offline
  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
    } else {
      return (
        <InputToolbar
        {...props}
        containerStyle={styles.inputContainer}
        />
      )
    }
  }

  // render the send button styling so it doesn take styling of text input box
  renderSend = (props) => {
    return (
      <Send
        {...props}
        containerStyle={{
          backgroundColor: 'transparent',
          paddingBottom: 5,
        }}
      />
    )
  }

 // renders custom Action button for sending pics/taking pics/sending location
  renderCustomActions = (props) => {
    return <CustomActions {...props} />
  }

  renderCustomView (props) {
    const { currentMessage } = props;
    if(currentMessage.location) {
      return (
        <MapView
          style={{
            width: 250,
            height: 200,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      )
    }
    return null;
  }

  render() {
    let { backgroundColor } = this.props.route.params
    return (
      <View style={[styles.textContainer, { backgroundColor: backgroundColor }]}>
        <GiftedChat
        renderBubble={this.renderBubble}
        renderInputToolbar={this.renderInputToolbar}
        renderCustomView={this.renderCustomView}
        renderSend={this.renderSend}
        messages={this.state.messages}
        renderAvatar={this.renderAvatar}
        renderUsernameOnMessage={true}
        onSend={messages => this.onSend(messages)}
        user={this.state.user}
        renderActions={this.renderCustomActions}
        />
        { 
          Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null 
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 1, 
    borderTopWidth: 1, 
    borderColor: '#757083', 
    borderTopColor: '#757083', 
    borderRadius: 25, 
    paddingTop: 6,
    width: '80%',
    left: '10%',
  },
})