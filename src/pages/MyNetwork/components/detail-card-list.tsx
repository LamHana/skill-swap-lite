import { User } from '@/types/user.type';
import DetailCard from './detail-card';

type DetailCardListProps = {
  users: User[];
};

const DetailCardList = ({ users }: DetailCardListProps) => {
  return (
    <div className='flex flex-col items-start mt-10'>
      <h2 className='text-xl font-bold mb-4'>
        My Connections
        <span className='font-medium'>{` (${users.length})`}</span>
      </h2>

      <div className='flex flex-col gap-y-6 my-2'>
        {users.map((user: User) => (
          <DetailCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
};

export default DetailCardList;
