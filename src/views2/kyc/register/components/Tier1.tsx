import { useEffect, useState } from 'react';
import { init } from 'onfido-sdk-ui';
import { kyc0CreateWorkFlowRun } from '@/05_utils/apis/yumi/kyc';
import Loading from '@/09_components/ui/loading';

const Tier1 = ({ principal }: { principal: string | undefined }) => {
    const [load, setLoad] = useState(true);
    useEffect(() => {
        principal &&
            kyc0CreateWorkFlowRun(principal)
                .then((res) => {
                    const { workflow_run_id, generateSdkToken } = res;
                    init({
                        token: generateSdkToken,
                        containerId: 'onfido-mount',
                        workflowRunId: workflow_run_id,
                        steps: ['welcome', 'poa', 'document', 'face', 'complete'],
                        customUI: { colorBorderSurfaceModal: 'white' },
                    });
                    setLoad(false);
                })
                .catch((err) => {
                    // message.error(err);
                    console.debug(
                        '🚀 ~ file: Tier1.tsx:11 ~ principal&&kyc0CreateWorkFlowRun ~ err:',
                        err,
                    );
                });
    }, [principal]);

    return (
        <>
            {load && <Loading />}
            <div id="onfido-mount" className="h-full min-h-[100vh] md:min-h-0"></div>
        </>
    );
};
export default Tier1;
