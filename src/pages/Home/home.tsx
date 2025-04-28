import { PageHeader } from '@/components/common/page-header';
import PreviewCardList from './components/preview-card-list';
import { Categories, Profiles } from './data';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useAuth } from '@/hooks';
import { UpdateProfileModal } from '@/pages/Home/components/updateProfileModal/update-profile-modal';
import { useEffect, useState } from 'react';

const searchFormDefaultValues = {
  keyword: '',
  category: '',
};

const Home = () => {
  const { user } = useAuth();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  useEffect(() => {
    if (user && (!user.learn?.length || !user.teach?.length)) {
      setShowCompleteProfile(true);
    }
  }, []);

  const form = useForm({ defaultValues: searchFormDefaultValues });

  const onSubmit = (e: any) => {
    console.log(e);
  };

  return (
    <>
      <PageHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full px-4 md:px-0 md:max-w-3xl mx-auto'>
          <div className='flex flex-col md:flex-row items-center gap-3 md:gap-2'>
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='w-full md:flex-1'>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className=' w-full'>
                        <SelectValue placeholder='Select Category' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {Categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='w-full md:w-auto'>
              <FormField
                control={form.control}
                name='keyword'
                render={({ field }) => (
                  <FormItem className='md:mx-2'>
                    <FormControl>
                      <Input type='text' placeholder='Search...' className='flex-1 sm:w-120' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit' className='w-full md:w-auto'>
              <Search className='mx-auto h-4 w-4' />
            </Button>
          </div>
        </form>
      </Form>

      <div className='container mx-auto p-4 md:p-8'>
        <p className='text-3xl font-bold'>Top Related</p>
        <PreviewCardList results={Profiles} />
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
