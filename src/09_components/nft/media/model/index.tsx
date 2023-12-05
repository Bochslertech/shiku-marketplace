import { useEffect, useState } from 'react';
import { Color3, GlowLayer, HDRCubeTexture, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import SceneComponent from 'babylonjs-hook';
import { NftTokenMetadata } from '@/01_types/nft';
import { cdn } from '@/02_common/cdn';
import './index.less';

const SCALED_CANISTERS = ['hx4at-7qaaa-aaaah-admja-cai'];

// TODO 进度条等以后有空再做

// let clickTime = 0;
// let taskManager = [];
// let computeTimes = 0;

function ModelViewer({
    src,
    metadata,
    onLoaded,
    className,
}: {
    src: string;
    metadata: NftTokenMetadata;
    onLoaded?: () => void;
    className?: string;
}) {
    const environment: string =
        JSON.parse(metadata.raw.data).environmentImageThree ??
        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/components/1658988744307_warehouse.hdr';
    const showEnvironment = JSON.parse(metadata.raw.data).showEnvironment;

    // console.debug('3d model metadata', JSON.parse(metadata.raw.data));

    const scale = SCALED_CANISTERS.includes(metadata.token_id.collection);

    // const [progress, setProgress] = useState(0);
    const [progress] = useState(0);
    const [loadTime, setLoadTime] = useState(0);
    const [modelLoaded, setModelLoaded] = useState(false);
    // const [disableProgress, setDisableProgress] = useState(false);
    const [disableProgress] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoadTime(loadTime + 100);
        }, 100);
        // taskManager = [];
        // computeTimes = 0;
    }, []);

    // const handleProgress = () => {
    //     let total = 0;
    //     let loaded = 0;
    //     let key = true;
    //     taskManager.forEach((progressEvent) => {
    //         if (!progressEvent.lengthComputable) {
    //             computeTimes++;
    //             if (computeTimes >= 6) {
    //                 setDisableProgress(true);
    //             }
    //             key = false;
    //             return;
    //         } else {
    //             computeTimes = 0;
    //         }
    //         total += progressEvent.total;
    //         loaded += progressEvent.loaded;
    //     });
    //     if (key) {
    //         setProgress(((loaded / total) * 100).toFixed(2));
    //     }
    // };

    const onSceneReady = (scene: any) => {
        console.debug(`🚀 ~ file: index.tsx:64 ~ onSceneReady ~ scene:`, scene);
        scene.createDefaultCamera();
        scene.clearColor = new Color3(1, 1, 1);
        scene.onPointerDown = () => {
            // clickTime = new Date().getTime();
        };
        // scene.onPointerUp = () => {
        //     const diff = new Date().getTime() - clickTime;
        //     if (diff < 300 && onClick) onClick();
        // };
        SceneLoader.ShowLoadingScreen = false;

        const modelRequest = fetch(src).then((d) => d.blob());
        const environmentRequest = fetch(environment).then((d) => d.blob());

        // const modelRequest = axios({
        //     url: modelUrl,
        //     responseType: 'blob',
        //     onDownloadProgress: (e) => {
        //         taskManager[0] = e;
        //         handleProgress();
        //     },
        // });
        // const environmentRequest = axios({
        //     url: environment,
        //     responseType: 'blob',
        //     onDownloadProgress: (e) => {
        //         taskManager[1] = e;
        //         handleProgress();
        //     },
        // });
        Promise.all([modelRequest, environmentRequest]).then((res) => {
            const modelRes = window.URL.createObjectURL(res[0]);
            const environmentRes = window.URL.createObjectURL(res[1]);

            const env = new HDRCubeTexture(environmentRes, scene, showEnvironment ? 512 : 128);
            SceneLoader.Append(
                '',
                modelRes,
                scene,
                () => {
                    scene.createDefaultCameraOrLight(true, true, true);
                    new GlowLayer('glow', scene);
                    scene.cameras[0].useAutoRotationBehavior = true;
                    scene.cameras[0].autoRotationBehavior.idleRotationSpeed = 0.2;
                    // if (nftCard) {
                    //     scene.cameras[0].inputs.removeByType('ArcRotateCameraMouseWheelInput');
                    // }
                    scene.environmentTexture = env;
                    if (showEnvironment) {
                        scene.createDefaultSkybox(env);
                    }
                },
                undefined,
                undefined,
                '.glb',
            );
            setModelLoaded(true);
            onLoaded && onLoaded();
        });
    };

    return (
        <div
            className={`model-viewer ${scale ? 'scale' : ''} ${className}`}
            style={{ width: '100%', height: '100%' }}
        >
            <SceneComponent
                engineOptions={{ adaptToDeviceRatio: true }}
                style={{ width: '100%', height: '100%', outline: 'none' }}
                antialias
                onSceneReady={onSceneReady}
                id="my-canvas"
            />
            <div
                className={`progress-bar ${
                    (progress === 100 || loadTime === 0 || modelLoaded) && 'invisible'
                }`}
            >
                <img
                    src={cdn(
                        'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/loading-gif.gif',
                    )}
                    style={{ width: '75px', height: '75px' }}
                />
                <div hidden={disableProgress}>{progress}%</div>
            </div>
        </div>
    );
}

export default ModelViewer;
