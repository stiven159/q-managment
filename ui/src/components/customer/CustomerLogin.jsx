import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {Container, CssBaseline, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined.js';
import { css } from "@emotion/css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate , Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const sleepInSeconds = async(delayInSeconds) =>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve()
        }, delayInSeconds*1000)
    })
}

const classes = {
    paper: css({
        marginTop: "50%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    }),
    avatar: css({
        margin: 5,
        backgroundColor: "red"
    }),
    form: css({
        width: '100%', // Fix IE 11 issue.
        marginTop: 5
    }),
    submit: css({
        margin: 5
    })
};


const CustomerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // instantiate the auth service SDK
    const auth = getAuth();

    // Handle user sign up with email and password


    const login = async() => {
            const userCred = signInWithEmailAndPassword(auth, email, password);
            toast.promise(
                userCred,
                {
                    pending: 'Signin you in...',
                    success: "Logged in, you will redirect now...",
                    error: "Login error"
                }
            ).then(async(loginCred)=>{
                await sleepInSeconds(2);
                navigate('/owners')
            }).catch(loginError=>{
                // do nothing
            })

    }



    return (
        <Container component="main" maxWidth="xs">
            <ToastContainer
                style={{width: "350px"}}
                position={"top-center"}
                pauseOnHover={false}
                autoClose={2500}
            />
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar sx={{backgroundColor:"#f50057"}}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(event =>{
                        setEmail(event.target.value);
                    })}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event =>{
                        setPassword(event.target.value);
                    })}
                />
            </div>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={login}
            >
                Sign In
            </Button>
                  <Link variant="body2" to="/SingUp">
                    Already have an account? Sign in
                  </Link>
                
        </Container>
    );
};

export default CustomerLogin;
