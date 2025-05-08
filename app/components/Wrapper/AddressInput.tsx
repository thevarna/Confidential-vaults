import React from 'react';

const AddressInput: React.FC<{
    address: string;
    setAddress: (address: string) => void;
    placeholder?: string;
}> = ({ address, setAddress, placeholder }) => {
    return (
        <input
            type='text'
            required
            id='address'
            value={address}
            placeholder={placeholder || 'Enter your wallet address'}
            onChange={(e) => setAddress(e.target.value)}
            className='font-mono text-sm bg-transparent border-none focus:outline-none w-full text-white placeholder-white/50'
        />
    );
};

export default AddressInput;