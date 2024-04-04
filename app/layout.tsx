import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import { Outfit } from 'next/font/google';
import Walkthrough from './components/Walkthrough';

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
                <Walkthrough />
            </body>
        </html>
    );
}
