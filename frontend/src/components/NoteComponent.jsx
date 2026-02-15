import React from 'react'

const NoteComponent = ({ note, onView, onEdit, onDelete }) => {
  return (
    <div className="note-row">
      <div>
        <h3>{note.heading}</h3>
        <p>{note.content.substring(0, 50)}...</p>
      </div>

      <div className="actions">
        <button onClick={onView}>View</button>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

export default NoteComponent
