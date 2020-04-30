import React from 'react';
import { Button, Menu, Input, Dropdown, Tag } from 'antd';
import io from "socket.io-client";
import CreateGroup from './components/CreateGroup';
import Username from "./components/Username";
import { SendOutlined, EllipsisOutlined} from '@ant-design/icons';

const url = process.env.REACT_APP_API_URL
const socket = io(url);

class App extends React.Component {
  state = {
    showUsername: false,
    showCreateGroup: false,
    messageBox: "",
    currentGroupId: null,
    messages: [],
    username: ""
  }
  componentDidMount() {
    if (!localStorage.getItem('username')) {
      this.setState({ showUsername: true })
    } else {
      this.setState({ username: localStorage.getItem('username') });
    }
    if (socket !== null) {
      socket.on('joinedRoom', (data) => {
        this.setState({ 
          currentGroupId: data.roomName,
          messages: data.messages 
        })
      })
      socket.on('toClient', (data) => {
        console.log(data);
        // const m = [...this.state.messages];
        // this.setState({
        //   messages: m.push(data.message)
        // })
      })
    }
  }
  sendMessage = (e) => {
    e.preventDefault();
    const { messageBox, username } = this.state;
    if (messageBox && messageBox !== "") {
      // Send Message Here
      socket.emit('toRoom',{
        username,
        message: messageBox
      })
      this.setState({ messageBox: ""});
    }
  }
  leaveCurrentGroup = () => {
    // Leave Group
    const { username } = this.state;
    socket.emit('leaveRoom', username)
  }
  componentWillUnmount = () => {
    // Temporarily Exit Group
    const { username } = this.state;
    socket.emit('exitRoom', username)
  }
  render() {
    const { showUsername, showCreateGroup, messageBox, username, messages } = this.state;
    return (
      <div>
        <nav className="main">
          <div className="content">
            <h4 className="mb-0">Miniproject ภาคปลาย 2562: Simple LINE-like app (15%)</h4>
            <Button 
              onClick={() => this.setState({ showUsername: true })}
              style={{ position: 'absolute', right: 8 }}
            >
              Change Username
            </Button>
          </div>
        </nav>
        <div style={{ paddingTop: '48px' }}>
          <Menu
            className="main-menu"
            style={{ width: 256 }}
            mode="inline"
          >
            <Menu.Item 
              key="1" 
              className="ma-0 d-flex justify-space-between align-center"
              onClick={() => this.setState({ currentGroupId: 1 })}
            >
              <div className="d-flex align-center">
                <span>Group 1</span>
                <Tag color="#f5222d" className="ml-2 rounded-max">10</Tag>
              </div>
              <Dropdown placement="bottomRight" overlay={() => (
                <Menu style={{ marginTop: -8 }}>
                  <Menu.Item 
                    className="t-color-error"
                    onClick={() => this.leaveCurrentGroup()}
                  >Leave Group</Menu.Item>
                </Menu>
              )} trigger={['click']}>
                <Button type="link" className="pa-0">
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            </Menu.Item>
            <div 
              className="bottom-bar full-width pa-2"
              style={{ 
                width: 256,
                borderRight: '1px solid #f0f0f0',
                left: 0
              }}
            >
              <Button 
                type="primary" 
                onClick={() => this.setState({ showCreateGroup: true })}
                className="full-width"
                style={{ boxSizing: 'border-box' }}
              >
                Create or Join a Group
              </Button>
            </div>
          </Menu>
          <main>
            <div className="pa-2">
              { messages.map((e,i) => (
                <div className={`speech-bubble-wrapper ${e.sender === username ? 'mine' : 'theirs'}`}>
                  <div className="speech-name">{e.sender}</div>
                  <div className={`speech-bubble ${e.sender === username ? 'mine' : 'theirs'}`}>
                    {e.message}
                  </div>
                </div>
              ))}
            </div>
            <div 
              className="bottom-bar full-width pa-2"
              style={{ 
                width: 'calc(100vw - 256px)',
                right: 0,
                borderRight: '1px solid #f0f0f0'
              }}
            >
              <form
                onSubmit={e => this.sendMessage(e)}
              >
                <div className="d-flex">
                  <Input 
                    placeholder="Say something..."
                    value={messageBox}
                    className="mr-2"
                    onChange={(e) => this.setState({ messageBox: e.target.value })}
                  />
                  <Button type="primary" htmlType="submit">
                    <SendOutlined />
                  </Button>
                </div>
              </form>
            </div>
          </main>
          <CreateGroup
            visible={showCreateGroup}
            onCancel={() => this.setState({ showCreateGroup: false })}
            url={url}
            socket={socket}
          />
          <Username
            visible={showUsername}
            onCancel={() => this.setState({ showUsername: false })}
            url={url}
            socket={socket}
          />
        </div>
      </div>
    );
  }
}

export default App;
