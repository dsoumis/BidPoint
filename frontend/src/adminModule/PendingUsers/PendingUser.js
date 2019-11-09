import React from 'react';
import userIcon from "../user.png";
import Image from 'react-image-resizer';
import {Link} from "react-router-dom";
import './PendingUser.css'

function PendingUser({username,email}) {
    return(
        <div className="pendinguser">
            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/admin/pendusers/${username}`}>
                <div className="image">
                    <Image
                        src={userIcon}
                        height={90}
                        width={100}
                    />
                </div>
                <div className="details">
                    <h4>username: {username}</h4>
                    <h4>e-mail: {email}</h4>
                </div>
            </Link>
        </div>
    );
}
export default PendingUser