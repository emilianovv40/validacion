/*ValidacionPersonalizada Prototype:
	-Realiza un seguimiento de la lista de mensajes de 
	invalidez para la entrada.
	-Realiza un seguimiento de las comprobaciones de validez
	que se deben realizar para esta entrada.
	-Realiza las comprobaciones de validez y envia comentarios
	al front-end.
*/

function ValidacionPersonalizada(input){
	this.invalido=[];
	this.verificarValidez=[];
	//Agregar una referencia al nodo de entrada.
	this.inputNode=input;
	//Metodo de activacion para adjuntar al listener.
	this.registroListener();
}

ValidacionPersonalizada.prototype = {
	agregarInvalidez: function(mensaje){
		this.invalido.push(mensaje);
	},
	getinvalido: function(){
		return this.invalido.join('. \n');
	},
	verValidez: function(input){
		for(var i=0; i< this.verificarValidez.length; i++){
			var esInvalido= this.verificarValidez[i].esInvalido(input);
			if(esInvalido){
				this.agregarInvalidez(this.verificarValidez[i].mensajeInvalido);
			}//cierre del if

			var requirementElement = this.verificarValidez[i].element;
			if(requirementElement){
				if(esInvalido){
					requirementElement.classList.add('invalido');
					requirementElement.classList.remove('valido');
				} else {
					requirementElement.classList.remove('invalido');
					requirementElement.classList.add('valido');
				}//cierre del else
			}//cierre del if (requirementElement)
		}//fin del ciclo for.
	},//cierre de verValidez.
	checkInput: function(){	//encapsulamos el contenido del checkInput.
		this.inputNode.ValidacionPersonalizada.invalido =[];
		this.verValidez(this.inputNode);
		if(this.inputNode.ValidacionPersonalizada.invalido.length === 0 && this.inputNode.value !== ''){
			this.inputNode.setCustomValidity('');
		} else{
			var mensaje = this.inputNode.ValidacionPersonalizada.getinvalido();
			this.inputNode.setCustomValidity(mensaje);
		} //fin del else
	}, //fin del checkInput.
	registroListener: function() { //Registramos al listener.
		var ValidacionPersonalizada = this;
		this.inputNode.addEventListener('keyup', function() {
			ValidacionPersonalizada.checkInput();
		});
	} //fin del registroListener
}; //Fin de la ValidacionPersonalizada.prototype

/*
Validity Checks
Son las matrices de comprobación de validez de cada entrada.
Consta de 3 cosas:
1. esInvalido() - Es la función para determinar si la entrada cumple un requisito particular.
2. mensajeInvalido() - Es el mensaje de error para mostrar si el campo no es válido.
3. element - Es el elemento que establece el requisito.
*/

var usernameverificarValidez = [
	{
		esInvalido: function(input){
			return input.value.length < 3;
		},
		mensajeInvalido: 'Esta entrada debe tener al menos 3 caracteres.',
		element: document.querySelector('label[for="username"] .input-requirements li:nth-child(1)')
	},
	{
		esInvalido: function(input){
			var illegalCharacters = input.value.match(/[^a-zA-Z0-9]/g);
			return illegalCharacters ? true : false;
		},
		mensajeInvalido: 'Solo se permiten letras y numeros.',
		element: document.querySelector('label[for="username"] .input-requirements li:nth-child(2)')
	}

];

var passwordverificarValidez =[
	{
		esInvalido: function(input){
			return input.value.length < 8 | input.value.lenght > 100;
		},
		mensajeInvalido: 'Esta entrada debe tener entre 8 y 100 caracteres.',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(1)')
	},
	{
		esInvalido: function(input){
			return !input.value.match(/[0-9]/g);
		},
		mensajeInvalido: 'Se requiere al menos 1 número.',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(2)')
	},
	{
		esInvalido: function(input){
			return !input.value.match(/[a-z]/g);
		},
		mensajeInvalido: 'Se requiere al menos 1 letra minúscula',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(3)')
	},
	{
		esInvalido: function(input){
			return !input.value.match(/[A-Z]/g);
		},
		mensajeInvalido: 'Se requiere al menos 1 letra mayúscula.',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(4)')
	},
	{
		esInvalido: function(input){
			return !input.value.match(/[\!\@\#\$\%\^\&\*]/g);
		},
		mensajeInvalido: 'Se requiere algun caracter especial.',
		element: document.querySelector('label[for="password"] .input-requirements li:nth-child(5)')	
	}

];

var passwordRepeatverificarValidez = [
	{
		esInvalido: function(){
			return repetirPasswordInput.value != passwordInput.value;
		},
		mensajeInvalido: 'Esta contraseña debe coincidir con la primera.'
	}
];

/*
Setup ValidacionPersonalizada
1. Configuramos el prototype ValidacionPersonalizada para cada input.
2. Y tambien establecemos que matriz de comprobacion de validez se utilizara en cada input.
*/

var usernameInput = document.getElementById('username');
var passwordInput = document.getElementById('password');
var repetirPasswordInput = document.getElementById('password_repeat');

usernameInput.ValidacionPersonalizada = new ValidacionPersonalizada(
	usernameInput);
usernameInput.ValidacionPersonalizada.verificarValidez = usernameverificarValidez;

passwordInput.ValidacionPersonalizada = new ValidacionPersonalizada(
	passwordInput);
passwordInput.ValidacionPersonalizada.verificarValidez =passwordverificarValidez;

repetirPasswordInput.ValidacionPersonalizada = new ValidacionPersonalizada(
	repetirPasswordInput);
repetirPasswordInput.ValidacionPersonalizada.verificarValidez =passwordRepeatverificarValidez;

/*
Eventos de Listeners
*/

var inputs = document.querySelectorAll('input:not([type="submit"])');
var submit = document.querySelector('input[type="submit"]');
var form = document.getElementById('register');
function validar(){
	for (var i=0; i < inputs.length; i++){
		inputs[i].ValidacionPersonalizada.checkInput();
	}
}
submit.addEventListener('click', validar);
form.addEventListener('submit', validar);
