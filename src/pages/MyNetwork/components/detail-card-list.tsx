import useConnections from '@/hooks/useConnections';
import { User } from '@/types/user.type';

import DetailCard from './detail-card';
import { LoadingSpinner } from '@/components/common/loading-spinner';

const DetailCardList = () => {
  const { data: users, isLoading } = useConnections();

  return isLoading ? (
    <div className='w-full flex items-center justify-center py-20'>
      <LoadingSpinner size='md' />
    </div>
  ) : (
    <div className='flex flex-col items-start mt-10 w-full'>
      <h2 className='text-xl font-bold mb-4'>
        My Connections
        <span className='font-medium'>{users ? ` (${users?.length})` : ` (${0})`}</span>
      </h2>

      {users && users.length > 0 ? (
        <div className='flex flex-col gap-y-6 my-2 w-full'>
          {users?.map((user: User) => <DetailCard user={user} key={user.id} />)}
        </div>
      ) : (
        <div className='w-full flex items-center justify-center py-10'>
          <p className='text-2xl text-gray-500'>There are no connections.</p>
        </div>
      )}
    </div>
  );
};

export default DetailCardList;
