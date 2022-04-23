import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import Swal from 'sweetalert2';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DetailModal from '../modals/detailModal';

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly

const headCells = [
	{
		id: 'archived',
		label: 'Archived'
	},
	{
		id: 'from',
		label: 'From'
	},
	{
		id: 'to',
		label: 'To'
	},
	{
		id: 'via',
		label: 'Via'
	},
	{
		id: 'notes',
		label: 'Notes'
	},
	{
		id: 'call_type',
		label: 'Call Type'
	},
	{
		id: 'direction',
		label: 'Direction'
	},
	{
		id: 'action',
		label: 'Action'
	}
];

function EnhancedTableHead(props) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					{/* <Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all desserts'
						}}
					/> */}
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						sx={{ fontWeight: 'bold', fontFamily: 'Poppins', fontSize: 14 }}
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

export default function CallTable({ callData, reloadData }) {
	const [ order, setOrder ] = React.useState('asc');
	const [ orderBy, setOrderBy ] = React.useState('calories');
	const [ selected, setSelected ] = React.useState([]);
	const [ itemId, setItemId ] = React.useState();
	const [ detailFlag, setDetailFlag ] = React.useState();
	const [ dropDownFlag, setDropdownFlag ] = React.useState(false);
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = callData.map((n) => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};
	const saveId = (id) => {
		setDropdownFlag(!dropDownFlag);
		setItemId(id);
	};
	const openDetailModal = () => {
		setDetailFlag(!detailFlag);
	};
	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		setSelected(newSelected);
	};
	const archiveHandler = (id) => {
		Swal.fire({
			icon: 'warning',
			text: 'Are you sure you want to set the archive status',
			confirmButtonText: 'Yes',
			cancelButtonText: 'Cancel'
		})
			.then((r) => {
				if (r.isConfirmed) {
					axios
						.put(
							`https://frontend-test-api.aircall.io/calls/${id}/archive`,
							{},
							{
								headers: {
									Authorization: `Bearer ${localStorage.getItem('access_token')}`
								}
							}
						)
						.then((res) => {
							reloadData();
						})
						.catch((err) => console.log(err));
				}
			})
			.catch((err) => {});
	};
	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableContainer>
					<Table aria-labelledby="tableTitle" size={'medium'}>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={callData.length}
						/>
						<TableBody>
							{/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
							{callData.map((row, index) => {
								// const isItemSelected =  isSelected(row.id);

								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										onClick={(event) => handleClick(event, row.id)}
										role="checkbox"
										// aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.id}
										// selected={isItemSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												color="primary"
												// checked={isItemSelected}
												inputProps={{
													'aria-labelledby': labelId
												}}
											/>
										</TableCell>
										<TableCell component="th" id={labelId} scope="row" padding="none">
											{row.is_archived ? 'True' : 'False'}
										</TableCell>
										<TableCell>{row.from}</TableCell>
										<TableCell>{row.to}</TableCell>
										<TableCell>{row.via}</TableCell>
										<TableCell>
											{row.notes && row.notes.length ? <button>View</button> : '--'}
										</TableCell>
										<TableCell>{row.call_type}</TableCell>
										<TableCell>{row.direction}</TableCell>
										<TableCell sx={{ position: 'relative' }}>
											<MoreVertIcon onClick={() => saveId(row.id)} sx={{ fontSize: 25 }} />
											{itemId == row.id && dropDownFlag ? (
												<div className="Dropdown">
													<p onClick={() => openDetailModal()}>Details</p>
													<p onClick={() => archiveHandler(row.id)}>Set Archive</p>
												</div>
											) : null}
										</TableCell>
										{itemId == row.id ? (
											<DetailModal
												modalFlag={detailFlag}
												id={itemId}
												toggleDrawer={openDetailModal}
											/>
										) : null}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
}
