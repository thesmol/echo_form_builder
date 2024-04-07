"use client"

import { formSchema, formSchemaType } from '@/schemas/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { ImSpinner2 } from "react-icons/im";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";

import { toast } from './ui/use-toast';
import { CreateForm } from '@/actions/form';
import CreationForm from './CreationForm';

function CreateFormBtn() {
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    });

    async function onSubmit(values: formSchemaType) {
        try {
            const formId = await CreateForm(values);
            toast({
                title: "Успех",
                description: "Форма успешно создана",
            });
            console.log("FORM ID: ", formId);
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Что-то пошло не так, пожалуйста, попробуйте позже",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    className='group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4'
                >
                    <BsFileEarmarkPlus className='h-8 w-8 text-muted-foreground group-hover:text-primary' />
                    <p className='font-bold text-xl text-muted-foreground group-hover:text-primary'>Создать новую форму</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Создать форму
                    </DialogTitle>
                    <DialogDescription>
                        Создайте форму чтобы начать собирать данные
                    </DialogDescription>
                </DialogHeader>

                <CreationForm form={form} onSubmit={onSubmit} />

                <DialogFooter>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={form.formState.isSubmitting}
                        className='w-full mt-4'
                    >
                        {!form.formState.isSubmitting && <span>Сохранить</span>}
                        {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default CreateFormBtn;