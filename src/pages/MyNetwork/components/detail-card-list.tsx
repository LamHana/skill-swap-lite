import { LoadingSpinner } from '@/components/common/loading-spinner';
import useConnections from '@/hooks/useConnections';
import { User } from '@/types/user.type';

import DetailCard from './detail-card';
import { useEffect, useState } from 'react';
import useSkillMapping from '@/hooks/useSkillMapping';
import { useAuth } from '@/hooks';
import { asStringArray } from '@/utils/userHelpers';
import { matchingIndicator } from '@/utils/matchingIndicator';

const DetailCardList = () => {
  const { data: users, isLoading } = useConnections();
  const { user: currentUser } = useAuth();
  const [userWithSkills, setUserWithSkills] = useState<User | null>(null);
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [isPercentagesLoaded, setIsPercentagesLoaded] = useState(false);

  useEffect(() => {
    const fetchUserWithSkills = async () => {
      if (!currentUser) return;
      const teachSkills = await useSkillMapping(asStringArray(currentUser.teach));
      const learnSkills = await useSkillMapping(asStringArray(currentUser.learn));
      setUserWithSkills({ ...currentUser, teach: teachSkills, learn: learnSkills });
    };

    fetchUserWithSkills();
  }, [currentUser]);

  useEffect(() => {
    if (!userWithSkills || !users) return;

    const calculatePercentages = async () => {
      const newPercentages: Record<string, number> = {};
      for (const user of users) {
        newPercentages[user.id] = matchingIndicator(userWithSkills, user).percent;
      }
      setPercentages(newPercentages);
      setIsPercentagesLoaded(true);
    };

    calculatePercentages();
  }, [userWithSkills, users]);

  return isLoading || !isPercentagesLoaded ? (
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
          {users?.map((user: User) => <DetailCard user={user} key={user.id} percentage={percentages[user.id]} />)}
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
