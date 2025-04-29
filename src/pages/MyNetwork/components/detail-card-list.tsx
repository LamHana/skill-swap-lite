import { User } from '@/types/user.type';
import DetailCard from './detail-card';
import useConnections from '@/hooks/useConnections';

const DetailCardList = () => {
  const { data: users, isLoading, isError } = useConnections();

  return (
    <div className='flex flex-col items-start mt-10 w-full'>
      <h2 className='text-xl font-bold mb-4'>
        My Connections
        <span className='font-medium'>{users ? ` (${users?.length})` : ` (${0})`}</span>
      </h2>

      <div className='flex flex-col gap-y-6 my-2 w-full'>
        {users?.map((user: User) => <DetailCard user={user} key={user.id} />)}
      </div>
    </div>
  );
};

export default DetailCardList;
