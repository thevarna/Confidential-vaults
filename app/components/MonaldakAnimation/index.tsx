import Image from 'next/image';
import { useEffect, useState } from 'react';

const MonaldakAnimation = () => {
    const [monaldaks, setMonaldaks] = useState<number[]>([]);
    useEffect(() => {
        setMonaldaks(new Array(20).fill(0));
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            {monaldaks.map((_, index) => (
                <div
                    key={index}
                    className="absolute inset-0 w-[200px] h-[200px] animate-monaldak"
                    style={{
                        animationDuration: `${Math.random() * 3 + 3}s`,
                        left: `${Math.random() * 90}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                >
                    <Image
                        src={
                            (Math.floor(Math.random() * 10 % 10)) % 2
                                ? '/monaldak.png'
                                : '/monaldak2.png'
                        }
                        alt="Monaldak"
                        layout="fill"
                    />
                </div>
            ))}
        </div>
    );
};

export default MonaldakAnimation;
