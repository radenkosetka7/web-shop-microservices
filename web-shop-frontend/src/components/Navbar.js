import './Navbar.css';
import Logo from '../assets/web-shop-logo(1).png';

import {useSelector} from "react-redux";
import {useState} from 'react';
import {Link} from "react-router-dom";
import DropDownMenu from "./DropDownMenu/DropDownMenu";

export default function Navbar() {
    const {authenticated, loggedUser} = useSelector((state) => state.users);


    const [activeLink, setActiveLink] = useState('');

    const handleLinkClick = (link) => {
        setActiveLink(link);
    }

    return (
      <div className='navbarMenu'>
        <div className='logo-map'>
          <Link to="/">
            <img className='confLogo' src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className='twoItems'>
          {authenticated && loggedUser.role === 0 && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link
                className={`home underline ${activeLink === 'users' ? 'active' : ''}`}
                to="/users"
                onClick={() => handleLinkClick('users')}
                style={{ color: "white", fontWeight: "bold", marginRight: '10%' }}
              >
                Users
              </Link>
              <Link
                className={`home underline ${activeLink === 'categories' ? 'active' : ''}`}
                to="/categories"
                onClick={() => handleLinkClick('categories')}
                style={{ color: "white", fontWeight: "bold", marginRight: '10%' }}
              >
                Categories
              </Link>
            </div>

          )}
        </div>
        <div className='twoItems'>
          {authenticated && loggedUser.role === 1 && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link
                className={`home underline ${activeLink === 'messages' ? 'active' : ''}`}
                to="/messages"
                onClick={() => handleLinkClick('messages')}
                style={{ color: "white", fontWeight: "bold", marginRight: '10%' }}
              >
                Messages
              </Link>
            </div>
          )}
        </div>
        <div className='twoItems'>
          {!authenticated && (
            <Link
              className={`home underline ${activeLink === 'login' ? 'active' : ''}`}
              to="/login"
              onClick={() => handleLinkClick('login')}
              style={{ color: "white", fontWeight: "bold" }}
            >
              Login
            </Link>
          )}
          {authenticated && <DropDownMenu />}
        </div>

      </div>
    )
}
