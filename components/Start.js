import React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
const backgroundImage = require('../assets/Background-Image.png');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '',
      backgroundColor: '',
      selectedBackgroundButton: 1
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={backgroundImage} style={styles.background}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>weChat</Text>
          </View>
          <View style={styles.loginContainer}>
            <TextInput 
              style={styles.nameInput}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
              placeholder='Your Name'
              placeholderTextColor='rgba(117, 112, 131, 0.6)'
            />
            <Text style={styles.chooseColorText}>Choose Background Color:</Text>
            <View style={styles.chatBackgroundColor}>
              <TouchableOpacity
              // these styling conditionals will add and remove selectedBackgroundButton class when you press on each color
                style={(this.state.selectedBackgroundButton == 1)
                  ? [styles.chatBackgroundColor1, styles.selectedBackgroundButton]
                  : styles.chatBackgroundColor1}
                onPress={() => this.setState({ 
                  backgroundColor: '#090C08',
                  selectedBackgroundButton: 1 
                })}
              />
              <TouchableOpacity
                style={(this.state.selectedBackgroundButton == 2)
                  ?[styles.chatBackgroundColor2, styles.selectedBackgroundButton]
                  :styles.chatBackgroundColor2}
                onPress={() => this.setState({ 
                  backgroundColor: '#474056',
                  selectedBackgroundButton: 2 
                })}
              />
              <TouchableOpacity
                style={(this.state.selectedBackgroundButton == 3)
                  ?[styles.chatBackgroundColor3, styles.selectedBackgroundButton]
                  :styles.chatBackgroundColor3}
                onPress={() => this.setState({ 
                  backgroundColor: '#8A95A5',
                  selectedBackgroundButton: 3 
                })}
              />
              <TouchableOpacity
                style={(this.state.selectedBackgroundButton == 4)
                  ?[styles.chatBackgroundColor4, styles.selectedBackgroundButton]
                  :styles.chatBackgroundColor4}
                onPress={() => this.setState({ 
                  backgroundColor: '#B9C6AE',
                  selectedBackgroundButton: 4 
                })}
              />
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  name: this.state.name,
                  backgroundColor: this.state.backgroundColor,
                })
              }
              >
              <Text style={styles.chatButtonText}>Start Chatting</Text>
            </TouchableOpacity>            
          </View>
  
          
        </ImageBackground>
      </View>
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
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: '600',
    height: 120,
    opacity: 0.8
  },
  loginContainer: {
    backgroundColor: '#FFFFFF',
    margin: '6%',
    justifyContent: 'space-around',
    width: '88%',
    height: '44%'
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
    opacity: 0.8
    
  },
  chatBackgroundColor: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  chatBackgroundColor1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#090C08',
  },
  chatBackgroundColor2: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#474056',
  },
  chatBackgroundColor3: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8A95A5',
  },
  chatBackgroundColor4: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#B9C6AE',
  },
  selectedBackgroundButton: { 
    borderColor: '#A7C7E7',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 5,
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