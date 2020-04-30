import React from 'react';
import { Button, Input } from 'antd';
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
    showUsername: false,
    showCreateRoom: false,
    messageBox: "",
    currentRoomName: null,
    messages: [],
    username: "",
    rooms: [{
      roomName: "Room Name",
      _id: "123"
    },{
      roomName: "Room 2",
      _id: "234"
    }],
    isAuth: false,
    token: null
  }
  componentDidMount() {
    if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
      this.setState({ 
        showUsername: true,
      })
    } else {
      this.setState({ 
        username: localStorage.getItem('username'),
        token: localStorage.getItem('token'),
        isAuth: true
      });
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
  changeRoom = (roomName) => {
    console.log(roomName);
    // this.leaveCurrentRoom();
    // socket.emit('joinRoom', {
    //   username: this.state.username,
    //   roomName
    // });
  }
  leaveCurrentRoom = () => {
    // Leave Room
    socket.emit('leaveRoom', this.state.username);
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
  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.resetCurrentRoomName();
    this.setState({
      username: "",
      token: null,
      isAuth: false,
      showUsername: true
    })
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
      rooms,
      currentRoomName,
      isAuth
    } = this.state;
    return (
      <div>
        <Nav 
          isAuth={isAuth} 
          logout={() => this.logout()} 
          onButtonClick={() => this.setState({ showUsername: true })}
        />
        <div style={{ paddingTop: '48px' }}>
          <RoomSelect
            rooms={rooms}
            leaveRoom={() => this.leaveCurrentRoom()}
            onChange={this.changeRoom}
            onCreateClick={() => this.setState({ showCreateRoom: true })}
            isAuth={isAuth}
          />
          <main>
            <div className="messages-wrapper">
              <div className="pa-2">
                { messages.map((e,i) => (
                  <div 
                    className={`speech-bubble-wrapper ${e.sender === username ? 'mine' : 'theirs'}`}
                    key={i + e.timestamp}
                  >
                    <div className="speech-name">{e.sender}, {moment(e.timestamp).format("HH:MM DD/MM/YYYY")}</div>
                    <div className={`speech-bubble ${e.sender === username ? 'mine' : 'theirs'}`}>
                      {e.message}
                    </div>
                  </div>
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
