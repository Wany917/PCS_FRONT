import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints, axiosInstance } from '../lib/axios';

export interface Booking {
  id: number;
  propertyId: number;
  userId: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  guests: number;
  propertyName: string;
  pricePerNight: number;
  totalPriceNight: number;
  serviceFee: number;
  discount: number;
  totalPrice: number;
  nights: number;
}

export interface BookingFilters {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export function useGetPropertyBookings(propertyId?: number) {
    const URL = propertyId ? endpoints.properties.bookings.list(propertyId) : null;
  
    const { data, error, isValidating, mutate } = useSWR(URL, fetcher);
  
    const memoizedValue = useMemo(
      () => ({
        bookings: data || [],
        bookingsLoading: !error && !data,
        bookingsError: error,
        bookingsValidating: isValidating,
        bookingsEmpty: !(!error && !data) && !data?.length,
        mutate,
      }),
      [data, error, isValidating, mutate]
    );
  
    return memoizedValue;
  }

export function useGetPropertyBooking(propertyId: number, bookingId: number) {
  const URL = endpoints.properties.bookings.get(propertyId, bookingId);

  const { data, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      booking: data || null,
      bookingLoading: !error && !data,
      bookingError: error,
      bookingValidating: isValidating,
      mutate,
    }),
    [data, error, isValidating, mutate]
  );

  return memoizedValue;
}

export async function createPropertyBooking(propertyId: number, bookingData: Omit<Booking, 'id'>) {
  try {
    const response = await axiosInstance.post(endpoints.properties.bookings.create(propertyId), bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function updatePropertyBooking(propertyId: number, bookingId: number, bookingData: Partial<Booking>) {
  try {
    const response = await axiosInstance.put(endpoints.properties.bookings.update(propertyId, bookingId), bookingData);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}

export async function deletePropertyBooking(propertyId: number, bookingId: number) {
  try {
    const response = await axiosInstance.delete(endpoints.properties.bookings.delete(propertyId, bookingId));
    return response.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

export function useCreatePropertyBooking(propertyId: number) {
  const { mutate } = useSWR(endpoints.properties.bookings.list(propertyId));

  const createBookingMutation = async (bookingData: Omit<Booking, 'id'>) => {
    try {
      const newBooking = await createPropertyBooking(propertyId, bookingData);
      mutate();
      return newBooking;
    } catch (error) {
      throw error;
    }
  };

  return createBookingMutation;
}

export function useUpdatePropertyBooking(propertyId: number, bookingId: number) {
  const { mutate } = useSWR(endpoints.properties.bookings.get(propertyId, bookingId));

  const updateBookingMutation = async (bookingData: Partial<Booking>) => {
    try {
      const updatedBooking = await updatePropertyBooking(propertyId, bookingId, bookingData);
      mutate();
      return updatedBooking;
    } catch (error) {
      throw error;
    }
  };

  return updateBookingMutation;
}

export function useDeletePropertyBooking(propertyId: number) {
  const { mutate } = useSWR(endpoints.properties.bookings.list(propertyId));

  const deleteBookingMutation = async (bookingId: number) => {
    try {
      await deletePropertyBooking(propertyId, bookingId);
      mutate();
    } catch (error) {
      throw error;
    }
  };

  return deleteBookingMutation;
}

export function usePropertyAvailability(propertyId: number) {
  const URL = endpoints.properties.bookings.availability(propertyId);

  const { data, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      availableDates: data || [],
      availabilityLoading: !error && !data,
      availabilityError: error,
      availabilityValidating: isValidating,
    }),
    [data, error, isValidating]
  );

  return memoizedValue;
}