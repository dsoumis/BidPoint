import React,{useEffect,useState} from 'react';
import history from "../history";


function MessageDetail({ match }){             //using match to get the id

    const [loaded,setLoaded] = useState(false);
    const [message,setMessage]=useState({string:'',From:'',To:''});
    const [reply, setReply] = useState("");
    const [sent,setSent]= useState(false);

    const updateReply = e =>{
        setReply(e.target.value);
    };

    async function  getReply (e) {     //when the user submits
        e.preventDefault();      //prevent the page refresh
        const response = await fetch(`https://localhost:3001/sendMessage`, {
                method: 'Post',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Sent:{
                        Message:reply,
                        To: message.From
                    }
                })
            }
        );
        const data = await response.json();
        if(data === 'all good') {
            history.push('/messages');
            window.location.reload();
        }else
            alert(data);


    }

    async function getMessage() {
        let response = await fetch(`https://localhost:3001/getSpecificMessage`, {
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
        let data = await response.json();
        setMessage(data);
        console.log(data);
        if ('To' in data){
            setSent(true);
        }
        if ('From' in data){
            response = await fetch(`https://localhost:3001/readMessage`, {
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
            data = await response.json();
            if(!(data === 'ola kala'))
                alert(data);
        }

        setLoaded(true);
    }
    async function deleteMessage(e) {
        e.preventDefault();
        const response = await fetch(`https://localhost:3001/deleteMessage`, {
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
        if(!(data==='ola kala'))
            alert(data);
        else{
            history.push('/messages');
            window.location.reload();
        }
    }
    const htmlReady = (
        <div className="wrapper">
            <div className="message-disp">
                {!sent? (<h1>From:{message.From}</h1>):''}
                <h3>Message: {message.Message} </h3>
                {!sent?(
                    <form className="reply">

                    <input className="reply-bar"
                           type="text"
                           value={reply}
                           onChange={updateReply}
                           placeholder="Reply"
                    />

                    <button className="reply-button" onClick={getReply}>
                        Quick Reply
                    </button>

                </form>): ''}

                <button className="reply-button" onClick={deleteMessage} >
                    Delete message
                </button>
            </div>
        </div>

    );




    const [isLogged,setIsLogged] = useState(false);

    async function alreadyLogged(){
        const response = await fetch(`https://localhost:3001/checkUserToken`, {
                method: 'Get',
                mode: "cors",
                credentials: 'include', // <- this is mandatory to deal with cookies
            }
        );
        if(response.status === 200)
            setIsLogged(true);
        setLoaded(true);
    }

    useEffect(()=>{
        alreadyLogged();
        getMessage();
    },[]);


    const condition1 = loaded===true && isLogged ===true;
    return(
        <div>
            {condition1 ? htmlReady :(<h1>Loading...</h1>)}
        </div>
    )
}


export default MessageDetail;

