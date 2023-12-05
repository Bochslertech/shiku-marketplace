import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, message, Radio } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { shallow } from 'zustand/shallow';
import { cn } from '@/02_common/cn';
import { Apply2ArtistFormData } from '@/03_canisters/yumi/yumi_application';
import { apply2Artist } from '@/05_utils/canisters/yumi/application';
import { useArtistStore } from '@/07_stores/artist';
import { useIdentityStore } from '@/07_stores/identity';
import './index.less';

type CombinedFromData = Apply2ArtistFormData & { policy: boolean[]; permit: boolean[] };

function ExploreArtApply() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const identity = useIdentityStore((s) => s.connectedIdentity);

    const [form] = Form.useForm<CombinedFromData>();
    const [representingVal, setRepresentingVal] = useState<string>('');

    const representingChange = ({ target: { value } }) => {
        setRepresentingVal(value);
    };

    // 持久化当前输入的数据
    const { applyFormData, updateArtistApplyFormData, deleteArtistApplyFormData } = useArtistStore(
        (s) => s,
        shallow,
    );

    // 在表单值发生变化时更新store
    const onValuesChange = (values: CombinedFromData) => {
        updateArtistApplyFormData(values);
    };

    const [applying, setApplying] = useState<boolean>(false);

    // 提交表单
    const onFinish = (values: CombinedFromData) => {
        if (!identity) return navigate('/connect');

        // 防止重复点击
        if (applying) return;
        const res = { ...values };
        if (representingVal) {
            res.representing = `${res.representing},${representingVal}`;
        }

        if (!res.policy || !res.policy[0]) {
            message.error(t('explore.apply.policyError'));
            return;
        }
        if (!res.permit || !res.permit[0]) {
            message.error(t('explore.apply.permitError'));
            return;
        }

        setApplying(true);
        apply2Artist(identity, res)
            .then((received) => {
                if (received) {
                    message.success('We have received your apply!');
                    // 删除缓存数据
                    deleteArtistApplyFormData();
                    navigate('/'); // 去主页
                } else {
                    message.error('apply failed');
                }
            })
            .catch((e) => {
                console.debug(`🚀 ~ file: apply.tsx:73 ~ apply2Artist ~ e:`, e);
                message.error(`apply failed,transaction failed: ${e}`);
            })
            .finally(() => setApplying(false));
    };
    return (
        <>
            <div className="h-[90px] w-full bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 bg-cover bg-repeat">
                <div className="mx-auto flex h-[90px] w-full max-w-[900px] items-center justify-center text-[30px] font-bold text-[#fff]">
                    {t('explore.apply.title')}
                </div>
            </div>
            <div className="mx-auto flex w-full max-w-[900px] flex-col bg-white px-[20px] py-[20px] md:px-[30px] md:py-[40px]">
                <p className="mb-2 text-[14px] text-[#000] md:mb-5 md:text-[18px]">
                    {t('explore.apply.introduce1')}
                </p>
                <p className="mb-2 text-[14px] text-[#000] md:mb-5 md:text-[18px]">
                    {t('explore.apply.introduce2')}
                </p>
                <p className="text-[14px] text-[#000] md:text-[18px]">
                    {t('explore.apply.introduce3')}{' '}
                    <Link to="" target="_blank" className="text-[#7355FF]">
                        contact@yumi.io
                    </Link>{' '}
                    {t('explore.apply.introduce4')}
                </p>
            </div>
            <div className="flex h-[10px] w-full flex-col bg-[#EDEDED]"></div>
            <div className="mx-auto flex w-full max-w-[900px] flex-col bg-white px-[15px] py-[15px] md:px-[40px] md:py-[40px]">
                <Form
                    form={form}
                    layout="vertical"
                    name="control-hooks"
                    onFinish={onFinish}
                    onValuesChange={onValuesChange}
                    initialValues={applyFormData}
                >
                    <Form.Item
                        name="contact"
                        label={t('explore.apply.formTitle1')}
                        rules={[{ required: true, message: t('explore.apply.formItemMessage1') }]}
                    >
                        <Input
                            className="mt-[10px] md:mt-[20px]"
                            placeholder={t('explore.apply.formItemPlaceholder1')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label={t('explore.apply.formTitle2')}
                        rules={[{ required: true, message: t('explore.apply.formItemMessage2') }]}
                    >
                        <Input
                            className="mt-[10px] md:mt-[20px]"
                            placeholder={t('explore.apply.formItemPlaceholder2')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="representing"
                        label={t('explore.apply.formTitle3')}
                        rules={[
                            {
                                required: true,
                                message: t('explore.apply.formItemMessage3'),
                                validator: async (_, value) => {
                                    if ((!value || !value.length) && !representingVal) {
                                        throw new Error();
                                    }
                                },
                            },
                        ]}
                    >
                        <Radio.Group className="mt-[10px] md:mt-[20px]">
                            <Radio value="Company / Project">
                                {t('explore.apply.formItem3Checkbox1')}
                            </Radio>
                            <Radio value="Independent Artist">
                                {t('explore.apply.formItem3Checkbox2')}
                            </Radio>
                            <Input
                                onChange={representingChange}
                                value={representingVal}
                                className="mt-[10px] w-full md:mt-[20px]"
                                placeholder={t('explore.apply.formItemPlaceholder3')}
                            />
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="interested"
                        label={t('explore.apply.formTitle4')}
                        rules={[
                            {
                                required: true,
                                message: t('explore.apply.formItemMessage4'),
                            },
                        ]}
                    >
                        <Checkbox.Group className="grid w-full grid-cols-2 pt-[20px] md:w-[60%] lg:w-[50%]">
                            <Checkbox className="mb-3" value="Collectibles">
                                {t('explore.apply.formItem4Checkbox1')}
                            </Checkbox>
                            <Checkbox className="mb-3" value="Art">
                                {t('explore.apply.formItem4Checkbox2')}
                            </Checkbox>
                            <Checkbox className="mb-3" value="Limited">
                                {t('explore.apply.formItem4Checkbox3')}
                            </Checkbox>
                            <Checkbox className="mb-3" value="Game">
                                {t('explore.apply.formItem4Checkbox4')}
                            </Checkbox>
                            <Checkbox className="mb-3" value="OAT">
                                {t('explore.apply.formItem4Checkbox5')}
                            </Checkbox>
                            <Checkbox className="mb-3" value="Others">
                                {t('explore.apply.formItem4Checkbox6')}
                            </Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item name="platform" label={t('explore.apply.formTitle5')}>
                        <Input
                            className="mt-[10px] md:mt-[20px]"
                            placeholder={t('explore.apply.formItemPlaceholder5')}
                        />
                    </Form.Item>

                    <Form.Item name="other" label={t('explore.apply.formTitle6')}>
                        <Input
                            className="mt-[10px] md:mt-[20px]"
                            placeholder={t('explore.apply.formItemPlaceholder6')}
                        />
                    </Form.Item>

                    <Form.Item className="mt-[20px] flex w-full items-center justify-center">
                        <Button
                            className={cn(
                                'flex h-[48px] w-[160px] items-center justify-center bg-[#000] text-[16px] font-bold text-[#fff] shadow-none hover:!bg-black',
                                applying && 'cursor-not-allowed opacity-20',
                            )}
                            type="primary"
                            htmlType="submit"
                        >
                            {t('explore.apply.submit')}
                            {applying && <LoadingOutlined />}
                        </Button>
                    </Form.Item>

                    <Form.Item name="policy" className="mb-5 mt-[20px] flex w-full">
                        <Checkbox.Group className="mt-[10px] md:mt-[20px]">
                            <Checkbox className="policy" value="true">
                                <p className="text-[16px] text-[#000]">
                                    {t('explore.apply.policy1')}
                                    <Link
                                        className="text-[#7355FF] hover:text-[#7355FF]"
                                        to=""
                                        target="_blank"
                                    >
                                        {t('explore.apply.policy2')}
                                    </Link>
                                    {t('explore.apply.policy3')}
                                    <Link
                                        className="text-[#7355FF] hover:text-[#7355FF]"
                                        to=""
                                        target="_blank"
                                    >
                                        {t('explore.apply.policy4')}
                                    </Link>
                                    .
                                </p>
                            </Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item name="permit" className="flex w-full">
                        <Checkbox.Group className="mt-0">
                            <Checkbox className="policy" value="true">
                                <p className="text-[16px] text-[#000]">
                                    {t('explore.apply.permit1')}
                                    <Link
                                        className="text-[#7355FF] hover:text-[#7355FF]"
                                        to=""
                                        target="_blank"
                                    >
                                        {t('explore.apply.permit2')}
                                    </Link>
                                    .
                                </p>
                            </Checkbox>
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default ExploreArtApply;
