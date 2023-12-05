import { Link } from 'react-router-dom';
import { cdn } from '@/02_common/cdn';

function ShikuIntroduction() {
    return (
        <div className="mt-[25px] h-full w-full md:mt-[79px] ">
            <img
                className="h-[326px] w-full rounded-t-[40px] object-cover md:h-[404px]"
                src={cdn(
                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/1681787833858_shiku_twitter_banner_v2%201.png',
                )}
                alt=""
            />
            {/* absolute left-[50%] translate-x-[-50%] */}
            <div className="z-50 m-auto flex h-full w-[329px] translate-y-[-289px] flex-wrap rounded-[40px] bg-[#F0F5F5] pb-[40px] md:h-[282px] md:w-[824px] md:translate-y-[-63px] md:flex-nowrap">
                <img
                    className="m-auto mt-[67px] h-[37px] w-[182px] md:ml-[72px] md:mr-[41px] md:mt-[63px] md:h-[47px] md:w-[234px]"
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/shiku/1681789244746_shiku_logo.svg',
                    )}
                    alt=""
                />
                <div className="mt-[44px] md:mr-[31px] md:mt-[53px]">
                    <div className="font-inter-normal px-[39px] text-[16px] leading-[24px] text-[#305B65]  md:px-0 md:text-[12px]">
                        Shiku is the first Metaverse Foundation in Switzerland. Its mandate is to
                        build the world's first open and decentralized full-feature metaverse that
                        provides high-resolution immersive experiences of collaboration,
                        communication and connection.
                    </div>
                    <Link to={`https://shiku.com`} target="_blank">
                        <div className="ml-[61px] mt-[55px] h-[51px] w-[206px] cursor-pointer rounded-[12px] bg-black text-center  font-inter-black text-[14px] leading-[51px] text-white md:ml-0 md:mt-[36px]">
                            Learn more about Shiku
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ShikuIntroduction;
