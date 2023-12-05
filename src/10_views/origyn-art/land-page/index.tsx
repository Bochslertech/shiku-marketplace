import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { isEmail } from '@/02_common/data/email';
import { origynArtRegisterEmail } from '@/04_apis/yumi/origyn-art';
import OrigynArtCountdownRenderer from '@/09_components/countdown/origyn-art-land-page';
import { Form, FormControl, FormField, FormItem } from '@/09_components/data/form';
import message from '@/09_components/message';
import { Button } from '@/09_components/ui/button';

const FormSchema = z.object({
    // email: z.string().refine(isEmail, {
    //     message: 'Invalid email address',
    // }),
    email: z.string(),
});
function OrigynArtLandPage() {
    const { t } = useTranslation();
    const [tab, setTab] = useState<'JULIAN OPIE' | 'FAQ' | 'GUIDE'>('JULIAN OPIE');
    const form1 = useForm<{ email: string }>({
        resolver: zodResolver(FormSchema),
    });
    const form2 = useForm<{ email: string }>({
        resolver: zodResolver(FormSchema),
    });
    const [subscribing, setSubscribing] = useState(false);
    // tab改变就到top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [tab]);

    const onSubmit = (data: { email: string }) => {
        if (subscribing) return; // 防止重复点击
        const { email } = data;
        if (!isEmail(email)) {
            message.error('Invalid email address');
            return;
        }
        message.loading('Subscribing...');
        setSubscribing(true);
        origynArtRegisterEmail(email)
            .then(() => {
                message.destroy();
                message.success('Successful');
            })
            .catch(() => message.error('Please try again.'))
            .finally(() => setSubscribing(false));
    };

    return (
        <div className="min-h-screen w-full bg-[#171b18] font-montserrat text-[#FEFEFE]">
            <div className="px-[20px] text-[14px] md:px-[60px] xl:px-[120px]">
                <div className="mx-auto flex max-w-[1200px] justify-center border-b border-white/30  py-[24px]  text-[#fff9] md:py-[26px]">
                    <div className="flex w-full justify-between font-semibold tracking-[6px] md:w-1/2">
                        <div
                            className={cn(
                                'cursor-pointer',
                                tab === 'JULIAN OPIE' && '!text-[#fff]',
                            )}
                            onClick={() => {
                                setTab('JULIAN OPIE');
                            }}
                        >
                            {' '}
                            {t('owned.land.tab.julian')}
                        </div>
                        <div
                            className={cn('cursor-pointer', tab === 'FAQ' && '!text-[#fff]')}
                            onClick={() => {
                                setTab('FAQ');
                            }}
                        >
                            {t('owned.land.tab.faq')}
                        </div>
                        <div
                            className={cn('cursor-pointer', tab === 'GUIDE' && '!text-[#fff]')}
                            onClick={() => {
                                setTab('GUIDE');
                            }}
                        >
                            {t('owned.land.tab.guide')}
                        </div>
                    </div>
                </div>
            </div>
            {tab === 'JULIAN OPIE' && (
                <>
                    <div className="mt-[60px] md:mt-[100px]">
                        <div className="flex flex-col items-center justify-center gap-x-[80px] px-[20px] md:flex-row">
                            <div className="flex w-full flex-col gap-y-[10px]  md:w-auto">
                                <div className="text-center font-montserrat-bold text-[18px] uppercase leading-tight tracking-[8px] md:text-[24px]">
                                    OWN A UNIQUE <br /> PIECE OF
                                </div>
                                <div className="mt-[20px] text-center font-montserrat-extrabold text-[80px] uppercase leading-[90px] tracking-[3px] text-[] md:mt-0 md:text-[120px] md:leading-[120px]">
                                    Julian <br></br> OPIE
                                </div>
                            </div>
                            <img
                                src={cdn(
                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669630828531_land-page-banner.png',
                                )}
                                className="mt-[50px] h-[500px] md:mt-0 md:h-[566px] "
                                alt=""
                            />
                        </div>
                        <div className="mt-[55px] flex flex-col-reverse items-center justify-center gap-x-[80px] md:mt-[95px] md:flex-row">
                            <div className="mt-[50px] flex w-full flex-col gap-y-[10px] px-[20px] text-[24px] font-semibold md:mt-0  md:w-[474px] md:px-0 ">
                                <div className="text-center text-[24px] leading-tight tracking-widest">
                                    For the First Time in History, Become a Co-Owner of a Physical
                                    Artwork Powered by NFT.
                                </div>
                                <div className="text-center text-[16px] font-light leading-[30px] text-[#fff9]">
                                    This collection consists of{' '}
                                    <span className="font-semibold">1,000 NFTs</span>, each NFT
                                    representing a unique piece of the physical artwork and
                                    identified by coordinates and ID
                                </div>
                            </div>
                            <div className="flex w-[80%] flex-col  gap-y-[10px]  text-[24px] md:w-[415px] md:border-l md:pl-[20px]  ">
                                <div className="text-center text-[20px] font-semibold italic leading-tight tracking-[-1px] md:text-left md:text-[24px]">
                                    Suzanne walking in leather skirt. 3, 2008
                                </div>
                                <div className="mt-[20px] text-center text-[14px] font-light leading-normal text-[#fff9] md:mt-0  md:text-left md:text-[16px] md:leading-[30px]">
                                    Julian OPIE (b. 1958) <br />
                                    Vinyl on wooden strecher <br />
                                    222 x 110,3 cm | 87 x 43 in. <br />
                                    Stored in a secured vault in Switzerland
                                </div>
                            </div>
                        </div>
                        <div className="mx-auto mt-[20px] flex max-w-[1000px] flex-col items-center justify-between gap-x-[40px] md:mt-[95px] md:flex-row">
                            <div className="flex flex-col items-center gap-y-[10px] text-[24px] ">
                                <img
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669630828528_land-page-art-1.png',
                                    )}
                                    alt=""
                                />
                                <div className="text-[10px]">Reverse</div>
                            </div>
                            <div className="flex flex-col items-center gap-y-[10px] text-[24px] ">
                                <img
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669630828526_land-page-art-2.png',
                                    )}
                                    alt=""
                                />
                                <div className="text-[10px]">Signature</div>
                            </div>
                            <div className="flex flex-col items-center gap-y-[10px] text-[24px] ">
                                <img
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669630828515_land-page-art-3.png',
                                    )}
                                    alt=""
                                />
                                <div className="text-[10px]">Detail</div>
                            </div>
                        </div>
                        <div className="mx-auto mt-[42px] flex max-w-[900px] items-center justify-center pb-[36px] md:mt-[95px] md:pb-[90px]">
                            <div className="font-italic w-full px-[20px]  text-[14px] font-normal leading-[22px] md:w-full md:px-0">
                                Suzanne Walking in Leather Skirt is from a body of Julian Opie’s
                                work that serves a close relationship to two works commissioned
                                through the ICA/Boston’s Vita Brevis program launched in 1998. In
                                October 2005, the ICA unveiled two walking portraits by Opie,
                                including Suzanne Walking, which served as “ambassadors” for the new
                                ICA building.
                                <br />
                                <br />
                                This work in vinyl, painted in 2008, depicts a figure moving with
                                lightness and grace, unceasingly, as in a perpetual and cyclical
                                movement. It exemplifies Opie’s signature style of reducing figures
                                and shapes to their most essential outlines using a black line
                                filled with a strong, clear blue color echoing the language of signs
                                and symbols. Amazingly, it is a poignant example of the distinctive
                                style Opie would develop throughout the years.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center bg-white px-[20px] py-[60px] text-[#0B140C] md:px-0  md:py-[90px]">
                        <div className="text-center text-[18px]  font-bold uppercase tracking-[9px] md:text-[20px] ">
                            Sale starts in
                        </div>
                        <div className="mt-[19px] text-center text-[14px] leading-[22px] ">
                            For the first time in history, own a fractionalized piece of a physical
                            artwork by Julian Opie. Powered by NFTs.
                        </div>
                        <div className="mt-[30px] md:mt-[41px]">
                            {' '}
                            <Countdown
                                date={Date.now()}
                                renderer={(params) =>
                                    OrigynArtCountdownRenderer(params, 'text-black')
                                }
                            />
                        </div>
                        <div className="mb-[30px] mt-[20px] flex items-center md:mb-[50px] md:mt-[81px]">
                            <Form {...form1}>
                                <form
                                    onSubmit={form1.handleSubmit(onSubmit)}
                                    className=" flex w-full items-center py-[2px]"
                                >
                                    <FormField
                                        control={form1.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-1">
                                                <FormControl>
                                                    <input
                                                        placeholder={t('owned.land.email')}
                                                        className="h-[56px] w-[232px] flex-1 rounded-none  rounded-r-none border border-r-0 border-solid  border-black  bg-white px-[11px] py-[16px] pl-[24px] pr-[24px] text-[14px] text-black outline-none placeholder:text-[#0006] focus:outline-none focus:ring-0 focus-visible:ring-0 md:w-[252px] md:pr-[53px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="flex h-[56px] items-center justify-center rounded-none bg-black px-[16px] py-[16px] font-inter text-[14px] font-semibold text-white md:px-[24px] md:text-[16px]"
                                    >
                                        {t('owned.land.stayTuned')}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                    <div className="flex w-full flex-col items-start justify-between bg-[#F8F8F4] px-[20px] py-[60px]  text-[#171B18] md:w-auto md:flex-row md:px-[155px]  md:py-[126px]">
                        <div className="text-[20px] font-bold leading-[1.9]">
                            <div className="text-[45px] leading-[70px] md:text-[80px] md:leading-[90px]">
                                {' '}
                                Julian Opie
                            </div>
                            <div className="text-[24px] leading-[30px]"> (b. 1958)</div>
                            <div className="mt-[20px] text-[18px] leading-[35px] md:text-[24px]">
                                The British sculptor and digital artist
                            </div>
                        </div>
                        <div className="w-full font-inter text-[14px] leading-[22px] md:w-1/2">
                            Since the onset of his career, Julian Opie began painting, sculpting,
                            filming, and making installations in public spaces. By using the city as
                            his personal canvas, he was able to develop his distinctive aesthetic of
                            bold lines and bright solid colors. Today his work can be found in many
                            cities throughout the world.
                            <br />
                            <br />
                            In addition to the public space installations, Opie enjoys creating
                            depictions of well-known personalities. To name only one, he created the
                            award-winning cover of the Britpop band Blur's successful album: Blur:
                            The Best Of (2000), whose print series is now on display at the National
                            Portrait Gallery.
                            <br />
                            <br />
                            Julian Opie is one of the most well-known contemporary British artists.
                            Born in London in 1958, he graduated from the Goldsmith's School of Art
                            in 1983. He currently lives and works in London.
                            <br />
                            <br />
                            His works can be found in the collections of many public institutions
                            throughout the world, including Tate, the National Portrait Gallery, the
                            Victoria and Albert Museum and the British Museum in London, The Israel
                            Museum in Jerusalem, the Kunsthaus Bregenz in Austria, the Kunsthaus
                            Zürich, Switzerland, the Neue Galerie Sammlung Ludwig in Aachen, the
                            Stedelijk Museum in Amsterdam, the National Museum of Art in Osaka, the
                            Museum of Modern Art in New York and also in the MOCAK Collection, and
                            Museum of Contemporary Art Krakow.
                        </div>
                    </div>
                    <div className="flex flex-col items-center px-[20px] py-[60px] md:px-[150px] md:py-[120px] xl:px-[300px]">
                        <div className="hidden text-center text-[24px] font-bold uppercase leading-[40px] tracking-[10px] md:block">
                            How to become <br /> an owner
                        </div>

                        <div className="mt-[50px] flex w-full flex-col gap-x-[37px] md:mt-[60px] md:grid md:grid-cols-2 md:grid-rows-2">
                            <div className="gap-y-[10px] border-t border-gray-300 py-[17px] text-[16px]  leading-[30px] ">
                                <div className="font-bold">
                                    How many pieces in total will there be?
                                </div>
                                <div>There will be 1,000 pieces.</div>
                            </div>
                            <div className="gap-y-[10px] border-t border-gray-300 py-[17px] ">
                                <div className="font-bold">Can we buy several pieces at once?</div>
                                <div> Yes, you can buy a bundle of 2 or 5 NFTs.</div>
                            </div>
                            <div className="flex flex-col gap-y-[10px] border-t border-gray-300 py-[17px] ">
                                <div className="font-bold">How much will a piece cost?</div>
                                <div>
                                    {' '}
                                    A piece is 35 ICP (approx. US$ 150 including fees), the amount
                                    will be charged in ICP, the final price is subject to the price
                                    of ICP on the day of purchase.
                                </div>
                            </div>
                            <div className="gap-y-[10px] border-t border-gray-300 py-[17px] ">
                                <div className="font-bold">When will I receive my NFT? </div>
                                <div>
                                    You will receive your NFT when 100% of the portions are sold.
                                </div>
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                setTab('FAQ');
                            }}
                            className="mt-[10px] w-full  cursor-pointer bg-white px-[24px] py-[16px] text-center text-[14px] font-bold text-[#151515]  md:w-auto"
                        >
                            More information in our FAQ
                        </div>
                        <div className="mt-[65px] flex flex-col items-end justify-center gap-x-[122px] md:mt-[100px]  md:flex-row">
                            <img
                                src={cdn(
                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/primary-sale-intro.png',
                                )}
                                className="h-fit w-full md:w-1/3"
                                alt=""
                            />

                            <div className="mt-[43.6px] flex-1 md:mt-0">
                                <div className="text-[24px] font-bold leading-[38px] tracking-tighter ">
                                    About ORIGYN
                                </div>
                                <div className="mt-[24px] text-[14px] leading-[22px]">
                                    ORIGYN creates powerful biometric digital certificates that
                                    prove authenticity, identity and ownership of valuable objects
                                    and secure their data forever.{' '}
                                </div>
                                <br />
                                <div className="text-[14px] leading-[22px]">
                                    ORIGYN's digital certification technology establishes an
                                    irrefutable connection between a physical asset such as fine
                                    art, luxury watches or jewelry and a digital certificate. In the
                                    art industry, this helps to diminish acts of forgery or other
                                    misrepresentations, serves as a trusted seal for archiving
                                    documentation regarding authenticity, provenance and transfer of
                                    ownership and benefits artists through copyright and resale
                                    royalties, as well as enables a new dimension of co-ownership in
                                    the art market.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center bg-white px-[20px] py-[60px] text-[#151515]  md:px-[122px]  md:py-[95px]">
                        <div className="text-center  text-[20px] font-bold uppercase tracking-[9px] ">
                            As seen on
                        </div>
                        <div className="mt-[42px] flex w-full flex-col justify-between gap-y-[46px] md:flex-row md:gap-y-0 ">
                            <div className="flex items-center justify-center ">
                                <img
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669631375778_land-page-brand-1.png',
                                    )}
                                    className="h-[40px]"
                                    alt=""
                                />
                            </div>
                            <div className="flex items-center justify-center ">
                                <img
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669631375779_land-page-brand-2.png',
                                    )}
                                    alt=""
                                    className="h-[60px]"
                                />
                            </div>
                            <div className="flex items-center justify-center ">
                                <img
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669631375780_land-page-brand-3.png',
                                    )}
                                    alt=""
                                    className="h-[40px]"
                                />
                            </div>
                            <div className="flex items-center justify-center ">
                                <img
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669631375781_land-page-brand-4.png',
                                    )}
                                    alt=""
                                    className="h-[45px]"
                                />
                            </div>
                            <div className="flex items-center justify-center ">
                                <img
                                    src={cdn(
                                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669631375776_land-page-brand-5.png',
                                    )}
                                    alt=""
                                    className="h-[55px]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center bg-[#0B140C]  px-[20px] py-[60px]   text-white md:px-0   md:py-[90px]">
                        <div className="text-center text-[18px]  font-bold uppercase tracking-[9px] md:text-[20px] ">
                            Sale starts in
                        </div>
                        <div className="mt-[19px] text-center text-[14px] leading-[22px] ">
                            For the first time in history, own a fractionalized piece of a physical
                            artwork by Julian Opie. Powered by NFTs.
                        </div>
                        <div className="mt-[30px] md:mt-[41px]">
                            {' '}
                            <Countdown date={Date.now()} renderer={OrigynArtCountdownRenderer} />
                        </div>
                        <div className="mb-[30px] mt-[20px] flex items-center md:mb-[50px] md:mt-[81px]">
                            <Form {...form2}>
                                <form
                                    onSubmit={form2.handleSubmit(onSubmit)}
                                    className=" flex w-full items-center py-[2px]"
                                >
                                    <FormField
                                        control={form2.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-1">
                                                <FormControl>
                                                    <input
                                                        placeholder={t('owned.land.email')}
                                                        className="h-[56px] w-[232px] flex-1 rounded-none border-r-0  border-solid  border-gray-300  bg-[#171B18]  px-[11px] py-[16px]  pl-[24px] pr-[24px] text-[14px]  text-white outline-none  placeholder:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 md:w-[252px] md:pr-[53px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="flex h-[56px] items-center justify-center rounded-none bg-white px-[16px] py-[16px] font-inter text-[16px] font-semibold text-black hover:bg-white hover:opacity-60 md:px-[24px] "
                                    >
                                        {t('owned.land.stayTuned')}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </>
            )}
            {tab === 'FAQ' && (
                <div className="mx-auto flex max-w-[800px] flex-col px-[20px] py-[20px] font-montserrat ">
                    <div className="mt-[40px] flex flex-col">
                        <div className="font-montserrat-extrabold  text-[90px] leading-[120px]">
                            FAQ
                        </div>
                        <div className="mt-[20px] text-[24px] leading-[30px] ">
                            Specific to Julian Opie
                        </div>
                        <div className="mt-[40px] text-[18px] font-light leading-[30px] ">
                            *All questions are valid for any future sale. However answers will vary
                            depending on the work and the offer model.
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                How many pieces in total will there be?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                There will be 1,000 pieces.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                Can we buy several pieces at once?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Yes, you can buy a bundle between 1 to 100 NFTs.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                When will I receive my NFT?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                You will receive your NFT when either 100% of the fractions are sold
                                or US$150K in value sold, given the daily ICP price.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px] flex flex-col">
                        <div className="font-montserrat-extrabold text-[90px] leading-[120px]">
                            FAQ
                        </div>
                        <div className="mt-[20px] text-[24px] font-light leading-[30px] ">
                            General
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                Who can participate in the sale?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Anyone can participate in the sale. The purpose of Yumi is to make
                                co-ownership of valuable artworks available to a broader and wider
                                group of collectors.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What are NFT pieces or lots?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Pieces are the resulting NFTs (sub-NFTs) created by dividing an
                                ORIGYN Digital Certificate, which can be sold for co-ownership by
                                the Yumi marketplace.
                                <br />
                                Lots are groupings of NFT pieces.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What is the ORIGYN certificate?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                The ORIGYN Digital Certificate proves the authenticity, identity,
                                and ownership of valuable objects and stores their data forever on
                                the blockchain.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What is the Yumi marketplace?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Yumi is a high-speed, low-cost, and fully decentralized NFT
                                marketplace built on Internet Computer (IC) that enables artists,
                                galleries, and collectors—who have legal title to their artworks—to
                                buy and sell art or pieces of it.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                How and when will I know if my purchase is final?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                A sale will only be final if either 100% of the pieces are sold or
                                US$150K in value sold, given the daily ICP price, in a period of 120
                                days. If such a limit is not reached by the platform, all sales will
                                be reimbursed to buyers with ICP.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                Can I buy the totality of the pieces if I’m not interested in
                                co-ownership?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                The Yumi peer-to-peer marketplace allows buyers to purchase the
                                totality of the physical artwork by making an offer at any time via
                                the platform. The co-owners of such artwork have the right to accept
                                or reject this offer via governing votes. Stay tuned to Yumi for
                                more information to come on governance, this feature will be
                                available in 2023/2024.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What are the duties and responsibilities of co-owners of an artwork?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                To have clear and legal title to their property, to actively
                                participate in the decision-making processes by executing their
                                right to vote, and to act in good faith when establishing sale
                                prices and conditions.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What is meant by the legal title of an artwork?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                A legal title refers to the actual ownership of a property as it
                                appears on the property deed. A person having the legal title has
                                all the rights, responsibilities and duties of a property owner,
                                such as maintaining the property, using it, and controlling it.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                How and when can I resell my lots or pieces?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                You can only resell your pieces on the Yumi marketplace once the
                                initial sale is complete.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                Do I have to pay taxes on the transaction?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Taxes are the responsibility of each seller and buyer and vary from
                                jurisdiction to jurisdiction. We recommend that you consult with
                                your tax advisor.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What am I receiving as proof of purchase or title of ownership?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                First you will receive one-of-a-kind egg NFT, which is a proof of
                                purchase that you will see reflected in your wallet. <br /> Once the
                                initial sale is complete, you will receive the NFT(s) piece(s) that
                                you acquire on top of the egg NFT. <br /> If the initial sale is not
                                complete, then the egg NFT is still yours to keep.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">Can I sell the egg NFT?</div>
                            <div className="mt-[15px] text-[16px] font-light">
                                No, the egg NFT is non-transferable. You can use it as PFP but not
                                sell it.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                For the pieces I buy, can I choose a particular section of the
                                painting (i.e., eyes)?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                No, you own a portion of the title of ownership but the artwork
                                remains intact.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What payments are accepted on the platform?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Payment is made in ICP, and the pieces are transferred to the
                                buyer’s compatible wallet.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                How’s my wallet safe from hackers?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                While the system offers password protection from hackers, wallet
                                holders are responsible for the safekeeping of their password.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What are validators (Nodes) and what are their responsibilities?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                They are art professionals who have specific knowledge in their
                                field who act as validators of the artworks to mint the NFTs. They
                                act in accordance with the owner’s decisions.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What are my limitations of warranties?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Please refer to the terms and conditions of ORIGYN and Yumi.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                If I’m a co-owner, can I include the physical work in an exhibition?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                ORIGYN has some protocols to make the works available for public
                                exhibitions. Please check with the ORIGYN team at art@origyn.ch for
                                more information.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                Where are artworks stored?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                All artworks offered for sale on Yumi are fully insured and stored
                                in a high security fine art vault in Switzerland. The fine art vault
                                acting as Custodian will issue a document of Proof of Storage on
                                behalf of ORIGYN, who in turn is acting on behalf of the owners of
                                the works. This document will be delivered to ORIGYN who will
                                conserve it for the benefit and on behalf of the owner(s) of the
                                artwork.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                Who has control of the artwork in the secured art vault?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                ORIGYN remains in control over the artworks during the period that
                                pieces are traded in the marketplace. They act in representation of
                                co-owners depending on the results of their voting.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What are the commissions for sales on Yumi?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                On the first sale, on the launchpad, commissions are paid to Yumi
                                (3%), Minting Node (3.5%), Copyright and Royalty owners (4%), Seller
                                (1%), ORIGYN (0.5%). <br />
                                On the second sale, commissions are paid to Yumi (3%), Minting Node
                                (3.5%), Copyright and Royalty owners (4%), Seller (1%), ORIGYN
                                (0.5%).
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What is an NFT canister?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                The securitized container in the blockchain that stores metadata.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What is an NFT canister?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                The securitized container in the blockchain that stores metadata.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                How will my private info be used?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                None of your personal details will be asked, such as name, location,
                                etc..
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What does decentralized mean?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                The dispersion or distribution of functions and powers.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                Who pays for crating and shipping the artwork to the vault in
                                Switzerland?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                The owner is responsible for paying and coordinating transport
                                needs.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                How are artworks insured while in storage or transit?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                While in transit the owners insure their artwork. While in the
                                secured art vault, ORIGYN represents the owners, and is responsible
                                for securing insurance.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                Can I sell my artwork on another platform?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                For the moment, you can only fractionalize your artwork on Yumi.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                Can I fractionalize my NFT that I bought elsewhere on Yumi?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Not at the moment. In the future, it will depend on whether your NFT
                                matches the requirements of our site and the interoperability of the
                                blockchain where you minted/bought your NFT.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">Can my NFT be burned?</div>
                            <div className="mt-[15px] text-[16px] font-light">
                                If, in the event of a buyout, a buyer makes an offer to buy back all
                                the portions and you sell him yours, you are, in fact, no longer the
                                owner. <br />
                                If the said person decides to take the work out of the safe, then
                                the sub-NFTs will be destroyed. Only the ORIGYN certificate
                                irrefutably linked to the artwork will remain.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                How will my private info be used?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Your information is confidential and may only be used by Yumi under
                                the terms and conditions of our platform.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What if as an art collector I’m only interested in selling a small
                                portion of my artwork? Do I get to keep the work in my home while I
                                sell a small amount of shares on your platform?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                You are expected to sell a minimum of 66% of your ownership. Hence,
                                you must surrender custody of the artwork to ORIGYN.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                How do I know that your platform is secure?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                All of your data on the site is confidential and will not be shared
                                with any third parties. <br />
                                ORIGYN and Yumi care about the integrity and security of your
                                personal information. However, we cannot guarantee that unauthorized
                                third parties will never be able to defeat our security measures or
                                use or access information, including your personal information, made
                                available through our Sites for improper purposes.
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {tab === 'GUIDE' && (
                <div className=" mx-auto flex max-w-[800px] flex-col px-[20px] py-[20px] font-montserrat">
                    <div className="mt-[30px] flex flex-col">
                        <div className="font-montserrat-extrabold text-[90px] leading-[120px]">
                            Guide
                        </div>
                        <div className="mt-[20px] text-[24px] font-light leading-[30px] ">
                            Fractionalization with Yumi
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What is fractionalization?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                ORIGYN has partenered with Yumi, a marketplace built on the Internet
                                Computer blockchain. As an ORIGYN Digital Certificate owner, you can
                                now fractionalize physical objects into pieces by generating
                                sub-NFTs through Yumi.
                                <br />
                                <br />
                                Simply said, fractionalization means dividing into parts or pieces.
                                Each piece is identified as an NFT that is tied directly to the
                                physical object, and each piece makes the holder a co-owner of the
                                physical object. Just like buying shares of a company on a stock
                                exchange makes you an owner of a company, you can similarly co-own
                                art pieces/collectibles/other objects with the help of Yumi.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">
                                What does certification enable for an art owner or an artist
                                representative?
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                ORIGYN’s digital certification technology enables artists and art
                                owners to generate a digital certificate of their physical artwork.
                                This process is defined as minting, and the certificates generated
                                are NFTs. These NFTs are tied to real physical objects. They attest
                                to the existence of the artworks and are irrefutably linked to them
                                on the blockchain. Simply put, your physical art piece can now have
                                its own NFT called the ORIGYN Digital Certificate, which enables key
                                functions like reselling, authentication, art fractionalization, and
                                more.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">How to buy it?</div>
                            <div className="mt-[15px] text-[20px] font-semibold">
                                Prepare your wallet and ICP tokens:
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                1. Set up your IC-based wallet. You can see a list of wallets we
                                recommend{' '}
                                <Link
                                    to="https://yuminftmarketplace.gitbook.io/yumi-docs/getting-started/install-a-wallet"
                                    target="_blank"
                                    className="underline"
                                >
                                    here
                                </Link>
                                .
                                <br /> <br />
                                2. Purchase ICP tokens from an exchange. For example,
                                <Link
                                    to="https://www.coinbase.com"
                                    target="_blank"
                                    className="underline"
                                >
                                    Coinbase
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://www.binance.com/zh-CN"
                                    target="_blank"
                                    className="underline"
                                >
                                    Binance
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://www.kraken.com"
                                    target="_blank"
                                    className="underline"
                                >
                                    Kraken
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://www.huobi.com"
                                    target="_blank"
                                    className="underline"
                                >
                                    Huobi
                                </Link>
                                ,{' '}
                                <Link
                                    to="https://www.bitfinex.com"
                                    target="_blank"
                                    className="underline"
                                >
                                    Bitfinex
                                </Link>
                                , and many others.
                                <br /> <br />
                                3. Transfer your ICP tokens from the exchange to your IC-based
                                wallet. <br /> <br />
                                * It is important to use the account ID to transfer the ICP tokens
                                to the wallet, the account ID contains a series of number and
                                letters, and should look like the following:
                                50311207ed4db1b13f9720a1c8a49f1dbc0558a69998b5db46fe7gc913cd6648
                                <br /> <br />
                                4. Connect your IC-based wallet on Yumi. <br /> <br />
                                For more detailed instructions please click{' '}
                                <Link
                                    to="https://yuminftmarketplace.gitbook.io/yumi-docs/getting-started/install-a-wallet"
                                    target="_blank"
                                    className="underline"
                                >
                                    here
                                </Link>
                                . You can find a step-by-step video tutorial.
                            </div>
                            <div className="mt-[15px] text-[20px] font-semibold">
                                Purchase pieces of an artwork:
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                There are two ways to purchase artwork pieces on Yumi: The launchpad
                                for an initial sale of an artwork by the owner on Yumi and the
                                ORIGYN Marketplace for secondary sales and where all available
                                pieces are listed.
                            </div>
                            <div className="mt-[15px] text-[20px] font-semibold">
                                The Launchpad:
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Be an early investor by purchasing a piece of a newly listed
                                artwork. <br /> <br />
                                1. Click on the number of NFTs or “pieces” of the artwork you would
                                like to purchase. <br /> <br />
                                2. Click on “Buy now.” <br /> <br />
                                3. Accept the “Terms and Conditions” of the platform <br /> <br />{' '}
                                4. Click on “Finalize my purchase.”
                                <br /> <br />
                                Once completed, you will receive an egg NFT in your wallet
                                corresponding to the promise to buy the piece of the artwork.
                                <br /> <br />
                                Once initial sale is complete, you will receive the NFT
                                corresponding to the piece.
                                <br /> <br />
                                You can now build a diversified collection of iconic works of art
                                curated by our research team.
                            </div>
                            <div className="mt-[15px] text-[20px] font-semibold">
                                The Marketplace:
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                All fractionalized artworks are displayed on ORIGYN’s market page.
                                1. Click on “buy pieces” for the artwork of your choice, and you
                                will be redirected to the artwork’s individual page.
                                <br />
                                <br />
                                2. SELECT the piece you want to acquire from the list.
                                <br />
                                <br />
                                3. Click the “BUY NOW” button.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">How to sell?</div>
                            <div className="mt-[15px]">
                                To sell your ORIGYN NFT fractions, go to your Yumi profile and then
                                click "Collected". Pick the one you want to sell and click on "List
                                on Yumi" to list it for sale.
                            </div>
                            <div className="mt-[15px] text-[20px] font-semibold">
                                Making an offer
                            </div>
                            <div className="mt-[15px] text-[16px] font-light">
                                Sellers can choose to suggest their preferred NFT price as a reserve
                                price.
                                <br />
                                <br />
                                If you wish to acquire the NFT at a different price, you can make an
                                offer. The NFT will then be displayed in your personal profile, and
                                the transaction will be marked as pending. If the seller accepts the
                                proposed price, the transaction will be completed successfully. If
                                the seller doesn’t agree, the bidding will continue.
                            </div>
                        </div>
                    </div>
                    <div className="mt-[30px]">
                        <div className="border-t border-gray-100/30 py-[23px]">
                            <div className="text-[24px] font-semibold">Why do you need us?</div>
                            <div className="mt-[15px]">
                                ORIGYN empowers the art world to safeguard its inventory and archive
                                documentation of factual and reputable sources associated with the
                                physical items. We do this in a secure, transparent, and
                                decentralized environment built on the IC.
                                <br />
                                <br />
                                The ORIGYN NFT helps you generate a revenue stream through our
                                perpetual market.
                                <br />
                                <br />
                                Leveraging the ORIGYN Digital Certificate, each link in the chain
                                gets rewarded (artist, owner, validator).
                                <br />
                                <br />
                                Yumi makes ownership of artworks easy & accessible.
                                <br />
                                <br />
                                Yumi creates scarcity and liquidity in an illiquid market.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrigynArtLandPage;
