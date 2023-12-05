import { NavLink } from 'react-router-dom';

function Navigator() {
    return (
        <div className="hack-navigator">
            <h1>Navigator</h1>
            <ol style={{ listStyle: 'auto' }}>
                <li>
                    <NavLink to="/">
                        主页(/) {`未开始 -> 功能开发 -> UI开发 -> 功能测试 -> UI验收 -> 完成`}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/connect">
                        登录(/connect) {`UI开发 -> 功能测试 -> UI验收 -> 完成`}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile">
                        个人中心(/profile) {`功能开发 -> UI开发 -> 功能测试 -> UI验收 -> 完成`}
                    </NavLink>
                </li>
                <li>
                    <a
                        href="/profile/nka23-rvoky-suzg7-qvnev-ldniw-vhaft-idot4-zenzk-oyryp-7hqpc-iqe"
                        target="_blank"
                    >
                        打开新的页面,看别人拥有的NFT(/profile/nka23-rvoky-suzg7-qvnev-ldniw-vhaft-idot4-zenzk-oyryp-7hqpc-iqe)
                    </a>
                </li>
                <li>
                    <a
                        href="/profile/kvxmz-2wzgu-k5bco-b6xeo-rwxof-jt65n-c5i7j-b6vac-zemky-tutht-7qe"
                        target="_blank"
                    >
                        打开新的页面,看别人拥有的NFT,有黄金(/profile/kvxmz-2wzgu-k5bco-b6xeo-rwxof-jt65n-c5i7j-b6vac-zemky-tutht-7qe)
                    </a>
                </li>
                <li>
                    <a
                        href="/profile/hxmvo-tgd7l-46wi2-nz4at-eg7fc-o2i2t-xrjql-dwdr6-2van4-6ot3s-gqe/created"
                        target="_blank"
                    >
                        打开新的页面,看别人创建的NFT(/profile/hxmvo-tgd7l-46wi2-nz4at-eg7fc-o2i2t-xrjql-dwdr6-2van4-6ot3s-gqe/created)
                    </a>
                </li>
                <li>
                    <a
                        href="/profile/nka23-rvoky-suzg7-qvnev-ldniw-vhaft-idot4-zenzk-oyryp-7hqpc-iqe/favorite"
                        target="_blank"
                    >
                        打开新的页面,看别人收藏的NFT(/profile/nka23-rvoky-suzg7-qvnev-ldniw-vhaft-idot4-zenzk-oyryp-7hqpc-iqe/favorite)
                    </a>
                </li>
                <li>
                    <a
                        href="/profile/nka23-rvoky-suzg7-qvnev-ldniw-vhaft-idot4-zenzk-oyryp-7hqpc-iqe/activity"
                        target="_blank"
                    >
                        打开新的页面,看别人活动记录(/profile/nka23-rvoky-suzg7-qvnev-ldniw-vhaft-idot4-zenzk-oyryp-7hqpc-iqe/activity)
                    </a>
                </li>
                <li>
                    <a
                        href="/profile/gqf6k-vkxbo-4qpjk-ct3r3-hhzoh-byfbi-h37pr-zwccb-xtx6r-zuz2u-tae/auction"
                        target="_blank"
                    >
                        打开新的页面,看别人拍卖记录(/profile/gqf6k-vkxbo-4qpjk-ct3r3-hhzoh-byfbi-h37pr-zwccb-xtx6r-zuz2u-tae/auction)
                    </a>
                </li>
            </ol>
        </div>
    );
}

export default Navigator;
