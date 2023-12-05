import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAccountHex, principal2account } from '@/02_common/ic/account';
import { isPrincipalText } from '@/02_common/ic/principals';
import { FirstRenderByData } from '@/02_common/react/render';
import { useIdentityStore } from '@/07_stores/identity';
import message from '@/09_components/message';
import { isValidProfileTab, ProfileTab } from './common';
import './index.less';
import Profile from './profile';

function ProfileContainer() {
    const navigate = useNavigate();

    const param = useParams(); // 获取参数
    const connectedIdentity = useIdentityStore((s) => s.connectedIdentity);
    const principal_or_account = param.principal_or_account
        ? param.principal_or_account
        : connectedIdentity?.principal;
    const tab: ProfileTab = param.tab ? (param.tab as ProfileTab) : 'collected'; // 默认是 collected 标签页

    const [once_check_params] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_check_params.once([principal_or_account, tab], () => {
                if (!principal_or_account) return navigate('/connect'); // ! 没有目标身份，进入登录页面
                if (!isPrincipalText(principal_or_account) && !isAccountHex(principal_or_account)) {
                    message.error('wrong principal id');
                    return navigate('/', { replace: true }); // ! 没有目标身份，进入登录页面
                }
                if (!isValidProfileTab(tab)) return navigate('/', { replace: true }); // ! tab 不对，进入主页
            }),
        [principal_or_account, tab],
    );

    const { principal, account }: { principal?: string; account?: string } = useMemo(() => {
        if (!principal_or_account) return {};
        if (isPrincipalText(principal_or_account)) {
            return {
                principal: principal_or_account,
                account: principal2account(principal_or_account),
            };
        }
        if (isAccountHex(principal_or_account)) {
            return {
                account: principal_or_account,
            };
        }
        return {};
    }, [principal_or_account]);

    if (!account) return <div></div>; // 没有目标身份，不允许进入
    if (!isValidProfileTab(tab)) return <div></div>; // tab 不对，不允许进入

    return (
        <div className="profile-container min-h-[100vh]">
            <Profile principal={principal} account={account} tab={tab} />
        </div>
    );
}

export default ProfileContainer;
