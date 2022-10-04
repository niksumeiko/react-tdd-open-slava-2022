import type { FC } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import styles from '../App.module.scss';
import type { NewPayment } from './PaymentService';
import { isPaymentAvailable } from './CreatePaymentService';
import { useCreatePayment } from './useCreatePayment';

const FORM_VALIDATION_SCHEMA = object({
    iban: string().required('Missing IBAN'),
});

export const PaymentForm: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewPayment>({
        resolver: yupResolver(FORM_VALIDATION_SCHEMA),
    });
    const mutation = useCreatePayment();
    const onSubmit = (values: NewPayment) => {
        mutation.createPayment(values);
    };

    if (isPaymentAvailable(mutation)) {
        const { payment } = mutation;

        return (
            <div data-test="payment-success">
                <h3>A payment succeed!</h3>
                <p>
                    €{payment.amount} have been sent to {payment.iban}
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className={styles.formInputField}>
                <label htmlFor="iban" className={styles.formLabel}>
                    Recipient (IBAN)
                </label>
                <input
                    {...register('iban')}
                    id="iban"
                    className={styles.formInput}
                    data-test="iban"
                />
                {errors.iban && <p className={styles.formError}>{errors.iban.message}</p>}
            </div>
            <div className={styles.formInputField}>
                <label htmlFor="amount" className={styles.formLabel}>
                    Amount
                </label>
                <input
                    {...register('amount')}
                    id="amount"
                    placeholder="0.00"
                    className={styles.formInput}
                    data-test="amount"
                />
            </div>
            <button type="submit" disabled={mutation.isPaying} className={styles.formButton}>
                Make payment
            </button>
        </form>
    );
};