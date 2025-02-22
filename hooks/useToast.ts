import Toast from 'react-native-toast-message';
import { useColorScheme } from './useColorScheme';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  text2?: string;
  visibilityTime?: number;
  autoHide?: boolean;
  position?: 'top' | 'bottom';
}

export function useToast() {
  const colorScheme = useColorScheme();

  const showToast = (type: ToastType, text1: string, options: ToastOptions = {}) => {
    const { text2, visibilityTime = 4000, autoHide = true, position = 'bottom' } = options;

    const baseStyle = {
      backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
      borderLeftColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3',
    };

    const textStyle = {
      color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    };

    Toast.show({
      type,
      text1,
      text2,
      position,
      visibilityTime,
      autoHide,
      props: {
        style: baseStyle,
        text1Style: textStyle,
        text2Style: textStyle,
      },
    });
  };

  return {
    success: (text1: string, options?: ToastOptions) => showToast('success', text1, options),
    error: (text1: string, options?: ToastOptions) => showToast('error', text1, options),
    info: (text1: string, options?: ToastOptions) => showToast('info', text1, options),
  };
}
