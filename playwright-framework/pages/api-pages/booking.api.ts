import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseAPI } from './base.api';
import { Booking, BookingId, BookingResponse } from '../../test-data/bookings';
import { buildQueryString } from '../../utils/helpers';

export class BookingAPI extends BaseAPI {
  private token: string | null = null;

  constructor(request: APIRequestContext) {
    super(request, process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com');
  }

  private authHeader(): Record<string, string> {
    if (!this.token) throw new Error('Not authenticated - call authenticate() first.');
    return { Cookie: `token=${this.token}` };
  }

  async authenticate(username: string, password: string): Promise<string> {
    const response = await this.post('/auth', { username, password });
    const body = await this.parseJSON<{ token: string } | { reason: string }>(response);
    if ('reason' in body) throw new Error(`Auth failed: ${(body as { reason: string }).reason}`);
    this.token = (body as { token: string }).token;
    return this.token;
  }

  async authenticateRaw(username: string, password: string): Promise<APIResponse> {
    return this.post('/auth', { username, password });
  }

  async createBooking(booking: Booking): Promise<BookingResponse> {
    const response = await this.post('/booking', booking);
    return this.parseJSON<BookingResponse>(response);
  }

  async createBookingRaw(data: unknown): Promise<APIResponse> {
    return this.post('/booking', data);
  }

  async getBooking(id: number): Promise<Booking> {
    const response = await this.get(`/booking/${id}`);
    return this.parseJSON<Booking>(response);
  }

  async getBookingRaw(id: number): Promise<APIResponse> {
    return this.get(`/booking/${id}`);
  }

  async getAllBookingIds(filters?: Record<string, string | number | boolean>): Promise<BookingId[]> {
    const query = filters ? `?${buildQueryString(filters)}` : '';
    const response = await this.get(`/booking${query}`);
    return this.parseJSON<BookingId[]>(response);
  }

  async updateBooking(id: number, booking: Booking): Promise<Booking> {
    const response = await this.put(`/booking/${id}`, booking, this.authHeader());
    return this.parseJSON<Booking>(response);
  }

  async partialUpdateBooking(id: number, partial: Partial<Booking>): Promise<Booking> {
    const response = await this.patch(`/booking/${id}`, partial, this.authHeader());
    return this.parseJSON<Booking>(response);
  }

  async deleteBooking(id: number): Promise<APIResponse> {
    return this.delete(`/booking/${id}`, this.authHeader());
  }
}
