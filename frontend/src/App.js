import React from 'react';
import { Button, Menu, Input, Dropdown, Tag } from 'antd';
import io from "socket.io-client";
import CreateRoom from './components/CreateRoom';
import Username from "./components/Username";
import { SendOutlined, EllipsisOutlined} from '@ant-design/icons';
import moment from "moment";

const url = process.env.REACT_APP_API_URL
const socket = io(url);

class App extends React.Component {
  state = {
    showUsername: false,
    showCreateRoom: false,
    messageBox: "",
    currentRoomName: null,
    messages: [],
    username: "",
    groups: [{
      roomName: "Room Name",
      _id: "123"
    }]
  }
  componentDidMount() {
    if (!localStorage.getItem('username')) {
      this.setState({ showUsername: true })
    } else {
      this.setState({ username: localStorage.getItem('username') });
    }
    if (socket !== null) {
      socket.on('joinedRoom', (data) => {
        // Set Room and Recieve Messages
        this.setState({ 
          currentRoomName: data.roomInfo._id,
          messages: data.roomInfo.messages ? data.roomInfo.messages : [],
          showCreateRoom: false
        })
      })
      socket.on('toClient', (data) => {
        // Recieve Messages
        let m = [...this.state.messages];
        m.push(data)
        this.setState({
          messages: m
        })
      })
    }
  }
  sendMessage = (e) => {
    e.preventDefault();
    const { messageBox, username } = this.state;
    if (messageBox && messageBox !== "") {
      // Send Message
      socket.emit('toRoom',{
        username,
        message: messageBox
      })
      this.setState({ messageBox: ""});
    }
  }
  changeRoom = (roomName) => {
    this.leaveCurrentRoom();
    socket.emit('joinRoom', {
      username: this.state.username,
      roomName
    });
  }
  leaveCurrentRoom = () => {
    // Leave Room
    const { username } = this.state;
    socket.emit('leaveRoom', username)
  }
  resetCurrentRoomName = () => {
    this.setState({ 
      currentRoomName: null,
      messages: [] 
    });
  }
  componentWillUnmount = () => {
    // Temporarily Exit Room
    const { username } = this.state;
    socket.emit('exitRoom', username)
  }
  render() {
    const { showUsername, 
      showCreateRoom,
      messageBox, 
      username, 
      messages, 
      groups,
      currentRoomName
    } = this.state;
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
            {groups.map((e,i) => (
              <Menu.Item 
                key={'group' + i} 
                className="ma-0 d-flex justify-space-between align-center"
                onClick={() => this.changeRoom(e.roomName)}
              >
                <div className="d-flex align-center">
                  <span>{e.roomName}</span>
                  <Tag color="#f5222d" className="ml-2 rounded-max">10</Tag>
                </div>
                <Dropdown placement="bottomRight" overlay={() => (
                  <Menu style={{ marginTop: -8 }}>
                    <Menu.Item 
                      className="t-color-error"
                      onClick={() => this.leaveCurrentRoom()}
                    >Leave Room</Menu.Item>
                  </Menu>
                )} trigger={['click']}>
                  <Button type="link" className="pa-0">
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              </Menu.Item>
            ))}
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
                onClick={() => this.setState({ showCreateRoom: true })}
                className="full-width"
                style={{ boxSizing: 'border-box' }}
              >
                Create or Join a Room
              </Button>
            </div>
          </Menu>
          <main>
            <div className="pa-2">
              { messages.map((e,i) => (
                <div 
                  className={`speech-bubble-wrapper ${e.username === username ? 'mine' : 'theirs'}`}
                  key={i + e.timestamp}
                >
                  <div className="speech-name">{e.username}, {moment(e.timestamp).format("HH:MM DD/MM/YYYY")}</div>
                  <div className={`speech-bubble ${e.username === username ? 'mine' : 'theirs'}`}>
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
                    disabled={!currentRoomName}
                  />
                  <Button type="primary" htmlType="submit" disabled={!currentRoomName}>
                    <SendOutlined />
                  </Button>
                </div>
              </form>
            </div>
          </main>
          <CreateRoom
            visible={showCreateRoom}
            onCancel={() => this.setState({ showCreateRoom: false })}
            url={url}
            socket={socket}
          />
          <Username
            visible={showUsername}
            onCancel={() => this.setState({ showUsername: false })}
            url={url}
            socket={socket}
            reset={() => this.resetCurrentRoomName()}
          />
        </div>
      </div>
    );
  }
}

export default App;
