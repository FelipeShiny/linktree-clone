import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* <script src="../path/to/flowbite/dist/flowbite.min.js"></script> */}
                <Header />
                {children}
            </body>
        </html>
    );
}
