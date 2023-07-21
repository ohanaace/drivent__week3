import { ApplicationError } from "@/protocols";

export function forbiddenError(): ApplicationError {
    return {
        name: 'ForbiddenError',
        message: 'You cannot complete this operation'
    };
};