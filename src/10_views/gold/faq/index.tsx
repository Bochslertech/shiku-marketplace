import { useState } from 'react';
import { allFaqList } from '../about/render-list';
import style from './index.module.less';

const GoldFaqPage = () => {
    const [faqExpanded, setFaqExpanded] = useState(allFaqList.map((_) => false));

    const clickExpand = (index: number) => {
        setFaqExpanded((faqExpanded) =>
            faqExpanded.map((item, i) => {
                return i === index ? !item : item;
            }),
        );
    };
    return (
        <div
            className={`${style['gold-faq']} mx-auto max-w-[1440px] py-[20px] font-inter-medium lg:py-[80px]`}
        >
            <div className=" mb-[54px] ml-[30px] mt-[20px]  text-[64px]">FAQ</div>
            <div className=" float-right max-w-[1000px] px-[20px] pb-[20px] text-[16px] lg:px-0 lg:pb-[80px] lg:text-[24px]">
                {allFaqList.map((item, index) => {
                    return (
                        <div className="faq-list-item flex border-b border-solid border-black border-opacity-30">
                            <div className="mt-[12px] w-[60px] lg:mt-[22px]">{index + 1}</div>
                            <div className="w-calc[100% - 120px] lg:w-calc[100% - 64px - 119px] item-detail relative">
                                <div className=" py-[7px] leading-[32px] lg:py-[14px] lg:leading-[52px]">
                                    {item.question}
                                </div>
                                <div
                                    className=" absolute right-[-40px] top-[16px] h-[16px] w-[16px] cursor-pointer bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/expand-arrow.svg')] bg-contain lg:right-[-80px] lg:top-[24px] lg:h-[32px] lg:w-[32px]"
                                    onClick={() => clickExpand(index)}
                                    style={
                                        faqExpanded[index] ? { transform: 'rotate(180deg)' } : {}
                                    }
                                ></div>
                                <div
                                    className=" item-answer pb-[28px] font-inter-regular text-[14px] lg:leading-[32px]"
                                    dangerouslySetInnerHTML={{ __html: item.answer }}
                                    hidden={!faqExpanded[index]}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GoldFaqPage;
