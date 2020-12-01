export const errorHttp = (status) => {
    switch (status) {
        case 404:
            return error = {
                status,
                message: 'Recurso no encontrado'
            }
        case 403:
            return error = {
                status,
                message: 'Recurso no encontrado'
            }
        default:
            break;
    }
}