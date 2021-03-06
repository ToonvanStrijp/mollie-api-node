import { defaults, get, startsWith } from 'lodash';

import Resource from '../../resource';
import PaymentsBaseResource from './base';
import Capture from '../../models/Capture';
import List from '../../models/List';
import Payment from '../../models/Payment';
import NotImplementedError from '../../errors/NotImplementedError';
import { IGetParams, IListParams } from '../../types/payment/capture/params';
import { GetCallback, ListCallback } from '../../types/payment/capture/callback';

/**
 * The `payments_captures` resource
 *
 * @since 1.1.1
 */
export default class PaymentsCapturesResource extends PaymentsBaseResource {
  public static resource = 'payments_captures';
  public static model = Capture;
  public apiName = 'Captures API';

  /**
   * Retrieve a list of Payment Captures
   *
   * @since 1.1.1
   *
   * @see https://docs.mollie.com/reference/v2/captures-api/list-captures
   *
   * @public ✓ This method is part of the public API
   *
   * @alias list
   */
  public all = this.list;
  /**
   * Retrieve a list of Payment Captures
   *
   * @since 3.0.0
   *
   * @see https://docs.mollie.com/reference/v2/captures-api/list-captures
   *
   * @public ✓ This method is part of the public API
   *
   * @alias list
   */
  public page = this.list;

  /**
   * Get a Payment Capture by ID
   *
   * @param id - Capture ID
   * @param params - Get Payment Capture parameters
   * @param cb - (DEPRECATED SINCE 3.0.0) Callback function, can be used instead of the returned `Promise` object
   *
   * @returns The found Payment Capture object
   *
   * @since 1.1.1
   *
   * @see https://docs.mollie.com/reference/v2/captures-api/get-Capture
   *
   * @public ✓ This method is part of the public API
   */
  public async get(id: string, params?: IGetParams, cb?: GetCallback): Promise<Capture> {
    // Using callbacks (DEPRECATED SINCE 3.0.0)
    if (typeof params === 'function' || typeof cb === 'function') {
      if (!startsWith(id, Capture.resourcePrefix)) {
        Resource.createApiError('The capture id is invalid', typeof params === 'function' ? params : cb);
      }
      const paymentId = get(params, 'paymentId') || this.parentId;
      if (!startsWith(paymentId, Payment.resourcePrefix)) {
        Resource.createApiError('The payment id is invalid', typeof params === 'function' ? params : cb);
      }
      this.setParentId(paymentId);

      return super.get(id, typeof params === 'function' ? null : params, typeof params === 'function' ? params : cb) as Promise<Capture>;
    }

    if (!startsWith(id, Capture.resourcePrefix)) {
      Resource.createApiError('The capture id is invalid');
    }
    // defaults for .withParent() compatibility (DEPRECATED SINCE 3.0.0)
    const { paymentId, ...parameters } = defaults(params, { paymentId: this.parentId });
    if (!startsWith(paymentId, Payment.resourcePrefix)) {
      Resource.createApiError('The payment id is invalid');
    }
    this.setParentId(paymentId);

    return (super.get(id, parameters, cb) as unknown) as Promise<Capture>;
  }

  /**
   * Retrieve a list of Payment Captures
   *
   * @param params - Retrieve Payment Captures list parameters
   *                 (DEPRECATED SINCE 3.0.0) Can also be a callback function
   * @param cb - (DEPRECATED SINCE 3.0.0) Callback function, can be used instead of the returned `Promise` object
   *
   * @returns A list of found Payment Captures
   *
   * @since 3.0.0
   *
   * @see https://docs.mollie.com/reference/v2/captures-api/list-captures
   *
   * @public ✓ This method is part of the public API
   */
  public async list(params?: IListParams | ListCallback, cb?: ListCallback): Promise<List<Capture>> {
    // Using callbacks (DEPRECATED SINCE 3.0.0)
    if (typeof params === 'function' || typeof cb === 'function') {
      const paymentId = get(params, 'paymentId') || this.parentId;
      if (!startsWith(paymentId, Payment.resourcePrefix)) {
        Resource.createApiError('The payment id is invalid', typeof params === 'function' ? params : cb);
      }
      this.setParentId(paymentId);

      return super.list(typeof params === 'function' ? null : params, typeof params === 'function' ? params : cb) as Promise<List<Capture>>;
    }

    // defaults for .withParent() compatibility (DEPRECATED SINCE 3.0.0)
    const { paymentId, ...parameters } = defaults(params, { paymentId: this.parentId });
    if (!startsWith(paymentId, Payment.resourcePrefix)) {
      Resource.createApiError('The payment id is invalid');
    }
    this.setParentId(paymentId);

    return super.list(parameters, cb);
  }

  /**
   * @deprecated 2.0.0. This method is not supported by the v2 API.
   */
  public async create(): Promise<Capture> {
    throw new NotImplementedError('This method does not exist', this.apiName);
  }

  /**
   * @deprecated 2.0.0. This method is not supported by the v2 API.
   */
  public async update(): Promise<Capture> {
    throw new NotImplementedError('This method does not exist', this.apiName);
  }

  /**
   * @deprecated 2.0.0. This method is not supported by the v2 API.
   */
  public async cancel(): Promise<boolean> {
    throw new NotImplementedError('This method does not exist', this.apiName);
  }

  /**
   * @deprecated 2.0.0. This method is not supported by the v2 API.
   */
  public async delete(): Promise<boolean> {
    throw new NotImplementedError('This method does not exist', this.apiName);
  }
}
