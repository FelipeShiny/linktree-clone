import React from 'react';
import { addNewLink } from '../utils/profile';
import { Link } from '../types/linkTypes';

const EnterUrl = ({
    newUrl,
    setNewUrl,
    newTitle,
    setNewTitle,
    creatorLinks,
    setCreatorLinks,
}: {
    newUrl: string;
    setNewUrl: React.Dispatch<React.SetStateAction<string>>;
    newTitle: string;
    setNewTitle: React.Dispatch<React.SetStateAction<string>>;
    creatorLinks: Link[];
    setCreatorLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}) => {
    return (
        <div className="flex w-full flex-col gap-6 rounded-2xl border bg-white p-2 px-6 py-9 shadow">
            <h2>Enter URL</h2>
            <div className="flex items-center justify-between gap-2">
                <input
                    className="w-full rounded-xl bg-[#f3f3f1]"
                    type="text"
                    name="url"
                    id="url"
                    value={newUrl}
                    placeholder="URL"
                    onChange={(e) => {
                        setNewUrl(e.target.value);
                    }}
                />
                <button
                    type="button"
                    className="cursor w-14 rounded-xl"
                    onClick={() => {
                        const url = new URL(newUrl);
                        const newTitle = url.hostname;
                        setNewTitle(newTitle);

                        addNewLink(
                            newTitle,
                            newUrl,
                            creatorLinks,
                            setNewTitle,
                            setNewUrl,
                            setCreatorLinks,
                        );
                    }}
                >
                    <p>Add</p>
                </button>
            </div>
        </div>
    );
};

export default EnterUrl;
