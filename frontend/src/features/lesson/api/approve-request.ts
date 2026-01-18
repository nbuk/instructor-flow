import { api } from '@/shared/api/axios';

export interface ApproveRequestParams {
  requestId: string;
  slotId: string;
}

export const approveRequest = async (params: ApproveRequestParams) => {
  await api.post(`/schedule/${params.slotId}/${params.requestId}/approve`);
};
