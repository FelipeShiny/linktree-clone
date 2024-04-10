import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Trash } from 'lucide-react';
import { deleteLink } from '../utils/profile';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export function DeleteLinkButton({ linkId }: { linkId: number }) {
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const handleDelete = () => {
        deleteLink(linkId);
        setIsDeleted(true);
        setTimeout(() => {
            location.reload();
        }, 1000);
    };

    return (
        <>
            {isDeleted ? (
                <LoadingSpinner />
            ) : (
                <Dialog>
                    <DialogTrigger asChild>
                        <Trash className="w-4" />
                    </DialogTrigger>
                    <DialogContent className="bg-white sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Delete Link</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col gap-2">
                            <DialogClose asChild>
                                <Button type="button">
                                    <p>No, I don't want to delete</p>
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="bg-white outline outline-1 outline-[#8129D9]"
                                    onClick={handleDelete}
                                >
                                    <p className="text-[#8129D9]">
                                        Yes, I want to delete
                                    </p>
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
