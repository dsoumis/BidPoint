import React,{useEffect,useState} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import DateTimePicker from "react-datetime-picker";
import './ItemDetail.css';
import Image from 'react-image-resizer';
import history from "../history";

function ItemDetail({ match }){             //using match to get the id

    const [isAdmin,setIsAdmin] = useState(false);
    const [isSameUser,setIsSameUser] = useState(false);
    const [loaded,setLoaded] = useState(false);
    const [offer, setOffer] = useState("");
    const [isLogged,setIsLogged] =  useState(false);

    const updateOffer = e =>{
        setOffer(e.target.value);
    };

    async function getOffer(e){     //when the user submits
        e.preventDefault();
        await fetch(`https://localhost:3001/setBidToItem`, {
                method: 'Put',
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: match.params.id,
                    Amount: Number(offer)
                }),
                credentials: 'include', // <- this is mandatory to deal with cookies
            }
        );
        console.log('poso kanei?'+Number(basicform.Buy_Price)+'poso edwsa?'+Number(offer));
        if(Number(basicform.Buy_Price) === Number(offer)){  //if the user purchased the item
            console.log('agorazw!');
            await fetch(`https://localhost:3001/RateSeller`, {
                    method: 'Put',
                    mode: "cors",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName: Seller.userName
                    }),
                    credentials: 'include',
                }
            );
            await fetch(`https://localhost:3001/RateBidder`, {
                    method: 'Put',
                    mode: "cors",
                    credentials: 'include',
                }
            );
            await fetch(`https://localhost:3001/sendMessage`, {
                    method: 'Post',
                    mode: "cors",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Sent:{
                            Message: "I bought "+basicform.Name+" that you were selling!",
                            To:Seller.userName
                        }
                    }),
                    credentials: 'include',
                }
            );
        }
        window.location.reload();
    }

    async function alreadyLogged(){
        let response = await fetch(`https://localhost:3001/checkAdminToken`, {
                method: 'Get',
                mode: "cors",
                credentials: 'include', // <- this is mandatory to deal with cookies
            }
        );
        if(response.status === 200) {
            setIsAdmin(true);
            setIsLogged(true);
        }
        response = await fetch(`https://localhost:3001/checkUserToken`, {
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
        getInfo();
    },[]);


    async function xml(e) {
        e.preventDefault();
        console.log('twra mpainoyme xml!!');
        await fetch(`https://localhost:3001/convertToXml`, {
                method: 'Post',
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: match.params.id
                }),
                credentials: 'include', // <- this is mandatory to deal with cookies
            },
        ).catch(err => console.error('Caught error: ', err));
    }
    async function json(e) {
        e.preventDefault();
        await fetch(`https://localhost:3001/convertToJSON`, {
                method: 'Post',
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                _id: match.params.id
                }),
                credentials: 'include', // <- this is mandatory to deal with cookies
            },
        ).catch(err => console.error('Caught error: ', err));
    }


    const [basicform, setBasicForm] = useState({
        Name: '',
        Buy_Price: '',
        First_Bid: '',
        Currently:'',
        Country:'',
        Description:'',
        Number_of_Bids:0,
        Purchased:''
    });
    const [category,setCategory] = useState(['']);
    const [bids,setBids] = useState([]);
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
        sellerPoints: ''
    });

    const [image,setImage] = useState([]);
    const [position,setPosition] = useState([0,0]);
    //let position = [0,0];
    async function getInfo(){ //function to get the values that are already stored in the database
        const response = await fetch(`https://localhost:3001/getSpecificItem`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: match.params.id
                })
            }
        );
        const data = await response.json();
        console.log(`o server mas epestrepse   ${data.Location.Longtitude}  ${data.Location.Longtitude}  ${data.Location.Name}`);
        setLocation({
            Name: data.Location.Name
        });
        if(data.Location.Longtitude === null)
            setLocation({
                Name:data.Location.Name,Longtitude:'',Latitude:''
            });
        else
            setLocation({
                Name:data.Location.Name,Longtitude:data.Location.Longtitude,Latitude:data.Location.Longtitude
            });
        setCategory(data.Category);
        setBasicForm({
            Name: data.Name,
            Buy_Price: data.Buy_Price,
            First_Bid: data.First_Bid,
            Country:data.Country,
            Description:data.Description,
            Number_of_Bids: data.Number_of_Bids,
            Currently: data.Currently,
            Purchased: data.Purchased
        });
        setStarted({
            Date: data.Started
        });
        setEnds({
            Date: data.Ends
        });


        setImage(data.Image);
        setBids(data.Bids);
        const response2 = await fetch(`https://localhost:3001/getSpecificRating`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: data._idCreatedIt
                })
            }
        );
        const data2 = await response2.json();
        setSeller({
            userName:data2.userName,
            sellerPoints: data2.sellerPoints
        });
        const response3 = await fetch(`https://localhost:3001/getSpecificUserByID`, {
                method: 'Get',
                credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            }
        );
        const data3 = await response3.json();
        if( data2.userName ===  data3.userName) {
            setIsSameUser(true);
        }



        if(data.Location.Longtitude===null && data.Location.Latitude===null) {

            console.log('mpika edw' + data.Location.Name);
            const response4 = await fetch(`https://localhost:3001/itemCoords`, {
                    method: 'Post',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        adress: data.Location.Name + ' ' + data.Country
                    })
                }
            );
            const data4 = await response4.json();
            // position[0] = data4.lat;
            // position[1] = data4.lng;
            setPosition([data4.lat,data4.lng]);
        }else{
            setPosition([data.Location.Latitude,data.Location.Longtitude]);
            // position[0]=data.Location.Latitude;
            // position[1]=data.Location.Longtitude;
        }


        setLoaded(true);
    }

    function updateItem(e) {
        e.preventDefault();
        history.push('/itemUpdate/'+match.params.id);
        window.location.reload();
    }
    async function deleteItem(e) {
        e.preventDefault();

        if((new Date()) >= Started.Date){
            alert('You are not allowed to delete this item. Auction has started.');
            history.push('/my-items');
            window.location.reload();
        }
        if(basicform.Number_of_Bids>0){
            alert('You are not allowed to delete this item. Someone has already bid.');
            history.push('/my-items');
            window.location.reload();
        }
        if((new Date()) < Started.Date && basicform.Number_of_Bids===0) {
            const response = await fetch(`https://localhost:3001/deleteItem`, {
                    method: 'Post',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },


                    body: JSON.stringify(
                        {
                            _id: match.params.id
                        })
                },
            );
            const data = await response.json();
            if (!(data === 'ola kala'))
                alert(data + ' Please retry later!');


            history.push('/my-items');
            window.location.reload();
        }
    }

    const styles = {
        width: '30%',
        height: '300px'

    };

    const map = (
        <div className="map">
            <Map center={position} zoom={13} style = {styles}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>{Location.Name}<br />{basicform.Country}</Popup>
                </Marker>
            </Map>
        </div>
    );
    const noOfferCondition = basicform.Buy_Price === '' || (new Date(Ends.Date)< new Date()) || basicform.Purchased===true || isSameUser === true || isLogged === false;
    const htmlReady = (

        <div className="itemPage">


                <div className="details1">
                    <h4 className="item-f">Name: {basicform.Name}</h4>
                    {category !== [] ? category.map((category,idx)=>{
                        return (<h4 key={idx} className="item-f">Category: {category}</h4>);
                    }) : console.log('wait')}
                    <h4 className="item-f">First Bid: {basicform.First_Bid}</h4>
                    <h4 className="item-f">Currently: {basicform.Currently}</h4>
                    <h4 className="item-f">Number of bids: {basicform.Number_of_Bids}</h4>
                    <h4 className="item-f">Buy Price: {basicform.Buy_Price}</h4>
                    <h4 className="item-f">Country: {basicform.Country}</h4>
                    <h4 className="item-f">Location: {Location.Name}</h4>
                    {map}

                    <div className="time">
                        <h4>Start time:</h4>
                        <DateTimePicker className="" disabled={true} value={new Date(Started.Date)}/>
                        <h4>End time:</h4>
                        <DateTimePicker className="" disabled={true} value={new Date(Ends.Date)}/>
                    </div>
                    <h4 className="item-f">Seller: {Seller.userName}<br/> Rating:{Seller.sellerPoints}</h4>
                    <h4 className="des">Description: {basicform.Description}</h4>
                </div>
                {/*If there are images render them */}
                {image !== [] ? image.map((image,idx)=>{
                    return (<div className='item-image' key={idx}><Image key={image.imageName} src={image.imageData} height={800} width={800} alt=""/></div>);
                }) : console.log('wait')}

                <div className="Bidders">
                    {/*If there are bids render them */}
                    <h2>Bidders</h2>
                    <div className="Bids">
                        {bids !== [] ? bids.map((bid,idx)=>{
                            return (
                                <div key={idx} className="bidders">
                                    <h4 >{bid.Bidder.userName}</h4>
                                    <h4 >{bid.Bidder.Rating}</h4>
                                    <h4 >{bid.Bidder.Location}</h4>
                                    <h4 >{bid.Bidder.Country}</h4>
                                    <DateTimePicker disabled={true} value={new Date(bid.Time)}/>
                                    <h4 >{bid.Amount}</h4>
                                </div>
                                );
                        }) : console.log('wait')}
                    </div>
                </div>

            {/*an den exei oristei buyprice h exei agorastei h exei lh3ei h einai o idios o seller pou to koitaei na mhn emfanizetai*/}
            {/*If there is no buyprice or the item is purchased or auction has ended or it is the same seller-user,don't show*/}
            {noOfferCondition ? basicform.Purchased ? (<h1>Purchased</h1>): (''):(
                <div className="offer">

                <form  className="offer-form">
                    <h2>Wanna make an offer?</h2>
                    <input className="offer-bar"
                           type="number" min={basicform.First_Bid}
                           value={offer}
                           onChange={updateOffer}
                           placeholder="Write amount here.."
                    />

                    <button className="offer-button" onClick={(e)=>{
                        if(offer>=basicform.First_Bid){
                            if (window.confirm('Are you sure you want to submit this amount?')) {
                                getOffer(e)
                            }
                        }else{
                            e.preventDefault();
                            alert('Minimun bid is '+basicform.First_Bid)}}}>
                        submit
                    </button>


                </form>
            </div>)}


            {isSameUser ?
                <div className="user_buttons">
                <button className="buttons_" onClick={e=> updateItem(e)}>Update item</button>
                <button className="buttons_" onClick={e=> deleteItem(e)}>Delete item</button>
            </div> : ('')}


            {isAdmin ? (
                <div className="admin-buttons">
                <button className="buttons_" onClick={e=> xml(e)}>Extract to xml</button>
                <button className="buttons_" onClick={e=> json(e)}>Extract to json</button>
                </div>
            ): ('')}
        </div>
    );

    const authorized=(<div>{loaded ? htmlReady : (<h1>Loading...</h1>)}</div>);
    return(

        <div>
            {authorized}
        </div>
    )

}


export default ItemDetail;

