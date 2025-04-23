import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '../ui/extension/multi-select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ControlledItemsProps } from './controlled-input';

interface ControlledMultiSelectorProps extends ControlledItemsProps {
  data: any[];
}

const ControlledMultiSelector = ({
  form,
  name,
  label,
  placeholder,
  description,
  data,
}: ControlledMultiSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultiSelector onValuesChange={field.onChange} values={field.value}>
              <MultiSelectorTrigger>
                <MultiSelectorInput placeholder={placeholder} />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {data.map((data) => (
                    <MultiSelectorItem key={data.name} value={data.name}>
                      <span>{data.name}</span>
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ControlledMultiSelector;
