import React from 'react';
import {Link} from "react-router-dom";


function InboxMessage({id,From,Read,Message}){
    return(
        <div className="message">
            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/messages/${id}`}>
                <div className="message-display">
                    <h4>From: {From}</h4>
                    {Read ? '' : (<h4>Unread</h4>)}
                </div>
            </Link>
        </div>
    );
}
export default InboxMessage;