import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import * as Icons from "react-icons/ai"
import * as CIcons from "react-icons/cg";
import  {NavbarData}  from "./NavbarData"
import './Navbar.css'
import { IconContext } from 'react-icons/lib'

function NoBar() {
    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar)
  return (
    <>
    <IconContext.Provider value={{color: 'white'}}>
    <div className="navbar">
      {/* <Link to="#" className='menu-bar'>
        <Icons.AiOutlineBars onClick={showSidebar}/>
      </Link> */}
      <div className="logo">
            <h1> <CIcons.CgBee />BeeHive</h1>
          </div>
    </div>
    <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-items' onClick={showSidebar}>
            <li className='nav-toggle'>
                <Link to="#" className='menu-bar'>
                    <Icons.AiOutlineClose />
                </Link>
            </li>
            {NavbarData.map((item, index) => {
                return(
                    <li key={index} className={item.className}>
                        <Link to={item.path}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    </nav>
    </IconContext.Provider>
    </>
  )
}
export default NoBar