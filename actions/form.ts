"use server"

import prisma from "@/lib/prisma";
import { FormStats, User } from "@/types/types";
import { currentUser } from "@clerk/nextjs";

class UserNotFoundError extends Error { }

/**
 * Retrieves and calculates statistics for forms created by the current user.
 * 
 * This function fetches the total number of visits and submissions for all forms
 * created by the current user. It then calculates the submission rate and bounce rate
 * based on these statistics.
 *
 * @returns {Promise<{visits, submissions, submissionRate, bounceRate}>}
 * An object containing the total number of visits, submissions, submission rate, and bounce rate.
 *
 * @throws {UserNotFoundError} If the current user cannot be determined (e.g., not logged in).
 */
export async function GetFormStats(): Promise<FormStats> {
    const user: User | null = await currentUser();
    if (!user) {
        throw new UserNotFoundError();
    }

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

    if (visits > 0) {
        submissionRate = (submissions / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    return {
        visits,
        submissions,
        submissionRate,
        bounceRate
    }
}
