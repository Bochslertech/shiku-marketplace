import { useRoutes } from 'react-router-dom';
import '@/00_assets/css/app.less';
import { initial } from '@/08_hooks/app/initial';
import { watching } from '@/08_hooks/app/watch';
import PageLayout from '@/09_components/layout/page';
import routes from '@/11_routes';

function App() {
    // 初始化
    initial();
    // 监听
    watching();

    // 初始化路由
    const views = useRoutes(routes);

    return <PageLayout>{views}</PageLayout>;
}

export default App;
