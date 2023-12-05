import { useShikuLandsInfo } from '@/08_hooks/views/shiku';
import CoverBox from './components/cover-box';
import ShikuFeatures from './components/features';
import ShikuIntroduction from './components/introduction';
import ShikuDetail from './detail';
import './index.less';

function ShikuPage() {
    const { position, setPosition, cards, card, listing, refresh } = useShikuLandsInfo();

    return (
        <>
            <div className="shiku-wrap">
                <div className="mt-[34px] flex flex-wrap justify-center px-[28px] md:px-0">
                    <CoverBox position={position} setPosition={setPosition} card={card} />
                    <ShikuDetail cards={cards} card={card} listing={listing} refreshAll={refresh} />
                </div>
                {/* 当有Place a bid in advance这个内容的时候，mt-[32px] */}
                <ShikuIntroduction />
                <ShikuFeatures />
            </div>
        </>
    );
}

export default ShikuPage;
