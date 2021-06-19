import React from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
// import AsyncStorage from '@react-native-community/async-storage';
// using deprecated version for now bc updated (above) does not work with expo ios
import { AsyncStorage } from "react-native";
import NetInfo from '@react-native-community/netinfo';

const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyC-ss-crf_xOfKvWBN7wfTuj5WWPBIYZiY",
  authDomain: "test-8b6b2.firebaseapp.com",
  projectId: "test-8b6b2",
  storageBucket: "test-8b6b2.appspot.com",
  messagingSenderId: "829771573633",
  appId: "1:829771573633:web:5bb750d61146fd8a4ca080"
}

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: '',
      isConnected: false,
      user: {
        _id: '',
        name: '',
        avatar: '',
      }
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // creates reference to collection made in Firestore called weChat throughout code
    this.referenceChatMessages = firebase.firestore().collection('weChat');
  }

  // allows offline access to messages retrieved from client-side storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // saves new messages to client-side storage
  async saveMessages() {
    try {
      const jsonValue = JSON.stringify(this.state.messages);
      await AsyncStorage.setItem('messages', jsonValue);
    } catch(error) {
      console.log(error.message)
    }
  }

  // delete messages from client-side storage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    const { name } = this.props.route.params;
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
          this.unsubscribeMessages = this.referenceChatMessages
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

  // adds messages to firebase database
  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      createdAt: message.createdAt,
      text: message.text,
      user: message.user,
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        //a callback function to setState so that once the state object is updated, you’ll save its current state into asyncStorage
        this.addMessages();
        this.saveMessages();
      })
  }
  
  //retrieves the data in the collection at the time so that the state can change 
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    })
  }

  componentWillUnmount() {
    // Stop listening to authentication and collection changes 
    this.authUnsubscribe();
    this.unsubscribeMessages();
  }

  // change bubble color / disabled for now
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          },
        }}
      />
    )
  }

  // renders input toolbar through gifted chat props only when online
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return (
        <InputToolbar
        {...props}
        />
      )
    }
  }

  render() {
    let { backgroundColor } = this.props.route.params
    return (
      <View style={[styles.textContainer, { backgroundColor: backgroundColor }]}>
        <GiftedChat
        // renderBubble={this.renderBubble.bind(this)}
        renderInputToolbar={this.renderInputToolbar.bind(this)}
        messages={this.state.messages}
        renderUsernameOnMessage={true}
        onSend={messages => this.onSend(messages)}
        user={this.state.user}
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
})