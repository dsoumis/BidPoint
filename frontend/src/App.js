import React,{useEffect, useState} from 'react';
import './App.css';
import Nav from './Nav';
import LoginForm from './loginModule/loginForm';
import RegisterForm from './registerModule/registerForm';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {isAuthenticated} from "./actions";

import Admin from './adminModule/admin'
import UserDetail from './adminModule/Users/UserDetail.js';
import UserList from './adminModule/Users/UserList.js';
import PendingList from './adminModule/PendingUsers/PendingList.js';
import PendUserDetail from './adminModule/PendingUsers/PendingUserDetail';

import ItemRegisterForm from './itemModule/itemRegisterForm';
import ItemUpdateForm from './itemModule/itemUpdateForm';
import Home from './homeModule/Home.js';
import ItemDetail from './homeModule/ItemDetail.js';
import MyItems from './homeModule/MyItems.js';

import Messages from './messageModule/Messages.js';
import MessageDetail from './messageModule/MessageDetail.js';
function App() {

    const dispatch = useDispatch();


    async function alreadyLogged(){
        let response = await fetch(`https://localhost:3001/checkUserToken`, {
                method: 'Get',
                mode: "cors",
                // cache: "default",
                // credentials: "include",
                // headers: {
                //     'Content-Type': 'application/json'
                // }
                credentials: 'include', // <- this is mandatory to deal with cookies
            }
        );
        if(!(response.status === 200))
            response = await fetch(`https://localhost:3001/checkAdminToken`, {
                    method: 'Get',
                    mode: "cors",
                    // cache: "default",
                    // credentials: "include",
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // }
                    credentials: 'include', // <- this is mandatory to deal with cookies
                }
            );
        dispatch(isAuthenticated(response.status));
    }

    useEffect(()=>{
        alreadyLogged(); //This function is used in order to avoid continuously logins. If we refresh or close the site without logging out, we will immediately login after visiting it again.
    },[]);

    return (
          <Router>
              <div className="App">
                  <Nav/>
                  <Switch>
                      <Route path="/" exact component={Home}/>
                      <Route path="/login" exact component={LoginForm}/>
                      <Route path="/register" exact component={RegisterForm}/>
                      <Route path="/my-items" exact component={MyItems}/>
                      <Route path="/messages" exact component={Messages}/>
                      <Route path="/messages/:id" exact component={MessageDetail}/>


                      <Route path="/itemRegister" exact component={ItemRegisterForm}/>
                      <Route path="/itemUpdate/:id" exact component={ItemUpdateForm}/>
                      <Route path="/items/:id" exact component={ItemDetail}/>

                      <Route path="/admin" exact component={Admin}/>
                      <Route path="/admin/users" exact component={UserList}/>
                      <Route path="/admin/users/:id" exact component={UserDetail}/>
                      <Route path="/admin/pendusers" exact component={PendingList}/>
                      <Route path="/admin/pendusers/:id" exact component={PendUserDetail}/>



                  </Switch>
              </div>
          </Router>
      );
}
export default App;
