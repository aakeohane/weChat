import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default class Chat extends React.Component {
  render() {
    let { name, backgroundColor } = this.props.route.params
    return (
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <Text style={styles.username}>Hello {name}!</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 20
  }
})