import React from 'react';
import { Button, Input, Tag } from 'antd';
import io from "socket.io-client";
import CreateRoom from './components/CreateRoom';
import Username from "./components/Username";
import Nav from "./components/Nav";
import RoomSelect from "./components/RoomSelect";
import { SendOutlined} from '@ant-design/icons';
import moment from "moment";

const url = process.env.REACT_APP_API_URL
const socket = io(url);

class App extends React.Component {
  state = {
    showUsername: true,
    showCreateRoom: false,
    messageBox: "",
    currentRoomName: null,
    messages: [],
    username: "",
    rooms: {},
    isAuth: false,
    token: null,
  }
  componentDidMount() {
    if (socket !== null) {
      socket.on('joinedRoom', (data) => {
        // Set Room and Recieve Messages
        if (data.roomInfo.messages) {
          const messages = data.roomInfo.messages;
          if (messages.length > 0) {
            const lastMessageTime = Date.parse(messages[messages.length-1].timestamp)
            let mesWithBanner = [];
            if (Date.parse(data.lastActiveAt) < lastMessageTime) {
              mesWithBanner = [{
                type: 'banner',
                content: 'Unread Messages Below',
                timestamp: data.lastActiveAt
              },...data.roomInfo.messages];
              mesWithBanner = mesWithBanner.sort((a,b) => {
                return a.timestamp.localeCompare(b.timestamp)
              });
            } else {
              mesWithBanner = messages;
            }
            this.setState({ 
              messages: mesWithBanner,
            })
          } else {
            this.setState({ 
              messages,
            })
          }
        }
        this.setState({ 
          currentRoomName: data,
          showCreateRoom: false,
        })
        // Change room
        let r = this.state.rooms
        r[data.roomInfo._id] = data.roomInfo;
        this.setState({ rooms: r })
      })
      socket.on('toClient', (data) => {
        // Recieve Messages
        let d = {...data}
        d.sender = data.username;
        delete d.username;
        let m = [...this.state.messages];
        m.push(d)
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
  changeRoom = (room) => {
    if (room) {
      socket.emit('joinRoom', {
        username: this.state.username,
        roomName: room.roomName
      });
    }
  }
  exitCurrentRoom = (room) => {
    // Leave Room
    const r = this.state.rooms;
    delete r[room._id]
    socket.emit('exitRoom', this.state.username);
    this.setState({ 
      currentRoomName: null,
      messages: [] 
    });
  }
  resetCurrentRoomName = () => {
    this.setState({ 
      currentRoomName: null,
      messages: [] 
    });
  }
  login = (res) => {
    let r = {};
    res.rooms.forEach(e => {
      r[e._id] = e
    });
    this.setState({
      username: res.username,
      token: res.token,
      showUsername: false,
      isAuth: true,
      rooms: r
    })
    
  }
  logout = (username) => {
    this.resetCurrentRoomName();
    socket.emit('leaveRoom', username);
    this.setState({
      username: "",
      token: null,
      isAuth: false,
      showUsername: true,
      rooms: {}
    })
  }
  componentWillUnmount = () => {
    // Temporarily Exit Room
    const { username } = this.state;
    socket.emit('leaveRoom', username);
    this.logout(username);
  }
  render() {
    const { showUsername, 
      showCreateRoom,
      messageBox, 
      username, 
      messages, 
      rooms,
      currentRoomName,
      isAuth
    } = this.state;
    return (
      <div>
        <Nav 
          isAuth={isAuth} 
          logout={() => this.logout(username)} 
          onButtonClick={() => this.setState({ showUsername: true })}
        />
        <div style={{ paddingTop: '48px' }}>
          <RoomSelect
            rooms={rooms}
            exitRoom={this.exitCurrentRoom}
            onChange={this.changeRoom}
            onCreateClick={() => this.setState({ showCreateRoom: true })}
            isAuth={isAuth}
          />
          <main>
            <div className="messages-wrapper">
              <div className="pa-2">
                { messages.map((e,i) => (
                  e.type === 'banner' ? (
                    <div className="full-width pt-3 pb-3" style={{ textAlign: 'center' }} key={i + e.timestamp}>
                      <Tag color="#dcdcdc" style={{ color: '#262626' }}>{e.content}</Tag>
                    </div>
                  ) : (
                    <div 
                      className={`speech-bubble-wrapper ${e.sender === username ? 'mine' : 'theirs'}`}
                      key={i + e.timestamp}
                    >
                      <div className="speech-name">{e.sender}, {moment(e.timestamp).format("HH:MM DD/MM/YYYY")}</div>
                      <div className={`speech-bubble ${e.sender === username ? 'mine' : 'theirs'}`}>
                        {e.message}
                      </div>
                    </div>
                  )
                ))}
              </div>
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
            username={username}
          />
          <Username
            visible={showUsername}
            onCancel={() => this.setState({ showUsername: false })}
            url={url}
            socket={socket}
            reset={() => this.resetCurrentRoomName()}
            onLogin={this.login}
          />
        </div>
      </div>
    );
  }
}

export default App;
