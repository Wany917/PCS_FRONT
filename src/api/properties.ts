'use client';
import useSWR, { mutate } from 'swr';
import { useEffect,useState,useMemo } from 'react';
import axios from 'axios';
import { fetcher, endpoints } from '../lib/axios';

export interface Property {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  line1: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  isPrivate: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  propertyImages: string[];
  facilities: string[];
}

export interface PropertyFilters {
  category?: string;
  country?: string;
  priceRange?: [number, number];
  roomNumber?: number;
  squareMetersRange?: [number, number];
  status?: 'published' | 'draft';
  sortDir?: 'asc' | 'desc';
}

interface ApiResponse {
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  };
  data: Property[];
}

export function useGetProperties(filters: PropertyFilters = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        queryParams.append(`${key}Min`, value[0].toString());
        queryParams.append(`${key}Max`, value[1].toString());
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  const queryString = queryParams.toString();
  const URL = `${endpoints.properties.list}?${queryString}`;

  const { data, error, isValidating } = useSWR<ApiResponse>(URL, fetcher);

  const memoizedValue = useMemo(() => {
    if (error) {
      console.error(error);
    }
    return {
      properties: data?.data || [],
      propertiesLoading: !data && !error,
      propertiesError: error,
      propertiesValidating: isValidating,
      propertiesEmpty: data?.data.length === 0,
    };
  }, [data, error, isValidating]);

  return memoizedValue;
}

export function useGetProperty(id: number) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(endpoints.properties.get(id));
        if (response.data?.data && response.data.data.length > 0) {
          setProperty(response.data.data[0]);
        } else {
          setProperty(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return { property, isLoading, error };
}


export async function createProperty(propertyData: Property): Promise<Property> {
  try {
    const response = await axios.post<Property>(endpoints.properties.create, propertyData);
    await mutate(endpoints.properties.list);
    return response.data;
  } catch (error) {
    console.error('Failed to create property', error);
    throw error;
  }
}

export async function updateProperty(id: number, propertyData: Partial<Property>): Promise<Property> {
  try {
    const response = await axios.put<Property>(endpoints.properties.update(id), propertyData);
    mutate(endpoints.properties.get(id));
    return response.data;
  } catch (error) {
    console.error('Failed to update property', error);
    throw error;
  }
}

export async function deleteProperty(id: number): Promise<void> {
  try {
    await axios.delete(endpoints.properties.delete(id));
    mutate(endpoints.properties.list);
  } catch (error) {
    console.error('Failed to delete property', error);
    throw error;
  }
}
