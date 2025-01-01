//npm install mongoose

//lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI 환경 변수를 설정하세요.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;



//models/Item.js
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);



//pages/api/items.js
import dbConnect from '../../lib/mongodb';
import Item from '../../models/Item';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const items = await Item.find({});
    res.status(200).json(items);
  } else if (req.method === 'POST') {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item deleted' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}





//pages/crud.js
import { useState, useEffect } from 'react';

export default function CrudApp() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(data);
    }
    fetchItems();
  }, []);

  const addItem = async () => {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem }),
    });
    const data = await res.json();
    setItems((prev) => [...prev, data]);
    setNewItem('');
  };

  const deleteItem = async (id) => {
    await fetch('/api/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div>
      <h1>CRUD App with MongoDB</h1>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name}{' '}
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}




//.env.local
MONGODB_URI=your-mongodb-uri
