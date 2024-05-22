import React from "react";

class Header extends React.Component{
    render(){
        return (<header>
        
            <h2 class="logo">BeeHive</h2>
            <nav class="navigation">
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Contact</a>
                <button class="loginBtn">Login</button>
            </nav>
        </header>
        );
    }
}

export default Header;