import Image from 'next/image';

export default function Logo() {
	return <Image src={'/logo.svg'} width={120} height={30} alt='logo' />;
}
