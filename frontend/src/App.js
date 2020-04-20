import React from 'react';
import { Button, Menu, Input, Dropdown, Tag } from 'antd';
import JoinGroup from './components/JoinGroup';
import Username from "./components/Username";
import { SendOutlined, EllipsisOutlined} from '@ant-design/icons';

class App extends React.Component {
  state = {
    showJoinGroup: false,
    showUsername: false,
    messageBox: "",
    currentChatId: null
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
  leaveCurrentGroup = () => {
    // Leave Group
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
            mode="inline"
          >
            <Menu.Item 
              key="1" 
              className="ma-0 d-flex justify-space-between align-center"
              onClick={() => this.setState({ currentChatId: 1 })}
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
              <div className="speech-bubble-wrapper theirs">
                <div className="speech-name">Someone</div>
                <div className="speech-bubble theirs">
                  Hello
                </div>
              </div>
              <div className="speech-bubble-wrapper mine">
                <div className="speech-name">Me</div>
                <div className="speech-bubble mine">
                  Hello there!
                </div>
              </div>
              <div className="speech-bubble-wrapper mine">
                <div className="speech-bubble mine">
                  Lorem ipsum dolor sit amet
                </div>
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
