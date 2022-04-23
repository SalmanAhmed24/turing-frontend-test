import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
function Navbar() {
	const router = useRouter();
	const [ logoutFlag, setLogoutFlag ] = useState(false);
	const [ token, setToken ] = useState('');
	const logoutHandler = () => {
		localStorage.setItem('access_token', null);
		localStorage.setItem('refresh_token', null);
		router.push('/');
	};
	return (
		<nav>
			<div className="logoutWrap">
				<p onClick={logoutHandler}>Logout</p>
			</div>
		</nav>
	);
}

export default Navbar;
