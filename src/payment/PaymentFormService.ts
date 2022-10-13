import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import type { Iban } from './IbanService';
import type { Payment } from './PaymentService';
import { isDomesticPayment } from './PaymentService';

const FORM_VALIDATION_SCHEMA = object({
    iban: string().required('Missing IBAN'),
    bic: string().when('iban', {
        is: (iban: Iban) => !isDomesticPayment({ iban }),
        then: (schema) => schema.required('Missing BIC'),
    }),
});

export const PAYMENT_FORM_OPTIONS = {
    resolver: yupResolver(FORM_VALIDATION_SCHEMA),
    defaultValues: {
        iban: '',
        amount: '',
    },
};

export function getSuccessMessage({ type }: Pick<Payment, 'type'>): string {
    if (type === 'DOM') {
        return 'A domestic payment succeed!';
    }

    return 'An international payment succeed!';
}
