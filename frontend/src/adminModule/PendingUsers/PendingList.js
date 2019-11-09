import React,{useEffect,useState} from 'react';
import PendingUser from './PendingUser';
import './PendingList.css'
import {Redirect} from "react-router-dom";


function PendingList() {
    const [users, setUsers] = useState([]);

    useEffect(function () {
        getUsersInDb();
        alreadyLogged();
    },[]);

    async function getUsersInDb() {
        const response = await fetch(`https://localhost:3001/getPendingUsers`, {
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
        setUsers(data);
    }







    const [loaded,setLoaded] = useState(false);
    const [isLogged,setIsLogged] = useState(false);
    async function alreadyLogged(){
        const response = await fetch(`https://localhost:3001/checkAdminToken`, {
                method: 'Get',
                mode: "cors",
                credentials: 'include', // <- this is mandatory to deal with cookies
            }
        );
        if(response.status === 200)
            setIsLogged(true);
        setLoaded(true);
    }




    const adminLinks = (
        <div className="body">
            <h1>Pending Users List:</h1>

            <div className="users">
                {users.map(user => (
                    <PendingUser
                        key = {user.userName}
                        username = {user.userName}
                        email = {user.email}
                    />

                ) )}
            </div>

        </div>
    );

    const guestLinks = (
        <Redirect to='/'/>
    );
    const condition1 = loaded===true && isLogged ===true;
    const condition2 = loaded===true && isLogged ===false;
    return(
        <div>
            {condition1 ? adminLinks
                :condition2 ? guestLinks
                    :(<h1>Loading...</h1>)}
        </div>
    )
}
export default PendingList;