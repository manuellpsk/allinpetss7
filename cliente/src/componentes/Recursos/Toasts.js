import { toast } from 'react-toastify';
const timeClose = 2500

const optionsErrorToast = {
    type: toast.TYPE.ERROR,
    position: "top-right",
    autoClose: timeClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

const optionsRightToast = {
    type: toast.TYPE.SUCCESS,
    position: "top-right",
    autoClose: timeClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

const optionsWarningToast = {
    type: toast.TYPE.WARNING,
    position: "top-right",
    autoClose: timeClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

const optionsInfoToast = {
    type: toast.TYPE.INFO,
    position: "top-right",
    autoClose: timeClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export const notifyError = (message) => {
    return toast('Ups! ' + message, optionsErrorToast)
}
export const notifyRight = (message, doNext) => {
    if (doNext) {
        optionsRightToast.onClose = doNext
    }
    return toast('Éxitoso! ' + message, optionsRightToast)
}
export const notifyWarning = (message) => {
    return toast('Atento! ' + message, optionsWarningToast)
}
export const notifyInfo = (message) => {
    return toast('Info! ' + message, optionsInfoToast)
}