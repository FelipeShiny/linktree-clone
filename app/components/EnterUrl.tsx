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
            <form className="flex items-center justify-between gap-2">
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
                    type="submit"
                    className="cursor w-14 rounded-xl"
                    onClick={(e) => {
                        e.preventDefault();

                        let formattedUrl = newUrl.trim();
                        if (
                            !formattedUrl.startsWith('http://') &&
                            !formattedUrl.startsWith('https://')
                        ) {
                            formattedUrl = 'https://' + formattedUrl; // Add protocol if missing
                        }

                        try {
                            const url = new URL(formattedUrl);
                            const hostname = url.hostname.replace(/^www\./, ''); // Remove 'www.' if present
                            const newTitle = hostname || 'Untitled';

                            setNewTitle(newTitle);
                            addNewLink(
                                newTitle,
                                formattedUrl,
                                creatorLinks,
                                setNewTitle,
                                setNewUrl,
                                setCreatorLinks,
                            );
                            // location.reload();
                        } catch (error: any) {
                            console.error('Invalid URL:', error.message);
                            // Handle invalid URL error here, e.g., show an error message to the user
                        }
                    }}
                >
                    <p>Add</p>
                </button>
            </form>
        </div>
    );
};

export default EnterUrl;
