import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { useAppStore } from '@/07_stores/app';
import { Button } from '@/09_components/ui/button';
import YumiIcon from '@/09_components/ui/yumi-icon';
import './index.less';

export default function GoldModal() {
    const goldModalFlag = useAppStore((s) => s.goldModalFlag);
    const setGoldModalFlag = useAppStore((s) => s.setGoldModalFlag);
    return (
        <Modal
            open={!goldModalFlag}
            // onCancel={() => setGoldModalFlag(true)}
            closeIcon={null}
            footer={null}
            width={550}
            centered={true}
            className="gold-modal"
        >
            <div className="flex flex-col">
                <div className="flex w-full justify-between">
                    <div className="header-gold w-fit font-inter-bold text-[20px] text-[#ceac63]">
                        GLD NFT
                    </div>
                    <YumiIcon
                        name="action-close"
                        size={18}
                        color="#B79350"
                        className="mt-[8px] cursor-pointer hover:opacity-80"
                        onClick={() => setGoldModalFlag(true)}
                    />
                </div>
                <div className="mt-[20px] w-full font-inter-semibold text-[16px] leading-[22px] text-[#333333]">
                    New way to own physical gold
                </div>
                <div className="mt-[10px] w-full font-inter-medium text-sm leading-[22px] text-[#666666]">
                    GLD NFTs empower you to take control of your financial future and join the
                    global movement towards a more transparent and accessible buying and selling of
                    gold.
                </div>
                <Link to={'/gold'} onClick={() => setGoldModalFlag(true)} className="mx-auto">
                    <Button className="mt-[35px] w-[126px] rounded-[8px] bg-[#bd9242] py-[21px]  font-inter-bold hover:bg-[#bd9242]/80">
                        Explore
                    </Button>
                </Link>
            </div>
        </Modal>
    );
}
