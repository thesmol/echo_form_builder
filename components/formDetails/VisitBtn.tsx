"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';

function VisitBtn({ shareUrl }: { shareUrl: string }) {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // avoid window not defined error
    }

    const shareLink = `${window.location.origin}/submit/${shareUrl}`;
    return (
        <Button className='w-[200px]' onClick={() => window.open(shareLink, "_blank")}>
            Посетить
        </Button>
    )
}

export default VisitBtn;