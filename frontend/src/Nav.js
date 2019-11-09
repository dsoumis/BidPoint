import React,{useEffect, useState} from 'react';
import './App.css';
import {Link} from "react-router-dom";
import logo from "./img/logo.png";
import Image from 'react-image-resizer';
import {useDispatch, useSelector} from "react-redux";
import {isAuthenticated} from "./actions";

function Nav() {
    const navStyle = {
        color: 'white',textDecoration: 'none'
    };
    const dispatch = useDispatch();
    async function logoutProcedure() {
        await fetch(`https://localhost:3001/logout`, { //Delete authentication cookie
            method: 'Post',
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include', // <- this is mandatory to deal with cookies
        },);
        await fetch(`https://localhost:3001/logoutAdmin`, { //Delete authentication cookie
            method: 'Post',
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include', // <- this is mandatory to deal with cookies
        },);

        dispatch(isAuthenticated(400)); //update the isLogged state to false

    }


    const [messages, setMessage] = useState({
        userName: '',
        Unread: 0,
        Sent: [],
        Inbox:[]
    });
    const [loaded,setLoaded]=useState(false);
    useEffect(function () {
        getMessagesInDb();
    },[]);


    async function getMessagesInDb() {

        const response = await fetch(`https://localhost:3001/getMyMessages`, {
                method: 'Get',
                mode: "cors",
                // cache: "default",
                credentials: "include",
                // headers: {
                //     'Content-Type': 'application/json'
                // }`
            }
        );
        const data = await response.json();
        console.log(data);
        setMessage({
            userName: data.userName,
            Unread: data.Unread,
            Sent: data.Sent,
            Inbox: data.Inbox
        });
        console.log('to sent'+data.Sent);
        setMessage(data);

        setLoaded(true);
    }



    const guestLinks=(
        <ul className="nav-links">
            <Link style={navStyle} to='/login'>
                <li>Login</li>
            </Link>
            <Link style={navStyle} to='/register'>
                <li>Register</li>
            </Link>
        </ul>
    );

    const userLinks=(
        <ul className="nav-links">
            <Link style={navStyle} to='/messages' onClick={getMessagesInDb}>
                <li>My Messages</li>
                <li>({messages.Unread})</li>
            </Link>
            <li>|</li>
            <Link style={navStyle} to='/my-items'>
                <li>My Items</li>
            </Link>
            <li>|</li>
            <Link style={navStyle} to='/itemRegister'>
                <li>Register a new item</li>
            </Link>
            <li>|</li>
            <Link style={navStyle} to='/' onClick={logoutProcedure}>
                <li>Logout</li>
            </Link>
        </ul>
    );


    const isLogged = useSelector(state => state.isLogged);


    return (
        <nav>
            <ul className="nav-logo">
                <Link style={navStyle} to='/'>
                    <div>
                        <Image
                            src={logo}
                            height={180}
                            width={200}
                        />
                    </div>
                </Link>
            </ul>
            {isLogged && loaded ? userLinks : guestLinks} {/*if the user is logged, it shows logout else login or register*/}
        </nav>
    );
}

export default Nav;