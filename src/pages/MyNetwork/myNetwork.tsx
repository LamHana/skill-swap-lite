import React from 'react';
import { mockUsers } from './data';
import DetailCard from './components/DetailCard';

const MyNetwork = () => {
  const users = mockUsers;

  return (
    <div>
      {users.map((user) => (
        <DetailCard user={user} />
      ))}
    </div>
  );
};

export default MyNetwork;
