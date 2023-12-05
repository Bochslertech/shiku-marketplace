import { cdn } from '@/02_common/cdn';

export type GoldCardOrListType = 'card' | 'list';

function GoldCardOrList({
    type,
    setType,
}: {
    type: GoldCardOrListType;
    setType: (type: GoldCardOrListType) => void;
}) {
    const onType = (_type: GoldCardOrListType) => {
        if (type === _type) return;
        setType(_type);
    };

    return (
        <div className=" ml-[27px] flex h-[46px] items-center justify-between rounded-[8px] bg-[#f6f6f6] px-[16px]">
            <div
                className={`${
                    type === 'card' ? 'bg-[#fff]' : ''
                } flex h-[31px] w-[45px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[8px]`}
                onClick={() => {
                    onType('card');
                }}
            >
                <div className=" flex h-[22px] w-[22px] flex-wrap items-center">
                    <div className="mr-[2px] mt-[0px] h-[10px] w-[10px] rounded-[3px] bg-[#707072]"></div>
                    <div className="mr-[0px] h-[10px] w-[10px] rounded-[3px] bg-[#707072]"></div>
                    <div className="mr-[2px] mt-[2px] h-[10px] w-[10px] rounded-[3px] bg-[#707072]"></div>
                    <div className="mt-[2px] h-[10px] w-[10px] rounded-[3px] bg-[#707072]"></div>
                </div>
            </div>
            <div
                className={`${
                    type === 'list' ? 'bg-[#fff]' : ''
                } flex h-[31px] w-[45px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[8px]`}
                onClick={() => {
                    onType('list');
                }}
            >
                <div className=" flex h-[22px] w-[22px] flex-wrap items-center">
                    <img
                        className="h-[20px] w-[20px] opacity-[0.7]"
                        src={cdn(
                            'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/launchpad/1681729054889_menu.png',
                        )}
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}

export default GoldCardOrList;
