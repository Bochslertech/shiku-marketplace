import { Link } from 'react-router-dom';
import { cdn } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';

interface Benefit {
    icon: string;
    text: Array<string>;
    id: number;
}
interface Plat {
    url: string;
    text: string;
    link: string;
}

const BENEFITS_LIST: Benefit[] = [
    {
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/shiku-benefits-icon-1.svg',
        text: ['Receive airdrop of NFTs', 'and tokens'],
        id: 1,
    },
    {
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/shiku-benefits-icon-2.svg',
        text: ['Host events, e.g. exhibitions,', 'concerts, conferences, etc'],
        id: 2,
    },
    {
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/shiku-benefits-icon-3.svg',
        text: ['Sublet the land'],
        id: 3,
    },
    {
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/shiku-benefits-icon-4.svg',
        text: ['Charge fees for the sales of NFTs', 'exhibited on the land'],
        id: 4,
    },
    {
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/shiku-benefits-icon-5.svg',
        text: ['Collateral for DeFi'],
        id: 5,
    },
    {
        icon: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/shiku-benefits-icon-6.svg',
        text: ['Branding', '& Advertisement'],
        id: 6,
    },
];
const PLAT_LIST: Plat[] = [
    {
        url: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/1681789935470_land_yumi 1.png',
        text: 'Yumi',
        link: 'https://shiku.com/spaces/yumi',
    },
    {
        url: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/1681790034879_land_origyn_2 1.png',
        text: 'Origyn',
        link: 'https://shiku.com/spaces/origyn',
    },
    {
        url: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/conference.jpg',
        text: 'Dfinity',
        link: 'https://shiku.com/conference',
    },
    {
        url: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/3dArtGallary.jpg',
        text: 'distrikt',
        link: 'https://shiku.com/spaces/artgallery',
    },
];

function ShikuFeatures() {
    return (
        <div className="m-auto mt-[-249px] w-full px-[28px] md:mt-[-3px] md:w-[1204px] md:px-0">
            <div className="w-full border-b border-solid border-black/40 pb-[26px] font-inter-bold text-[22px] text-black">
                Benefits of land owners
            </div>
            <div className="mb-[42px] mt-[25px] flex  flex-col gap-y-[15px] overflow-x-auto md:mb-[78px] md:grid md:grid-cols-3 md:grid-rows-2  md:flex-wrap md:justify-between">
                {BENEFITS_LIST.map((item) => {
                    return (
                        <div
                            key={`benefits_${item.id}`}
                            className="h-[166px] min-w-[241px] rounded-[30px] bg-[#F0F5F5] last:mr-0  md:h-[216px] md:w-[386px]"
                        >
                            <img
                                className={cn(
                                    'm-auto mb-[20px] mt-[45px] h-[40px] w-[40px] md:mb-[26px] md:mt-[59px]',
                                    item.id === 4 && 'mt-[20px] md:mt-[59px]',
                                )}
                                src={cdn(item.icon)}
                                alt=""
                            />
                            <div className="p-cells">
                                {item.text.map((p, pIndex) => {
                                    return (
                                        <div
                                            key={`benefits_${item.id}_${pIndex}`}
                                            className="text-center font-inter-bold text-[16px] text-[#003541cc] md:mb-[8px]"
                                        >
                                            {p}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="w-full border-b border-solid border-black/40 pb-[28px] font-inter-bold text-[22px] text-black">
                Land owners can freely build on their lands
            </div>
            <div className="mb-[29px] mt-[23px] md:mb-[74px] md:mt-[26px] md:flex md:flex-wrap md:justify-between">
                {PLAT_LIST.map((item, index: number) => {
                    return (
                        <Link
                            key={`plat_${index}`}
                            to={item.link}
                            target="_blank"
                            className="mb-[20px] block h-[450px] w-full cursor-pointer md:mb-0 md:h-[381px] md:w-[284px]"
                        >
                            <div className="h-full w-full">
                                <img
                                    className="h-full w-full object-cover hover:translate-y-[-10px] hover:rounded-[190px] hover:duration-500"
                                    src={cdn(item.url)}
                                    alt=""
                                />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default ShikuFeatures;
