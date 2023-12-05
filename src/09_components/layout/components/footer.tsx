import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isEmail } from '@/02_common/data/email';
import { subscribeEmail } from '@/05_utils/canisters/yumi/core';
import YumiIcon from '@/09_components/ui/yumi-icon';
import { Form, FormControl, FormField, FormItem } from '../../data/form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const FormSchema = z.object({
    // email: z.string().refine(isEmail, {
    //     message: 'Invalid email address',
    // }),
    email: z.string(),
});

type TextLink = { text: string; link: string };
type TextArray = Array<TextLink>;

const exploreArr: TextArray = [
    { text: 'Launchpad', link: '/launchpad' },
    { text: 'Explore', link: '/explore' },
    { text: 'Art', link: '/explore/art' },
    { text: 'Co-owned', link: '/origyn' },
    { text: 'OAT', link: '/explore/oat' },
    { text: 'My Account', link: '/profile' },
    { text: 'Yumi Space', link: 'https://minigames.shiku.com/one/until/yumiscene.html' },
];

const resourcesArr = [
    {
        text: 'User Guide',
        link: 'https://yuminftmarketplace.gitbook.io/yumi-docs/creating/collaboration-with-yumi',
    },
    {
        text: 'Publish on Yumi',
        link: 'https://yuminftmarketplace.gitbook.io/yumi-docs/creating/collaboration-with-yumi',
    },
    {
        text: 'Developers',
        link: 'https://yuminftmarketplace.gitbook.io/yumi-docs/developers/technical-support',
    },
    { text: 'FAQ', link: 'https://yuminftmarketplace.gitbook.io/yumi-docs/faq/what-is-nft' },
    { text: 'Announcements', link: '/announcements' },
];

const legalArr = [
    {
        text: 'Terms of Service',
        link: 'https://yuminftmarketplace.gitbook.io/yumi-docs/legal/terms-of-service',
    },
    {
        text: 'Privacy Policy',
        link: 'https://yuminftmarketplace.gitbook.io/yumi-docs/legal/privacy-policy',
    },
];

const companyArr = [
    {
        text: 'Careers',
        link: 'https://yuminftmarketplace.gitbook.io/yumi-docs/careers/careers-on-yumi',
    },
    { text: 'Contact Us', link: '/art/apply' },
];

const links = [
    {
        label: 'twitter',
        link: 'https://twitter.com/YumiMarketplace',
    },
    {
        label: 'medium',
        link: 'https://medium.com/@YumiMarketplace',
    },
    {
        label: 'discord',
        link: 'https://discord.com/invite/x239m2dx6j',
    },
    {
        label: 'dscvr',
        link: 'https://h5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app/u/yumi_marketplace',
    },
    {
        label: 'distrikt',
        link: 'https://az5sd-cqaaa-aaaae-aaarq-cai.ic0.app/u/yumi',
    },
    {
        label: 'instagram',
        link: 'https://www.instagram.com/yumimarketplace/',
    },
    {
        label: 'youtube',
        link: 'https://www.youtube.com/@yumimarketplace',
    },
    {
        label: 'tiktok',
        link: 'https://www.tiktok.com/@yumimarketplace',
    },
];

