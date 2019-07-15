/* @flow */
import React, {Component} from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as chatActions from '../Chat/ChatAction'

const connectFunc = connect(
  state => ({
    user: state.chat.user,
    error: state.chat.error
  }),
  dispatch => bindActionCreators({...chatActions}, dispatch)
)

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  onSubmit = () => {
    if (this.state.text.length === 0)
      return;
    
    this.props.fetchUser(this.state.text)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Please enter a user name.</Text>
        <TextInput 
          style={styles.input}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          >
        </TextInput>
        { this.props.error && (
          <Text style={styles.error}>{this.props.error}</Text>) 
        }
        <Text style={styles.text}>We'll check if that name is available in the chat room.</Text>
        <TouchableOpacity 
          style={styles.buttonContainer}
          onPress={this.onSubmit}
          >
          <Text style={styles.button}>Send</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 40
  },
  heading: {
    fontSize: 18,
    marginTop: 40,
    marginVertical: 10
  },
  text: {
    marginHorizontal: 8,
    marginVertical: 10,
    fontSize: 12, 
    color: '#0a0a0a', 
    lineHeight: 16
  },
  error: {
    marginHorizontal: 8,
    marginVertical: 10,
    fontSize: 16, 
    color: '#B22222', 
    lineHeight: 16
  },
  input: {
    height: 50, 
    borderColor: 'gray', 
    borderWidth: 1,
    fontSize: 20, 
    color: '#0a0a0a', 
    lineHeight: 20,
    padding: 10
  },
  buttonContainer: {
    marginVertical: 10,
    minWidth: 120,
    height: 50,
    backgroundColor: '#0066FF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    color: '#fefefe',
    fontSize: 18
  }
})

export default connectFunc(Login)