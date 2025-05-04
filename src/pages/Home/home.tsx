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
import { UserWithPercent } from '@/types/user.type';
import { asStringArray } from '@/utils/userHelpers';

import { BookOpenIcon, CheckIcon, ChevronDown, FilterIcon, GraduationCapIcon, SearchIcon, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import PreviewCardList from './components/previewCardList';
import { TABS_DATA, TABS_SEARCH, TabsDataType } from './constants';

const Home = () => {
  const [currentTab, setCurrentTab] = useState<string>('related');
  const [userList, setUserList] = useState<UserWithPercent[] | null>(null);
  const [isLoadingSearchedUsers, setIsLoadingSearchedUsers] = useState(false);
  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [tabsData, setTabsData] = useState<TabsDataType[]>(TABS_DATA);
  const [isClearCategories, setIsClearCategories] = useState(false);

  const previousTabRef = useRef(currentTab);

  const { user } = useAuth();
  const { users, isLoading: isLoadingUsers } = useGetUsers();

  const {
    skillCategories,
    currentLearning: myLearning,
    currentTeaching: myTeaching,
    skills,
    checkMatching,
  } = useSkill();
  const applicableSkills = useMemo(() => {
    if (!selectedCategories.length || !skillCategories) return [];

    const skills: string[] = [];
    skillCategories.forEach((category) => {
      if (selectedCategories.includes(category.category)) {
        category.skills.forEach((skill) => {
          skills.push(skill.name);
        });
      }
    });
    return skills;
  }, [selectedCategories, skillCategories]);

  // Memoize filtered users based on search criteria

  const onSearch = useCallback(
    (mode: string) => {
      if (!users) return [];
      if (selectedCategories.length === 0 && !searchKeyword) {
        setSearchMode(false);

        setSelectedCategories([]);
        setSearchKeyword('');
        setUserList(users);
        setCurrentTab(() => 'related');
        setTabsData(TABS_DATA);
        return;
      }
      setIsLoadingSearchedUsers(true);
      setSearchMode(true);
      const searchSkills: string[] = [];
      const searchedUsers: UserWithPercent[] = [];

      // If no applicable skills and we have a keyword, just filter by name
      if (applicableSkills.length === 0 && searchKeyword) {
        const lowercaseKeyword = searchKeyword.toLowerCase();
        skills?.forEach((skill) => {
          if (skill.name.toLowerCase().includes(lowercaseKeyword)) searchSkills.push(skill.name);
        });
      } else if (applicableSkills.length > 0 && !searchKeyword) {
        // If we have applicable skills but no keyword
        searchSkills.push(...applicableSkills);
      } else if (applicableSkills.length > 0 && searchKeyword) {
        const lowercaseKeyword = searchKeyword.toLowerCase();
        searchSkills.push(...applicableSkills.filter((skill) => skill.toLowerCase().includes(lowercaseKeyword)));
      }

      if (mode === 'related') {
        mode = 'learning';
      }

      if (mode === 'teaching') {
        const baseSet = new Set<string>(searchSkills);
        users.forEach((user) => {
          const { hasMatch, matchedSkills, matchedSkillsCount } = checkMatching(asStringArray(user.learn), baseSet);
          if (user.learn && hasMatch) {
            searchedUsers.push(user);
            user.learn = matchedSkills;
            user.matchedTeach = matchedSkillsCount;
            user.matchedLearn = 0;
          } else if (searchKeyword && user.fullName.toString().toLowerCase().includes(searchKeyword.toLowerCase())) {
            searchedUsers.push(user);
          }
        });
      } else if (mode === 'learning') {
        const baseSet = new Set<string>(searchSkills);
        users.forEach((user) => {
          const { hasMatch, matchedSkills, matchedSkillsCount } = checkMatching(asStringArray(user.teach), baseSet);
          if (user.teach && hasMatch) {
            searchedUsers.push(user);
            user.teach = matchedSkills;
            user.matchedLearn = matchedSkillsCount;
            user.matchedTeach = 0;
          } else if (searchKeyword && user.fullName.toString().toLowerCase().includes(searchKeyword.toLowerCase())) {
            searchedUsers.push(user);
          }
        });
      }
      setUserList(searchedUsers);
      setTabsData(TABS_SEARCH);
      setCurrentTab(mode);
      setIsLoadingSearchedUsers(false);
    },
    [applicableSkills, checkMatching, searchKeyword, selectedCategories.length, skills, users],
  );

  // Handle tab changes and re-run search if in search mode
  useEffect(() => {
    // Skip on initial render
    if (previousTabRef.current === currentTab) return;

    // Update the ref
    previousTabRef.current = currentTab;

    // If we're in search mode, perform search with the new tab
    if (searchMode && users) {
      onSearch(currentTab);
      setTabsData(TABS_SEARCH);
    }
    // If not in search mode, just use the users from the hook
    else if (users) {
      let filteredUsers = users;
      if (currentTab === 'learning') {
        filteredUsers = users.filter((cur) => cur.matchedLearn > 0);
      } else if (currentTab === 'teaching') {
        filteredUsers = users.filter((cur) => cur.matchedTeach > 0);
      }

      setTabsData(TABS_DATA);
      setUserList(filteredUsers);
    }
  }, [currentTab, users, searchMode, onSearch]);

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
    setSearchKeyword('');
    setUserList(users);
    setCurrentTab('related');
    setIsClearCategories(true);
  };
  useEffect(() => {
    if (isClearCategories) {
      setTabsData(TABS_DATA);
      setIsClearCategories(false);
    }
  }, [tabsData, isClearCategories]);

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
          <div className='flex-5 z-30'>
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
            <Input
              placeholder='Search...'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className='pl-9'
            />
          </div>

          {/* Search Button */}
          <Button className='bg-red-600 hover:bg-red-700' onClick={() => onSearch(currentTab)}>
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

      <Tabs value={currentTab} onValueChange={setCurrentTab} className='mb-6'>
        <TabsList className='mb-4  z-10'>
          {tabsData.map((data) => (
            <TabsTrigger key={data.value} value={data.value}>
              {data.tabTrigger}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsData.map((data) => (
          <TabsContent key={data.value} value={data.value}>
            <h2 className='text-2xl font-bold'>{data.tabHeader}</h2>

            {(isLoadingUsers || isLoadingSearchedUsers) && <LoadingSpinner className='mx-auto mt-10' />}
            {!isLoadingUsers &&
              !isLoadingSearchedUsers &&
              (users && users.length > 0 ? (
                <PreviewCardList results={userList || users} />
              ) : (
                <p className='text-center mt-10'>No users found</p>
              ))}
          </TabsContent>
        ))}
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
