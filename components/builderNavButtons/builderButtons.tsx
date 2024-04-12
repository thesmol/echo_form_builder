import React from 'react';
import { Button } from '../ui/button';
import { MdPreview } from 'react-icons/md';
import { HiSaveAs } from 'react-icons/hi';
import { MdOutlinePublish } from 'react-icons/md';

export function PreviewDialogBtn() {
    return (
        <Button variant={"outline"} className='gap-2'>
            <MdPreview className='h-4 w-4' />
            Предпросмотр
        </Button>
    )
}

export function SaveFormBtn() {
    return (
        <Button variant={"outline"} className='gap-2'>
            <HiSaveAs className='h-4 w-4' />
            Сохранить
        </Button>
    )
}

export function PublishFormBtn() {
    return (
        <Button className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-green-400 hover:from-green-400 hover:to-indigo-400 transition-all duration-500'>
            <MdOutlinePublish className='h-4 w-4' />
            Опубликовать
        </Button>
    )
}

