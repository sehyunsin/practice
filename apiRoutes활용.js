/* pages/api/todos.js */
const todos = [
    { id: 1, task: 'Learn JavaScript' },
    { id: 2, task: 'Practice React' },
    { id: 3, task: 'Explore Next.js' },
  ];
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).json(todos);
    } else if (req.method === 'POST') {
      const { task } = req.body;
      const newTodo = { id: todos.length + 1, task };
      todos.push(newTodo);
      res.status(201).json(newTodo);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  

/*   pages/todos.js */
import { useState, useEffect } from 'react';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    async function fetchTodos() {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
    }
    fetchTodos();
  }, []);

  const addTodo = async () => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setTask('');
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.task}</li>
        ))}
      </ul>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTodo}>Add</button>
    </div>
  );
}

/* API Routes의 사용 사례와 이점 설명
실제 프로젝트에서 API Routes를 어떻게 활용할 수 있는지 예시 제시
데이터베이스 연결로 확장 가능성을 안내 */
