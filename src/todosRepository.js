
const app = require('./firebase');
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where
} = require('firebase/firestore');

const db = getFirestore(app);
const col = collection(db, 'todos');

const map = s => {
  const d = s.data() || {};
  return {
    id: s.id,
    title: d.title || '',
    description: d.description || '',
    completed: !!d.completed,
    created_at: d.created_at,
    updated_at: d.updated_at
  };
};

async function createTodo({ title, description = '' }) {
  if (!title) throw new Error('title obrigatório');
  const ref = await addDoc(col, {
    title,
    description,
    completed: false,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  });
  return map(await getDoc(ref));
}

async function listTodos({ onlyCompleted, onlyActive } = {}) {
  let qBase = query(col, orderBy('created_at', 'desc'));
  if (onlyCompleted) qBase = query(col, where('completed', '==', true), orderBy('created_at', 'desc'));
  else if (onlyActive) qBase = query(col, where('completed', '==', false), orderBy('created_at', 'desc'));
  const snap = await getDocs(qBase);
  return snap.docs.map(map);
}

async function getTodo(id) {
  const snap = await getDoc(doc(db, 'todos', id));
  if (!snap.exists()) return null;
  return map(snap);
}

async function updateTodo(id, data) {
  const ref = doc(db, 'todos', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const patch = {};
  ['title','description','completed'].forEach(k => {
    if (k in data) patch[k] = data[k];
  });
  if (!Object.keys(patch).length) return map(snap);
  patch.updated_at = serverTimestamp();
  await updateDoc(ref, patch);
  return map(await getDoc(ref));
}

async function deleteTodo(id) {
  await deleteDoc(doc(db, 'todos', id));
  return true;
}

async function clearCompleted() {
  const completed = await listTodos({ onlyCompleted: true });
  await Promise.all(completed.map(t => deleteTodo(t.id)));
  return completed.length;
}

module.exports = {
  createTodo,
  listTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  clearCompleted
};