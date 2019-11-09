import React,{useEffect, useState} from 'react';
import './loginForm.css';
import {Link,Redirect} from "react-router-dom";

import {isAuthenticated} from "../actions";
import {useSelector, useDispatch} from "react-redux";
import history from "../history";

function LoginForm() {

    function geoLook(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => console.log(`longitude: ${ position.coords.longitude } | latitude: ${ position.coords.latitude }`));
        } else {
            console.log('To mpoulo');
        }
    }


    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const getValues = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const isLogged = useSelector(state => state.isLogged);
    const dispatch = useDispatch();
    const [admin,setAdmin] = useState(false);
    async function loginDb(e) {
        e.preventDefault();

        console.log(form.username, form.password);
        const response = await fetch(`https://localhost:3001/login`, {
                method: 'Post',
                mode: "cors",
                // cache: "default",
                // credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: form.username,
                    password: form.password
                }),
                credentials: 'include', // <- this is mandatory to deal with cookies
            },
        ).catch(err => console.error('Caught error: ', err));
        const data = await response.json();
        console.log('o server mas epestrepse ' + data);
        if (data === 'Logged In!') {
            const response2 = await fetch(`https://localhost:3001/checkUserToken`, {
                    method: 'Get',
                    mode: "cors",
                    credentials: 'include', // <- this is mandatory to deal with cookies
                }
            );

            dispatch(isAuthenticated(response2.status));
            history.push('/');
            window.location.reload();
        } else if (data === 'Logged In Admin!') {
            setAdmin(true);
            const response3 = await fetch(`https://localhost:3001/checkAdminToken`, {
                    method: 'Get',
                    mode: "cors",
                    credentials: 'include', // <- this is mandatory to deal with cookies
                }
            );
            dispatch(isAuthenticated(response3.status));
        } else {
            alert(data);
        }
    }



    const guestLinks=(
        <div className="login-form">
            <h1 className='title-login-form'>Login Form</h1>
            <form className="log-data-form">
                <input type="text" name="username" placeholder="Username" required className='login-username' value={form.username} onChange={getValues}/>
                <input type="password" name="password" placeholder="Password" required className='login-password' value={form.password}  onChange={getValues} />
                {/*<input type="submit" value="Submit" className="logButtonSubmit" onClick={()=> loginDb}/>*/}
                <button className="logButtonSubmit" onClick={loginDb}>Submit</button>
            </form>

            <h2 className='title-not-member'>Not a member yet?</h2>
            <button className='logButtonRegister'>
                <Link style={{display: 'block', height: '100%', color: 'white',textDecoration:'none'}} to="/register">Register Here</Link>
            </button>
        </div>
    );

    const userLinks=(
        <Redirect to='/'/>
    );


    const condition1 = isLogged===true && admin===false;
    const condition2 = isLogged===true && admin===true;
    return (
        <div>
            {condition1 ? userLinks
                :condition2 ? (<Redirect to='/admin'/>)
                    :guestLinks}
        </div>
    );
}

export default LoginForm;