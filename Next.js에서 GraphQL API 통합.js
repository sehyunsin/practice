//npm install @apollo/client graphql


//lib/apollo.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/',
  cache: new InMemoryCache(),
});

export default client;


//pages/index.js

import { gql, useQuery } from '@apollo/client';
import client from '../lib/apollo';

const GET_LAUNCHES = gql`
  query GetLaunches {
    launchesPast(limit: 5) {
      mission_name
      launch_date_utc
      rocket {
        rocket_name
      }
    }
  }
`;

export async function getServerSideProps() {
  const { data } = await client.query({
    query: GET_LAUNCHES,
  });

  return {
    props: {
      launches: data.launchesPast,
    },
  };
}

export default function Home({ launches }) {
  return (
    <div>
      <h1>SpaceX 최근 발사 기록</h1>
      <ul>
        {launches.map((launch, index) => (
          <li key={index}>
            <h2>{launch.mission_name}</h2>
            <p>{new Date(launch.launch_date_utc).toLocaleDateString()}</p>
            <p>로켓: {launch.rocket.rocket_name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

//pages/create.js

import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import client from '../lib/apollo';

const ADD_MISSION = gql`
  mutation AddMission($name: String!, $rocket: String!) {
    insert_missions(objects: { mission_name: $name, rocket_name: $rocket }) {
      returning {
        id
        mission_name
        rocket_name
      }
    }
  }
`;

export default function CreateMission() {
  const [name, setName] = useState('');
  const [rocket, setRocket] = useState('');
  const [addMission] = useMutation(ADD_MISSION, { client });

  const handleSubmit = async () => {
    await addMission({ variables: { name, rocket } });
    alert('Mission added!');
    setName('');
    setRocket('');
  };

  return (
    <div>
      <h1>새 미션 추가</h1>
      <input
        type="text"
        placeholder="미션 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="로켓 이름"
        value={rocket}
        onChange={(e) => setRocket(e.target.value)}
      />
      <button onClick={handleSubmit}>추가</button>
    </div>
  );
}


