import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { Progress, Radio, Skeleton } from 'antd';
import { cn } from '@/02_common/cn';
import { shrinkAccount } from '@/02_common/data/text';
import {
    Proposal,
    ProposalOption,
    ProposalSnapshot,
    ProposalVoteRecord,
} from '@/03_canisters/yumi/yumi_origyn_art_proposal';
import {
    queryNextProposalId,
    queryProposalInfo,
    queryProposalSnapshot,
    queryProposalVoteRecords,
} from '@/05_utils/canisters/yumi/origyn-art-proposal';
import { useDeviceStore } from '@/07_stores/device';
import { useIdentityStore } from '@/07_stores/identity';
import { PaginatedNextLabel, PaginatedPreviousLabel } from '@/09_components/ui/paginated';
import style from './index.module.less';
import VoteModal from './vote-modal';

//右侧时间面板
const Instructions = React.memo(({ proposal }: { proposal: Proposal | undefined }) => {
    return (
        <div
            style={{ boxShadow: '0px 4px 10px 1px rgba(102, 102, 102, 0.2)' }}
            className="top-[80px] h-[261px] lg:sticky  lg:ml-[57px] lg:w-[421px]"
        >
            <div className=" h-[68px] border border-[#f3f3f3] pl-[17px] font-inter-semibold text-[20px] leading-[67px] lg:pl-[37px]">
                Instructions
            </div>
            <div className="pl-[17px] pt-[17px] lg:pl-[37px] lg:pt-[27px]">
                <div className=" w-unset  flex">
                    <div className=" mr-[20px] min-w-[124px] font-inter-medium text-[14px] text-symbol lg:mr-[42px] lg:text-[16px]">
                        Voting Starts at:
                    </div>
                    <div className="font-inter-semibold text-[16px] leading-[24px] text-stress">
                        {proposal ? (
                            convertTime(proposal.start_timestamp)
                        ) : (
                            <Skeleton.Input active={true} size="small" />
                        )}
                    </div>
                </div>
                <div className=" w-unset mt-[31px] flex">
                    <div className="mr-[20px] min-w-[124px] font-inter-medium text-[16px] text-symbol lg:mr-[42px]">
                        Voting Ends in:
                    </div>
                    <div className="font-inter-semibold text-[16px] leading-[24px] text-stress">
                        {proposal ? (
                            convertTime(proposal?.end_timestamp)
                        ) : (
                            <Skeleton.Input active={true} size={'small'} />
                        )}
                    </div>
                </div>
                <div className=" w-unset mt-[31px] flex">
                    <div className="mr-[20px] min-w-[124px] font-inter-medium text-[16px] text-symbol lg:mr-[42px]">
                        Total votes:
                    </div>
                    <div className="font-inter-semibold text-[14px] leading-[24px] text-stress lg:text-[16px]">
                        1000
                    </div>
                </div>
            </div>
        </div>
    );
});

//投票历史列表

