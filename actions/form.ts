"use server"

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { IFormStats, IUser } from "@/types/types";
import { currentUser } from "@clerk/nextjs";
import { Form } from "@prisma/client";

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
 * @returns {Promise<Form>} The created form.
 * 
 * @throws {Error} If the form is filled out incorrectly.
 * @throws {UserNotFoundError} If the current user is not found.
 * @throws {Error} If an error occurs during form creation.
 */
export async function CreateForm(data: formSchemaType): Promise<Form> {
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

    return form;
}

/**
 * Retrieves all forms associated with the current user from the database.
 * 
 * This function fetches all forms created by the current user, ordered by their creation date in descending order.
 * It uses the Prisma client to query the database and returns a promise that resolves to an array of `Form` objects.
 * 
 * @async
 * @function
 * @returns {Promise<Form[]>} A promise that resolves to an array of `Form` objects. The array can be empty if no forms are found for the current user.
 * @throws {UserNotFoundError} If the current user is not found or not authenticated.
 * @throws {Error} If an error occurs during the database query.
 */
export async function GetForms(): Promise<Form[]> {
    const user: IUser = await getCurrentUser();

    return await prisma.form.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

/**
 * Retrieves a specific form by its ID from the database.
 *
 * This function fetches a form with the specified ID that is associated with the current user.
 * It uses the Prisma client to query the database and returns a promise that resolves to a `Form` object.
 * If no form is found with the given ID, it returns `null`.
 *
 * @async
 * @function
 * @param {number} id - The ID of the form to retrieve.
 * @returns {Promise} A promise that resolves to the `Form` object if found, or `null` if not found.
 * @throws {UserNotFoundError} If the current user is not found or not authenticated.
 * @throws {Error} If an error occurs during the database query.
 */
export async function GetFormById(id: number): Promise<Form | null> {
    const user: IUser = await getCurrentUser();

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        }
    })
}


/**
 * Updates the content of a form identified by its ID.
 *
 * This function updates the content of a form in the database. It requires the form's ID and the new content as input. The content is expected to be a JSON string.
 *
 * @param {number} id - The unique identifier of the form whose content needs to be updated.
 * @param {string} jsonContent - The new content for the form, provided as a JSON string.
 * @throws {UserNotFoundError} If the current user is not found or not authenticated.
 */
export async function UpdateFormContent(
    id: number,
    jsonContent: string
) {
    const user: IUser = await getCurrentUser();

    return await prisma.form.update({
        where: {
            userId: user.id,
            id
        },
        data: {
            content: jsonContent
        }
    })
}


/**
 * Marks a form as published.
 *
 * This function updates the status of a form in the database to indicate that it has been published.
 * It requires the ID of the form to identify which form should be updated.
 *
 * @async
 * @function
 * @param id - The unique identifier of the form to publish.
 * @returns A promise that resolves when the form has been successfully marked as published.
 * @throws If the current user is not found or not authenticated.
 * @throws If an error occurs during the database operation.
 */
export async function PublishForm(id: number) {
    const user: IUser = await getCurrentUser();

    return await prisma.form.update({
        where: {
            userId: user.id,
            id
        },
        data: {
            published: true
        }
    })
}

/**
 * Retrieves a specific form along with its submissions by its ID.
 *
 * This function fetches a form with the specified ID that is associated with the current user,
 * including all related submissions. It uses the Prisma client to query the database and returns
 * a promise that resolves to a `Form` object with included `FormSubmissions`.
 *
 * @async
 * @function
 * @param id - The ID of the form to retrieve along with its submissions.
 * @returns A promise that resolves
 * to the `Form` object with its submissions if found, or `null` if not found.
 * @throws If the current user is not found or not authenticated.
 * @throws If an error occurs during the database query.
 */
export async function GetFormWithSubmissions(id: number) {
    const user: IUser = await getCurrentUser();

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        },
        include: {
            FormSubmissions: true
        }
    })
}

/**
 * Fetches the content of a form by its shared URL and increments the visit count.
 *
 * This function searches for a form in the database that matches the provided `shareURL`.
 * If found, it retrieves the form's content and increments the `visits` field by 1.
 * This is useful for tracking how many times a form has been accessed through its public URL.
 *
 * @async
 * @function
 * @param formUrl - The shared URL of the form to fetch and update.
 * @returns A promise that resolves to the content of the form as a string.
 * @throws If an error occurs while querying the database.
 */
export async function GetFormContentByUrl(formUrl: string) {

    return await prisma.form.update({
        select: {
            content: true,
        },
        data: {
            visits: {
                increment: 1,
            }
        },
        where: {
            shareURL: formUrl,
        }
    })
}

/**
 * Submits a form by updating its record in the database and creating a new submission entry.
 *
 * This function is designed to handle the submission of a form identified by its shared URL (`formUrl`). It increments the form's submission count and creates a new submission record with the provided JSON content (`jsonContent`). This is useful for tracking each submission made to a form.
 *
 * @async
 * @function SubmitForm
 * @param formUrl - The shared URL of the form to submit. This must match exactly with one of the existing form records in the database.
 * @param jsonContent - The JSON content representing the submitted form data. This should be a serialized JSON string.
 * @returns A promise that resolves once the form submission has been processed. Note that this function does not return the newly created submission record directly but updates the form record instead.
 * @throws If an error occurs while querying the database, such as issues connecting to the database or errors returned by Prisma.
 */
export async function SubmitForm(formUrl: string, jsonContent: string) {
    return await prisma.form.update({
        data: {
            submissions: {
                increment: 1,
            },
            FormSubmissions: {
                create: {
                    content: jsonContent,
                }
            }
        },
        where: {
            shareURL: formUrl,
        }
    })
}