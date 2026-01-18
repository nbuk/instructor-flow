import { api } from '@/shared/api/axios';

export interface CancelRequestParams {
  slotId: string;
  requestId: string;
}

export const cancelRequest = async (params: CancelRequestParams) => {
  await api.post(`/schedule/${params.slotId}/${params.requestId}/cancel`);
};
