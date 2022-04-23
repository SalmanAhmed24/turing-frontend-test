import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

function LoginForm() {
	// all global variables
	const router = useRouter();
	// all states
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ usernameFlag, setUsernameFlag ] = useState(false);
	const [ passwordFlag, setPasswordFlag ] = useState(false);
	// all functions
	const usernameHandler = (e) => {
		usernameFlag ? setUsernameFlag(false) : false;
		setUsername(e.target.value);
	};
	const passwordHandler = (e) => {
		passwordFlag ? setPasswordFlag(false) : false;
		setPassword(e.target.value);
	};
	const loginHandler = () => {
		if (username == '') {
			setUsernameFlag(true);
		} else if (password == '') {
			setPasswordFlag(true);
		} else {
			const data = {
				username,
				password
			};
			login(data);
		}
	};
	const login = async (data) => {
		axios
			.post('https://frontend-test-api.aircall.io/auth/login', data)
			.then((res) => {
				localStorage.setItem('access_token', res.data.access_token);
				localStorage.setItem('refresh_token', res.data.refresh_token);
				router.push('/calls');
			})
			.catch((err) => console.log(err));
	};
	return (
		<main className="loginCon">
			<div className="loginWrap">
				<h3 className="login-h">Login</h3>
				<div className="formWrap">
					<input type="text" className="inp" placeholder="Username" onChange={usernameHandler} />
					{usernameFlag ? <p className="red">*Username missing</p> : null}
					<input type="password" className="inp" placeholder="Password" onChange={passwordHandler} />
					{passwordFlag ? <p className="red">*Password missing</p> : null}
					<button className="loginBtn" onClick={loginHandler}>
						Login
					</button>
				</div>
			</div>
		</main>
	);
}

export default LoginForm;
