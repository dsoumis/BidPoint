import React,{useEffect, useState} from 'react';
import Item from "./Item";
import './MyItems.css';


function MyItems() {

    const [isLogged,setIsLogged] =  useState(false);

    async function alreadyLogged(){
        const response = await fetch(`https://localhost:3001/checkUserToken`, {
                method: 'Get',
                mode: "cors",
                credentials: 'include', // <- this is mandatory to deal with cookies
            }
        );
        if(response.status === 200)
            setIsLogged(true);
    }

    useEffect(()=>{
        alreadyLogged(); //This function is used in order to avoid continuously logins. If we refresh or close the site without logging out, we will immediately login after visiting it again.
        getItemsInDb();
    },[]);



    const [items, setItems] = useState([]);



    async function getItemsInDb() {

        const response = await fetch('https://localhost:3001/getMyItems', {
                method: 'Get',
                mode: "cors",
                credentials: "include"
            }
        );
        const data = await response.json();
        if(response.status === 200)
            setItems(data);
    }

    const userLinks = (
        <div>
            <h2> My items </h2>
            <div className="my-items">
                {items !== [] ? items.map(item => {
                    return (<Item
                        key={item._id}
                        id={item._id}
                        name={item.Name}
                        categories={item.Category.toString()}
                    />)

                } ) : console.log('wait')}
            </div>
        </div>
    );
    return(
        <div className="itemsList">
            {isLogged ? userLinks: (<h1>Unauthorized</h1>)}


        </div>
    );
}

export default MyItems;