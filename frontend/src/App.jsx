import React, { useEffect, useState } from 'react'
import NoteComponent from './components/NoteComponent'
import { API_BASE } from "./api.js";

const App = () => {

  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [formData, setFormData] = useState({ heading: '', content: '' })
  const [modalType, setModalType] = useState(null) // create | edit | view | delete

  const fetchNotes = () => {
    fetch(`${API_BASE}/all`)
      .then(res => res.json())
      .then(data => setNotes(data))
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const openCreate = () => {
    setFormData({ heading: '', content: '' })
    setModalType('create')
  }

  const openEdit = (note) => {
    setSelectedNote(note)
    setFormData({ heading: note.heading, content: note.content })
    setModalType('edit')
  }

  const openView = (note) => {
    setSelectedNote(note)
    setModalType('view')
  }

  const openDelete = (note) => {
    setSelectedNote(note)
    setModalType('delete')
  }

  const closeModal = () => {
    setModalType(null)
    setSelectedNote(null)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCreate = async () => {
    await fetch(`${API_BASE}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    fetchNotes()
    closeModal()
  }

  const handleUpdate = async () => {
    await fetch(`${API_BASE}/edit/${selectedNote.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    fetchNotes()
    closeModal()
  }

  const handleDelete = async () => {
    await fetch(`${API_BASE}/delete/${selectedNote.id}`, {
      method: 'DELETE'
    })
    fetchNotes()
    closeModal()
  }

  return (
    <div className="app-container">
      <h1>📝 Notes Manager</h1>

      <button className="add-btn" onClick={openCreate}>
        + Add Note
      </button>

      <div className="notes-list">
        {notes.map(note => (
          <NoteComponent
            key={note.id}
            note={note}
            onView={() => openView(note)}
            onEdit={() => openEdit(note)}
            onDelete={() => openDelete(note)}
          />
        ))}
      </div>

      {/* MODAL */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal">

            {modalType === 'create' && (
              <>
                <h2>Create Note</h2>
                <input
                  name="heading"
                  placeholder="Heading"
                  value={formData.heading}
                  onChange={handleChange}
                />
                <textarea
                  name="content"
                  placeholder="Content"
                  value={formData.content}
                  onChange={handleChange}
                />
                <button className="modal-create" onClick={handleCreate}>Create</button>
              </>
            )}

            {modalType === 'edit' && (
              <>
                <h2>Edit Note</h2>
                <input
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                />
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                />
                <button className="modal-update" onClick={handleUpdate}>Update</button>
              </>
            )}

            {modalType === 'view' && (
              <>
                <h2>{selectedNote.heading}</h2>
                <p>{selectedNote.content}</p>
              </>
            )}

            {modalType === 'delete' && (
              <>
                <h2>Delete Note?</h2>
                <p>Are you sure you want to delete this note?</p>
                <button className="modal-delete" onClick={handleDelete}>Yes, Delete</button>
              </>
            )}

            <button className="close-btn" onClick={closeModal}>
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  )
}

export default App
