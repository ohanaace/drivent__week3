import { ApplicationError } from "@/protocols";

export function paymentRequiredError(): ApplicationError{
    throw {
        name: 'PaymentRequiredError',
        message: 'You must complete payment before carrying on'
    };
};