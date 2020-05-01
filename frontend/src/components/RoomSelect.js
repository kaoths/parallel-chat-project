import React from "react"
import { Menu, Button, Dropdown } from "antd"
import { EllipsisOutlined } from '@ant-design/icons';

class RoomSelect extends React.Component {
  handleChange = (e) => {
    this.props.onChange(e)
  }
  render() {
    const { rooms, leaveRoom, onCreateClick, isAuth } = this.props;
    return (
      <Menu
        className="main-menu"
        style={{ width: 256 }}
        mode="inline"
      >
        {rooms.map((e,i) => (
          <Menu.Item 
            key={'group' + i} 
            className="ma-0 d-flex justify-space-between align-center"
            onClick={() => this.handleChange(e)}
          >
            <span>{e.roomName}</span>
            <Dropdown placement="bottomRight" overlay={() => (
              <Menu style={{ marginTop: -8 }}>
                <Menu.Item 
                  className="t-color-error"
                  onClick={leaveRoom}
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
            disabled={!isAuth}
            type="primary" 
            onClick={onCreateClick}
            className="full-width"
            style={{ boxSizing: 'border-box' }}
          >
            Create or Join a Room
          </Button>
        </div>
      </Menu>
    )
  }
}

export default RoomSelect;