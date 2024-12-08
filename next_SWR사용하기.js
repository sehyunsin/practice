/* npm install swr
pages/api/users.js */

export default function handler(req, res) {
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Alice' },
    ];
    res.status(200).json(users);
  }
  

  // pages/swr-example.js
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SWRExample() {
  const { data, error } = useSWR('/api/users', fetcher);

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>사용자 목록</h1>
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
