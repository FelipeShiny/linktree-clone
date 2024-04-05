import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogClose,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronsUp } from 'lucide-react';
import DefaultCheckbox from './DefaultCheckbox';

export function WalkthroughDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex w-44 flex-col items-center gap-1 rounded-t-3xl bg-[#8129D9] p-6 text-white">
                    <ChevronsUp />
                    <h4 className="text-white">Walkthrough</h4>
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-scroll bg-white sm:max-w-[425px] lg:max-w-screen-lg">
                <DialogClose asChild>
                    <Button type="button">
                        <p>Close</p>
                    </Button>
                </DialogClose>
                <DialogHeader className="bg-white text-left">
                    <h3>Walkthrough</h3>
                    <h6>
                        This guide offers step-by-step instructions to showcase
                        the functionalities of this application.
                    </h6>
                    <p className="font-bold">1. Creator profile</p>
                    <DefaultCheckbox instruction="Click on any one of the creators" />
                    <DefaultCheckbox instruction="Try clicking on one of the links" />

                    <p className="font-bold">2. Log in as creator</p>
                    <h3 className="pb-2 text-base">Login</h3>
                    <DefaultCheckbox instruction="Click 'Login' button" />
                    <DefaultCheckbox instruction="Use the provided login credential" />
                    <h3 className="pb-2 text-base ">Add new link</h3>
                    <DefaultCheckbox instruction="Go to test_user creator page" />
                    <DefaultCheckbox instruction="Enter the title and the URL of your new link then press 'Add new link' using the form at the bottom of the page" />
                    <DefaultCheckbox instruction="Try your newly added link" />
                    <h3 className="pb-2 text-base ">Delete link</h3>
                    <DefaultCheckbox instruction="On the right side of the link, press the '⋮' button then press delete" />
                    <h3 className="pb-2 text-base ">Authentication</h3>
                    <DefaultCheckbox instruction="Go back to the home page and choose other creator page" />
                    <DefaultCheckbox instruction="Notice that you cannot add link for other creator other than yours" />
                    <h3 className="pb-2 text-base ">Change profile picture</h3>
                    <DefaultCheckbox instruction="Go to test_user creator page" />
                    <DefaultCheckbox instruction="Under 'Upload Profile Picture', press 'Choose File'. Select any image you want to use for profile picture" />
                    <DefaultCheckbox instruction="The page should refresh itself and you will see your new profile picture" />

                    <p className="font-bold">3. Sign up as creator</p>
                    <h3 className="pb-2 text-base ">Sign Up</h3>
                    <DefaultCheckbox instruction="Click 'Login' button" />
                    <DefaultCheckbox instruction="On Login page, Click 'Sign Up' button" />
                    <DefaultCheckbox instruction="Enter your username, email and password" />
                    <DefaultCheckbox instruction="You should be redirected to your creator page and be able to do all the things from previous tutorial" />

                    <div className="relative mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                        <strong className="font-bold">Warning!</strong>
                        <p>
                            Please use throwaway email and password because I do
                            not even know how secure my app is lol
                        </p>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
