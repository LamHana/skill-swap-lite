import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

import { BookOpenIcon, GraduationCapIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';

import { Badge } from '../ui/badge';

import ProfileModal from './profile-modal';

interface PreviewCardProps {
  id: string;
  name: string;
  percent: number;
  teach: string[];
  learn: string[];
  photoUrl?: string;
  button: ReactNode;
  className?: string;
  setListPendingUsers?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  listPendingUsers?: Record<string, boolean>;
}

export default function PreviewCard({
  id,
  name,
  percent,
  teach,
  learn,
  photoUrl,
  button,
  className = '',
  setListPendingUsers,
  listPendingUsers,
}: PreviewCardProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const getDisplayData = (): { teachDisplay: string[]; learnDisplay: string[] } => {
    const teachDisplay: string[] = teach.length <= 2 ? teach : [teach[0], teach[1], '+' + (teach.length - 2)];
    const learnDisplay: string[] = learn.length <= 2 ? learn : [learn[0], learn[1], '+' + (learn.length - 2)];
    return { teachDisplay, learnDisplay };
  };
  const { teachDisplay, learnDisplay } = getDisplayData();

  const handleOpenProfileModal = () => {
    setShowProfileModal(true);
  };
  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <>
      <Card
        className={`w-full  gap-3 relative mx-auto overflow-hidden py-0 ${className}`}
        key={id}
        onClick={handleOpenProfileModal}
      >
        <div className='relative'>
          <div className='absolute top-0 right-0 bg-primary text-white text-xs font-medium px-2 py-1 rounded-bl-md'>
            {percent}%
          </div>
          <CardHeader className='pb-2 pt-4 px-4 flex flex-row items-center gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={photoUrl} alt={name} />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h3 className='font-medium text-base line-clamp-2'>{name}</h3>
          </CardHeader>

          <CardContent className='px-4 py-2 space-y-3'>
            {/* Teaching Skills */}
            <div>
              <div className='text-sm font-medium mb-1.5 flex items-center'>
                <GraduationCapIcon className='h-3.5 w-3.5 mr-1.5 text-emerald-500' />
                Teaching
              </div>
              <div className='flex flex-wrap gap-1.5'>
                {teachDisplay.map((skill, index) => {
                  return (
                    <Badge key={index} variant={'outline'}>
                      {skill}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Learning Skills */}
            <div>
              <div className='text-sm font-medium mb-1.5 flex items-center'>
                <BookOpenIcon className='h-3.5 w-3.5 mr-1.5 text-blue-500' />
                Learning
              </div>
              <div className='flex flex-wrap gap-1.5'>
                {learnDisplay.map((skill, index) => {
                  return (
                    <Badge key={index} variant={'outline'}>
                      {skill}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className='p-4'>{button}</CardFooter>
        </div>
      </Card>
      {/* <Card>
        <div className='absolute top-0 right-0 bg-primary text-white font-bold py-1 px-4 rounded-tr-lg rounded-bl-lg'>
          {percent}%
        </div>
        <CardContent className='flex flex-col gap-1'>
          <div className='flex items-center gap-1 '>
            <span className='font-medium text-xs'>Teaching</span>
            <div className='flex gap-1'>
              {teachDisplay.map((item, index) =>
                index !== 2 ? (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          key={index}
                          className='rounded-full px-2 py-1 border border-gray-300 text-xs content-center text-center'
                        >
                          {item.length > 10 ? item.slice(0, 10) + '...' : item}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span key={index} className='my-auto text-xs'>
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card> */}
      {showProfileModal && (
        <ProfileModal
          open={showProfileModal}
          onOpenChange={handleCloseProfileModal}
          userId={id}
          listPendingUsers={listPendingUsers}
          setListPendingUsers={setListPendingUsers}
        />
      )}
    </>
  );
}
