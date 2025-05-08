import React from 'react';

const AddressInput: React.FC<{
    address: string;
    setAddress: (address: string) => void;
    placeholder?: string;
}> = ({ address, setAddress, placeholder }) => {
    return (
        <textarea
            cols={10}
            rows={1}
            required
            id='address'
            value={address}
            placeholder={placeholder || 'Enter your wallet address'}
            onChange={(e) => setAddress(e.target.value)}
            className='font-mono text-sm bg-[#121212] p-3 border-none resize-none focus:outline-none w-full text-white placeholder-white/50'
        />
    );
};

export default AddressInput;