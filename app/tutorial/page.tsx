import React from "react";
import DefaultCheckbox from "../components/DefaultCheckbox";

const Tutorial = () => {
    return (
        <div className="mx-auto w-[90%] flex flex-col">
            <h1 className="text-3xl font-bold py-10">
                Low quality tutorial on how to use the features from this
                projects
            </h1>
            <div className="pb-4">
                <h2 className="text-lg font-bold pb-2">1. Creator profile</h2>
                <DefaultCheckbox instruction="Click on one of the creators" />
                <DefaultCheckbox instruction="Try clicking on one of the links" />
            </div>
            <div className="pb-4">
                <h2 className="text-lg font-bold pb-2">2. Log in as creator</h2>
                <h3 className="text-base font-bold pb-2">Login</h3>
                <DefaultCheckbox instruction="Click 'Login' button" />
                <DefaultCheckbox instruction="Use the provided login credential" />
                <h3 className="text-base font-bold pb-2">Add new link</h3>
                <DefaultCheckbox instruction="Go to test_user creator page" />
                <DefaultCheckbox instruction="Enter the title and the URL of your new link then press 'Add new link' using the form at the bottom of the page" />
                <DefaultCheckbox instruction="Try your newly added link" />
                <h3 className="text-base font-bold pb-2">Delete link</h3>
                <DefaultCheckbox instruction="On the right side of the link, press the '⋮' button then press delete" />
                <h3 className="text-base font-bold pb-2">Authentication</h3>
                <DefaultCheckbox instruction="Go back to the home page and choose other creator page" />
                <DefaultCheckbox instruction="Notice that you cannot add link for other creator other than yours" />
            </div>
        </div>
    );
};

export default Tutorial;
