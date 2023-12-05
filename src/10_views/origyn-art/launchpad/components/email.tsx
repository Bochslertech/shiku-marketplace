import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';
import { cn } from '@/02_common/cn';
import { isEmail } from '@/02_common/data/email';
import { origynArtRegisterEmail } from '@/05_utils/apis/yumi/origyn-art';
import message from '@/09_components/message';
import YumiIcon from '@/09_components/ui/yumi-icon';

function OrigynArtEmail() {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const onChange = ({ target: { value } }) => {
        setEmail(value);
    };

    const [subscribing, setSubscribing] = useState(false);
    const onSubscribe = () => {
        if (subscribing) return; // 防止重复点击
        if (!isEmail(email)) {
            message.error('Invalid email address');
            return;
        }
        setSubscribing(true);
        origynArtRegisterEmail(email)
            .then(() => {
                setEmail('');
                message.success('Successful');
            })
            .catch(() => message.error('Please try again.'))
            .finally(() => setSubscribing(false));
    };
    return (
        <div className="bg-[#0C150D] md:h-[182px]">
            <div className="mx-auto flex h-full w-full flex-col items-center md:w-[1200px] md:flex-row">
                <p className="mt-5 flex h-full w-full items-center justify-center font-[Inter-Bold] text-[24px] text-[#fff] md:ml-5 md:mt-0 md:w-7/12 md:justify-start md:text-[50px]">
                    {t('owned.search.title')}
                </p>
                <div className="mb-5 mt-3 flex h-[40px] w-full items-center px-5 text-[#fff] md:mr-5 md:mt-0 md:h-[48px] md:w-5/12 md:px-0">
                    <div className="flex h-full w-full border-b border-[#ddd]/60">
                        <input
                            placeholder={t('owned.search.placeholder')}
                            type="text"
                            className="flex flex-1 bg-transparent text-[14px] text-[#fff] outline-none placeholder:text-[#ddd]/60"
                            onChange={onChange}
                            value={email}
                        />
                        <p
                            onClick={onSubscribe}
                            className={cn([
                                'flex items-center text-[16px] text-[#fff]',
                                !subscribing && 'cursor-pointer',
                            ])}
                        >
                            {t('owned.search.subscribe')}
                            {!subscribing && (
                                <YumiIcon name="arrow-right" size={18} className="ml-[10px]" />
                            )}
                            {subscribing && <LoadingOutlined className="ml-[10px]" />}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrigynArtEmail;
