import DetailCardList from './components/detail-card-list';
import { Profiles } from '../Home/data';
import Invitations from './components/invitations';
import useConnections from '@/hooks/useConnections';

const MyNetwork = () => {
  const invitations = Profiles;

  const { data: users = [], isLoading, isError } = useConnections();

  return (
    <div className='flex flex-col items-start gap-4 mb-8 p-8 w-full'>
      <Invitations users={invitations} />
      <DetailCardList users={users} />
    </div>
  );
};

export default MyNetwork;
