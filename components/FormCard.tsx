import { Form } from '@prisma/client';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { BiRightArrowAlt } from 'react-icons/bi';
import { FaEdit, FaWpforms } from 'react-icons/fa';
import { LuView } from 'react-icons/lu';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from './ui/card';

function FormCard({ form }: { form: Form }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <span className="truncate font-bold">
                        {form.name}
                    </span>
                    {form.published && <Badge>Опубликовано</Badge>}
                    {!form.published && <Badge variant={"destructive"}>Черновик</Badge>}
                </CardTitle>
                <CardDescription className='flex items-center justify-between text-muted-foreground text-sm'>
                    {formatDistance(form.createdAt, new Date(), {
                        addSuffix: true,
                        locale: ru,
                    })}
                    {
                        form.published && (
                            <span className="flex items-center gap-2">
                                <LuView className="text-muted-foreground" />
                                <span>{form.visits.toLocaleString()}</span>
                                <FaWpforms className="text-muted-foreground" />
                                <span>{form.submissions.toLocaleString()}</span>
                            </span>
                        )
                    }
                </CardDescription>
            </CardHeader>

            <CardContent className='h-[20px] truncate text-sm text-muted-foreground'>
                {form.description || "Описания нет"}
            </CardContent>

            <CardFooter>
                {form.published && (
                    <Button asChild className='w-full mt-2 text-md gap-4'>
                        <Link href={`/forms/${form.id}`}>
                            Посмотреть ответы <BiRightArrowAlt />
                        </Link>
                    </Button>
                )}
                {!form.published && (
                    <Button
                        asChild
                        className='w-full mt-2 text-md gap-4'
                        variant={"secondary"}
                    >
                        <Link href={`/builder/${form.id}`}>
                            Редактировать форму<FaEdit />
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default FormCard;
