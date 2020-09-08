import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'
import './index.css'

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState('some error happened...')

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    }, [])

    const addNote = event => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5,
            id: notes.length + 1
        }

        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
                setNewNote('')
            })
    }

    const toggleImportanceOf = id => {
        const url = `http://localhost:3001/notes/${id}`
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important}

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            })
            .catch(error => {
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                )
                setTimeout(()=> {
                    setErrorMessage(null)
                },5000)
                setNotes(notes.filter(n => n.id !== id))
            })
    }

    const handleNoteChange = event => {
        setNewNote(event.target.value)
    }

    const notesToShow = showAll ? notes : notes.filter(note => note.important)

    const Notification = ({ message }) => {
        if(message === null) {
            return null
        }
        return (
            <div className='error'>
                {message}
            </div>
        )
    }

    const Footer = () => {
        const footerStyle = {
            color: 'green',
            fontStyle: 'italic',
            fontSize: 16
        }
        return (
            <div className={footerStyle}>
                <br/>
                <em>Note app, Department of Computer Science, University od Helsinki 2020</em>
            </div>
        )
    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map((note, i) =>
                    <Note
                        key={i}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleNoteChange}
                />
                <button type="submit">save</button>
            </form>
            <Footer/>
        </div>
    )
}

export default App