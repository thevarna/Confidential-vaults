import type { Metadata } from 'next';
import './globals.css';
import "@solana/wallet-adapter-react-ui/styles.css";
import Providers from './providers';
import { JetBrainsMono } from './fonts/fonts';
import FlexibleLayout from './layouts/FlexibleLayout';

export const metadata: Metadata = {
	title: 'Encifher Dex',
	description: 'Encrypted Swap on Encifher',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={JetBrainsMono.variable}>
				<Providers>
					<FlexibleLayout>{children}</FlexibleLayout>
				</Providers>
			</body>
		</html>
	);
}
