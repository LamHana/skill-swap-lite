import { mockUsers } from './data';
import DetailCardList from './components/detail-card-list';
import { Profiles } from '../Home/data';
import Invitations from './components/invitations';

const MyNetwork = () => {
  const users = mockUsers;
  const invitations = Profiles;

  return (
    <div className='flex flex-col items-start gap-4 mb-8 p-8 w-full'>
      <Invitations users={invitations} />
      <DetailCardList users={users} />
    </div>
  );
};

export default MyNetwork;
