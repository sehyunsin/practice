//pages/api/items.js
let items = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(items);
  } else if (req.method === 'POST') {
    const newItem = { id: Date.now(), ...req.body };
    items.push(newItem);
    res.status(201).json(newItem);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    items = items.filter((item) => item.id !== id);
    res.status(200).json({ message: 'Item deleted' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}


//pages/api-usage.js
import { useState, useEffect } from 'react';

export default function ApiUsage() {
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
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h1>Serverless API Example</h1>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}{' '}
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

//API Routes로 서버리스 백엔드를 구현하는 방법
//API Routes는 Next.js에서 제공하는 서버리스 함수를 사용하여 백엔드 기능을 구현하는 방법입니다.
