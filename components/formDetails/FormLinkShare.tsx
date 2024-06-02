"use client"

import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { GoCopy } from 'react-icons/go';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

function FormLinkShare({ shareUrl }: { shareUrl: string }) {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // avoid window not defined error
    }
    const shareLink = `${window.location.origin}/submit/${shareUrl}`;

    return (
        <div className='flex gap-4 flex-grow items-center'>
            <Input value = {shareLink} readOnly/>
            <Button className='w-[250px]' onClick={() => {
                navigator.clipboard.writeText(shareLink);
                toast({
                    title: "Скопировано",
                    description: "Ссылка скопирована в буфер обмена"
                })
            }}>
                <GoCopy className='mr-2 h-4 w-4'/>
                Скопировать ссылку
            </Button>
        </div>
    )
}

export default FormLinkShare