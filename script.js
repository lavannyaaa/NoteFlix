let currentNote = null;

function fetchNotes() {
    fetch('/get-notes')
        .then(response => response.json())
        .then(data => {
            const notesContainer = document.getElementById('notesContainer');
            data.forEach(note => {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'note';
                noteDiv.innerText = note.content;

                noteDiv.dataset.id = note.id;

                noteDiv.addEventListener('click', function () {
                    openNoteDetail(noteDiv);
                });

                notesContainer.insertBefore(noteDiv, document.getElementById('addNote'));
            });
        })
        .catch(error => {
            console.error('Error fetching notes:', error);
        });
}

document.addEventListener('DOMContentLoaded', fetchNotes);

function addNote() {
    const notesContainer = document.getElementById('notesContainer');
    const note = document.createElement('div');
    note.className = 'note';
    note.contentEditable = true;
    note.innerText = 'New Note'; // Initial placeholder text
    note.style.color = 'black'; 

    note.addEventListener('focus', function() {
        if (note.innerText === 'New Note') {
            note.innerText = ''; 
            note.style.color = 'black'; // Change text color 
        }
    });

    note.addEventListener('blur', function() {
        if (note.innerText.trim() === '') {
            note.innerText = 'New Note'; // Reset to placeholder 
            note.style.color = 'black'; 
        }
    });

    notesContainer.insertBefore(note, document.getElementById('addNote'));

    note.addEventListener('click', function () {
        openNoteDetail(note);
    });

    const addButton = document.getElementById('addNote');
    notesContainer.insertBefore(note, addButton);

    currentNote = note;
}

function openNoteDetail(note) {
    currentNote = note;

    document.getElementById('notesContainer').style.display = 'none';
    document.getElementById('noteDetail').style.display = 'block';

    document.getElementById('noteContent').value = note.innerText;
}

function saveNote() {
    if (currentNote) {
        const noteContent = document.getElementById('noteContent').value;

        currentNote.innerText = noteContent;

        if (currentNote.dataset.id) {
            updateNoteInDatabase(noteContent);
        } else {
            saveNoteToDatabase(noteContent);
        }

        goBack();
    }
}

function goBack() {

    document.getElementById('noteDetail').style.display = 'none';
    document.getElementById('notesContainer').style.display = 'flex';
}

function saveNoteToDatabase(noteContent) {
    fetch('/add-note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: noteContent })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Note added:', data);
        currentNote.dataset.id = data.id; // Save the note ID in the dataset
        currentNote.dataset.saved = true; 
    })
    .catch((error) => {
        console.error('Error adding note:', error);
    });
}

function updateNoteInDatabase(noteContent) {
    const noteId = currentNote.dataset.id; 
    if (noteId) {
        fetch(`/update-note/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: noteContent })
        })
        .then(response => {
            if (response.ok) {
                console.log('Note updated successfully');
            }
        })
        .catch((error) => {
            console.error('Error updating note:', error);
        });
    }
}

function deleteNote() {
    const noteId = currentNote.dataset.id; 
    if (noteId) {
        fetch(`/delete-note/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                console.log('Note deleted successfully');
                currentNote.remove(); // Remove the note 
                goBack();
            }
        })
        .catch((error) => {
            console.error('Error deleting note:', error);
        });
    }
}
