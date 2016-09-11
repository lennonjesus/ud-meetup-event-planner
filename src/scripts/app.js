(() => {
  'use strict';

  var app = {
    init: init,
    attachEventListeners: attachEventListeners,
    validate: validate,

    invalidInputs: [],

    validationAlert: document.querySelector('#validationAlert'),

    frmAccountCreate: document.querySelector('#frmAccountCreate'),
    btnCreateAccount: document.querySelector('#btnCreateAccount'),
    inputName: document.querySelector('#inputName'),
    inputEmail: document.querySelector('#inputEmail'),
    inputPassword: document.querySelector('#inputPassword'),
    inputPasswordRetype: document.querySelector('#inputPasswordRetype'),

    inputEventDateStart: document.querySelector('#inputEventDateStart'),
    inputEventDateEnd: document.querySelector('#inputEventDateEnd')

  };

  app.init();

  function init () {
    app.attachEventListeners();

    app.inputEventDateStart.min = "2026-05-05T16:15:23";
  }

  function attachEventListeners() {

    app.btnCreateAccount.addEventListener('click', event => {
      event.preventDefault();

      app.validate();

      let hasErrors = app.invalidInputs.length > 0;

      if (hasErrors) {
        app.invalidInputs.map(elem => elem.parentElement.classList.add('has-warning'));
        app.validationAlert.removeAttribute('hidden');
      } else {
        app.frmAccountCreate.submit();
      }
    });
  }

  function validate() {

    prepareValidation();

    shouldNotBeEmpty(app.inputName);
    shouldNotBeEmpty(app.inputEmail);
    shouldNotBeEmpty(app.inputPassword);
    shouldNotBeEmpty(app.inputPasswordRetype);

    shouldBeAValidEmail(app.inputEmail);

    shouldBeAValidPassword(app.inputPassword);
    shouldBeEqualsPasswords(app.inputPassword, app.inputPasswordRetype);

  }

  function shouldNotBeEmpty(elem) {
    if (elem.value === null || elem.value === '' || elem.value === ' ') {
      app.invalidInputs.push(elem);
    }
  }

  function shouldBeAValidEmail(elem) {
    let regex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/);

    if (!regex.test(elem.value)) {
      app.invalidInputs.push(elem);
    }
  }

  function shouldBeAValidPassword(elem) {
    let regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

    if (!regex.test(elem.value)) {
      app.invalidInputs.push(elem);
    }
  }

  function shouldBeEqualsPasswords(elem1, elem2) {
    if(elem1.value !== elem2.value) {
        app.invalidInputs.push(elem2);
    }
  }

  function prepareValidation() {
    app.invalidInputs = [];
    app.validationAlert.setAttribute('hidden', 'hidden');
    document.querySelectorAll('.has-warning').forEach(elem => elem.classList.remove('has-warning'));
  }

})();
