import { get, startsWith } from 'lodash';

import Resource from '../../../resource';
import CustomersSubscriptionsBaseResource from './base';
import Subscription from '../../../models/Subscription';
import List from '../../../models/List';
import Payment from '../../../models/Payment';
import Customer from '../../../models/Customer';
import NotImplementedError from '../../../errors/NotImplementedError';
import { IListParams } from '../../../types/subscription/payment/params';
import { ListCallback } from '../../../types/subscription/payment/callback';

/**
 * The `customers_subscriptions` resource.
 *
 * @since 1.3.2
 */
export default class CustomersSubscriptionsResource extends CustomersSubscriptionsBaseResource {
  public static resource = 'customers_subscriptions';
  public static model = Subscription;
  public apiName = 'Subscriptions API (Payments section)';

  /**
   * Get all customer's subscriptions.
   *
   * @since 3.0.0
   *
   * @alias list
   *
   * @see https://docs.mollie.com/reference/v2/subscriptions-api/list-subscriptions-payments
   *
   * @public ✓ This method is part of the public API
   */
  public all = this.list;
  /**
   * Get all customer's subscriptions.
   *
   * @since 3.0.0
   *
   * @alias list
   *
   * @see https://docs.mollie.com/reference/v2/subscriptions-api/list-subscriptions-payments
   *
   * @public ✓ This method is part of the public API
   */
  public page = this.list;

  /**
   * Get all customer's subscriptions.
   *
   * @param params - List Customer's Subscriptions parameters
   *                 (DEPRECATED SINCE 3.0.0) Can also be a callback function
   * @param cb - (DEPRECATED SINCE 3.0.0) Callback function, can be used instead of the returned `Promise` object
   *
   * @returns A list of found Subscriptions
   *
   * @since 3.0.0
   *
   * @see https://docs.mollie.com/reference/v2/subscriptions-api/list-subscriptions-payments
   *
   * @public ✓ This method is part of the public API
   */
  public async list(params?: IListParams | ListCallback, cb?: ListCallback): Promise<List<Payment>> {
    // Using callbacks (DEPRECATED SINCE 3.0.0)
    if (typeof params === 'function' || typeof cb === 'function') {
      const customerId = get(params, 'customerId') || this.parentId;
      const subscriptionId = get(params, 'subscriptionId') || this.subscriptionId;
      if (!startsWith(customerId, Customer.resourcePrefix)) {
        Resource.createApiError('The customer id is invalid', typeof params === 'function' ? params : cb);
      }
      if (!startsWith(subscriptionId, Subscription.resourcePrefix)) {
        Resource.createApiError('The subscription id is invalid', typeof params === 'function' ? params : cb);
      }
      this.setParentId(customerId);
      this.setSubscriptionId(subscriptionId);

      return super.list(typeof params === 'function' ? null : params, typeof params === 'function' ? params : cb) as Promise<List<Payment>>;
    }

    const { customerId, subscriptionId, ...parameters } = params;
    if (!startsWith(customerId, Customer.resourcePrefix)) {
      Resource.createApiError('The customer id is invalid');
    }
    if (!startsWith(subscriptionId, Subscription.resourcePrefix)) {
      Resource.createApiError('The subscription id is invalid');
    }
    this.setParentId(customerId);
    this.setSubscriptionId(subscriptionId);

    return super.list(parameters, cb) as Promise<List<Payment>>;
  }

  /**
   * @deprecated 2.0.0. This method is not supported by the v2 API.
   */
  public async create(): Promise<Payment> {
    throw new NotImplementedError('This method does not exist', this.apiName);
  }

  /**
   * @deprecated 2.0.0. This method is not supported by the v2 API.
   */
  public async get(): Promise<Payment> {
    throw new NotImplementedError('This method does not exist', this.apiName);
  }

  /**
   * @deprecated 2.0.0. This method is not supported by the v2 API.
   */
  public async update(): Promise<Payment> {
    throw new NotImplementedError('This method does not exist', this.apiName);
  }

  /**
   * @deprecated 2.0.0. This method is not supported by the v2 API.
   */
  public async delete(): Promise<boolean> {
    throw new NotImplementedError('This method does not exist', this.apiName);
  }

  /**
   * @deprecated 2.0.0. This method is not supported by the v2 API.
   */
  public async cancel(): Promise<boolean> {
    throw new NotImplementedError('This method does not exist', this.apiName);
  }
}
