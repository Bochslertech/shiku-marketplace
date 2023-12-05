import { Link } from 'react-router-dom';
import { cdn } from '@/02_common/cdn';

const GoldIntroduction = () => {
    return (
        <div className="flex w-full items-center justify-between bg-[#f4f4f4] p-[20px] font-inter-extrabold lg:px-[180px] lg:py-[10px] ">
            <div className="flex flex-col text-[30px] leading-[38px] lg:text-[50px] lg:leading-[60px]">
                <span>PHYSICAL GOLD</span>
                <span>LINKED TO AN NFT</span>
                {
                    <Link
                        to="/gold/about"
                        className="mt-[25px] h-[30px] w-[130px] cursor-pointer rounded-[4px] bg-black text-center  font-inter-semibold text-[12px]  leading-[30px] text-white hover:bg-gray-800 lg:mt-[39px] lg:h-[50px] lg:w-[220px] lg:rounded-[8px] lg:text-[22px] lg:leading-[50px]"
                    >
                        Learn more
                    </Link>
                }
            </div>
            <img
                className=" w-[40vw] lg:w-[400px]"
                src={cdn(
                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1680849518845_goldbanner.png',
                )}
                alt=""
            />
        </div>
    );
};
export default GoldIntroduction;
