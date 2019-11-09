import React from 'react';
import './Item.css'
import {Link} from "react-router-dom";


function Item({id, name, categories}){
    return(
        <div className="item">
            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/items/${id}`}>

                <div className="details">
                    <h4>name: {name}</h4>
                    <h4>categories: {categories}</h4>
                </div>
            </Link>
        </div>
    );
}
export default Item;