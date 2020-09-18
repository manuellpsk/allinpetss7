//alertas
$("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
    $("#success-alert").slideUp(500);
});
$("#message-alert").fadeTo(2000, 500).slideUp(500, function () {
    $("#message-alert").slideUp(500);
});

//evento para validar y dar color a las casillas de ingreso de datos, login y registro
window.addEventListener('load', () => {

    // Grab all the forms
    var forms = document.getElementsByClassName('needs-validation');
    // Iterate over each one
    for (let form of forms) {
        //validando formulario de registro, elemento null y rut correcto
        if (form.getAttribute('name') == 'formsignup') {
            //sección rut
            let input = document.getElementById('rut');
            input.addEventListener('input', function (evt) {
                let rut = document.getElementById('rut').value;
                input.classList.remove('is-invalid');
                input.classList.remove('is-valid');
                if (!validar(rut)) {
                    input.classList.add('is-invalid');
                    input.setCustomValidity('invalid');
                } else {
                    input.classList.add('is-valid');
                    input.setCustomValidity('');
                }
            });
        }
        //validando form login no nulls y rut correcto
        if (form.getAttribute('name') == 'formlogin') {
            let input = document.getElementById('rutlogin');
            input.addEventListener('input', function (evt) {
                let rut = document.getElementById('rutlogin').value;
                input.classList.remove('is-invalid');
                input.classList.remove('is-valid');
                if (!validar(rut)) {
                    input.classList.add('is-invalid');
                    input.setCustomValidity('invalid');
                } else {
                    input.classList.add('is-valid');
                    input.setCustomValidity('');
                    console.log('paso');
                }
            });
        }

        //validando formulario para la modificacion de datos
        if (form.getAttribute('name') == 'formModificar') {

            document.getElementById('btnModificar').addEventListener('click', function (evt) {
                let input = document.getElementById('password');
                let password2 = document.getElementById('password2');
                input.classList.remove('is-invalid');
                input.classList.remove('is-valid');
                password2.classList.remove('is-invalid');
                password2.classList.remove('is-valid');
                if (input.value != password2.value) {
                    input.classList.add('is-invalid');
                    password2.classList.add('is-invalid');
                    input.setCustomValidity('invalid');
                    password2.setCustomValidity('invalid');
                    evt.preventDefault();
                    evt.stopPropagation();
                } else {
                    input.classList.add('is-valid');
                    password2.classList.add('is-valid');
                    input.setCustomValidity('');
                    password2.setCustomValidity('');
                }
            });
        }

        //validando comentarios
        if (form.getAttribute('name') == 'formComentario') {
            let input = document.getElementById('idComentario');
            let btnComentar = document.getElementById('btnComentario');
            input.addEventListener('keyup', (evt) => {
                if (input.value.length > 0) {
                    btnComentar.removeAttribute('disabled');
                } else {
                    btnComentar.setAttribute('disabled', true);
                    evt.preventDefault();
                    evt.stopPropagation();
                }
            });
        }
        // Add a 'submit' event listener on each one
        form.addEventListener('submit', (evt) => {
            // check if the form input elements have the 'required' attribute  
            if (!form.checkValidity()) {
                evt.preventDefault();
                evt.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    }
});

function validar(rut) {
    //validando RUT
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
        return partes[1].toLocaleLowerCase() === dv;
    } else {
        //document.querySelector('#rut').classList.add('is-invalid');
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
    if ((document.getElementById('password').value === document.getElementById('password2').value)) {
        return true;
    } else {
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

//validando el input del rut para el login
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

//validando la cantidad de caracteres de la nueva publicación, 255max min2
let elementtxtPublicar = document.getElementById('txtPublicar');
if (elementtxtPublicar) {
    elementtxtPublicar.addEventListener('keydown', function (event) {
        if (elementtxtPublicar.value.length > 249) {
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
function focusComentar() {
    document.getElementById('idComentario').focus();
}