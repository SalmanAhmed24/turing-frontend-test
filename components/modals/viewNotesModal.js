import React from 'react';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';

export default function ViewNotesModal({ modalFlag, modalHandler, notes }) {
	return (
		<React.Fragment>
			<Dialog fullWidth={true} maxWidth="lg" open={modalFlag} onClose={modalHandler}>
				<div className="closeWrap">
					<CloseIcon onClick={() => modalHandler()} sx={{ fontSize: 25 }} />
				</div>
				<div className="contentWrap">
					{notes && notes.length ? (
						notes.map((i) => {
							return <p key={i.id}>{i.content}</p>;
						})
					) : (
						<p>No notes found</p>
					)}
				</div>
			</Dialog>
		</React.Fragment>
	);
}
