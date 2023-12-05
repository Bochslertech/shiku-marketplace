import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { Button } from '@/09_components/ui/button';
import './index.less';

export default function Gold() {
    return !isMobile ? (
        <div className="gold-home mx-auto flex max-w-[1920px] items-center justify-between px-[156px] py-[55px] pb-[150px] md:flex-row ">
            <div className="relative w-[640px] flex-shrink-0">
                <img
                    src="/img/gold/home-gold-left.svg"
                    className="left-[80px] z-10 bg-transparent "
                    alt=""
                />
                <div className="absolute -top-[80px] left-[80px]">
                    <img
                        src="/img/gold/home-gold-right.png"
                        className="z-10 w-[640px] bg-transparent "
                        alt=""
                    />
                </div>
            </div>
            <div className="flex flex-col items-start">
                <div className="flex w-full justify-between">
                    <div className="header-gold w-fit font-inter-bold text-[32px] text-[#ceac63]">
                        GLD NFT
                    </div>
                </div>
                <div className="mt-[30px] w-full font-inter-semibold text-[18px] leading-[22px] text-[#333333]">
                    New way to own physical gold
                </div>
                <div className="mt-[20px] w-full font-inter-medium text-[16px] leading-[22px] text-[#999]">
                    GLD NFTs empower you to take control of your financial future and join the
                    global movement towards a more transparent and accessible buying and selling of
                    gold.
                </div>
                <Link to={'/gold'} className="mr-auto">
                    <Button className="mt-[35px] w-[126px] bg-[#bd9242] py-6 font-inter-bold hover:bg-[#bd9242]/80">
                        Explore
                    </Button>
                </Link>
            </div>
        </div>
    ) : (
        <div className="gold-home flex flex-col items-center justify-between px-[15px] py-[30px]  pb-[80px] md:flex-row ">
            <div className="relative w-full flex-shrink-0">
                <img
                    src="/img/gold/home-gold-left.svg"
                    className="z-10 w-[300px] bg-transparent "
                    alt=""
                />
                <div className="absolute -bottom-[90px] -right-[80px]">
                    <img
                        src="/img/gold/home-gold-right.png"
                        className="z-10 w-[380px] bg-transparent "
                        alt=""
                    />
                </div>
            </div>
            <div className="mt-[70px] flex flex-col items-start">
                <div className="flex w-full justify-between">
                    <div className="header-gold w-fit font-inter-bold text-[32px] text-[#ceac63]">
                        GLD NFT
                    </div>
                </div>
                <div className="mt-[30px] w-full font-inter-semibold text-[18px] leading-[22px] text-[#333333]">
                    New way to own physical gold
                </div>
                <div className="mt-[20px] w-full font-inter-medium text-[16px] leading-[22px] text-[#999]">
                    GLD NFTs empower you to take control of your financial future and join the
                    global movement towards a more transparent and accessible buying and selling of
                    gold.
                </div>
                <Link to={'/gold'} className="mr-auto">
                    <Button className="mt-[35px] w-[126px] bg-[#bd9242]  font-inter-bold hover:bg-[#bd9242]/80">
                        Explore
                    </Button>
                </Link>
            </div>
        </div>
    );
}
