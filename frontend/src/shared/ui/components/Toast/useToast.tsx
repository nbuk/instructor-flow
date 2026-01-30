import { toast } from 'sonner';

import { Toast } from './Toast';

export const useToast = () => {
  return {
    info: (message: string) =>
      toast.custom(() => <Toast type={'info'} message={message} />),
    error: (message: string) =>
      toast.custom(() => <Toast type={'error'} message={message} />),
  };
};
