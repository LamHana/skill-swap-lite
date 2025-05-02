import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { useAuth } from '@/hooks';
import useGetUsers from '@/hooks/useGetUsers';
import { UpdateProfileModal } from '@/pages/Home/components/updateProfileModal/update-profile-modal';
import { GET_SKILL_CATEGORIES_QUERY_KEY, getCategoriesWithSkills } from '@/services/skill.service';
import { getUserBySkills } from '@/services/user.service';
import { UserWithPercent } from '@/types/user.type';

import { useEffect, useState } from 'react';

import PreviewCardList from './components/previewCardList';
import SearchForm from './components/searchForm';

import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const [searchIDs, setSearchIDs] = useState<string[] | null>(null);

  const [userList, setUserList] = useState<UserWithPercent[] | null>(null);
  const [isLoadingSearchedUsers, setIsLoadingSearchedUsers] = useState(false);

  const { user } = useAuth();
  const { users, isLoading: isLoadingUsers, processUsers, sortUsersByMatching } = useGetUsers();

  const { data: categories, isLoading } = useQuery({
    queryKey: [GET_SKILL_CATEGORIES_QUERY_KEY],
    queryFn: () => getCategoriesWithSkills(),
  });

  useEffect(() => {
    setUserList(users);
  }, [users]);

  useEffect(() => {
    console.log(searchIDs, 'searchIDs in Home');
    if (!searchIDs) {
      setUserList(users);
    } else if (searchIDs.length > 0) {
      setIsLoadingSearchedUsers(true);
      getUserBySkills(searchIDs)
        .then((searchedUsers) => {
          setIsLoadingSearchedUsers(false);
          if (searchedUsers.length > 0) {
            setUserList(sortUsersByMatching(processUsers(searchedUsers)));
          } else {
            setUserList([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching searched users:', error);
        })
        .finally(() => {
          setIsLoadingSearchedUsers(false);
        });
    } else {
      setUserList([]);
    }
  }, [searchIDs]);

  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  useEffect(() => {
    if (
      user &&
      ((Array.isArray(user.learn) && !user.learn.length) || (Array.isArray(user.teach) && !user.teach.length))
    ) {
      setShowCompleteProfile(true);
    }
  }, [user]);

  return (
    <>
      <PageHeader />
      {isLoading && <p>Loading...</p>}
      {!isLoading && <SearchForm categories={categories || []} setSearchIDs={setSearchIDs} />}

      <div className='container mx-auto p-4 md:p-8'>
        <p className='text-3xl font-bold'>
          {searchIDs ? (
            <>
              Search Result{' '}
              <span className='font-medium text-2xl text-gray-500'>
                {!isLoadingSearchedUsers && `(${userList?.length})`}
              </span>
            </>
          ) : (
            `Top Related`
          )}
        </p>
        {(isLoading || isLoadingSearchedUsers) && <LoadingSpinner className='mx-auto mt-10' />}
        {!isLoadingUsers &&
          !isLoadingSearchedUsers &&
          (userList && userList.length > 0 ? (
            <PreviewCardList results={userList ?? users} />
          ) : (
            <p className='text-center mt-10'>No users found</p>
          ))}
      </div>

      {user && showCompleteProfile && (
        <UpdateProfileModal
          open={showCompleteProfile}
          onOpenChange={(isOpen) => {
            setShowCompleteProfile(isOpen);
          }}
          userId={user.id}
        />
      )}
    </>
  );
};

export default Home;
