import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cdn } from '@/02_common/cdn';
import style from './index.module.less';
import { generalFaqList, peculiarityList, platformHistory } from './render-list';

function GoldAboutPage() {
    const [faqExpanded, setFaqExpanded] = useState(generalFaqList.map((_) => false));
    const clickExpand = (index: number) => {
        setFaqExpanded((faqExpanded) =>
            faqExpanded.map((item, i) => {
                return i === index ? !item : item;
            }),
        );
    };
    return (
        <div
            className={`mx-auto w-screen max-w-[1440px] overflow-x-hidden font-sans ${style['gold-introduction']}`}
        >
            <div className="h-fit-content relative px-[20px] pb-[50px] lg:h-[600px] lg:pl-[95px]">
                <div className="mt-[200px] font-inter-extrabold text-[40px] lg:mt-[100px] lg:text-[64px]">
                    GLD NFT
                </div>
                <div className="font-inter-medium text-[15px] lg:mt-[24px] lg:text-[24px]">
                    New way to own physical gold
                </div>
                <div className=" mt-[30px] max-w-[700px] font-inter-regular text-[14px] lg:mt-[40px] lg:text-[16px]">
                    With GLD NFTs, customers of all income levels can now access physical gold
                    through NFTs in a secure and simple way. GLD NFTs empower you to take control of
                    your financial future and join the global movement towards a more transparent
                    and accessible buying and selling of gold.
                </div>
                <Link
                    to="/gold"
                    className=" mt-[70px] block h-[60px] w-[220px] cursor-pointer rounded-[8px] bg-black text-center font-inter-semibold text-[22px] leading-[60px] text-white"
                >
                    Explore
                </Link>
                <img
                    className="z-neg-1 w-400px[] absolute right-[-100px] top-[-230px] lg:right-[0px] lg:top-[-100px]  lg:w-[640px]"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/1679564733031_new-gold-yumi-nft.png',
                    )}
                />
            </div>
            {/* <div className="video-section">
      
    </div> */}
            <div className="w-full px-[20px] lg:px-0">
                <div className="flex flex-col lg:flex-row">
                    <div className="h-[120px] w-full font-inter-semibold text-[52px] leading-[60px] text-[#c79f5d] lg:ml-[50px] lg:mt-[20px] lg:h-[660px] lg:w-[597px] lg:text-[200px] lg:leading-[220px]">
                        WHY
                        <br />
                        GOLD BAR?
                    </div>
                    <div className=" w-full text-[14px] leading-[28px] lg:ml-[40px] lg:mt-[41px] lg:w-[663px] lg:text-[18px] lg:leading-[30px]">
                        <p className="mt-[30px] lg:mt-0">
                            With so many types of gold products to buy in the market, traditional
                            physical gold bars and coins have been the preferred method. However,
                            purchasing gold in this way can come with additional costs such as
                            insurance, transportation, and safekeeping. These factors can make
                            buying, holding, and selling physical gold bars and coins too
                            complicated for many.
                        </p>
                        <p className="mt-[30px] lg:mt-0">
                            This is where GLD NFTs come in. By offering NFTs linked to gold bullion
                            stored in a secure vault in Switzerland, GLD NFTs eliminate the need for
                            buyers to worry about the hassle of storing, insuring, and securing
                            physical gold. GLD NFTs make buying, selling, and holding gold easier
                            than ever, providing buyers with a convenient and accessible way to
                            purchase gold.
                        </p>
                        <p className="mt-[30px] lg:mt-0">
                            All gold bullions linked to GLD NFTs are provided by METALOR, and
                            audited by KPMG. With GLD NFTs, buyers can enjoy the benefits of buying
                            and holding gold without the added costs and complexities associated
                            with buying and holding physical gold bars and coins.
                        </p>
                        <p className="mt-[30px] lg:mt-0">
                            GLD NFTs provide a simple, cost-effective, and accessible way for
                            investors to participate in the gold market and potentially benefit from
                            its wealth preservation and diversification properties.
                        </p>
                    </div>
                </div>
                <div className="my-[40px] lg:mb-0 lg:ml-[80px] lg:mt-[100px]">
                    <div className=" w-full font-inter-semibold text-[40px] leading-[52px] lg:w-[1020px] lg:text-[60px] lg:leading-[90px]">
                        PROTECT YOUR WEALTH DURING UNCERTAIN TIMES
                    </div>
                    <div className=" mt-[20px] text-[14px] leading-[28px] lg:mt-[30px] lg:text-[20px] lg:leading-[40px]">
                        Buying gold can be a great way to diversify your portfolio and to protect
                        your wealth during market turbulence. Gold has historically shown steady
                        growth over the time, acting as a safe haven during turbulent times and
                        providing positive returns–thereby protecting investor wealth. Additionally,
                        gold has high liquidity, meaning it can be easily bought and sold on a deep
                        and liquid trading market, which can further help with wealth preservation.
                    </div>
                </div>
                <div className="flex flex-col lg:mt-[100px] lg:flex-none lg:flex-row lg:px-[64px] lg:pr-[80px]">
                    <img
                        className=" w-full object-contain lg:w-[486px]"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/gold-store-img.png',
                        )}
                    />
                    <div>
                        <div className="text-right font-inter-semibold text-[40px] leading-[50px] lg:text-[60px] lg:leading-[90px]">
                            STORE OF VALUE AGAINST HIGH INFLATION
                        </div>
                        <div className="mb-[74px] ml-[20px] mt-[30px] text-right text-[14px] leading-[28px] lg:mb-0 lg:text-[20px] lg:leading-[40px]">
                            Gold can potentially provide a unique store of value, helping to
                            preserve purchasing power over time. Gold has historically provided
                            positive returns during periods of rising inflation, particularly in
                            environments of extreme inflation, thus making it a reliable hedge
                            against systemic risk. By including gold in your portfolio, you can
                            benefit from its diversification and wealth preservation properties.
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#f5f5f5] px-[20px] pb-[1px] lg:p-0 lg:pb-0">
                <div className="flex flex-wrap justify-center py-[20px] lg:mt-[120px] lg:justify-between lg:px-[41px]">
                    {peculiarityList.map((item) => {
                        return (
                            <div
                                className="mt-[20px] h-[210px] w-full rounded-[24px] bg-white px-[28px] text-center lg:mt-[120px] lg:h-[400px] lg:w-[320px] lg:px-[24px]"
                                key={item.title}
                            >
                                <div className="mt-[24px] font-inter-semibold text-[22px] leading-[32px] lg:mt-[60px] lg:text-[32px]">
                                    {item.title}
                                </div>
                                <div className="mt-[12px] text-[14px] leading-[28px] lg:mt-[32px] lg:text-[20px] lg:leading-[40px]">
                                    {item.detail}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className=" pt-[42px] text-[14px] leading-[28px] lg:pb-[110px] lg:pl-[124px] lg:pr-[124px] lg:pt-[100px] lg:text-[22px] lg:leading-[44px]">
                    <div className="text-center">
                        <img
                            className="mb-[22px] inline-block w-[240px] lg:mb-[60px] lg:w-auto"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/metalor.svg',
                            )}
                            alt=""
                        />
                    </div>
                    {platformHistory.map((item) => {
                        return (
                            <p key={item} className="mb-[40px] text-center">
                                {item}
                            </p>
                        );
                    })}
                    <p className=" mb-[40px] text-center">
                        <a
                            href="https://metalor.com/heritage/our-heritage"
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'underline' }}
                            className="underline"
                        >
                            https://metalor.com/heritage/our-heritage/
                        </a>
                    </p>
                </div>
            </div>
            <div className="flex-col lg:px-[40px] lg:py-[120px]">
                <div className="mt-[50px] w-full px-[20px] text-center font-inter-semibold text-[40px] leading-[50px] lg:mt-0 lg:p-0 lg:text-[56px] lg:leading-[56px]">
                    Main Advantages of the Project
                </div>
                <div className=" mb-0 w-full overflow-x-auto pl-[20px] lg:pl-0">
                    <table className="advantage-table">
                        <div className="col font-inter-medium">
                            <div>&nbsp;</div>
                            <div>CUSTODY</div>
                            <div>ALLOCATED</div>
                            <div>24/7 VERIFIABLE OWNERSHIP</div>
                            <div>TIME TO SETTLE</div>
                            <div>GOLD QUALITY</div>
                            <div>MINIMUM PURCHASE</div>
                            <div>REDEEMABLE FOR PHYSICAL</div>
                            {/* <div>REGULATORY</div> */}
                        </div>
                        <div className="col yumi">
                            <div>YUMI GOLD</div>
                            <div>Free</div>
                            <div>
                                <div className="true"></div>
                            </div>
                            <div>
                                <div className="true"></div>
                            </div>
                            <div>Instant</div>
                            <div>LBMA</div>
                            <div>70 USD</div>
                            <div>
                                <div className="true"></div>
                            </div>
                            {/* <div>FINMA, VQF</div> */}
                        </div>
                        <div className="col">
                            <div>
                                GOLD ETF
                                <br />
                                (BROKER)
                            </div>
                            <div>25 bps/y</div>
                            <div>
                                <div className="false"></div>
                            </div>
                            <div>
                                <div className="false"></div>
                            </div>
                            <div>T+1</div>
                            <div>Variable</div>
                            <div>200 USD</div>
                            <div>
                                <div className="false"></div>
                            </div>
                            {/* <div>SEC or equ</div> */}
                        </div>
                        <div className="col">
                            <div>
                                GOLD FUTURE
                                <br />
                                (COMEX)
                            </div>
                            <div>No custody</div>
                            <div>
                                <div className="false"></div>
                            </div>
                            <div>
                                <div className="false"></div>
                            </div>
                            <div>Instant</div>
                            <div>Variable</div>
                            <div>1900 USD</div>
                            <div>
                                <div className="false"></div>
                            </div>
                            {/* <div>CFTC</div> */}
                        </div>
                        <div className="col">
                            <div>
                                UNALLOCATED
                                <br />
                                GOLD (BANK)
                            </div>
                            <div>10 bps/y</div>
                            <div>
                                <div className="false"></div>
                            </div>
                            <div>
                                <div className="false"></div>
                            </div>
                            <div>T+2</div>
                            <div>Variable</div>
                            <div>Variable</div>
                            <div>
                                <div className="false"></div>
                            </div>
                            {/* <div><div className="false"></div></div> */}
                        </div>
                        <div className="col">
                            <div>
                                ALLOCATED <br />
                                GOLD (STORE)
                            </div>
                            <div>2k/year mini</div>
                            <div>
                                <div className="true"></div>
                            </div>
                            <div>
                                <div className="false"></div>
                            </div>
                            <div>T+2 -&gt; T+4</div>
                            <div>Variable</div>
                            <div>70 USD</div>
                            <div>
                                <div className="true"></div>
                            </div>
                            {/* <div><div className="false"></div></div> */}
                        </div>
                    </table>
                </div>
                <div className="my-[40px] flex justify-center gap-[45px] lg:my-0 lg:mt-[80px] lg:items-center">
                    <a
                        className="text-align flex cursor-pointer items-center rounded-[8px] bg-[#000] px-[12px] py-[10px] font-inter-semibold text-[14px] text-[#fff] lg:px-[20px] lg:py-[10px] lg:text-[24px]"
                        target="blank"
                        href="https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1682519585417_WhitePaperGLDNFT (1).pdf"
                    >
                        <img
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/1691412454365_gold-whitepaper-download.svg',
                            )}
                            className="mr-[10px] block h-[12px] w-[12px] lg:mr-[20px] lg:h-[24px] lg:w-[24px]"
                            alt=""
                        />
                        White Paper
                    </a>
                    <Link
                        to="/gold/audit"
                        className="text-align flex cursor-pointer items-center rounded-[8px] bg-[#000] px-[12px] py-[10px] font-inter-semibold text-[14px] text-[#fff] lg:px-[20px] lg:py-[10px] lg:text-[24px]"
                    >
                        <img
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/1691412467341_gold-audit-report.svg',
                            )}
                            className="mr-[10px] block h-[12px] w-[12px] lg:mr-[20px] lg:h-[24px] lg:w-[24px]"
                            alt=""
                        />
                        <div>Audit Report</div>
                    </Link>
                </div>
            </div>
            <div className="bg-[#f5f5f5] px-[20px] lg:px-[50px] lg:py-[120px]">
                <div className="grid-cols-2 text-center font-inter-semibold text-[40px] leading-[52px] text-[#c79f5b] lg:text-[56px] lg:leading-[56px]">
                    Backed by Top Firms
                </div>
                <div className="mt-[20px] grid grid-cols-3 flex-wrap justify-between gap-0 pb-[79px] lg:mt-[40px] lg:flex lg:justify-center lg:pb-0 ">
                    <div className=" mx-[7px] mt-[15px] flex h-[80px] w-auto items-center justify-center rounded-[8px] border border-[#ccc] bg-white lg:mt-[30px] lg:h-[160px] lg:w-[330px] lg:rounded-[16px]">
                        <img
                            className=" m-auto max-h-[80%] max-w-[80%] object-contain"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/metalor.svg',
                            )}
                        />
                    </div>
                    <div className=" mx-[7px] mt-[15px] flex h-[80px] w-auto items-center justify-center rounded-[8px] border border-[#ccc] bg-white lg:mt-[30px] lg:h-[160px] lg:w-[330px] lg:rounded-[16px]">
                        <img
                            className=" m-auto max-h-[80%] max-w-[80%] object-contain"
                            src={'/img/gold/ogy.png'}
                        />
                    </div>
                    <div className=" mx-[7px] mt-[15px] flex h-[80px] w-auto items-center justify-center rounded-[8px] border border-[#ccc] bg-white lg:mt-[30px] lg:h-[160px] lg:w-[330px] lg:rounded-[16px]">
                        <img
                            className=" m-auto max-h-[60%] max-w-[60%] object-contain"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/kpmg.png',
                            )}
                        />
                    </div>
                    <div className=" mx-[7px] mt-[15px] flex h-[80px] w-auto items-center justify-center rounded-[8px] border border-[#ccc] bg-white lg:mt-[30px] lg:h-[160px] lg:w-[330px] lg:rounded-[16px]">
                        <img
                            className=" m-auto h-[91px] max-h-[80%] max-w-[80%] object-contain"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/loomis.png',
                            )}
                        />
                    </div>
                    <div className=" mx-[7px] mt-[15px] flex h-[80px] w-auto items-center justify-center rounded-[8px] border border-[#ccc] bg-white lg:mt-[30px] lg:h-[160px] lg:w-[330px] lg:rounded-[16px]">
                        <img
                            className="m-auto h-[81px] max-h-[80%] max-w-[80%] object-contain"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/1684234944580_img_v2_b2fe56e0-89cb-4d59-96a7-562684d7e58g 1.png',
                            )}
                        />
                    </div>
                    <div className=" mx-[7px] mt-[15px] flex h-[80px] w-auto items-center justify-center rounded-[8px] border border-[#ccc] bg-white lg:mt-[30px] lg:h-[160px] lg:w-[330px] lg:rounded-[16px]">
                        <img
                            className="m-auto max-h-[60%] max-w-[60%] object-contain"
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/btstech.png',
                            )}
                        />
                    </div>
                </div>
            </div>
            <div className="px-[20px] lg:px-[40px]">
                <div className="mb-[30px] mt-[60px] text-center font-inter-semibold text-[40px] leading-[52px] lg:mb-[60px] lg:mt-[120px] lg:text-[56px] lg:leading-[56px]">
                    Frequently Asked Questions
                </div>
                {generalFaqList.map((item, index) => {
                    return (
                        <div className=" relative my-[12px] h-fit min-h-[50px] w-full rounded-[25px] bg-[#f5f5f5] px-[24px] lg:my-[24px] lg:min-h-[80px] lg:rounded-[40px] lg:px-[80px]">
                            <div className="max-w-[259px] py-[16px] font-inter-medium text-[14px] leading-[24px] lg:max-w-none lg:py-0 lg:text-[24px] lg:leading-[80px]">
                                {item.question}
                            </div>
                            <div
                                className="absolute right-[24px] top-[20px] h-[16px] w-[16px] cursor-pointer bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/expand-arrow.svg')] bg-contain lg:right-[80px] lg:top-[24px] lg:h-[32px] lg:w-[32px]"
                                onClick={() => clickExpand(index)}
                                style={
                                    faqExpanded[index]
                                        ? {
                                              transform: 'rotate(180deg)',
                                          }
                                        : {}
                                }
                            ></div>
                            <div
                                className=" pb-[16px] font-inter-regular text-[12px] leading-[20px] lg:pb-[28px] lg:text-[16px] lg:leading-[32px]"
                                hidden={!faqExpanded[index]}
                                dangerouslySetInnerHTML={{ __html: item.answer }}
                            ></div>
                        </div>
                    );
                })}
                <Link
                    className=" mx-auto my-[24px] block h-[40px] w-[240px] cursor-pointer rounded-[8px] bg-[#000] text-center font-inter-semibold text-[14px] leading-[40px] text-[#fff] lg:my-[60px] lg:h-[64px] lg:w-[380px] lg:text-[24px] lg:leading-[64px]"
                    // onClick={goFaqDetail}
                    to="/gold/faq"
                >
                    View more FAQS
                </Link>
            </div>
            <div className="mt-[60px] lg:mt-0 lg:px-[40px] lg:py-[80px]">
                <div className="relative h-[500px] overflow-hidden bg-[#000] px-[20px] font-inter-semibold text-[#fff] lg:h-[340px] lg:rounded-[16px] lg:px-0 lg:pl-[85px]">
                    <img
                        className="absolute right-[-100px] top-[250px] w-[385px] object-contain lg:right-[5%] lg:top-0 lg:w-[548px]"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/invest.png',
                        )}
                    />
                    <div className="z-1 relative mt-[45px] w-[594px] text-[40px] leading-[50px] lg:text-[55px] lg:leading-[75px]">
                        Start investing
                        <br />
                        in NFT gold today
                    </div>
                    <Link
                        className=" z-1 relative mt-[28px] block h-[40px] w-[160px] cursor-pointer rounded-[25px] bg-[#c79f5d] text-center text-[16px] leading-[40px] lg:h-[50px] lg:w-[220px] lg:text-[22px] lg:leading-[50px]"
                        to="/gold"
                    >
                        Explore
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default GoldAboutPage;
