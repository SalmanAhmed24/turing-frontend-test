import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

export default function DetailModal({ modalFlag, toggleDrawer, id }) {
	const [ loaderFlag, setLoaderFlag ] = useState(false);
	const [ detail, setDetail ] = useState([]);
	useEffect(() => {
		setLoaderFlag(true);
		axios
			.get(`https://frontend-test-api.aircall.io/calls/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			})
			.then((res) => {
				console.log(res.data);
				setDetail(res.data);
				setLoaderFlag(false);
			})
			.catch((err) => {
				setLoaderFlag(false);
			});
	}, []);
	return (
		<Drawer className="cusDrawer" anchor={'right'} open={modalFlag} onClose={() => toggleDrawer()}>
			<div className="closeWrap">
				<CloseIcon onClick={() => toggleDrawer()} sx={{ fontSize: 25 }} />
			</div>
			{loaderFlag ? (
				<p style={{ padding: '0px 20px' }}>loading....</p>
			) : (
				<div className="detailWrap">
					<h2>Call Details</h2>
					<div className="allInfo">
						<h4>
							Call Type: <span>{detail.call_type}</span>
						</h4>
						<h4>
							Created At: <span>{detail.created_at}</span>
						</h4>
						<h4>
							Direction: <span>{detail.direction}</span>
						</h4>
						<h4>
							Duration: <span>{detail.duration}</span>
						</h4>
						<h4>
							From: <span>{detail.from}</span>
						</h4>
						<h4>
							To: <span>{detail.to}</span>
						</h4>
						<h4>
							Via: <span>{detail.via}</span>
						</h4>
						<h4>Notes</h4>
						{detail.notes.length ? (
							detail.notes.map((i) => {
								return (
									<div className="card">
										<p>{i}</p>
									</div>
								);
							})
						) : (
							<p>No notes found</p>
						)}
					</div>
				</div>
			)}
		</Drawer>
	);
}
