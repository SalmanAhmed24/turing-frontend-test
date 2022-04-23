import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from 'rc-pagination';
import CallTable from '../tables/callTable';
function CallComponent() {
	// useState
	const [ pageLimit, setPageLimit ] = useState(10);
	const [ pageOffset, setPageOffset ] = useState(1);
	const [ callData, setCallData ] = useState([]);
	const [ totalCount, setTotalCount ] = useState();
	const [ loaderFlag, setLoaderFlag ] = useState(false);
	// useEffect
	useEffect(() => {
		if (typeof window !== undefined) {
			getCalls();
		}
	}, []);
	// all functions
	const getCalls = (pageOff = pageOffset, pageLim = pageLimit) => {
		setLoaderFlag(true);
		axios
			.get(`https://frontend-test-api.aircall.io/calls?offset=${pageOff}&limit=${pageLim}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			})
			.then((res) => {
				setCallData(res.data.nodes);
				setTotalCount(res.data.totalCount);
				setLoaderFlag(false);
			})
			.catch((err) => {
				console.log(err);
				setLoaderFlag(false);
				setCallData([]);
				setTotalCount(0);
			});
	};
	const handleOnChange = (current, page) => {
		setPageOffset(current);
		getCalls(page, pageLimit);
	};
	return (
		<div>
			<h1>Calls Management</h1>
			{loaderFlag ? (
				<p>loading...</p>
			) : callData.length ? (
				<CallTable reloadData={() => getCalls(pageOffset, pageLimit)} callData={callData} />
			) : (
				<p>No data found or Something went wrong</p>
			)}
			{loaderFlag ? null : callData.length ? (
				<Pagination
					className="cusPagination"
					nextIcon={() => <button>Next</button>}
					prevIcon={() => <button>Prev</button>}
					onChange={handleOnChange}
					current={pageOffset}
					total={totalCount}
					pageSize={pageLimit}
					jumpPrevIcon={() => <p>&#10094;&#10094;</p>}
					jumpNextIcon={() => <p>&#10095;&#10095;</p>}
				/>
			) : null}
		</div>
	);
}

export default CallComponent;
