"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Logo() {
    return (
        <Link href={"/"} className='font-bold text-3xl bg-gradient-to-r from-indigo-800 to-green-400 text-transparent bg-clip-text hover:cursor-pointer'>
            ЭХО
        </Link>
    )
}

export default Logo
