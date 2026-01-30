import { api } from '@/shared/api/axios';

export interface DeleteTemplateParams {
  templateId: string;
  instructionId: string;
}

export const deleteTemplate = async (params: DeleteTemplateParams) => {
  await api.delete(
    `/instructors/${params.instructionId}/templates/${params.templateId}`,
  );
};
