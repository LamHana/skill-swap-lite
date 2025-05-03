import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks';
import useGetUsers from '@/hooks/useGetUsers';
import useSkill from '@/hooks/useSkill';
import { cn } from '@/lib/utils';
import { UpdateProfileModal } from '@/pages/Home/components/updateProfileModal/update-profile-modal';
import { GET_SKILL_CATEGORIES_QUERY_KEY, getCategoriesWithSkills } from '@/services/skill.service';
import { getUserBySkills } from '@/services/user.service';
import { UserWithPercent } from '@/types/user.type';

import { BookOpenIcon, CheckIcon, ChevronDown, FilterIcon, GraduationCapIcon, SearchIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import PreviewCardList from './components/previewCardList';
import SearchForm from './components/searchForm';

import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const [currentTab, setCurrentTab] = useState('related');
  const [searchIDs, setSearchIDs] = useState<string[] | null>(null);
  const [userList, setUserList] = useState<UserWithPercent[] | null>(null);
  const [isLoadingSearchedUsers, setIsLoadingSearchedUsers] = useState(false);
  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  const { user } = useAuth();
  const { users, isLoading: isLoadingUsers } = useGetUsers(currentTab);

  const { skillCategories, currentLearning: myLearning, currentTeaching: myTeaching } = useSkill();

  // useEffect(() => {
  //   setUserList(users);
  // }, [users]);

  // useEffect(() => {
  //   console.log(searchIDs, 'searchIDs in Home');
  //   if (!searchIDs) {
  //     setUserList(users);
  //   } else if (searchIDs.length > 0) {
  //     setIsLoadingSearchedUsers(true);
  //     getUserBySkills(searchIDs)
  //       .then((searchedUsers) => {
  //         setIsLoadingSearchedUsers(false);
  //         if (searchedUsers.length > 0) {
  //           setUserList(sortUsersByMatching(processUsers(searchedUsers)));
  //         } else {
  //           setUserList([]);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching searched users:', error);
  //       })
  //       .finally(() => {
  //         setIsLoadingSearchedUsers(false);
  //       });
  //   } else {
  //     setUserList([]);
  //   }
  // }, [searchIDs]);

  useEffect(() => {
    if (
      user &&
      ((Array.isArray(user.learn) && !user.learn.length) || (Array.isArray(user.teach) && !user.teach.length))
    ) {
      setShowCompleteProfile(true);
    }
  }, [user]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  // Clear all selected categories
  const clearCategories = () => {
    setSelectedCategories([]);
  };

  return (
    <>
      <PageHeader />
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 mb-4'>
        <div className='flex flex-col md:flex-row gap-3'>
          <div className='flex-1'>
            <Avatar className='h-10 w-10  mx-auto'>
              <AvatarImage src={user?.photoURL.toString()} />
              <AvatarFallback>{user?.fullName.toString().charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          {/* Teaching Skills */}
          <div className='flex-5'>
            <div className='flex items-center gap-1 mb-1'>
              <GraduationCapIcon className='h-4 w-4 text-emerald-500' />
              <h3 className='text-sm font-medium'>Teaching</h3>
            </div>
            <div className='flex flex-wrap gap-1'>
              {myTeaching?.map((skill, index) => (
                <>
                  <Badge
                    key={index}
                    variant={'outline'}
                    className='bg-emerald-100 dark:bg-emerald-700 border-emerald-500'
                  >
                    {skill}
                  </Badge>
                </>
              ))}
            </div>
          </div>

          {/* Learning Skills */}
          <div className='flex-5'>
            <div className='flex items-center gap-1 mb-1'>
              <BookOpenIcon className='h-4 w-4 text-blue-500' />
              <h3 className='text-sm font-medium'>Learning</h3>
            </div>
            <div className='flex flex-wrap gap-1'>
              {myLearning?.map((skill, index) => (
                <Badge key={index} variant={'outline'} className='bg-blue-100 dark:bg-blue-700 border-blue-500'>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Search and Multi-Select Filter */}
      <div className='flex flex-col gap-3 mb-6'>
        {/* Search and Filter Controls */}
        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Category Filter Dropdown */}
          <Popover open={openCategoryFilter} onOpenChange={setOpenCategoryFilter}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={openCategoryFilter}
                className='w-full sm:w-[220px] justify-between'
              >
                <div className='flex items-center gap-1'>
                  <FilterIcon className='h-4 w-4' />
                  <span>
                    {selectedCategories.length > 0 ? `${selectedCategories.length} categories` : 'Select Categories'}
                  </span>
                </div>
                <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[220px] p-0' align='start'>
              <Command>
                <CommandInput placeholder='Search categories...' />
                <CommandList>
                  <CommandEmpty>No categories found.</CommandEmpty>
                  <CommandGroup>
                    {skillCategories?.map((category) => {
                      const isSelected = selectedCategories.includes(category?.category);
                      return (
                        <CommandItem
                          key={category.category}
                          value={category.category}
                          onSelect={() => toggleCategory(category.category)}
                        >
                          <div
                            className={cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50',
                            )}
                          >
                            {isSelected && <CheckIcon className='h-3 w-3' />}
                          </div>
                          <span>{category.category}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Search Input */}
          <div className='relative flex-1'>
            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input placeholder='Search...' className='pl-9' />
          </div>

          {/* Search Button */}
          <Button className='bg-red-600 hover:bg-red-700'>
            <SearchIcon className='h-4 w-4 mr-2' />
            Search
          </Button>
        </div>

        {/* Selected Categories Display */}
        {selectedCategories.length > 0 && (
          <div className='flex flex-wrap items-center gap-2 mt-2'>
            <span className='text-sm text-muted-foreground'>Filters:</span>
            {selectedCategories.map((categoryValue) => {
              const category = skillCategories?.find((c) => c.category === categoryValue);
              return (
                <Badge key={categoryValue} variant='secondary' className='px-2 py-0 h-6'>
                  {category?.category}
                  <button className='ml-1 rounded-full hover:bg-muted/20' onClick={() => toggleCategory(categoryValue)}>
                    <X className='h-3 w-3' />
                    <span className='sr-only'>Remove {category?.category} filter</span>
                  </button>
                </Badge>
              );
            })}
            <Button
              variant='ghost'
              size='sm'
              className='h-6 px-2 text-xs text-muted-foreground'
              onClick={clearCategories}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* {!isLoading && <SearchForm categories={categories || []} setSearchIDs={setSearchIDs} />} */}

      <Tabs value={currentTab} onValueChange={setCurrentTab} className='mb-6'>
        <TabsList className='mb-4'>
          {TABS_DATA.map((data) => (
            <TabsTrigger key={data.value} value={data.value}>
              {data.tabTrigger}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value='related'>
          <h2 className='text-2xl font-bold'>Top Related</h2>
          {(isLoading || isLoadingSearchedUsers) && <LoadingSpinner className='mx-auto mt-10' />}
          {!isLoadingUsers &&
            !isLoadingSearchedUsers &&
            (userList && userList.length > 0 ? (
              <PreviewCardList results={userList ?? users} />
            ) : (
              <p className='text-center mt-10'>No users found</p>
            ))}
        </TabsContent>

        <TabsContent value='teaching'>
          <h2 className='text-2xl font-bold'>People Who Want to Learn What I Teach</h2>
          {(isLoading || isLoadingSearchedUsers) && <LoadingSpinner className='mx-auto mt-10' />}
          {!isLoadingUsers &&
            !isLoadingSearchedUsers &&
            (userList && userList.length > 0 ? (
              <PreviewCardList results={userList ?? users} />
            ) : (
              <p className='text-center mt-10'>No users found</p>
            ))}
        </TabsContent>

        <TabsContent value='learning'>
          <h2 className='text-2xl font-bold '>People Who Can Teach What I Want to Learn</h2>
          {(isLoading || isLoadingSearchedUsers) && <LoadingSpinner className='mx-auto mt-10' />}
          {!isLoadingUsers &&
            !isLoadingSearchedUsers &&
            (userList && userList.length > 0 ? (
              <PreviewCardList results={userList ?? users} />
            ) : (
              <p className='text-center mt-10'>No users found</p>
            ))}
        </TabsContent>
      </Tabs>

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
