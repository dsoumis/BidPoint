import React from 'react';
import userIcon from "../user.png";
import './User.css'
import Image from 'react-image-resizer';
import {Link} from "react-router-dom";

function User({username,email}) {
    return(
        <div className="user">
            <Link style={{ textDecoration: 'none', color: 'black' }} to={`/admin/users/${username}`}>
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
export default User