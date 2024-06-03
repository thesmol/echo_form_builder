import React, { useTransition } from 'react';
import { Button } from '../ui/button';
import { MdPreview } from 'react-icons/md';
import { HiSaveAs } from 'react-icons/hi';
import { MdOutlinePublish } from 'react-icons/md';
import useDesigner from '@/hooks/useDesigner';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { FormElements } from '../builder/FormElements';
import { PublishForm, UpdateFormContent } from '@/actions/form';
import { toast } from '../ui/use-toast';
import { ImSpinner10 } from 'react-icons/im';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useRouter } from 'next/navigation';

export function PreviewDialogBtn() {
    const { elements } = useDesigner();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} className='gap-2'>
                    <MdPreview className='h-4 w-4' />
                    Предпросмотр
                </Button>
            </DialogTrigger>
            <DialogContent className='w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 g-0 border-0 rounded-0 overflow-y-auto'>
                <div className="px-4 py-2 border-b">
                    <h1 className="text-lg font-bold text-muted-foreground">
                        Предпросмотр формы
                    </h1>
                    <p className="text-s text-muted-foreground">
                        Именно так будет выглядеть форма после публикации.
                    </p>
                </div>
                <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
                    <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-xl p-8">
                        {elements.map(element => {
                            const FormComponent = FormElements[element.type].formComponent;
                            return <FormComponent key={element.id} elementInstance={element} />
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function SaveFormBtn({ id }: { id: number }) {
    const { elements } = useDesigner();
    const [loading, startTransition] = useTransition();

    const updateFormContent = async () => {
        try {
            const JsonElements = JSON.stringify(elements);
            await UpdateFormContent(id, JsonElements);
            toast({
                title: "Успех",
                description: "Форма была успешно сохранена!"
            })
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Что-то пошло не так, форма не была сохранена(",
                variant: "destructive"
            })
        }
    }

    return (
        <Button
            variant={"outline"}
            className='relative gap-2'
            disabled={loading}
            onClick={() => startTransition(updateFormContent)}
        >
            <HiSaveAs className='h-4 w-4' />
            <p className={`${loading ? "opacity-0" : ""}`}>Сохранить</p>
            {loading && (
                <ImSpinner10 className='absolute left-1/2 animate-spin m-auto' />
            )}
        </Button>
    )
}

export function PublishFormBtn({ id }: { id: number }) {
    const { elements } = useDesigner();
    const [loading, startTransition] = useTransition();
    const router = useRouter();

    async function publishForm() {
        try {
            const JsonElements = JSON.stringify(elements);
            await UpdateFormContent(id, JsonElements);
            await PublishForm(id);
            toast({
                title: "Успех",
                description: "Форма была успешно опубликована!"
            })
            router.refresh();
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Что-то пошло не так, форма не была опубликована(",
                variant: "destructive"
            })
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-green-400 hover:from-green-400 hover:to-indigo-400 transition-all duration-500'>
                    <MdOutlinePublish className='h-4 w-4' />
                    Опубликовать
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Вы абсолютно уверены?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Это действие не может быть отменено. После публикации у Вас не будет возможности редактировать эту форму. <br /><br />
                        <span className="font-medium">
                            Публикуя форму, вы сделаете ее доступной и сможете начать получать ответы.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Отменить
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        className='relative'
                        onClick={(e) => {
                            e.preventDefault();
                            startTransition(publishForm);
                        }}>
                        <p className={`${loading ? "opacity-0" : ""}`}>Опубликовать</p>
                        {loading && (
                            <ImSpinner10 className='absolute animate-spin m-auto' />
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    )
}

