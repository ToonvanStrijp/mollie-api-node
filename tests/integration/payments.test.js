import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import dotenv from 'dotenv';

import mollie from '../../dist/mollie';

/**
 * Overwrite the default XMLHttpRequestAdapter
 */
axios.defaults.adapter = httpAdapter;

/**
 * Load the API_KEY environment variable
 */
dotenv.config();

const mollieClient = mollie({ apiKey: process.env.API_KEY });

describe('payments', () => {
  it('should integrate', (done) => {
    mollieClient.payments.all()
      .then((payments) => {
        let paymentExists;

        if (!payments.length || payments[0].isExpired()) {
          paymentExists = mollieClient.payments.create({
            amount: 10.00,
            description: 'Integration test payment',
            redirectUrl: 'https://example.com/redirect',
          })
            .then(payment => expect(payment).toBeDefined())
            .catch(err => expect(err).toBeNull());
        } else {
          paymentExists = Promise.resolve(payments[0]);
        }

        paymentExists.then((payment) => {
          /**
           * If you want to test the rest of this flow you have to
           * manually set this payment to paid.
           */
          if (!payment.isPaid()) {
            done();
          }

          mollieClient.payments_refunds.all({ paymentId: payment.id })
            .then((paymentRefunds) => {
              let refundExists;

              if (!paymentRefunds.length) {
                refundExists = mollieClient.payments_refunds.create({
                  paymentId: payments[0].id,
                  amount: 5.00,
                }).then((result) => {
                  expect(result).toBeDefined();
                  return result;
                }).catch((err) => {
                  expect(err).toBeNull();
                });
              } else {
                refundExists = Promise.resolve(paymentRefunds[0]);
              }

              refundExists.then((paymentRefund) => {
                mollieClient.payments_refunds.get(paymentRefund.id, {
                  paymentId: payments[0].id,
                }).then((result) => {
                  expect(result).toBeDefined();
                  done();
                }).catch((err) => {
                  expect(err).toBeNull();
                  done();
                });
              });
            })
            .catch((err) => {
              expect(err).toBeNull();
              done();
            });
        });
      })
      .catch((err) => {
        expect(err).toBeNull();
        done();
      });
  });
});