import { ReactNode } from 'react';
import Header from '../components/Header/Header';
import { Toaster } from 'sonner';
// import Navbar from '../components/Navbar';
import MatrixLetters from '../decorations/MatrixLetters';

interface FlexibleLayoutProps {
	children: ReactNode;
}

const FlexibleLayout: React.FC<FlexibleLayoutProps> = ({ children }) => {
	return (
		<div className='flex flex-col min-h-screen'>
			<div className='absolute top-0 left-0 w-full h-full'>
				<MatrixLetters />
			</div>
			<Toaster />
			<Header />
			<main className='flex flex-col flex-1 px-4'>{children}</main>
		</div>
	);
};

export default FlexibleLayout;
