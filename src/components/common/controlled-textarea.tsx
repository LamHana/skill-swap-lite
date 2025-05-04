import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';

import { ControlledItemsProps } from './controlled-input';

const ControlledTextarea = ({
  form,
  name,
  label,
  placeholder,
  description,
  required = false,
}: ControlledItemsProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className='text-primary'>*</span>}
          </FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} className='resize-none' {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ControlledTextarea;
