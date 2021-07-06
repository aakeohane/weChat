import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';

const backgroundImage = require('../assets/weChat-cover-background.jpeg');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '',
      colors: [
        '#090C08',
        '#474056',
        '#8A95A5',
        '#B9C6AE',
      ],
      colorChoice: '',
    }
  }
  
  render() {
    const { name, colors, colorChoice } = this.state;
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-65}
      style={{flex: 1}}
      >
        <View style={styles.container}>
          <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>weChat</Text>
            </View>
            <View style={styles.loginContainer}>
              <TextInput 
                style={styles.nameInput}
                onChangeText={(name) => this.setState({name})}
                value={name}
                placeholder='Your Name'
                placeholderTextColor='rgba(117, 112, 131, 0.6)'
              />
              <Text style={styles.chooseColorText}>Choose Background Color:</Text>
              <View style={styles.chatBackgroundColorContainer}>
              {/* Iterates (map) over colors array to create cricles and set selected circle border color on press */}
                {colors.map(color => (
                  <View style={[styles.selectedBackgroundRing, (colorChoice === color) 
                    ? { borderColor: '#A7C7E7' } 
                    : null
                  ]}
                  key={color}>
                  <TouchableOpacity
                    onPress={() => this.setState({ colorChoice: color })}
                    style={[styles.touchableCircle, { backgroundColor: color }]}
                    accessible={true}
                    accessibilityLabel="chosen background color"
                    accessibilityHint="lets you choose your background color for your chat"
                    accessibilityRole="button"
                  />
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() =>
                  this.props.navigation.navigate('Chat', {
                    name: name,
                    color: this.state.colorChoice,
                  })
                }
                accessible={true}
                accessibilityLabel="login"
                accessibilityHint="logs in to app so you can start chatting"
                accessibilityRole="button"
                >
                <Text style={styles.chatButtonText}>Start Chatting</Text>
              </TouchableOpacity> 
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 50,
    fontWeight: '600',
    height: '40%',
    opacity: 0.8,
    textShadowOffset: {width: 4, height: 2},
    textShadowRadius: 3,
    textShadowColor: 'black',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: '6%',
    marginBottom: '15%',
    justifyContent: 'space-between',
    width: '88%',
    height: '44%',
  },
  nameInput: {
    borderWidth: 2,
    borderColor: '#757083',
    margin: '6%',
    padding: 25,
    borderRadius: 2,
    fontSize: 16,
    fontWeight: '300',
  },
  chooseColorText: {
    marginLeft: '6%',
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
    paddingBottom: 2,
    opacity: 0.8,
    justifyContent: 'space-between'
  },
  chatBackgroundColorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  touchableCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  selectedBackgroundRing: { 
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 100,
    padding: 3,
  },
  chatButton: {
    margin: '6%',
    padding: 25,
    backgroundColor: '#757083',
    borderRadius: 2,
    borderColor: '#757083',
  },
  chatButtonText:{
    color:'#FFFFFF',
    textAlign:'center',
    fontSize: 16,
    fontWeight: '600'
  }
});