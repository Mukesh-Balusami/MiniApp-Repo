// .................Server without express (direct Node server).............//

// import http from 'http';

// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'content-type': 'text/plain'});
//     res.end('You had created a server successfully');
// });

// server.listen(3000, () => console.log(`Server is runningin the port http://localhost:3000`));

// .................Server without express (direct Node server).............//
import express from 'express';
import { db } from './db.js';
import { notes } from './schema.js';
import { eq } from 'drizzle-orm';
import cors from 'cors';

// Backend app is created
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Routing initiates
const router = express.Router();

app.use(express.json());

// Middleware router function from express
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${req.method}] [${req.url}]`)
    next();
})

// Dummy Database
// const notes = [
//     {id: 1, heading: 'Note 1', content: 'Content 1'},
//     {id: 2, heading: 'Note 2', content: 'Content 2'},
//     {id: 3, heading: 'Note 3', content: 'Content 3'},
// ]

// Roting
router.get('/', (req, res) => {
    res.json({message: 'Home page'});
});

router.get('/all', async (req, res) => {
    const allNotes = await db.select().from(notes);
    res.json(allNotes);
});

router.get('/note/:id', async (req, res) => {
    const id = Number(req.params.id);
    const result = await db.select().from(notes).where(eq(notes.id, id));

    const note = result[0];
    if(!note) return res.status(404).send('Note not found');
    res.json(note);
});

router.post('/create', async (req, res) => {
    const {heading, content} = req.body;
    if(!heading || !content) return res.status(400).json({error: 'All fields are required'});
    const [newNote] = await db.insert(notes).values({heading, content}).returning();
    res.status(201).json(newNote);
});

router.put('/edit/:id', async (req, res) => {
    const id = Number(req.params.id);
    const {heading, content} = req.body;
    // Create empty object
    const updateData = {};

    if (heading !== undefined) updateData.heading = heading;
    if (content !== undefined) updateData.content = content;

    // If nothing sent
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No fields provided to update" });
    }
    const noteToBeEdited = await db.update(notes).set(updateData).where(eq(notes.id, id)).returning();

    if(!noteToBeEdited.length) return res.status(404).json({error:'Note not found'});

    res.json(noteToBeEdited[0]);
});

router.delete('/delete/:id', async (req, res) => {
    const id = Number(req.params.id);
    const noteToBeDeleted = await db.delete(notes).where(eq(notes.id, id)).returning();

    if (!noteToBeDeleted.length) return res.json({error: 'Note not found'});

    res.json({message:"Note deleted", note: noteToBeDeleted[0]});
});

app.use('/api/v1/notes', router);

app.listen(PORT, () => console.log(`App is running on the port ${PORT}: http://localhost:${PORT}`));