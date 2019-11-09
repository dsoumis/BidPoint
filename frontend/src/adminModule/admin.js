import React, {useEffect, useState} from 'react';
import './admin.css';
import {Link} from "react-router-dom";
import {Redirect} from "react-router-dom";

function Admin() {
    const [loaded,setLoaded] = useState(false);
    const [isLogged,setIsLogged] = useState(false);

    async function alreadyLogged(){
        const response = await fetch(`https://localhost:3001/checkAdminToken`, {
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
        if(response.status === 200)
            setIsLogged(true);
        setLoaded(true);
    }

    useEffect(()=>{
        alreadyLogged(); //This function is used in order to avoid continuously logins. If we refresh or close the site without logging out, we will immediately login after visiting it again.
    },[]);



    const adminLinks = (
        <div className="admin">
        <h1> Welcome Admin! </h1>

        <div className="list-wrapper">
            <div className="lists">
                <div className="usersList">

                    <Link style={{ textDecoration: 'none', color: 'black' }} to={`/admin/users`}>
                        <h3>Users list</h3>
                        <div className="button">
                            <h4>Click here</h4>
                        </div>

                    </Link>
                </div>

                <div className="pendusersList">

                    <Link style={{ textDecoration: 'none', color: 'black' }} to={`/admin/pendusers`}>
                        <h3>Pending users list</h3>
                        <div className="button">
                            <h4>Click here</h4>
                        </div>

                    </Link>
                </div>
            </div>
        </div>

    </div>);

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
export default Admin;