/* @flow */
import React from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native'
import FlatListTab from '../../components/FlatListTab/Native/FlatListTab'
import {connect} from 'react-redux'
import compose from 'recompose/compose'
import {bindActionCreators} from 'redux'
import * as listActions from './FlatListAction'
import * as chatActions from '../Chat/ChatAction'
import {Grid} from 'react-native-responsive-grid'

const connectFunc = connect(
  state => ({
    refreshing: state.list.refreshing, 
    data: state.list.data,
    offset: state.list.offset,
    limit: state.list.limit,
    total: state.list.total,
    screenHeight: state.list.screenHeight,
    message: state.chat.message
  }),
  dispatch => bindActionCreators({...listActions, ...chatActions}, dispatch)
)

const enhanceFlatListTab = props => (
  <Grid>
    {
      ({state, setState}) => {
        // Send to redux, will be used to determine whether to shouldComponentUpdate.
        if (state.layout.screen) {
          props.setScreenHeight(state.layout.screen.height);
        }

        return (    
          state.layout.screen && (
          <View style={[styles.container]}>
            <FlatListTab {...props} inverted={true} 
              keys={[]} 
              listStyle={{height: state.layout.screen.height - 220}}
              onRefresh={()=>{}}
              onEndReached={()=>{}}
              onContentSizeChange={ref => () => ref && ref.scrollToEnd({animated: false})}
              onLayout={ref => () => ref && ref.scrollToEnd({animated: false})}
              renderItem={keys => ({item}) => {
                const o = JSON.parse(item)
                return (
                <View style={styles.messageContainer}>
                  <View style={styles.textHeaderContainer}>
                  <Text style={styles.textHeader}>{o.name}</Text>
                  <Text style={styles.textDate}>{o.timestamp}</Text>
                  </View>
                  <Text style={styles.textMessage}>{o.message}</Text>                  
                </View>
                )
              }}
              />
            <View style={styles.textAreaContainer} >
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder="What's happening?"
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                onChangeText={(text) => props.pushMessage(text)}
                value={props.message}
              />
              <View style={styles.button}>
                <Button
                  onPress={() => {
                    props.message.length > 0 && props.send(props.message)
                    props.resetMessage()
                  }}
                  title="Send"
                  color="#0066FF"
                />
              </View>
            </View>
          </View>
          )
        )
      }
    }
  </Grid>
)

export default compose(
  connectFunc
)(enhanceFlatListTab)

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: '1%', 
    marginBottom: 5,
    alignItems: 'stretch',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    flexDirection: 'column',
    minWidth: 375,
    maxWidth: 700
  },
  text: {
    fontSize: 12, 
    color: '#0a0a0a', 
    lineHeight: 10
  },
  textAreaContainer: {
    width: '100%',
    borderColor: 'grey',
    borderWidth: 1,
    padding: 5,
    margin: 5,
    maxHeight: 120,
    alignSelf: 'center',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  textArea: {
    flexGrow: 3,
    height: 100,
    justifyContent: 'flex-end',
    fontSize: 14,
    lineHeight: 20,
    padding: 10
  },
  listContainer: {
    flex: 3,
    width: '100%',
    maxHeight: 300
  },
  button: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    minWidth: 60,
    marginLeft: 5
  },
  messageContainer: {
    borderColor: '#D0D0D0',
    borderRadius: 20,
    borderWidth: 1,
    margin: 10,
    padding: 20
  },
  textMessage: {
    fontSize: 16,
    lineHeight: 24,
    height: 24
  },
  textDate: {
    fontSize: 12,
    lineHeight: 24,
    height: 24,
    color: '#505050',
    alignSelf: 'flex-end',
  },
  textHeader: {
    fontSize: 16,
    lineHeight: 24,
    height: 24,
    fontWeight: 'bold',
    color: '#0066FF'
  },
  textHeaderContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  }
})