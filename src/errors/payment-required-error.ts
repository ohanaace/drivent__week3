export function paymentRequiredError(){
    throw {
        name: 'PaymentRequiredError',
        message: 'You must complete payment before carrying on'
    };
};