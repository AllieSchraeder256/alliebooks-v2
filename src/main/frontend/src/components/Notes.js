import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Input, InputGroup } from 'reactstrap';
import moment from 'moment';
import { apiFetch } from '../utils/api';

const Notes = ({ leaseId, tenantId, initialNotes = [] }) => {
	const [notes, setNotes] = useState(initialNotes || []);
	const [newNoteText, setNewNoteText] = useState('');

	useEffect(() => {
		setNotes(initialNotes || []);
	}, [initialNotes]);

	async function saveNote() {
		if (!newNoteText.trim()) return;
		const note = {
			note: newNoteText,
			leaseId: leaseId ? leaseId : null,
            tenantId: tenantId ? tenantId : null,
		};
		await apiFetch('/notes', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(note),
		}).then(async (response) => {
			if (response.ok) {
				const createdNote = await response.json();
				const updatedNotes = [...notes, createdNote].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNotes(updatedNotes);
                setNewNoteText('');
			} else {
				//todo handle exception
			}
		});
	}

	function handleNewNoteText(event) {
		setNewNoteText(event.target.value);
	}

	return (
		<FormGroup>
			<InputGroup>
				<Input
					type="text"
					name="notes"
					id="notes"
					placeholder="What's happenin'"
					value={newNoteText}
					onChange={handleNewNoteText}
				/>
				<Button onClick={saveNote}>Yep</Button>
			</InputGroup>
			<div className="notes-list">
				{notes && notes.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(
					note => (
						<p key={note.id || `${note.leaseId}-${note.createdAt || note.note}` }>
							<span style={{color: 'gray'}}>{note.createdAt ? moment(note.createdAt).format('M/D/YY') : ''}:</span> {note.note}
						</p>
                ))}
			</div>
		</FormGroup>
	);
};

export default Notes;
