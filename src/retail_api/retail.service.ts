import { Injectable } from '@nestjs/common'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'
import axios, { AxiosInstance } from 'axios'
import { serialize } from '../tools'
import { plainToClass } from 'class-transformer'

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.RETAIL_URL}/api/v5`,
      timeout: 10000,
      headers: {},
      params: {
        apiKey: process.env.RETAIL_KEY,
      },
    })

    this.axios.interceptors.request.use((config) => {
      // console.log(config.url)
      return config
    })
    this.axios.interceptors.response.use(
      (r) => {
        // console.log("Result:", r.data)
        return r
      },
      (r) => {
        // console.log("Error:", r.response.data)
        return r
      },
    )
  }

  async orders(filter?: OrdersFilter): Promise<[Order[], RetailPagination]> {
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)
    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    //console.log(orders)
    const pagination: RetailPagination = resp.data.pagination
    console.log('XXX ', resp.data.pagination)
    console.log('YYY ')
    return [orders, pagination]
  }

  //

  async findOrder(id: string): Promise<Order | null> {
    const filter = { filter: { ids: [id] } }
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)
    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    return orders[0]
  }

  async orderStatuses(id: string): Promise<CrmType[]> {
    const filter = { filter: { ids: [id] } }
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders/statuses?' + params)
    console.log(resp)
    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    return null
  }

  async productStatuses(): Promise<CrmType[] | null> {
    return null
  }

  async deliveryTypes(): Promise<CrmType[] | null> {
    return null
  }
}
