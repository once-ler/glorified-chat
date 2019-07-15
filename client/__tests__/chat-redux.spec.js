import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'
import should from 'should'
import Chat from '../src/modules/Chat/Chat'
import * as chatActions from '../src/modules/Chat/ChatAction'

Enzyme.configure({ adapter: new Adapter() })

describe('<Chat />', () => {
  const initialState = {
    app: {
      wsUrl: 'ws://localhost:9001/ws'
    },
    chat: {
      user: ''
    },
    list: {
      refreshing: false,
      data: [],
      offset: 0,
      limit: 10,
      total: 0,
      downloaded: 0
    }
  }
  const mockStore = configureStore()
  let store, wrapper, mounted
  
  const mockFetchUserSuccessfn = jest.fn()

  beforeEach(()=>{
    store = mockStore(initialState)
    wrapper = shallow(<Chat store={store} />)
    mounted = mount(<Chat store={store} />)
  })

  afterEach(() => {
    
  })

  it('renders <Chat /> component', () => {
    wrapper.should.have.lengthOf(1)
  })

  it('check Prop matches with initialState', () => {
    const connectFunc = wrapper.prop('children')
    connectFunc.props.wsUrl.should.be.equal(initialState.app.wsUrl)
    connectFunc.props.user.should.be.equal(initialState.chat.user)
  })

  it('should update store state', () => {
    const payload = {
      name: 'henry',
      exist: false
    }
    
    store.dispatch(chatActions.fetchUserSuccess(payload))

    const actions = store.getActions()

    const expectedPayload = { type: 'FETCH_USER_SUCCESS', payload }
    
    expect(actions).toEqual([expectedPayload])
  })

  it('can explore HOC properties', () => {
    const connectFuncProps = mounted.find('withProps(withHandlers(lifecycle(Presentation)))').props()
    expect(connectFuncProps).toHaveProperty('wsUrl')
    expect(connectFuncProps).toHaveProperty('user')

    const enhanceWithHandlersProps = mounted.find('withHandlers(lifecycle(Presentation))').props()
    expect(enhanceWithHandlersProps).toHaveProperty('ws')
    
    const enhanceWithLifecycleProps = mounted.find('lifecycle(Presentation)').props()
    expect(enhanceWithLifecycleProps).toHaveProperty('onopen')
    expect(enhanceWithLifecycleProps).toHaveProperty('onmessage')
    expect(enhanceWithLifecycleProps).toHaveProperty('onclose')
    expect(enhanceWithLifecycleProps).toHaveProperty('send')
    
    const presentationProps = mounted.find('Presentation').props()
    expect(presentationProps).toHaveProperty('wsUrl')
    expect(presentationProps).toHaveProperty('user')
    expect(presentationProps).toHaveProperty('ws')
    expect(presentationProps).toHaveProperty('onopen')
    expect(presentationProps).toHaveProperty('onmessage')
    expect(presentationProps).toHaveProperty('onclose')
    expect(presentationProps).toHaveProperty('send')    
  })
})
