import React from 'react';
import {Link} from "react-router-dom";


function OutboxMessage({id,To,Message}){
    return(
        <div className="message">
            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/messages/${id}`}>
                <div className="message-display">
                    <h4>To: {To}</h4>

                </div>
            </Link>
        </div>
    );
}
export default OutboxMessage;