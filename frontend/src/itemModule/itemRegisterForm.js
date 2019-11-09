import React, {useEffect, useState} from 'react';
import './itemRegisterForm.css';
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import DateTimePicker from 'react-datetime-picker';
import "react-datepicker/dist/react-datepicker.css";
import {isAuthenticated} from "../actions";
import ReactFileReader from 'react-file-reader';
import history from "../history";
function ItemRegisterForm() {
    const isLogged =  useSelector(state => state.isLogged);
    const dispatch = useDispatch();
    const [loaded,setLoaded] = useState(false);

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
        setLoaded(true);
    }

    useEffect(()=>{
        alreadyLogged(); //This function is used in order to avoid continuously logins. If we refresh or close the site without logging out, we will immediately login after visiting it again.
        getUserRating();
    },[]);





    const [basicform, setBasicForm] = useState({
        Name: '',
        Buy_Price: '',
        First_Bid: '',
        Country:'',
        Description:''
    });
    const [category,setCategory] = useState(['']);
    const [Location,setLocation] = useState({
        Longtitude: '',
        Latitude: '',
        Name: ''
    });
    const [Started,setStarted] = useState({
        Date:new Date()
    });
    const [Ends,setEnds] = useState({
        Date:new Date()
    });
    const [Seller,setSeller] = useState({
        userName: '',
        Rating: ''
    });


    const getBasicValues = e => {
        setBasicForm({
            ...basicform,
            [e.target.name]: e.target.value
        });
    };


    const getLocation = e => {
        setLocation({
            ...Location,
            [e.target.name]: e.target.value
        });
    };

    const getStartedDate = Date => {
        setStarted({
            Date
        });
    };


    const getEndsDate = Date => {
        setEnds({
            Date
        });
    };


    async function getUserRating(){ //function to get seller and bidder rating of this user from database
        const response = await fetch(`https://localhost:3001/getRating`, {
                method: 'Get',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        );
        const data = await response.json();
        console.log('o server mas epestrepse ' + data.userName + " "+data.sellerPoints +" "+ data.bidderPoints);
        setSeller({
            userName: data.userName,
            Rating: data.sellerPoints
        });
    }



    async function itemRegisterDb(e){
        e.preventDefault();
        JSON.stringify(image);
        console.log(basicform.Name, basicform.Buy_Price, basicform.First_Bid, basicform.Description, basicform.Country,
            category,Location.Name,Location.Longtitude,Location.Latitude,Started.Date,Ends.Date,Seller.userName,Seller.Rating,image);
        const response = await fetch(`https://localhost:3001/registerItem`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    Name: basicform.Name,
                    Category: category,
                    Buy_Price: basicform.Buy_Price,
                    First_Bid: basicform.First_Bid,
                    Location:{
                        Longtitude:Location.Longtitude,
                        Latitude:Location.Latitude,
                        Name: Location.Name
                    },
                    Country:basicform.Country,
                    Started:Started.Date,
                    Ends:Ends.Date,
                    Seller: {
                        userName: Seller.userName,
                        Rating: Seller.Rating
                    },
                    Description:basicform.Description,
                    Image: image
                })
            },
        );
        const data = await response.json();
        console.log('o server mas epestrepse ' + data);
        if(!(data === 'Successfully created an item'))
            alert(data);
        else{
            history.push('/my-items');
            window.location.reload();
        }
    }

    const addCategory = () => {
        const categories = [...category];
        categories.push('');
        setCategory(categories);
    };
    function removeCategory(i) {
        const categories = [...category];
        categories.splice(i, 1);
        setCategory(categories);
    }
    const getCategories = (i,event) => {
        const categories = [...category];
        categories[i] = event.target.value;
        setCategory(categories);
    };

    const [image,setImage] = useState([]);


    function getImages(files) {
        const images = []; //write [...image] if you want to add them rather than replace them
        let numberOfFiles = files.base64.length;
        for(let i=0; i<numberOfFiles; i++){
            images.push({"imageName": "base-image-" + Date.now(),"imageData": files.base64[i].toString()})
        }
        console.log(images);
        setImage(images);
    }


    const userLinks=(
        <div className="item-register-form">
            <h1 className='item-title-register-form'>Submit a new item</h1>
            <form className="form">
                <input type="text" name="Name" placeholder="Name" required className="item-field" value={basicform.Name} onChange={getBasicValues}/>

                {/*<input type="text" name="Category" placeholder="Category" required className="item-field" value={category} onChange={getCategories}/>*/}


                    {category.map((category, idx) => {
                        return (
                            <div key={idx}>
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={category}
                                    className="item-field"
                                    onChange={e => getCategories(idx, e)}
                                />
                                <button type="button" onClick={() => removeCategory(idx)}>
                                    Delete Category ^
                                </button>
                            </div>
                        );
                    })}
                    <button type="button" className="item-field" onClick={() => addCategory()}>
                    Add new category
                    </button>



                <input type="text" name="Buy_Price" placeholder="Buy Price"  className="item-field" value={basicform.Buy_Price} onChange={getBasicValues}/>

                <input type="text" name="First_Bid" placeholder="First Bid" required className="item-field" value={basicform.First_Bid} onChange={getBasicValues}/>

                <input type="text" name="Name" placeholder="Location" required className="item-field" value={Location.Name} onChange={getLocation}/>
                <input type="text" name="Latitude" placeholder="Latitude"  className="item-field" value={Location.Latitude} onChange={getLocation}/>
                <input type="text" name="Longtitude" placeholder="Longtitude" className="item-field" value={Location.Longtitude} onChange={getLocation}/>

                <input type="text" name="Country" placeholder="Country" required className="item-field" value={basicform.Country} onChange={getBasicValues}/>
                <h3>Auction Active from: </h3>
                <DateTimePicker disabled={false} minDate={new Date()} value={Started.Date} name="Date" className="item-field" defaultValue={new Date()} onChange={getStartedDate} />


                <h3>Auction Active till :</h3>
                <DateTimePicker disabled={false} value={Ends.Date} minDate={new Date(Started.Date)} name="Date" className="item-field" defaultValue={new Date()} onChange={getEndsDate} />

                <input type="text" name="Description" placeholder="Description" className="item-field" value={basicform.Description} onChange={getBasicValues}/>


                <div className="item-field">
                    <h3>Select one or more images</h3>
                    <ReactFileReader fileTypes={[".png",".jpeg",".jpg"]} base64={true} multipleFiles={true} handleFiles={getImages}>
                        <button onClick={event => event.preventDefault()}>Upload</button>
                    </ReactFileReader>
                </div>
                {/*If there are images render them else wait till there are*/}
                {image !== [] ? image.map((image,idx)=>{
                    return (<img key={idx} src={image.imageData} alt="" className='item-field'/>);
                }) : console.log('wait')}
                <input type="submit" value="Submit" className="itembuttonSubmit" onClick={itemRegisterDb}/>
            </form>
        </div>
    );


    const guestLinks = (
        <Redirect to='/login'/>
        );
    const condition1 = loaded===true && isLogged ===true;
    const condition2 = loaded===true && isLogged ===false;

    return (
        <div>
            {condition1 ? userLinks
                :condition2 ? guestLinks
                    :(<h1>Loading...</h1>)}
        </div>
    );
}

export default ItemRegisterForm;