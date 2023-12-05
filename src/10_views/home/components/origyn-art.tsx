import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { Button } from '@/09_components/ui/button';

export default function OrigynArt() {
    return !isMobile ? (
        <div className="gold-home mx-auto flex max-w-[1920px] items-center justify-between gap-x-[54px] overflow-hidden bg-[#f8f8f8] px-[156px] py-[92px] ">
            <div className="relative flex h-[493px] w-[754px] flex-shrink-0">
                <div className="mb-auto  h-[303px] w-[303px] bg-black"></div>
                <div className="absolute -top-[16px] left-[128px] z-[2] -mt-[20px] h-[408px] w-[603px] bg-[#2B64A6]"></div>
                <img
                    className="absolute -bottom-[30px] -left-[20px] z-[4] h-[303px] w-[303px]"
                    src="/img/gold/co-owned-river.png"
                    alt=""
                />
                <div className="ml-auto mt-auto  h-[185px] w-[185px] bg-black"></div>

                <div className="absolute left-[206px] top-[40px] z-[3] flex h-[425px] w-[458px] flex-col items-start justify-start bg-[#f8f8f8] py-[60px] pb-16 pl-[96px] pr-[20px]">
                    <div className="mr-auto font-inter-bold text-3xl leading-[38px] text-[#0b140c]">
                        Co-Owned <br></br> Physical Artworks
                    </div>
                    <div className="mt-[20px] w-full  font-inter-semibold text-lg leading-[26px] text-[#666666]">
                        Suzanne Walking in Leather Skirt from Julian Opie
                    </div>
                    <div className="mt-[10px] w-full font-inter-medium leading-[24px] text-[#999999]">
                        Invest in iconic artworks and become part of an exclusive community of
                        co-owners and masterpiece collectors around the world.
                    </div>
                    <Link to={'/origyn'} className="mt-[30px]">
                        {' '}
                        <Button className=" w-[126px] flex-col rounded-lg bg-black py-6 text-center  font-inter-bold">
                            Explore
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative h-[560px] w-[274px] border-[3px] border-black ">
                <img
                    className="absolute -left-[20px] top-[33px] w-[254px]"
                    src="https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669630828531_land-page-banner.png"
                    alt=""
                />
                <div className="absolute -right-[3px] bottom-[40px] h-[180px] w-[3px] bg-[#f6f6f6]"></div>
                <div className="mr-2 mt-2 h-[146px] shrink-0 bg-black" />
            </div>
        </div>
    ) : (
        <div className="gold-home flex w-full items-center justify-between gap-x-[20px] bg-[#f6f6f6] px-[15px] py-[50px] ">
            <div className="relative h-[220px] w-[102px] flex-shrink-0 border-[3px] border-black ">
                <img
                    className="absolute -left-[10px] top-[20px] w-[94px]"
                    src="https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/origyn/1669630828531_land-page-banner.png"
                    alt=""
                />
                <div className="absolute -right-[3px] bottom-[40px] h-[150px] w-[3px] bg-[#f6f6f6]"></div>
                <div className="mr-2 mt-2 h-[146px] shrink-0 bg-black" />
            </div>

            <div className="z-[3] flex flex-col items-start ">
                <div className="mb-2  mr-auto font-inter-bold text-[24px] leading-[38px] text-[#0b140c]">
                    Co-Owned Physical Artworks
                </div>
                <div className="font-inter-semibold text-[16px] leading-[26px] text-[#666666]">
                    Suzanne Walking in Leather Skirt from Julian Opie
                </div>
                <div className="mb-2 line-clamp-2 font-inter-medium leading-[24px] text-[#999999]">
                    Invest in iconic artworks and become part of an exclusive community of co-owners
                    and masterpiece collectors around the world.
                </div>
                <Link to={'/origyn'}>
                    {' '}
                    <Button className=" w-[126px] flex-col rounded-lg bg-black py-4 text-center  font-inter-bold">
                        Explore
                    </Button>
                </Link>
            </div>
        </div>
    );
}
