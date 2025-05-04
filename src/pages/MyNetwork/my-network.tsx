import { useAuth } from '@/hooks';
import { getUserByUID } from '@/services/user.service';

import DetailCardList from './components/detail-card-list';
import Invitations from './components/invitations';

import { useQuery } from '@tanstack/react-query';

const MyNetwork = () => {
  const { user: authUser } = useAuth();

  const { data: currentUser, refetch: refetchCurrentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getUserByUID(authUser?.id ?? ''),
    enabled: !!authUser,
  });

  return (
    <div className='flex flex-col items-start gap-4 mb-8 p-8 w-full'>
      {currentUser && <Invitations currentUser={currentUser} refetchCurrentUser={refetchCurrentUser} />}
      <DetailCardList />
    </div>
  );
};

export default MyNetwork;
