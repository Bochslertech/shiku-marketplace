import { cdn } from '@/02_common/cdn';

export default function Empty() {
    return (
        <div className="mt-[20vh] flex w-full justify-center ">
            <img
                className="h-10 w-10 "
                src={cdn(
                    'https://yumi-frontend-assets.s3.ap-east-1.amazonaws.com/yumi/icons/icon-empty.png',
                )}
                alt=""
            />
        </div>
    );
}
