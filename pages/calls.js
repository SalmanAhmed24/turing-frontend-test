import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import CallComponent from '../components/subcomponents/CallComponent';
import Navbar from '../components/navbar/navbar';

function Calls() {
	// Global variables
	const router = useRouter();
	// useEffect
	useEffect(() => {
		if (typeof window !== undefined) {
			if (
				localStorage.getItem('access_token') == undefined ||
				localStorage.getItem('access_token') == null ||
				localStorage.getItem('access_token') == 'null'
			) {
				router.push('/');
			} else {
				const timer = setInterval(() => {
					refreshToken();
				}, 480000);
				return () => clearTimeout(timer);
			}
		}
	}, []);
	// all functions
	const refreshToken = () => {
		axios
			.post(
				'https://frontend-test-api.aircall.io/auth/refresh-token',
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`
					}
				}
			)
			.then((res) => {
				localStorage.setItem('access_token', res.data.access_token);
				localStorage.setItem('refresh_token', res.data.refresh_token);
			})
			.catch((err) => {
				router.push('/');
				localStorage.setItem('access_token', null);
			});
	};
	return (
		<div className="callWrapMain">
			<Navbar />
			<CallComponent />
		</div>
	);
}

export default Calls;
