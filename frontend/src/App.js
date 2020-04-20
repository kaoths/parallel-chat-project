import React from 'react';
import { Button, Menu, Input, Form, message } from 'antd';
import JoinGroup from './components/JoinGroup';
import Username from "./components/Username";
import { SendOutlined } from '@ant-design/icons';

class App extends React.Component {
  state = {
    showJoinGroup: false,
    showUsername: false,
    messageBox: ""
  }
  componentDidMount() {
    if (!localStorage.getItem('username')) {
      this.setState({ showUsername: true })
    }
  }
  sendMessage = (e) => {
    e.preventDefault();
    const { messageBox } = this.state;
    if (messageBox && messageBox !== "") {
      // Send Message Here
      console.log(messageBox);
      this.setState({ messageBox: ""});
    }
  }
  render() {
    const { showUsername, showJoinGroup, messageBox } = this.state;
    return (
      <div>
        <nav className="main">
          <div className="content">
            <h4 className="mb-0">Miniproject ภาคปลาย 2562: Simple LINE-like app (15%)</h4>
          </div>
        </nav>
        <div style={{ paddingTop: '48px' }}>
          <Menu
            className="main-menu"
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <Menu.Item key="1" className="ma-0">Group 1</Menu.Item>
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
                onClick={() => this.setState({ showJoinGroup: true })}
                className="full-width"
                style={{ boxSizing: 'border-box' }}
              >
                Join a Group
              </Button>
            </div>
          </Menu>
          <main>
            <div className="pa-2">
              <p>Chat Content</p>
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
          <JoinGroup
            visible={showJoinGroup}
            onCancel={() => this.setState({ showJoinGroup: false })}
          />
          <Username
            visible={showUsername}
            onCancel={() => this.setState({ showUsername: false })}
          />
        </div>
      </div>
    );
  }
}

export default App;
