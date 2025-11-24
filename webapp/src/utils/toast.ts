import { Toaster, toast as hotToast } from 'react-hot-toast'

export { Toaster }

export const toast = {
    success: (message: string) => {
        hotToast.success(message, {
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#10B981',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
            },
        })
    },
    error: (message: string) => {
        hotToast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#EF4444',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
            },
        })
    },
    loading: (message: string) => {
        return hotToast.loading(message, {
            position: 'top-right',
            style: {
                background: '#3B82F6',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
            },
        })
    },
    dismiss: (toastId: string) => {
        hotToast.dismiss(toastId)
    }
}
