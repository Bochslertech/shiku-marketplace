import { Select } from 'antd';
import { cn } from '@/02_common/cn';
import { IconDirectionDownSelect } from '../../icons';
import './antd-edit.less';

const { Option } = Select;

export type FilterSelectOption<T> = {
    value: T;
    label: string;
    disabled?: boolean;
};

const FilterSelect = <T extends string>({
    defaultValue,
    options,
    setOption,
    className,
}: {
    defaultValue: T;
    options: FilterSelectOption<T>[];
    setOption: (option: T) => void;
    className?: string;
}) => {
    const onChange = (option: T) => setOption(option);
    return (
        <Select
            className={cn(
                'h-[46px] w-full overflow-hidden rounded-[8px] border border-transparent bg-[#191e2e] outline-none hover:border-[#ccc] md:mt-0 md:w-3/12',
                className,
            )}
            defaultValue={defaultValue}
            placement="bottomRight"
            onChange={onChange}
            bordered={false}
            virtual={true}
            popupClassName="pop-up"
            suffixIcon={<IconDirectionDownSelect />}
        >
            {options.map((option) => (
                <Option
                    key={option.value}
                    className="flex h-[40px] w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#191e2e] px-[38px] py-[15px] font-inter-medium "
                    value={option.value}
                    label={option.label}
                >
                    <div className="mr-[15px] font-inter-medium  text-[12px] font-medium text-[#393838] md:text-[14px]">
                        {option.label}
                    </div>
                </Option>
            ))}
        </Select>
    );
};

export default FilterSelect;
