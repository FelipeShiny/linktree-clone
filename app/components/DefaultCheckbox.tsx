"use client";

import React, { useState } from "react";

const DefaultCheckbox = ({ instruction }: { instruction: string }) => {
    const [uniqueId] = useState(
        `checkbox-${Math.random().toString(36).substring(7)}`
    );

    return (
        <div className="flex items-center mb-1">
            <input
                id={uniqueId}
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
                htmlFor={uniqueId}
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
                {instruction}
            </label>
        </div>
    );
};

export default DefaultCheckbox;
