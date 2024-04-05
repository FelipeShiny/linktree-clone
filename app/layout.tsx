import './globals.css';
import Header from './components/Header';
import { Outfit } from 'next/font/google';
import { WalkthroughDialog } from './components/WalkthroughDialog';

const outfit = Outfit({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={outfit.className}>
                {/* <script src="../path/to/flowbite/dist/flowbite.min.js"></script> */}
                <Header />
                {children}
                <div className="fixed bottom-0 mx-auto flex w-full justify-center">
                    <WalkthroughDialog />
                </div>
            </body>
        </html>
    );
}
