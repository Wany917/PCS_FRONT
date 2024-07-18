import useSWR from "swr";
import { useMemo } from "react";
import { fetcher, endpoints } from "../lib/axios";

export function useGetInvoices(filters, sortDir, page, limit) {
    const queryParams = new URLSearchParams({
      ...(filters.customer && { customer: filters.customer }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.id && { id: filters.id }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.status && { status: filters.status }),
      sortDir,
      page: page.toString(),
      limit: limit.toString(),
    });
  
    const { data, error } = useSWR(`${endpoints.invoices.list}?${queryParams}`, fetcher);
  
    return {
      invoices: data?.data || [],
      isLoading: !error && !data,
      error,
      totalCount: data?.meta?.total || 0,
    };
  }

  export function useGetInvoice(invoiceId: string) {
    const { data, error } = useSWR(endpoints.invoices.get(invoiceId), fetcher);
  
    console.log('Invoice data:', data);
    console.log('Error:', error);
  
    return {
      invoice: data,
      isLoading: !error && !data,
      error: error ? (error.message || 'An error occurred') : null
    };
  }