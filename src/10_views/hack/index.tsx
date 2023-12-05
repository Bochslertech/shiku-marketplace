import Information from './components/information';
import Navigator from './components/navigator';
import Settings from './components/settings';
import './index.less';

function HackPage() {
    return (
        <div className="hack-container">
            <div>
                <Settings />
            </div>
            <div>
                <Information />
            </div>
            <div>
                <Navigator />
            </div>
        </div>
    );
}

export default HackPage;