const Record = React.memo(({ list }: { list: ProposalVoteRecord[] | undefined }) => {
    const [page, setPage] = useState(1);
    const handlePageClick = useCallback(({ selected }: { selected: number }) => {
        setPage(selected);
    }, []);
    return (
        <div className="record mt-[59px] pb-[25px] lg:mt-[87px]">
            <div className="h-[69px] font-inter-bold text-[20px] leading-[68px] lg:pl-[37px]">
                Voting Record
            </div>
            <div className="border-b border-t border-[#f3f3f3] px-[15px] pt-[16px] lg:px-[37px] lg:pt-[17px]">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Voter</th>
                            <th>Vote Count</th>
                            <th>Vote Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list &&
                            list.slice((page - 1) * 20, page * 20).map((item, index) => {
                                return (
                                    <tr key={item.proposal_id + item.count + index}>
                                        <td>{shrinkAccount(item.voter.toString())}</td>
                                        <td>
                                            {Number(item.count)}{' '}
                                            {Number(item.count) <= 1 ? 'vote' : 'votes'}
                                        </td>
                                        <td>{convertTime(item.vote_at)}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            <div className={cn(['mt-3 flex w-full justify-center'])}>
                <ReactPaginate
                    className="flex items-center gap-x-3"
                    previousLabel={<PaginatedPreviousLabel />}
                    breakLabel="..."
                    nextLabel={<PaginatedNextLabel />}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={page}
                    pageClassName="text-sm text-[#0003]"
                    activeClassName="!text-black"
                    // renderOnZeroPageCount={() => <Empty />}
                />
            </div>
        </div>
    );
});

//时间格式转换
const convertTime = (icTime: string) => {
    const date = new Date(Number(icTime) / 1e6);
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const hours = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();
    const month =
        date.getUTCMonth() + 1 < 10 ? `0${date.getUTCMonth() + 1}` : date.getUTCMonth() + 1;
    const _date = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();
    return `${_date}/${month}/${date.getUTCFullYear()} ${hours}:${minutes} UTC`;
};

const Voting = ({ onChangeTab }) => {
    const identity = useIdentityStore((s) => s.connectedIdentity);
    const principal = identity?.principal;
    const { isMobile } = useDeviceStore((s) => s.deviceInfo);
    const navigate = useNavigate();
    const [isShowExpand, setIsShowExpand] = useState(false);
    const [showMore, setShowMore] = useState(true);
    const [options, setOptions] = useState<ProposalOption[] | undefined>(undefined);
    //option 当前选项
    const [value, setValue] = useState<ProposalOption | undefined>(undefined);
    const [proposal, setProposal] = useState<Proposal | undefined>(undefined);
    //历史记录列表
    const [logger, setLogger] = useState<ProposalVoteRecord[] | undefined>(undefined);
    //当前提案块照
    const [snapshot, setSnapshot] = useState<ProposalSnapshot | undefined>(undefined);
    //判断details 段落是否需要展示加载更多

    const [modalTitle, setModalTitle] = useState<undefined | string>(undefined);

    //投票弹窗展示
    const [visible, setVisible] = useState<boolean>(false);
    //解析Uint8Array
    const analyzeText = useMemo(() => {
        if (proposal) {
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(new Uint8Array(proposal.introduction));
            return text;
        }
        return '';
    }, [proposal]);

    useEffect(() => {
        const queryDom = document.getElementById('details');
        if (queryDom && queryDom.offsetHeight > 432) {
            setShowMore(true);
        } else {
            setShowMore(false);
        }
    }, [analyzeText]);

    const init = useCallback(async () => {
        try {
            const nextId = await queryNextProposalId();
            const idToNumber = (Number(nextId) - 1).toString();
            const proposalDetails = await queryProposalInfo(idToNumber);
            const queryLogger = await queryProposalVoteRecords(idToNumber);
            const querySnapshot = await queryProposalSnapshot(idToNumber);
            setProposal(proposalDetails?.proposal);
            setOptions(proposalDetails?.options);
            setLogger(queryLogger);
            setSnapshot(querySnapshot);
        } catch (error) {
            console.debug('🚀 ~ file: voting.tsx:40 ~ init ~ error:', error);
        }
    }, []);

    useEffect(() => {
        init();
    }, []);

    //根据时间判断当前投票状态
    const status = useMemo(() => {
        if (proposal) {
            const time = BigInt(new Date().getTime() * 1e6);
            const startTime = BigInt(proposal.start_timestamp);
            const endTime = BigInt(proposal.end_timestamp);
            if (startTime > time) {
                return 'Upcoming';
            } else if (startTime < time && endTime > time) {
                return 'Open';
            } else return 'End';
        }
    }, [proposal]);

    //在历史记录中查找我是否已经投过票了
    const myVoted = useMemo(() => {
        if (logger) {
            const find = logger.find((item) => item.voter.toString() === principal);
            if (find) return find;
            else return false;
        } else return false;
    }, [logger, principal]);

    //我所拥有的票数
    const myVotes = useMemo(() => {
        if (snapshot) {
            const findMe = snapshot.accounts.filter((item) => item.owner.toString() === principal);
            if (findMe.length > 0) {
                return Number(findMe[0].amount);
            } else return 0;
        } else return 0;
    }, [snapshot, principal]);

    //选择选项
    const changeOption = useCallback(
        (e: any, index: number) => {
            if (options) {
                const find = options.find((item) => Number(item[0].id) + '' === e.target.value);
                if (find) {
                    setValue(find[0]);
                    setModalTitle(`Option ${index + 1}:${find[0].content}`);
                }
            }
        },
        [options],
    );

    //查询当前选项列表中 哪个是票数最多的
    const maxVote = useMemo(() => {
        if (options) {
            let list = JSON.parse(JSON.stringify(options));
            list = list.flat().map((item) => Number(item.votes));
            const max = Math.max(...list);
            if (max) return max;
            else return 0;
        } else return 0;
    }, [options]);

    //查询当前提案 总票数
    const totalVotes = useMemo(() => {
        if (snapshot) {
            return snapshot.accounts.reduce((total, option) => {
                return total + Number(option.amount);
            }, 0);
        } else return 0;
    }, [snapshot]);

    //按钮状态判断
    const btnStatus = useMemo(() => {
        const stringStyle =
            'cursor-pointer text-[16px] w-[320px] h-[50px] leading-[49px] font-inter-semibold rounded-[1px] text-[#fff] text-center bg-[#151515]';
        if (!principal) {
            return (
                <div className={stringStyle} onClick={() => navigate('/connect')}>
                    Connect to vote
                </div>
            );
        } else if (status === 'Upcoming') {
            return (
                <div
                    className={stringStyle}
                    onClick={() => {
                        const doc = document.getElementById('root') as HTMLElement;
                        doc.scrollTop = 0;
                        onChangeTab('listing');
                    }}
                >
                    Gain the vote
                </div>
            );
        } else if (status === 'Open' && !myVoted) {
            return (
                <div
                    className={cn([
                        stringStyle,
                        (!value || myVotes === 0) && 'pointer-events-none bg-[#ccc]',
                    ])}
                    onClick={() => {
                        // setVisible(true);
                    }}
                >
                    Cast your vote
                </div>
            );
        } else {
            return (
                <div
                    className={stringStyle}
                    onClick={() => {
                        const doc = document.getElementById('root') as HTMLElement;
                        doc.scrollTop = 0;
                        onChangeTab('listing');
                    }}
                >
                    View collection
                </div>
            );
        }
    }, [principal, status, value, myVotes, myVoted]);

    return (
        <div
            className={`${style['voting']} mx-auto mt-[41px] flex max-w-[1200px] px-[15px] lg:mt-[80px] lg:px-0`}
        >
            <div className="flex-1">
                <div className="font-inter-semibold text-[24px] leading-[32px] lg:text-[32px] lg:leading-[46px]">
                    Your Vote Matters: Deciding the Future of the 70 remaining Opie Fractions.
                </div>
                <div
                    className={cn([
                        ' my-[30px] inline-block rounded-[17px] px-[18px] font-inter-semibold text-[16px] leading-[33px] text-[#fff] lg:mb-[40px] lg:mt-[31px]',
                        status === 'Upcoming' && 'bg-[#0D94E8]',
                        status === 'Open' && 'bg-[#69CE28]',
                        status === 'End' && 'bg-[#C0C0C0]',
                    ])}
                >
                    {status}
                </div>
                <div>
                    <div className="mb-[20px] font-inter-semibold text-[20px]">
                        Proposal Details
                    </div>
                    <div className="details relative" id="details">
                        <div
                            className={cn([
                                'text flex flex-col font-inter-medium text-[14px] leading-[26px] text-symbol lg:text-[16px]',
                                !isShowExpand &&
                                    showMore &&
                                    'line-clamp-20 h-[432px] overflow-hidden',
                            ])}
                        >
                            {!analyzeText ? (
                                <Skeleton
                                    paragraph={{
                                        rows: 4,
                                    }}
                                    title={false}
                                />
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: analyzeText }}></div>
                            )}
                        </div>

                        {showMore && (
                            <div
                                className={`nav-voting-mask absolute bottom-[-2px] left-0 flex h-[152px] w-full items-end justify-center ${
                                    isShowExpand && ' h-auto'
                                }`}
                                style={
                                    isShowExpand
                                        ? {
                                              position: 'unset',
                                          }
                                        : {}
                                }
                            >
                                <div
                                    className="mx-auto inline-block h-[34px] cursor-pointer rounded-[17px] border border-[#eee] px-[14px] font-inter-semibold text-[16px] leading-[33px] hover:border-[#333]"
                                    onClick={() => setIsShowExpand(!isShowExpand)}
                                >
                                    {isShowExpand ? 'Pack Up' : 'Show More'}
                                </div>
                            </div>
                        )}
                    </div>
                    {isMobile && <Instructions proposal={proposal} />}

                    <div className="tips-boxShadow mt-[60px] flex w-full items-center justify-start py-[17px]">
                        <span className=" ml-[36px] mr-[37px] inline-block h-[24px] min-w-[24px] bg-[url('https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/1692088366395_check_ic.svg')] bg-center bg-no-repeat"></span>
                        <div>
                            <div className="mb-[4px] font-inter-bold text-[12px] text-black text-opacity-80">
                                Note
                            </div>
                            <div className="w-full max-w-[560px] font-inter-regular text-[12px] leading-[16px] text-[#585858]">
                                Selling or buying an NFT does not affect your voting power once your
                                votes have been cast, and please note that votes cannot be changed
                                once cast.
                            </div>
                        </div>
                    </div>

                    {/* 进度条渲染 */}
                    <div
                        className="options mt-[40px] lg:mt-[50px]"
                        style={
                            !isMobile
                                ? {
                                      boxShadow: 'unset',
                                  }
                                : {}
                        }
                    >
                        <div className=" h-[69px] border-[#f3f3f3] font-inter-bold text-[20px] leading-[68px] lg:border lg:pl-[37px]">
                            Options
                        </div>
                        <div className="cells">
                            <Radio.Group
                                value={
                                    myVoted
                                        ? Number(myVoted.option_id) + ''
                                        : Number(value?.id) + ''
                                }
                                buttonStyle="solid"
                                disabled={myVoted !== false || status !== 'Open'}
                            >
                                {options &&
                                    options.map((item, index) => {
                                        return (
                                            <div className="cell" key={item.id}>
                                                <div className="radio-title">
                                                    {status === 'End' &&
                                                    maxVote !== 0 &&
                                                    maxVote === Number(item.votes) ? (
                                                        <div className="win"></div>
                                                    ) : (
                                                        ''
                                                    )}

                                                    <Radio
                                                        onChange={(e) => {
                                                            changeOption(e, index);
                                                        }}
                                                        value={Number(item.id) + ''}
                                                    >
                                                        <div className="label">
                                                            Option {index + 1}:
                                                        </div>
                                                    </Radio>
                                                    <div className="value">{item.content}</div>
                                                </div>
                                                <div className="prog">
                                                    <Progress
                                                        percent={Math.round(
                                                            (Number(item.votes) / totalVotes) * 100,
                                                        )}
                                                        showInfo={false}
                                                        strokeColor={{
                                                            '0%': '#82A5FF',
                                                            '100%': '#720DFF',
                                                        }}
                                                    />
                                                    <div className="show">
                                                        <div className="sale">
                                                            {totalVotes !== 0
                                                                ? Math.round(
                                                                      (Number(item.votes) /
                                                                          totalVotes) *
                                                                          100,
                                                                  )
                                                                : 0}
                                                            %
                                                        </div>
                                                        <div className="count">
                                                            {Number(item.votes)}{' '}
                                                            {Number(item.votes) <= 1
                                                                ? 'vote'
                                                                : 'votes'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tips-option">
                                                    {myVoted && myVoted.option_id === item[0].id ? (
                                                        <>
                                                            <span></span>
                                                            {`You voted on ${convertTime(
                                                                myVoted.vote_at,
                                                            )} (${Number(myVoted.count)} ${
                                                                Number(myVoted.option_id) <= 1
                                                                    ? 'vote'
                                                                    : 'votes'
                                                            })`}
                                                        </>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                {/* {optionLoading ? (
                                    <div className="loading">
                                        <Loading width={100} />{' '}
                                    </div>
                                ) : (
                                    ''
                                )} */}
                            </Radio.Group>
                        </div>
                    </div>

                    <div
                        className={cn([
                            'mt-[30px] flex items-center justify-center',
                            !myVoted && status !== 'End' && 'justify-between',
                        ])}
                    >
                        {status !== 'End' && !myVoted && (
                            <div className="font-inter-semibold">
                                <span className="text-[18px] text-symbol">Voting Power</span>:{' '}
                                <span className=" ml-[15px] text-[18px] leading-[24px] text-stress">
                                    {myVotes || '--'}/{1000}
                                </span>
                            </div>
                        )}
                        {btnStatus}
                    </div>
                </div>
                <Record list={logger} />
            </div>
            {!isMobile && <Instructions proposal={proposal} />}
            <VoteModal
                open={visible}
                onClose={() => setVisible(false)}
                modalTitle={modalTitle}
                myVotes={myVotes}
                value={value}
            />
        </div>
    );
};

export default Voting;
