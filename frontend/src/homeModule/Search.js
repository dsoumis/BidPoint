import React , {useEffect, useState} from 'react';
import './Search.css'
import Item from "./Item";
import history from '../history'


function Search() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [value, setValue] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [loaded,setLoaded] = useState(false);



    const updateSearch = e =>{
        setSearch(e.target.value);
        setLoaded(false);
        setItems([]);
    };

    async function getSearch(e){     //when the user submits
        e.preventDefault();
        setLoaded(false);
        let response = await fetch(`https://localhost:3001/findByCategory`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Category: search
                })
            },
        );
        let data = await response.json();
        console.log('edw');
        console.log(data);
        setItems(data);
        response = await fetch(`https://localhost:3001/findByBuy_Price`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Buy_Price: Number(search)
                })
            },
        );
        data = await response.json();
        console.log('edw');
        console.log(data);
        if(data!==[])
            setItems(...items,data);
        response = await fetch(`https://localhost:3001/findByLocation`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Location: search
                })
            },
        );
        data = await response.json();
        console.log('edw');
        console.log(data);
        if(data!==[])
            setItems(...items,data);
        response = await fetch(`https://localhost:3001/findByDescription`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Description: search
                })
            },
        );
        data = await response.json();
        console.log('edw' + search);
        console.log(data);
        if(data!==[])
            setItems(...items,data);

        response = await fetch(`https://localhost:3001/findByName`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Name: search
                })
            },
        );
        data = await response.json();
        console.log('edw');
        console.log(data);
        if(data!==[])
            setItems(...items,data);
        setLoaded(true);
    }

    const updateCategory = e =>{
        setCategory(e.target.value);
        console.log(category);
    };

    async function getCategory(e){     //when the user submits
        e.preventDefault();      //prevent the page refresh
        setLoaded(false);
        console.log(category);
        const response = await fetch(`https://localhost:3001/findByCategory`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Category: category
                })
            },
        );
        const data = await response.json();
        console.log(data);
        setItems(data);
        setLoaded(true);
    }

    const updateValue = e =>{
        setValue(e.target.value);
        console.log(value);
    };

    async function getValue(e){     //when the user submits
        e.preventDefault();      //prevent the page refresh
        setLoaded(false);
        const response = await fetch(`https://localhost:3001/findByBuy_Price`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Buy_Price: value
                })
            },
        );
        const data = await response.json();
        console.log(data);
        setItems(data);
        setLoaded(true);
    }

    const updateLocation = e =>{
        setLocation(e.target.value);
        console.log(location);
    };

    async function getLocation(e){     //when the user submits
        e.preventDefault();      //prevent the page refresh
        setLoaded(false);
        const response = await fetch(`https://localhost:3001/findByLocation`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Location: location
                })
            },
        );
        const data = await response.json();
        console.log(data);
        setItems(data);
    }

    const updateDescription = e =>{
        setDescription(e.target.value);
        console.log(description);
    };

    async function getDescription(e) {     //when the user submits
        e.preventDefault();      //prevent the page refresh
        setLoaded(false);
        const response = await fetch(`https://localhost:3001/findByDescription`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Description: description
                })
            },
        );
        const data = await response.json();
        console.log(data);
        setItems(data);
        setLoaded(true);
    }

    const [items, setItems] = useState([]);




    const display = (
        <div className="items">
            {loaded ? items.map(item => (

                <Item
                    key = {item._id}
                    id = {item._id}
                    name = {item.Name}
                    categories = {item.Category.toString()}
                />
            ) ) : ''}
        </div>
    );

    return (
        <div className="search">

            <form  onSubmit={getSearch} className="search-form">

                <input className="search-bar"
                       type="text"
                       value={search}
                       onChange={updateSearch}
                       placeholder="Search.."
                />

                <button className="search-button" type="submit">
                    search
                </button>

            </form>

            <div className="search-by">
                <form onSubmit={getCategory} className="category-form">

                    <h2> Category</h2>
                    <input className="search-by-bar"
                           type="text"
                           value={category}
                           onChange={updateCategory}
                           placeholder="Write category here.."
                    />

                    <button className="search-by-button" type="submit" >
                        search
                    </button>

                </form>

                <form onSubmit={getValue} className="value-form">

                    <h2> Value</h2>
                    <input className="search-by-bar"
                           type="text"
                           value={value}
                           onChange={updateValue}
                           placeholder="Write value here.."
                    />

                    <button className="search-by-button" type="submit">
                        search
                    </button>

                </form>

                <form onSubmit={getLocation} className="location-form">

                    <h2> Location</h2>
                    <input className="search-by-bar"
                           type="text"
                           value={location}
                           onChange={updateLocation}
                           placeholder="Write location here.."
                    />

                    <button className="search-by-button" type="submit">
                        search
                    </button>

                </form>


                <form onSubmit={getDescription} className="description-form">

                    <h2> Description</h2>
                    <input className="search-by-bar"
                           type="text"
                           value={description}
                           onChange={updateDescription}
                           placeholder="Write description here.."
                    />

                    <button className="search-by-button" type="submit">
                        search
                    </button>

                </form>
            </div>
            {display}
        </div>
    );
}

export default Search;