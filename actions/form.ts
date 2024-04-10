"use server"

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { IFormStats, IUser } from "@/types/types";
import { currentUser } from "@clerk/nextjs";

class UserNotFoundError extends Error { }

/**
 * Retrieves the current user from the authentication context.
 * 
 * This function is used to fetch the current user's information from the authentication context.
 * It throws a `UserNotFoundError` if the user is not found or not authenticated.
 * 
 * @returns {Promise<IUser>} A promise that resolves to the current user's information.
 * @throws {UserNotFoundError} If the current user is not found or not authenticated.
 */
export async function getCurrentUser(): Promise<IUser> {
    const user: IUser | null = await currentUser();
    if (!user) {
        throw new UserNotFoundError();
    }
    return user;
}

/**
 * Retrieves and calculates statistics for forms created by the current user.
 * 
 * This function fetches the total number of visits and submissions for all forms
 * created by the current user. It then calculates the submission rate and bounce rate
 * based on these statistics.
 * 
 * @async
 * @function
 * @returns {Promise<{visits, submissions, submissionRate, bounceRate}>}
 * An object containing the total number of visits, submissions, submission rate, and bounce rate.
 * 
 * @throws {UserNotFoundError} If the current user cannot be determined (e.g., not logged in).
 * @throws {Error} If an error occurs during the retrieval of form statistics.
 */
export async function GetFormStats(): Promise<IFormStats> {
    const user: IUser = await getCurrentUser();

    const stats = await prisma.form.aggregate({
        where: {
            userId: user.id
        },
        _sum: {
            visits: true,
            submissions: true
        }
    })

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submissions || 0;

    let submissionRate = 0;
    let bounceRate = 0;

    if (visits > 0) {
        submissionRate = (submissions / visits) * 100;
        bounceRate = 100 - submissionRate;
    }

    return {
        visits,
        submissions,
        submissionRate,
        bounceRate
    }
}

/**
 * Creates a new form in the database.
 * 
 * @async
 * @function
 * @param {formSchemaType} data - The form data, including name and description.
 * @returns {Promise<number>} The ID of the created form.
 * 
 * @throws {Error} If the form is filled out incorrectly.
 * @throws {UserNotFoundError} If the current user is not found.
 * @throws {Error} If an error occurs during form creation.
 */
export async function CreateForm(data: formSchemaType): Promise<number> {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Форма не прошла валидацию, данные заполнены некорректно");
    }

    const user: IUser = await getCurrentUser();

    const { name, description } = data;

    const form = await prisma.form.create({
        data: {
            userId: user.id,
            name,
            description
        }
    })

    if (!form) {
        throw new Error("Во время создания формы что-то пошло не так");
    }

    return form.id;
}
