import React from 'react';

interface CheckboxProps {
    checked: boolean;
    setChecked: (arg: boolean) => void;
    label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, setChecked, label }) => {

    return (
        <div className="flex items-center gap-3 ml-6 mb-6">
            <label className="relative cursor-pointer">
                <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                />
                <span
                    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center border-primary-brand`}
                >
                    {checked && (
                        <svg
                            className="w-4 h-4 text-primary-brand"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                        </svg>
                    )}
                </span>
            </label>
            <span className="text-white text-sm font-mono">{label}</span>
        </div>
    );
};

export default Checkbox;
