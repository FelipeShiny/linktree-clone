import React from 'react';
import { Link } from '../types/linkTypes';

const CreatorLinks = ({
    isLinkLoading,
    creatorLinks,
}: {
    isLinkLoading: boolean;
    creatorLinks: Link[];
}) => {
    return (
        <div className="flex w-full flex-col gap-3">
            {isLinkLoading ? (
                <h4 className="text-center">Loading...</h4>
            ) : creatorLinks && creatorLinks.length > 0 ? (
                creatorLinks.map((link: Link, index: number) => (
                    <div key={index}>
                        <button
                            onClick={() =>
                                window.open(
                                    link.url.startsWith('http')
                                        ? link.url
                                        : `https://${link.url}`,
                                    '_blank',
                                )
                            }
                            rel="noopener noreferrer"
                            className="flex h-16 items-center justify-center rounded-full bg-[#222222] p-2 text-white hover:opacity-80"
                        >
                            <p>{link.title}</p>
                        </button>
                    </div>
                ))
            ) : (
                <h5 className="text-center">
                    This creator does not have any links.
                </h5>
            )}
        </div>
    );
};

export default CreatorLinks;
