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
import { ChevronsUp, Pencil, X } from 'lucide-react';
import DefaultCheckbox from './DefaultCheckbox';
import { uploadProfilePicture } from '../utils/profile';
import { useState } from 'react';

export function ChangeProfilePictureDialog({
    creatorId,
    router,
}: {
    creatorId: string;
    router: any;
}) {
    const [selectedFile, setSelectedFile] = useState<File | undefined>(
        undefined,
    );
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="cursor absolute bottom-0 right-0 flex justify-end ">
                    <div className="rounded-full bg-white p-2 shadow-lg">
                        <Pencil className="h-6 w-6 cursor-pointer" />
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-white py-12">
                <DialogHeader className="text-left">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between">
                            <h2>Upload Profile Picture</h2>
                            <DialogClose asChild className="flex justify-end">
                                <div>
                                    <Button type="button" className="w-10">
                                        <p>
                                            <X />
                                        </p>
                                    </Button>
                                </div>
                            </DialogClose>
                        </div>
                        <input
                            type="file"
                            onChange={(e) => {
                                if (
                                    e.target.files &&
                                    e.target.files.length == 1
                                ) {
                                    setSelectedFile(e.target.files[0]);
                                }
                            }}
                        />
                        {selectedFile && (
                            <DialogClose>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (creatorId && selectedFile) {
                                            uploadProfilePicture(
                                                creatorId,
                                                selectedFile,
                                                router,
                                            );
                                        }
                                        setSelectedFile(undefined);
                                    }}
                                >
                                    <p>Submit</p>
                                </button>
                            </DialogClose>
                        )}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
