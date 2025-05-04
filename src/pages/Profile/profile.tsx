import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useGetSingleProfile from '@/hooks/useGetSingleProfile';
import { Skill } from '@/types/skill.type';

import { BookOpenIcon, GraduationCapIcon, UserIcon, UsersIcon } from 'lucide-react';

const Profile = () => {
  const { id, currentUser, learn, teach, handleEditProfile, userConnections } = useGetSingleProfile();
  let actionButtonsGroup;

  if (id) {
    if (Array.isArray(currentUser?.connections) && currentUser?.connections.includes(id)) {
      actionButtonsGroup = (
        <div className='flex gap-4 xl:gap-6'>
          <Button className='grow'>Message</Button>
          <Button variant={'outline'} className='grow'>
            Disconnect
          </Button>
        </div>
      );
    } else {
      actionButtonsGroup = <Button>Connect</Button>;
    }
  } else {
    actionButtonsGroup = <Button onClick={handleEditProfile}>Edit profile</Button>;
  }

  return (
    <div className='container mx-auto mt-12 mb-20'>
      <div className='flex flex-col md:flex-row gap-6 items-start'>
        {/* Profile Header */}
        <div className='w-full md:w-1/3 flex flex-col items-center'>
          <div className='relative mb-4 w-40 h-40'>
            <Avatar className='w-40 h-40'>
              <AvatarImage src={currentUser?.photoURL.toString().trim() || ''} alt='shadcn' />
              <AvatarFallback className='bg-primary text-primary-foreground font-bold text-6xl'>
                {currentUser?.fullName.toString().trim().charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className='text-2xl font-bold text-center'>{currentUser?.fullName.toString().trim()}</h1>

          <div className='w-full mt-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm md:text-base font-medium flex items-center gap-2'>
                  <UsersIcon className='h-4 w-4' />
                  Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  {userConnections &&
                    userConnections.length !== 0 &&
                    userConnections.map((connection, index) => (
                      <li key={index} className='flex items-center gap-2'>
                        <Avatar className='h-6 w-6'>
                          <AvatarImage src={connection.photoURL.toString().trim() || ''} alt='shadcn' />
                          <AvatarFallback className='text-xs'>
                            {connection.fullName
                              .toString()
                              .split(' ')
                              .map((name) => name[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-sm'>{connection.fullName.toString()}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Content */}
        <div className='w-full md:w-2/3 space-y-6'>
          {/* Bio Section */}
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2 md:text-lg'>
                <UserIcon className='h-5 w-5' />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>{currentUser?.bio.toString().trim()}</p>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Learning */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm md:text-base font-medium flex items-center gap-2'>
                  <BookOpenIcon className='h-4 w-4' />
                  Learning
                </CardTitle>
                <CardDescription>Skills I want to learn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {learn.map((item: Skill) => (
                    <Badge key={item.id} variant='secondary' className='md:text-sm'>
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teaching */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm md:text-base font-medium flex items-center gap-2'>
                  <GraduationCapIcon className='h-4 w-4' />
                  Teaching
                </CardTitle>
                <CardDescription>Skills I can teach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {teach.map((item: Skill) => (
                    <Badge key={item.id} variant='outline' className='md:text-sm'>
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Button */}
          <div className='flex justify-end'>{actionButtonsGroup}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