export default function Footer() {
    const { t } = useTranslation();
    const form = useForm<{ email: string }>({
        resolver: zodResolver(FormSchema),
    });
    const location = useLocation();

    const [subscribing, setSubscribing] = useState(false);
    const onSubmit = (data: { email: string }) => {
        if (subscribing) return; // 防止重复点击
        const { email } = data;
        if (!isEmail(email)) {
            message.error('Invalid email address');
            return;
        }
        setSubscribing(true);
        subscribeEmail(email)
            .then(() => {
                form.reset({ email: '' });
                message.success('Email submitted');
            })
            .catch(() => message.success('Subscribe failed'))
            .finally(() => setSubscribing(false));
    };
    return (
        <div
            className={`z-0 mt-[30px] border-t border-gray-950/[.1] px-[19px] pb-10  md:mt-[78px] md:px-[119px] ${
                location && location.pathname === '/kyc/register' && 'hidden'
            }`}
        >
            <div
                className={`mx-auto mt-[30px] flex w-full  max-w-[1920px] flex-col flex-wrap justify-between md:mt-[90px] md:flex-row ${
                    ['/origyn', '/origyn/launchpad', '/origyn/market'].includes(
                        location.pathname,
                    ) && '!mt-0'
                }`}
            >
                <div className="w-full flex-1 flex-col md:flex">
                    <div className="mb-[20px] grid grid-cols-4 justify-between font-inter-medium text-[12px] md:mb-[35px] md:text-[14px] ">
                        <div>{t('home.footer.explore')}</div>
                        <div>{t('home.footer.resources')}</div>
                        <div>{t('home.footer.legal')}</div>
                        <div>{t('home.footer.company')}</div>
                    </div>
                    <div className="grid grid-cols-4 text-[10px] leading-[16px] text-gray-950/60 md:text-[12px] ">
                        <div className="flex flex-col gap-y-[15px] md:gap-y-[24px]">
                            {exploreArr.map((item) => (
                                <Link
                                    className="origin-left scale-75 cursor-pointer whitespace-nowrap text-[12px] hover:font-inter-bold hover:font-bold md:scale-100 md:text-[14px]"
                                    key={item.text}
                                    to={item.link}
                                    target={item.link.startsWith('https://') ? '_blank' : '_self'}
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-y-[15px] md:gap-y-[24px]">
                            {resourcesArr.map((item) => (
                                <Link
                                    className="origin-left scale-75 cursor-pointer whitespace-nowrap text-[12px] hover:font-inter-bold hover:font-bold md:scale-100 md:text-[14px]"
                                    key={item.text}
                                    to={item.link}
                                    target={item.link.startsWith('https://') ? '_blank' : '_self'}
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-y-[15px] md:gap-y-[24px]">
                            {legalArr.map((item) => (
                                <Link
                                    className="w-full origin-left scale-75 cursor-pointer whitespace-nowrap text-[12px] hover:font-inter-bold hover:font-bold md:scale-100 md:text-[14px]"
                                    key={item.text}
                                    to={item.link}
                                    target={item.link.startsWith('https://') ? '_blank' : '_self'}
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-y-[15px] md:gap-y-[24px]">
                            {companyArr.map((item) => (
                                <Link
                                    className="origin-left scale-75 cursor-pointer whitespace-nowrap text-[12px] hover:font-inter-bold hover:font-bold md:scale-100 md:text-[14px]"
                                    key={item.text}
                                    to={item.link}
                                    target={item.link.startsWith('https://') ? '_blank' : '_self'}
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-3 flex w-full flex-col md:mt-0 md:w-[272px] lg:w-[340px]">
                    <div className="mt-5 font-inter-medium text-[14px] md:mt-0">
                        {t('home.footer.newsletter')}
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mb-[30px] mt-[20px] flex w-full items-center md:mb-[50px] md:w-[272px] lg:w-[340px]"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="flex flex-1">
                                        <FormControl>
                                            <Input
                                                placeholder={t('home.footer.email')}
                                                className="h-[40px] rounded-[6px] rounded-r-none border-r-0 border-solid border-gray-300 bg-white px-[11px] py-[4px] text-[14px] placeholder:text-[#0006] focus:border-black focus-visible:ring-white"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="flex h-[40px] items-center justify-center rounded-lg rounded-l-none bg-black text-[16px] font-semibold text-white"
                            >
                                {t('home.footer.signUp')}
                            </Button>
                        </form>
                    </Form>
                    <div className="flex w-full items-center">
                        {links.map((item) => (
                            <Link
                                className="mr-[25px] cursor-pointer hover:font-bold"
                                key={item.label}
                                to={item.link}
                                target={item.link.startsWith('https://') ? '_blank' : '_self'}
                            >
                                <YumiIcon
                                    name={`media-${item.label}`}
                                    size={18}
                                    color="black"
                                    className="cursor-pointer transition-opacity hover:opacity-50"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="mt-[50px] w-full text-[12px] text-[#000]/60">
                    Copyright © 2023 Yumi
                </div>
            </div>
        </div>
    );
}
