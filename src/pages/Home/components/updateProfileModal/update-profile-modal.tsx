import { LoadingButton } from '@/components/common/loading-button';
import MultipleSelector, { Option } from '@/components/common/multi-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { patchUser } from '@/contexts/auth/auth.reducer';
import { useAuth } from '@/hooks';
import { useSkillValidation } from '@/hooks/useSkillValidation';
import { GET_SKILLS_QUERY_KEY, getSkills } from '@/services/skill.service';
import { getUserByUID, updateUser } from '@/services/user.service';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { updateProfileSchema } from './update-profile-modal.schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

const defaultValues: UpdateProfileFormData = {
  learnSkills: [],
  teachSkills: [],
};

interface UpdateProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export const UpdateProfileModal = ({ open, onOpenChange, userId }: UpdateProfileModalProps) => {
  const [skillOptions, setSkillOptions] = useState<Option[]>([]);
  const { dispatch } = useAuth();
  const { validateSkills, getFilteredOptions } = useSkillValidation();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  const { learnSkills, teachSkills } = form.watch();

  const { data: skills } = useQuery({
    queryKey: [GET_SKILLS_QUERY_KEY],
    queryFn: getSkills,
  });

  useEffect(() => {
    if (skills) {
      setSkillOptions(skills.map((skill) => ({ label: skill.name, value: skill.id.toString() })));
    }
  }, [skills]);

  const mapValuesToOptions = (values: string[]) =>
    values.map((v) => skillOptions.find((o) => o.value === v) || { label: v, value: v });

  const getAvailableOptions = (excludeValues: string[]) =>
    getFilteredOptions(skillOptions, mapValuesToOptions(excludeValues));

  const handleSkillsChange = (field: 'learnSkills' | 'teachSkills', options: Option[]) => {
    const currentOppositeSkills =
      field === 'learnSkills' ? mapValuesToOptions(teachSkills) : mapValuesToOptions(learnSkills);

    const validation = validateSkills(
      field === 'learnSkills' ? currentOppositeSkills : options,
      field === 'learnSkills' ? options : currentOppositeSkills,
    );

    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const filteredOptions = options.filter(
      (option) => !currentOppositeSkills.some((skill) => skill.value === option.value),
    );

    form.setValue(
      field,
      filteredOptions.map((o) => o.value),
    );
  };

  const { mutate: updateUserSkills, isPending } = useMutation({
    mutationFn: (data: UpdateProfileFormData) =>
      updateUser(userId, {
        learn: data.learnSkills,
        teach: data.teachSkills,
      }),
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    updateUserSkills(data, {
      onSuccess: async () => {
        onOpenChange(false);
        toast.success('Profile updated successfully');
        form.reset();
        const user = await getUserByUID(userId);

        dispatch(patchUser({ user }));
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='learnSkills'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills you want to learn</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={mapValuesToOptions(field.value)}
                      onChange={(options) => handleSkillsChange('learnSkills', options)}
                      options={getAvailableOptions(teachSkills)}
                      placeholder='Select skills you want to learn...'
                      emptyIndicator={
                        <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                          No results found
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='teachSkills'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills you want to teach</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={mapValuesToOptions(field.value)}
                      onChange={(options) => handleSkillsChange('teachSkills', options)}
                      options={getAvailableOptions(learnSkills)}
                      placeholder='Select skills you want to teach...'
                      emptyIndicator={
                        <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                          No results found
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton type='submit' className='w-full' loading={isPending}>
              Complete Profile
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
