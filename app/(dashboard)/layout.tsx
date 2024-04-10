import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { UserButton } from '@clerk/nextjs'
import React, { ReactNode } from 'react'

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className='flex flex-col min-h-screen min-w-full bg-background max-h-screen'>
            <nav className='flex justify-between border-b border-border h-[60px] px-4 items-center flex-shrink-0'>
                <Logo />
                <div className='flex gap-4 items-center'>
                    <ThemeSwitcher />
                    <UserButton afterSignOutUrl='/sign-in' />
                </div>
            </nav>
            <main className='flex w-full flex-grow overflow-y-auto mb-5'>{children}</main>
        </div>
    )
}

export default Layout
