import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

export interface ControlledItemsProps {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
}

const ControlledInput = ({ form, name, label, placeholder, description }: ControlledItemsProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ControlledInput;
