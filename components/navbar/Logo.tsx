"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Logo() {
    return (
        <Link href={"/"} className='flex gap-2 items-center'>
            <Image src="/logo.svg" alt="logo" width={40} height={25} className='w-[40px] h-[25px]' />
            <h1 className='font-bold text-3xl bg-gradient-to-r from-indigo-800 to-green-400 text-transparent bg-clip-text'>ЭХО</h1>
        </Link>
    )
}

export default Logo;
