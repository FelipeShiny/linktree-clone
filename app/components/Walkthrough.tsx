import React from 'react';
import { ChevronsUp } from 'lucide-react';

const Walkthrough = () => {
    return (
        <div className="flex w-44 flex-col items-center gap-1 rounded-t-3xl bg-[#8129D9] p-6 text-white">
            <ChevronsUp />
            <h4 className="text-white">Walkthrough</h4>
        </div>
    );
};

export default Walkthrough;
