function validarRutRegistro() {
    let rut=document.getElementById('rut').value;
    return validar(rut);
}

function validarRutLogin() {
    let rut=document.getElementById('rutlogin').value;
    return validar(rut);
}

function validar(rut) {
    //validando RUT
    console.log(rut);
    if (/^[0-9]{6,8}[-|‐]{1}[0-9kK]{1}$/.test(rut)) {

        //separando rut y d.v.
        const partes = rut.split('-');
        suma = 0; mult = 1;

        //incio de algoritmo modulo 11. Transadomar partes[0] en array y recorrer al revés.
        Array.from(partes[0]).reverse().forEach(element => {
            mult == 7 ? mult = 2 : mult++;
            suma = suma + (parseInt(element) * mult);
        });

        //finalizando modulo 11
        let dv = 11 - (suma % 11);
        if (dv == 10) dv = 'k';
        if (dv == 11) dv = 0;
        dv = String(dv);

        //comparando dv's.
        if (!(partes[1].toLocaleLowerCase() === dv)) {
            alert('rut incorrecto');
        }
        return partes[1].toLocaleLowerCase() === dv;
    } else {
        alert('rut incorrecto');
        return false;
    }
}

//retorna el valor que tiene un elemendo del DOM
function valueElementId(id) {
    return document.getElementById(id).value;
}

//validar datos para la modificacion de usuario
function validarModificacion() {
    //validando si las contraseñas son iguales
    if((document.getElementById('password').value===document.getElementById('password2').value)){
        return true;
    }else{
        alert('Las contraseñas deben ser iguales');
        return false;
    }
}

//validacion del input rut, sólo acepta numeros y guión, y máximo 10 caracteres
let elementRutLogin = document.getElementById('rutlogin');
if (elementRutLogin) {
    elementRutLogin.addEventListener('keydown', function (event) {
        if (elementRutLogin.value.length > 9) {
            if (event.which > 40) {
                event.preventDefault();
            }
        } else {
            if (event.which > 57) {//alfanumericos
                if (event.which != 189 && event.which != 109 && isNaN(event.key)) {//diferente de - - y es nan
                    event.preventDefault();
                }
            }
        }
    });
}

let elementRut = document.getElementById('rut');
if (elementRut) {
    elementRut.addEventListener('keydown', function (event) {
        if (elementRut.value.length > 9) {
            if (event.which > 40) {
                event.preventDefault();
            }
        } else {
            if (event.which > 57) {//alfanumericos
                if (event.which != 189 && event.which != 109 && isNaN(event.key)) {//diferente de - - y es nan
                    event.preventDefault();
                }
            }
        }
    });
}

//validando password login max 25 caracteres
let elementPasswordLogin = document.getElementById('passwordlogin');
if (elementPasswordLogin) {
    elementPasswordLogin.addEventListener('keydown', function (event) {
        if (elementPasswordLogin.value.length > 24) {
            if (event.which != 8 && event.which != 9) {
                event.preventDefault();
            }
        }
    });
}

//validando password registro cantidad de caracteres, también funciona para modificar usuario
let elementPassword = document.getElementById('password');
if (elementPassword) {
    elementPassword.addEventListener('keydown', function (event) {
        if (elementPassword.value.length > 24) {
            if (event.which != 8 && event.which != 9) {
                event.preventDefault();
            }
        }
    });
}

//validar nueva password en modificacion de usuario
let elementPassword2 = document.getElementById('password2');
if (elementPassword2) {
    elementPassword2.addEventListener('keydown', function (event) {
        if (elementPassword2.value.length > 24) {
            if (event.which != 8 && event.which != 9) {
                event.preventDefault();
            }
        }
    });
}

//validando email max 30 caracteres
let elementEmail = document.getElementById('email');
if (elementEmail) {
    elementEmail.addEventListener('keydown', function (event) {
        if (elementEmail.value.length > 29) {
            if (event.which != 8 && event.which != 9) {
                event.preventDefault();
            }
        }
    });
}

//validando la descripción max 150 caracteres
let elementDescipcion = document.getElementById('descripcion');
if (elementDescipcion) {
    elementDescipcion.addEventListener('keydown', function (event) {
        if (elementDescipcion.value.length > 149) {
            if (event.which != 8 && event.which != 9) {
                event.preventDefault();
            }
        }
    });
}

//Denuncia, cantidad de caracteres en motivos
let elementDenuncia = document.getElementById('idDenuncia');
if (elementDenuncia) {
    elementDenuncia.addEventListener('keydown', function (event) {
        console.log(elementDenuncia.value);
        if (elementDenuncia.value.length > 149) {
            if (event.which != 8 && event.which != 9) {
                event.preventDefault();
            }
        }
    });
}

//Comentarios, boton comentar hace ganar focus al input idComentario
function focusComentar(){
    document.getElementById('idComentario').focus();
}