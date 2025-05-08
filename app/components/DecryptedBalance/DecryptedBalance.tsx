import React from "react";
import { EyeIcon, EyeOffIcon, LoadingIcon } from "./Icons";

const EncryptedBalancePlaceholder = () => {
    return <div className='flex flex-row items-center gap-2 text-lg text-white/50 uppercase'>*******</div>;
};

const DecryptedBalance: React.FC<{ isVisible: boolean; balance: string; onToggle: () => void }> = ({ isVisible, balance, onToggle }) => {
    return (
        <span className='flex flex-row items-center gap-2 text-white font-mono'>
            <button onClick={onToggle}>{isVisible ? EyeIcon : EyeOffIcon}</button>
            {!isVisible ? <EncryptedBalancePlaceholder /> : <span className='text-white text-lg'>{balance}</span>}{' '}
        </span>
    );
};

export default DecryptedBalance;