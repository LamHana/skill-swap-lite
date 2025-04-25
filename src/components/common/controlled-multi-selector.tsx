import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ControlledItemsProps } from './controlled-input';
import MultipleSelector, { Option } from './multi-select';

interface ControlledMultiSelectorProps extends ControlledItemsProps {
  data: any[];
  current: any[];
  handleChange: (options: Option[]) => void;
}

const ControlledMultiSelector = ({
  form,
  name,
  label,
  placeholder,
  description,
  required = false,
  data,
  current,
  handleChange,
}: ControlledMultiSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const currentValue = field.value.map((v: any) => current.find((o) => o.value === v) || { label: v, value: v });
        return (
          <FormItem>
            <FormLabel>
              {label} {required && <span className='text-primary'>*</span>}
            </FormLabel>
            <FormControl>
              <MultipleSelector
                value={currentValue}
                onChange={handleChange}
                options={data}
                placeholder={placeholder}
                emptyIndicator={
                  <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>No results found</p>
                }
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ControlledMultiSelector;
