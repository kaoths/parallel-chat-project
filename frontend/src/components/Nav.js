import React from "react";
import { Button } from "antd";

class Nav extends React.Component {
    render() {
        const { isAuth, logout, onButtonClick } = this.props;
        return (
            <nav className="main">
                <div className="content">
                    <h4 className="mb-0">Miniproject ภาคปลาย 2562: Simple LINE-like app (15%)</h4>
                    { isAuth ? (
                    <Button 
                        onClick={logout}
                        style={{ position: 'absolute', right: 8 }}
                    >
                        Logout
                    </Button>
                    ) : (
                    <Button 
                        onClick={onButtonClick}
                        style={{ position: 'absolute', right: 8 }}
                    >
                        Register/Login
                    </Button>
                    )}
                </div>
            </nav>
        )
    }
}

export default Nav