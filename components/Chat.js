import React from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

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

  componentDidMount() {
    const { name } = this.props.route.params;
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
  }

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
        this.addMessages();
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

  render() {
    let { backgroundColor } = this.props.route.params
    return (
      <View style={[styles.textContainer, { backgroundColor: backgroundColor }]}>
        <GiftedChat
        // renderBubble={this.renderBubble.bind(this)}
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