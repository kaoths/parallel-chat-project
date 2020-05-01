import React from "react"
import { Menu, Button, Dropdown } from "antd"
import { EllipsisOutlined } from '@ant-design/icons';

class RoomSelect extends React.Component {
  handleChange = (e) => {
    this.props.onChange(e)
  }
  exit = (e) => {
    this.props.exitRoom(e)
  }
  render() {
    const { rooms, onCreateClick, isAuth, defaultSelectedKeys } = this.props;
    return (
      <Menu
        className="main-menu"
        style={{ 
          width: 256,
          overflowY: 'scroll',
          paddingBottom: 49
        }}
        defaultSelectedKeys={defaultSelectedKeys}
        mode="inline"
      >
        {Object.keys(rooms).map((e,i) => (
          <Menu.Item 
            key={'room' + e} 
            className="ma-0 d-flex justify-space-between align-center"
            onClick={() => this.handleChange(rooms[e])}
          >
            <span>{rooms[e].roomName}</span>
            <Dropdown placement="bottomRight" overlay={() => (
              <Menu style={{ marginTop: -8 }}>
                <Menu.Item 
                  className="t-color-error"
                  onClick={() => this.exit(rooms[e])}
                >Exit Room</Menu.Item>
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