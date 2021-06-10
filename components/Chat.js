import React from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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

  componentDidMount() {
    let userName = this.props.route.params.name;
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hey ${userName}!`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/animals',
          },
        },
        {
          _id: 2,
          text: `${userName} has entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }
  render() {
    let { userName, backgroundColor } = this.props.route.params
    return (
      <View style={[styles.textContainer, { backgroundColor: backgroundColor }]}>
        <GiftedChat
        // renderBubble={this.renderBubble.bind(this)}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
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