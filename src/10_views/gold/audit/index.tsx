import { Link, useNavigate } from 'react-router-dom';
import { cdn } from '@/02_common/cdn';

const reportList = [
    {
        title: 'Stock Audit Report01',
        company: 'KPMG',
        date: '26 April 2023',
        url: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1682519647700_signed.pdf',
    },
    {
        title: 'Stock Audit Report02',
        company: 'KPMG',
        date: '28 September 2023',
        url: 'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/AUP_BAS_GOLD_CERTIFICATES_September_2023.pdf',
    },
];
const GoldAuditPage = () => {
    const navigate = useNavigate();
    return (
        <div className=" min-h-[100vh] lg:px-[40px] lg:py-[60px]">
            <div className="flex items-center pl-[18px] font-inter-medium text-[18px] leading-[64px] lg:p-0 lg:text-[24px]">
                <div
                    className=" h-[24px] w-[24px]"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    <img
                        className="flex cursor-pointer"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/1692605008244_back.svg',
                        )}
                        alt="back"
                    />
                </div>
                <div className=" pl-[16px] lg:pl-[25px]">Audit Report</div>
            </div>
            <div className=" grid w-full grid-flow-row grid-cols-4 justify-between gap-4 px-[18px] text-[12px] leading-[18px] text-[#999] lg:px-[172px] lg:pt-[10px] lg:text-[14px]">
                <div>File</div>
                <div className="w-full whitespace-nowrap text-center lg:w-auto lg:text-left">
                    Audit Company
                </div>
                <div className="w-full text-center lg:w-auto lg:text-left">Issue Date</div>
                <div className=" w-full text-center">Download</div>
            </div>
            <div className=" mt-[15px]  flex min-h-[100vh] flex-col  rounded-[24px] px-[18px] lg:border lg:border-[#e6e6e6] lg:px-[172px] lg:py-[37px]">
                {reportList.map((item) => (
                    <div
                        className="grid w-full grid-cols-4 grid-rows-1 items-center gap-4 font-inter-medium text-[12px] leading-[30px] text-[#2b2929] lg:text-[14px]"
                        key={item.title}
                    >
                        <div className=" w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                            {item.title}
                        </div>
                        <div className=" text-center lg:text-left">{item.company}</div>
                        <div className=" text-center lg:text-left">{item.date}</div>
                        <Link to={item.url} target="_blank" className="mx-auto w-fit">
                            <img
                                className="h-[18px] w-[18px] cursor-pointer lg:h-auto lg:w-auto"
                                src={cdn(
                                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/goldNFT/1692672355009_download.svg',
                                )}
                                alt=""
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoldAuditPage;
