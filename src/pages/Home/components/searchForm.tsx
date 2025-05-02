import MultipleSelector, { Option } from '@/components/common/multi-select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CategoryWithSkills } from '@/types/skill.type';

import { Search } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface SearchFormProps {
  categories: CategoryWithSkills[];
  setSearchIDs: Dispatch<SetStateAction<string[] | null>>;
}

interface FormValues {
  keyword: string;
  category: string[];
}

const searchFormDefaultValues: FormValues = {
  keyword: '',
  category: [],
};

const SearchForm = ({ categories, setSearchIDs }: SearchFormProps) => {
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

  const form = useForm({ defaultValues: { ...searchFormDefaultValues } });

  const mapValuesToOptions = (values: string[]) =>
    values.map((v) => categoryOptions.find((o) => o.value === v) || { label: v, value: v });

  useEffect(() => {
    if (categories) {
      setCategoryOptions(categories.map((category) => ({ label: category.category, value: category.category })));
    }
  }, [categories]);

  const onSubmit = (e: any) => {
    if (e.keyword.length === 0 && e.category.length === 0) {
      setSearchIDs(null);
      return;
    }
    const IDs: string[] = [];
    if (e.category.length === 0) {
      categories.filter((category) =>
        category.skills.forEach(
          (skill) => skill.name.toLowerCase().includes(e.keyword.toLowerCase()) && IDs.push(skill.id),
        ),
      );
    } else if (e.keyword.length === 0) {
      categories.filter(
        (category) => e.category.includes(category.category) && category.skills.forEach((skill) => IDs.push(skill.id)),
      );
    } else {
      categories.filter(
        (category) =>
          e.category.includes(category.category) &&
          category.skills.forEach(
            (skill) => skill.name.toLowerCase().includes(e.keyword.toLowerCase()) && IDs.push(skill.id),
          ),
      );
    }
    setSearchIDs(IDs);
  };

  const handleCategoryChange = (options: Option[]) => {
    form.setValue(
      'category',
      options.map((o) => o.value),
    );
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full px-4 md:px-0 md:max-w-3xl mx-auto'>
          <div className='flex flex-col md:flex-row items-center gap-3 md:gap-2'>
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='w-full md:flex-1'>
                  <FormControl>
                    <MultipleSelector
                      value={mapValuesToOptions(field.value)}
                      onChange={handleCategoryChange}
                      options={categoryOptions}
                      placeholder='Select categories'
                      emptyIndicator={
                        <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                          No results found
                        </p>
                      }
                    />
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
    </>
  );
};

export default SearchForm;
