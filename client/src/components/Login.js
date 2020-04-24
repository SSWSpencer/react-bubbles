import React, {useState} from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth"

const Login = props => {
    const [state, setState] = useState({
        credentials: {
            username: "",
            password: ""
        }
    })

    const handleChange = e =>{
        setState({
            credentials: {
                ...state.credentials,
                [e.target.name]: e.target.value
            }
        })
    }

    const login = e => {
        e.preventDefault();
        axiosWithAuth()
            .post('/api/login', state.credentials)
            .then(res=> {
                console.log(res);
                localStorage.setItem('token', JSON.stringify(res.data.payload))
                props.history.push('/bubbles');
            })
            .catch(err => console.log({err}))
    }

    return(
        <div className="loginForm">
            <form onSubmit={login}>
                <input 
                type="text"
                placeholder="Username"
                name="username"
                value={state.credentials.username}
                onChange={handleChange}
                />
                <input 
                type="password"
                placeholder="Password"
                name="password"
                value={state.credentials.password}
                onChange={handleChange}
                />
                <button>Log In</button>
            </form>
        </div>
    )


}

export default Login;