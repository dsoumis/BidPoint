import React , {useEffect, useState} from 'react';
import './Home.css' ;
import Search from './Search.js';
import Item from './Item.js';



function Home() {

    const [items, setItems] = useState([]);

    useEffect(function () {
        getItemsInDb();

    },[]);

    async function getItemsInDb() {
        const response = await fetch(`https://localhost:3001/getItems`, {
                method: 'Get',
                //mode: "cors",
                credentials: "include"
            }
        );
        const data = await response.json();

        console.log(data);
        setItems(data);
    }

    return (
        <div className="homepage">

            {Search()}

            <div className="items-list">

                <h2> Items </h2>
                <div className="items">

                    {items !== [] ? items.map(item => (
                        <Item
                            key = {item._id}
                            id = {item._id}
                            name = {item.Name}
                            categories = {item.Category.toString()}
                        />

                    ) ) : console.log('wait')}
                </div>

            </div>

        </div>
    );
}

export default Home;