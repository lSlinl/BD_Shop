import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

function Profile() {
    const { user } = useContext(AuthContext)
    console.log(user)
    return (
        <div className="section">
            <h2>Профиль</h2>
            {user?.username}
            {user?.email}

    </div>
    )
}

export default Profile