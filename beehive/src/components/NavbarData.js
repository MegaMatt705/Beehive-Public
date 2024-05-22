import React from 'react'
import * as OIcons from "react-icons/io";
import * as CIcons from "react-icons/cg";
import * as MIcons from "react-icons/md";
import * as GIcons from "react-icons/gi";

export const NavbarData = [
    {
        title: 'Home',
        path: '/Home',
        icon: <GIcons.GiHoneypot/>,
        className: 'nav-text'

    },
    {
        title: 'Profile',
        path: '/Profile',
        icon: <CIcons.CgProfile/>,
        className: 'nav-text'

    },
    {
        title: 'Message',
        path: '/Message',
        icon: <OIcons.IoIosPaperPlane/>,
        className: 'nav-text'

    },
    {
        title: 'Jobs',
        path: '/Jobs',
        icon: <MIcons.MdWork/>,
        className: 'nav-text'

    },
    {
        title: 'Settings',
        path: '/Settings',
        icon: <OIcons.IoMdSettings/>,
        className: 'nav-text'

    },
    {
        title: 'About Us',
        path: '/AboutUs',
        icon: <MIcons.MdContactSupport/>,
        className: 'nav-text'

    },
    {
        title: 'Logout',
        path: '/',
        icon: <OIcons.IoIosLogOut/>,
        className: 'nav-text'

    },
]