import { toast } from "react-toastify";

type ToastType = 'info' | 'success' | 'warning' | 'error';

/**
 * The function creates a toast notification with a specified message and type.
 * @param {string} message - The `message` parameter is a string that represents the text content of
 * the toast message that will be displayed to the user.
 * @param {ToastType} type - The `type` parameter in the `createToast` function is of type `ToastType`.
 * This parameter is used to specify the type of toast message to be displayed, such as "success",
 * "error", "warning", or "info".
 */
export function createToast(message: string, type: ToastType, msAutoClose: number = 4000) {
    toast(message, {
        position: "bottom-right",
        autoClose: msAutoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        type: type,
    });
}