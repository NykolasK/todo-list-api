const express = require('express');
const {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} = require('firebase/firestore');
const db = require('../firebase');

const router = express.Router();

// LISTAR
router.get('/', async (req, res) => {
  try {
    const ref = collection(db, 'todos');
    const q = query(ref, orderBy('created_at', 'desc'));
    const snap = await getDocs(q);
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ message: 'OK', data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DETALHE
router.get('/:id', async (req, res) => {
  try {
    const ref = doc(db, 'todos', req.params.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return res.status(404).json({ error: 'Não encontrado' });
    res.json({ message: 'OK', data: { id: snap.id, ...snap.data() } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CRIAR
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Título obrigatório' });
  try {
    const ref = collection(db, 'todos');
    const created = await addDoc(ref, {
      title,
      description: description || '',
      completed: false,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    res.status(201).json({
      message: 'Criado',
      data: { id: created.id, title, description: description || '', completed: false }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ATUALIZAR
router.put('/:id', async (req, res) => {
  const { title, description, completed } = req.body;
  if (title === undefined && description === undefined && completed === undefined) {
    return res.status(400).json({ error: 'Nada para atualizar' });
  }
  try {
    const ref = doc(db, 'todos', req.params.id);
    await updateDoc(ref, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(completed !== undefined && { completed }),
      updated_at: serverTimestamp()
    });
    res.json({ message: 'Atualizado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETAR
router.delete('/:id', async (req, res) => {
  try {
    const ref = doc(db, 'todos', req.params.id);
    await deleteDoc(ref);
    res.json({ message: 'Removido' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;