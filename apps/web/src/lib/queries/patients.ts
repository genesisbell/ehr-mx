import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '@/lib/api';
import type {
  CreatePatientInput,
  CreateProvisionalPatientInput,
  UpdatePatientInput,
  PatientSearchParams,
} from '@ehr-mx/shared';

interface Patient {
  id: string;
  curp: string | null;
  name: string;
  paternalSurname: string;
  maternalSurname: string | null;
  phone: string | null;
  birthDate: string | null;
  sex: string | null;
  status: 'PROVISIONAL' | 'COMPLETE';
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  data: Patient[];
  total: number;
  page: number;
  limit: number;
}

export function usePatients(params: Partial<PatientSearchParams> = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  const path = `/patients${query ? `?${query}` : ''}`;

  return useQuery<PaginatedResponse>({
    queryKey: ['patients', params],
    queryFn: () => authFetch<PaginatedResponse>(path),
  });
}

export function usePatient(id: string) {
  return useQuery<Patient>({
    queryKey: ['patients', id],
    queryFn: () => authFetch<Patient>(`/patients/${id}`),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatientInput) =>
      authFetch<Patient>('/patients', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useCreateProvisionalPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProvisionalPatientInput) =>
      authFetch<Patient>('/patients/provisional', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePatientInput) =>
      authFetch<Patient>(`/patients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
