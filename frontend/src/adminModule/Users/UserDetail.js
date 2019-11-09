import React,{useEffect,useState} from 'react';
import Image from "react-image-resizer";
import userIcon from "../user.png";
import './User.css'
import {Redirect} from "react-router-dom";


function UserDetail({ match }){             //using match to get the id from /admin

    const [userFound,setUsersFound] = useState({__v:0,_id: '',afm:'',email:'',Location:'',Country:'',name:'',password:'',phoneNumber:'',physicalAddress:'',surName:'', userName:''});
    const [isLoading,setIsLoading] = useState(false);
    useEffect(function () {
        getUsersInDb();
    },[]);

    async function getUsersInDb() {
        const response = await fetch(`https://localhost:3001/getUsers`, {
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



        const response2 = await fetch(`https://localhost:3001/getItems`, {
                method: 'Get',
                mode: "cors",
                // cache: "default",
                credentials: "include",
                // headers: {
                //     'Content-Type': 'application/json'
                // }`
            }
        );
        const data2 = await response2.json();
        console.log(data2);

        data.map(user => {
            if(user.userName === match.params.id) {
                setUsersFound(user);
            }
            setIsLoading(true);
        });
    }

    const htmlReady = (
        <div>
            <div className="user">
                <div className="image">
                    <Image
                        src={userIcon}
                        height={90}
                        width={100}
                    />
                </div>
                <div className="details">
                    <h4>username: {userFound.userName}</h4>
                    <h4>name: {userFound.name}</h4>
                    <h4>last name: {userFound.surName}</h4>
                    <h4>e-mail: {userFound.email}</h4>
                    <h4>location: {userFound.Location}</h4>
                    <h4>country: {userFound.Country}</h4>
                    <h4>address: {userFound.physicalAddress}</h4>
                    <h4>phone number: {userFound.phoneNumber}</h4>
                    <h4>tax registration number: {userFound.afm}</h4>
                </div>
            </div>
        </div>
    );




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
        <div>
            {isLoading ? htmlReady : (<h1>Loading...</h1>)}
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


export default UserDetail;

