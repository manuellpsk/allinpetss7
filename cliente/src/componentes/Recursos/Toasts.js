import { toast } from 'react-toastify';

const optionsErrorToast = {
    autoClose: 5000,
    type: toast.TYPE.ERROR,
    hideProgressBar: false,
    position: toast.POSITION.BOTTOM_LEFT,
    pauseOnHover: true,
}
const optionsRightToast = {
    autoClose: 5000,
    type: toast.TYPE.SUCCESS,
    hideProgressBar: false,
    position: toast.POSITION.BOTTOM_LEFT,
    pauseOnHover: true,
}

export const notifyError = (message) => {
    return toast('Ups! '+message, optionsErrorToast)
}
export const notifyRight = () => {
    return toast('La operación se ha realizado correctamente!', optionsRightToast)
}