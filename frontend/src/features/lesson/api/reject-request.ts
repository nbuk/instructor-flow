import { api } from '@/shared/api/axios';

export interface RejectRequestParams {
  slotId: string;
  requestId: string;
}

export const rejectRequest = async (params: RejectRequestParams) => {
  await api.post(`/schedule/${params.slotId}/${params.requestId}/reject`);
};
