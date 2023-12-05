import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Form, Input } from 'antd';
import { cdn, cdn_by_assets } from '@/02_common/cdn';
import { cn } from '@/02_common/cn';
import { isEmail } from '@/02_common/data/email';
import { FirstRenderByData } from '@/02_common/react/render';
import { updateUserSettings } from '@/05_utils/canisters/yumi/core';
import { useIdentityStore } from '@/07_stores/identity';
import { Button } from '@/09_components/ui/button';
import AvatarCrop from './components/avatar';

type ProfileForm = {
    username: string;
    banner: string;
    avatar: string;
    email: string;
    bio: string;
};

function ProfileSettingsPage() {
    const navigate = useNavigate();
    const identity = useIdentityStore((s) => s.connectedIdentity);

    const [once_check_identity] = useState(new FirstRenderByData());
    useEffect(
        () =>
            once_check_identity.once([!!identity], () => {
                if (!identity) navigate('/connect'); // 没有登录强制去登录页
            }),
        [identity],
    );

    const reloadIdentityProfile = useIdentityStore((s) => s.reloadIdentityProfile);

    const identityProfile = useIdentityStore((s) => s.identityProfile);

    const [form] = Form.useForm();

    const [data, setData] = useState<ProfileForm>({
        username: identityProfile?.username ?? '',
        banner: identityProfile?.banner ?? '',
        avatar: identityProfile?.avatar ?? '',
        email: identityProfile?.email ?? '',
        bio: identityProfile?.bio ?? '',
    });

    const [validEmail, setValidEmail] = useState(!data.email || isEmail(data.email.trim()));
    // useEffect(() => {
    //     const email = form.getFieldValue('email');
    //     console.debug(`🚀 ~ file: settings.tsx:53 ~ useEffect ~ email:`, email);
    //     setValidEmail(!email || isEmail(email.trim()));
    // }, [form]);
    const onEmailChange = ({ target: { value } }) => {
        console.debug(`🚀 ~ file: settings.tsx:57 ~ onEmailChange ~ value:`, value);
        setValidEmail(!value || isEmail(value.trim()));
    };

    useEffect(() => {
        if (!identityProfile) return;
        let changed = false;
        ['username', 'banner', 'avatar', 'email', 'bio'].forEach((key) => {
            if (identityProfile[key] !== data[key]) {
                changed = true;
                data[key] = identityProfile[key];
            }
        });
        if (changed) {
            setData({ ...data });
            form.setFieldsValue(data);
        }
    }, [identityProfile, form]);

    // 上传头像图片, 上传图片,返回 url
    // const [uploading, setUploading] = useState(false);
    // const uploadFile = async (file: File): Promise<string> => {
    //     setUploading(true);
    //     const spend = Spend.start(`upload file`, true);
    //     try {
    //         const avatar = await uploadFileToBucket(identity!, { file, max_size: 150 });
    //         spend.mark(`got avatar: ${avatar}`);
    //         return avatar;
    //     } finally {
    //         spend.mark('over');
    //         setUploading(false);
    //     }
    // };
    const onFileChange = (avatar: any) => {
        // Todo 设置 avatar
        console.log('avatar', avatar);
        setData({ ...data, avatar });
        // uploadFile(e.target.files[0]).then((avatar) => {
        //     console.log('avatar', avatar);
        //     setData({ ...data, avatar });
        // });
    };

    const [updating, setUpdating] = useState(false);
    const doUpdate = (data: ProfileForm) => {
        if (updating) return false;
        if (!identity) return navigate('/connect'); // 没有登录强制去登录页
        const args = { ...data };
        args.username = args.username.trim();
        args.email = args.email.trim();
        args.bio = args.bio.trim();
        setUpdating(true);
        updateUserSettings(identity, args)
            .then((d) => {
                if (d) {
                    message.success('Profile updated successful');
                    setTimeout(() => reloadIdentityProfile(3), 0);
                    navigate(-1); // 返回上一页
                } else {
                    message.error('update failed');
                }
            })
            .catch((e) => message.error(`${e}`))
            .finally(() => setUpdating(false));
    };

    const onUpdate = (info: ProfileForm) => {
        console.debug(`🚀 ~ file: settings.tsx:118 ~ onUpdate ~ updating`, data);
        doUpdate({ ...data, ...info });
    };

    type FieldType = {
        username?: string;
        bio?: string;
        email?: string;
    };

    const onFinishFailed = (e: any) => {
        console.debug(`🚀 ~ file: settings.tsx:127 ~ onFinishFailed ~ e:`, e);
        message.error(`${e.errorFields[0].errors[0]}`);
    };

    if (!identity) return <></>;
    return (
        <div className="setting-container m-auto w-full bg-white md:w-[1200px]">
            <h1 className="mb-[36px] mt-[45px] hidden font-inter-bold text-[26px] md:block">
                Profile Settings
            </h1>
            <img
                src={cdn(data.banner)}
                alt=""
                className="h-[150px] w-full flex-shrink-0 object-cover md:h-[300px] md:last:rounded-[16px]"
            />
            <div className="group relative ml-[20px] mt-[-22px] h-[45px] w-[45px] cursor-pointer rounded-[8px] bg-white hover:bg-none md:ml-[30px] md:mt-[-51px] md:h-[102px] md:w-[102px] md:rounded-[20px]">
                {/* <img
                    src={cdn(data.avatar)}
                    alt=""
                    className="h-[45px] w-[45px] flex-shrink-0 rounded-[8px] border-4 border-solid border-black md:mt-[-51px] md:h-[103px] md:w-[103px] md:rounded-[20px]"
                />

                {!uploading && (
                    <div className="absolute left-0 top-0 hidden h-full w-[45px] flex-shrink-0 cursor-pointer rounded-[8px] bg-black/50 group-hover:block md:w-full md:rounded-[20px]">
                        <input
                            type="file"
                            name="file"
                            className="h-full w-full cursor-pointer opacity-0"
                            onChange={onFileChange}
                        />

                        <img
                            src={cdn(
                                'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/unity/1691050121618_upload.svg',
                            )}
                            alt=""
                            className="pointer-events-auto ml-[16px] mt-[-31px] h-[12px] w-[12px] flex-shrink-0 cursor-pointer rounded-[20px] md:ml-[31px] md:mt-[-62px] md:h-[31px] md:w-[31px]"
                        />
                    </div>
                )}
                {uploading && <img className="absolute left-0 top-0" src={cdn(loading)} alt="" />} */}

                {/* 新的带上传裁切的avatar */}
                <AvatarCrop avatar={data.avatar} identity={identity} onFileChange={onFileChange} />
            </div>
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                // style={{ width: '1200px' }}
                className="md:!width-[1200px] !w-full !px-[20px] md:!px-0"
                initialValues={data}
                onFinish={onUpdate}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div className="!mb-[14px] !mt-[27px] text-left font-inter-medium text-[14px] text-stress md:mt-[36px] md:text-[18px]">
                    User Name
                </div>
                <Form.Item<FieldType>
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input
                        placeholder="A Cool Name"
                        showCount
                        maxLength={20}
                        className="flex !h-[34px] w-full flex-shrink-0 items-center justify-center !rounded-[4px] !bg-[#F8F8F8] md:!h-[60px] md:!w-[751px] md:!rounded-[8px]"
                    />
                </Form.Item>

                <div className="!mb-[14px] !mt-[26px] text-left font-inter-medium !text-[18px] text-stress md:mb-[10px] md:mt-[40px] md:text-[18px]">
                    Email Address
                </div>
                <Form.Item<FieldType>
                    name="email"
                    rules={[
                        {
                            required: !validEmail,
                            type: 'email',
                            message: 'Please input correct email!',
                        },
                    ]}
                >
                    <Input
                        placeholder="Please Input Email"
                        className="!h-[34px] !w-full !rounded-[4px] bg-[#F8F8F8] pl-[15px] text-black placeholder:text-[#D0D0D0] md:!h-[60px] md:!w-[751px] md:!rounded-[8px]"
                        onChange={onEmailChange}
                        rootClassName="email"
                    />
                </Form.Item>

                <div className="!mb-[14px] !mt-[26px] text-left font-inter-medium !text-[12px] text-stress md:mb-[10px] md:mt-[40px] md:!text-[18px]">
                    Bio
                </div>
                <Form.Item<FieldType> name={'bio'}>
                    <Input.TextArea
                        className="!h-[103px] w-full resize-none bg-[#F8F8F8] px-[10px] py-[10px] md:!h-[500px] md:!w-[751px]"
                        name="bio"
                        showCount
                        // style={{ width: '751px', height: '100% !important', resize: 'none' }}
                        maxLength={300}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        className={cn([
                            'm-auto flex !h-[32px] !w-[98px] !cursor-pointer items-center justify-center rounded-[8px] bg-black font-inter-semibold leading-[32px] text-white md:m-0 md:mt-[20px] md:!h-[48px] md:!w-[147px] md:leading-[48px]',
                            updating && 'cursor-no-drop',
                        ])}
                    >
                        Update
                        {updating && (
                            <img
                                className="ml-[10px] h-[24px] w-[24px]"
                                src={cdn_by_assets('/images/common/loading.gif')}
                                alt="loading image"
                            />
                        )}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ProfileSettingsPage;
