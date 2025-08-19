import 'react-toastify/dist/ReactToastify.css';
import { toast, type ToastOptions } from 'react-toastify';

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';

const toastOptions: ToastOptions = {
  autoClose: 3000,
  position: 'top-right',
};

export const toaster = (type: ToastType, message: string): void => {
  const options = {
    ...toastOptions,
  };

  switch (type) {
    case 'info':
      toast.info(message, options);
      break;
    case 'success':
      toast.success(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
};
