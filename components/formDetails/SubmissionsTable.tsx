import { GetFormWithSubmissions } from '@/actions/form';
import { Column, ElementsType, FormElementInstance, Row } from '@/types/types';
import React, { ReactNode } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';

async function SubmissionsTable({ id }: { id: number }) {
    const form = await GetFormWithSubmissions(id);

    if (!form) {
        throw new Error("form not found");
    }

    const formElements = JSON.parse(form.content) as FormElementInstance[];
    const columns: Column[] = [];

    formElements.forEach(element => {
        switch (element.type) {
            case "CheckBoxField":
            case "SelectField":
            case "DateField":
            case "TextAreaField":
            case "NumberField":
            case "TextField":
                columns.push({
                    id: element.id,
                    label: element.extraAttributes?.label,
                    required: element.extraAttributes?.required,
                    type: element.type
                });
                break;
            default:
                break;
        }
    })

    const rows: Row[] = [];
    form.FormSubmissions.forEach((submission) => {
        const content = JSON.parse(submission.content);
        rows.push({
            ...content,
            submittedAt: submission.createdAt
        })
    })

    return (
        <>
            <h1 className="text-2xl font-bold my-4">Ответы</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.id} className='uppercase text-xs'>
                                    {column.label}
                                </TableHead>
                            ))}
                            <TableHead className='text-muted-forefround text-right uppercase'>
                                Заполнено
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <RowCell
                                        key={column.id}
                                        type={column.type}
                                        value={row[column.id]}
                                    />
                                ))}
                                <TableCell className='text-muted-foreground text-right'>
                                    {formatDistance(row.submittedAt, new Date(), {
                                        addSuffix: true,
                                        locale: ru,
                                    })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default SubmissionsTable;

function RowCell({
    type,
    value }: {
        type: ElementsType,
        value: string
    }) {
    let node: ReactNode = value;
    return (
        <TableCell>
            {node}
        </TableCell>
    )
}
