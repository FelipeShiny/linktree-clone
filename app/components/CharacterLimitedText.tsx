
'use client';

import React from 'react';

interface CharacterLimitedTextProps {
    text: string;
    limit: number;
}

const CharacterLimitedText: React.FC<CharacterLimitedTextProps> = ({ text, limit }) => {
    const displayText = text.length > limit ? `${text.substring(0, limit)}...` : text;
    
    return <span title={text}>{displayText}</span>;
};

export default CharacterLimitedText;
