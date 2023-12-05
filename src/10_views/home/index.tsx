import HomeAnnouncement from './components/announcement';
import HomeBanners from './components/banners';
import HomeFeatured from './components/featured';
import HomeGold from './components/gold';
import HomeHotCollections from './components/hot-collections';
import HomeLaunchpad from './components/launchpad';
import HomeOrigynArt from './components/origyn-art';
import HomePartner from './components/partner';

function HomePage() {
    return (
        <div className="h-full items-center">
            <HomeBanners />
            <HomeAnnouncement />
            <HomeGold />
            <HomeOrigynArt />
            <HomeHotCollections />
            <HomeFeatured />
            <HomeLaunchpad />
            <HomePartner />
        </div>
    );
}

export default HomePage;
