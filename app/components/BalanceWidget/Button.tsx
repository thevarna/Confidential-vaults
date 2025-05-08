import React from 'react';

interface UnwrapButtonProps {
    loading: boolean;
    onClick: () => void;
}

export const UnwrapButton: React.FC<UnwrapButtonProps> = ({ loading, onClick }) => {
    const buttonClass = `w-28 px-3 py-2 rounded-sm font-semibold font-mono uppercase text-primary-brand border-2
		${loading
            ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed border-gray-500'
            : 'bg-transparent border-primary-brand border-opacity-50 hover:border-opacity-100'
        }`;

    const buttonText = loading ? `Unwrapping...` : `Unwrap`;

    return (
        <button className={buttonClass} onClick={onClick} disabled={loading}>
            {buttonText}
        </button>
    );
};

interface DecryptButtonProps {
    loading: boolean;
    status: string;
    onClick: () => void;
}

export const DecryptButton: React.FC<DecryptButtonProps> = ({ loading, status, onClick }) => {
    const isDisabled = loading

    const buttonClass = `w-full py-4 rounded-b-lg font-semibold font-mono uppercase text-white mt-2
		${isDisabled ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed' : 'bg-primary-brand hover:bg-primary-brand/90'}`;

    const buttonText = loading ? status : `Decrypt All`;

    return (
        <button className={buttonClass} onClick={onClick} disabled={isDisabled}>
            {buttonText}
        </button>
    );
};