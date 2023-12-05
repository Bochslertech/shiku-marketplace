import { message } from 'antd';
import { ArgsProps } from 'antd/es/message';
import { LoadingOutlined } from '@ant-design/icons';

const toArgsProps = (props: ArgsProps | string, duration?: number): ArgsProps => {
    return typeof props === 'string' ? { content: props, duration } : props;
};

function success(props: ArgsProps | string, _duration?: number) {
    const { content, duration, onClose, key, style, className, onClick } = toArgsProps(
        props,
        _duration,
    );
    message.success({
        content,
        duration: duration ?? 2,
        onClose,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
            >
                <g clip-path="url(#clip0_2742_12485)">
                    <path
                        d="M8 16C3.582 16 0 12.418 0 8C0 3.582 3.582 0 8 0C12.418 0 16 3.582 16 8C16 12.418 12.418 16 8 16ZM6.216 11.1413C6.29339 11.2187 6.38526 11.2801 6.48638 11.322C6.5875 11.3639 6.69588 11.3855 6.80533 11.3855C6.91479 11.3855 7.02317 11.3639 7.12429 11.322C7.22541 11.2801 7.31728 11.2187 7.39467 11.1413L12.4467 6.08933C12.5241 6.01194 12.5855 5.92006 12.6273 5.81894C12.6692 5.71783 12.6908 5.60945 12.6908 5.5C12.6908 5.39055 12.6692 5.28217 12.6273 5.18106C12.5855 5.07994 12.5241 4.98806 12.4467 4.91067C12.3693 4.83327 12.2774 4.77188 12.1763 4.73C12.0752 4.68811 11.9668 4.66656 11.8573 4.66656C11.7479 4.66656 11.6395 4.68811 11.5384 4.73C11.4373 4.77188 11.3454 4.83327 11.268 4.91067L6.76933 9.33733L4.756 7.324C4.5997 7.1677 4.38771 7.07989 4.16667 7.07989C3.94562 7.07989 3.73363 7.1677 3.57733 7.324C3.42103 7.4803 3.33322 7.69229 3.33322 7.91333C3.33322 8.02278 3.35478 8.13116 3.39667 8.23228C3.43855 8.3334 3.49994 8.42527 3.57733 8.50267L6.216 11.1413Z"
                        fill="#80D241"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_2742_12485">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        ),
        key,
        style: style ?? { display: 'flex', alignItems: 'center' },
        className,
        onClick,
    });
}

function error(props: ArgsProps | string, _duration?: number) {
    const { content, duration, onClose, key, style, className, onClick } = toArgsProps(
        props,
        _duration,
    );
    message.error({
        content,
        duration: duration ?? 2,
        onClose,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
            >
                <path
                    fillRule="evenodd"
                    clip-rule="evenodd"
                    d="M2.3723 2.3723C5.49656 -0.751963 10.5483 -0.795861 13.7264 2.27363C16.7959 5.45172 16.752 10.5034 13.6277 13.6277C10.5034 16.752 5.45172 16.7959 2.27363 13.7264C-0.795861 10.5483 -0.751963 5.49656 2.3723 2.3723ZM11.6901 10.8754C11.6901 10.6594 11.6038 10.4524 11.4505 10.3003L9.14211 8.00004L11.4505 5.69978C11.6559 5.49433 11.7362 5.19487 11.661 4.91422C11.5858 4.63357 11.3665 4.41436 11.0859 4.33916C10.8052 4.26396 10.5058 4.34419 10.3003 4.54964L8.00007 6.85801L5.69981 4.54964C5.49436 4.34419 5.1949 4.26396 4.91425 4.33916C4.6336 4.41436 4.41439 4.63357 4.33918 4.91422C4.26398 5.19487 4.34422 5.49433 4.54967 5.69978L6.85804 8.00004L4.54967 10.3003C4.39634 10.4524 4.31009 10.6594 4.31009 10.8754C4.31009 11.0913 4.39634 11.2984 4.54967 11.4504C4.70253 11.6021 4.90945 11.6866 5.12474 11.6853C5.34003 11.6866 5.54695 11.6021 5.69981 11.4504L8.00007 9.14208L10.3003 11.4504C10.4532 11.6021 10.6601 11.6866 10.8754 11.6853C11.0907 11.6866 11.2976 11.6021 11.4505 11.4504C11.6038 11.2984 11.6901 11.0913 11.6901 10.8754Z"
                    fill="#FF0000"
                />
            </svg>
        ),
        key,
        style,
        className,
        onClick,
    });
}

function warning(props: ArgsProps | string, _duration?: number) {
    const { content, duration, onClose, key, style, className, onClick } = toArgsProps(
        props,
        _duration,
    );
    message.warning({
        content,
        duration: duration ?? 2,
        onClose,
        key,
        style,
        className,
        onClick,
    });
}

function loading(props: ArgsProps | string, _duration?: number) {
    const { content, duration, onClose, key, style, className, onClick } = toArgsProps(
        props,
        _duration,
    );
    message.loading({
        content,
        duration: duration ?? 2,
        onClose,
        icon: <LoadingOutlined style={{ color: '#7953ff' }} />,
        key,
        style,
        className,
        onClick,
    });
}

function destroy() {
    message.destroy();
}

export const useMessage = () => {
    return { success, error, loading, destroy, warning };
};
