(() => {
  'use strict';

  var app = {
    init: init,
    attachEventListeners: attachEventListeners,

    invalidInputs: [],

    mnCreateAccount: document.querySelector('#mnCreateAccount'),
    mnCreateEvent: document.querySelector('#mnCreateEvent'),
    mnListEvents: document.querySelector('#mnListEvents'),

    accountCreatePanel: document.querySelector('#accountCreatePanel'),
    eventCreatePanel: document.querySelector('#eventCreatePanel'),
    eventListPanel: document.querySelector('#eventListPanel'),

    user: {},

    validationAlert: document.querySelector('#validationAlert'),
    accountCreationSuccessAlert: document.querySelector('#accountCreationSuccessAlert'),
    frmAccountCreate: document.querySelector('#frmAccountCreate'),
    inputName: document.querySelector('#inputName'),
    inputEmail: document.querySelector('#inputEmail'),
    inputPassword: document.querySelector('#inputPassword'),
    inputPasswordRetype: document.querySelector('#inputPasswordRetype'),
    btnCreateAccount: document.querySelector('#btnCreateAccount'),
    validateAccountCreate: validateAccountCreate,

    eventValidationAlert: document.querySelector('#eventValidationAlert'),
    eventCreationSuccessAlert: document.querySelector('#eventCreationSuccessAlert'),
    frmEventCreate: document.querySelector('#frmEventCreate'),
    inputEventName: document.querySelector('#inputEventName'),
    inputEventType: document.querySelector('#inputEventType'),
    inputEventHost: document.querySelector('#inputEventHost'),
    inputEventDateStart: document.querySelector('#inputEventDateStart'),
    inputEventDateEnd: document.querySelector('#inputEventDateEnd'),
    inputEventGuestName: document.querySelector('#inputEventGuestName'),
    eventGuestListContainer: document.querySelector('#eventGuestListContainer'),
    eventGuestList: document.querySelectorAll('.guest-entry'),
    inputEventLocation: document.querySelector('#inputEventLocation'),
    inputEventGuestsNotification: document.querySelector('#inputEventGuestsNotification'),
    btnCreateEvent: document.querySelector('#btnCreateEvent'),
    validateEventCreate: validateEventCreate

  };

  app.init();

  function init () {
    app.attachEventListeners();

    localforage.getItem('events').then(events => {
      app.events = JSON.parse(events);
    });

  }

  function attachEventListeners() {

    app.mnCreateAccount.addEventListener('click', event => {
      accountCreatePanel.removeAttribute('hidden');
      eventCreatePanel.setAttribute('hidden', 'hidden');
      eventListPanel.setAttribute('hidden', 'hidden');

      app.mnCreateAccount.parentElement.classList.add('active');
      app.mnCreateEvent.parentElement.classList.remove('active');
      app.mnListEvents.parentElement.classList.remove('active');
    });

    app.mnCreateEvent.addEventListener('click', event => {
      eventCreatePanel.removeAttribute('hidden');
      accountCreatePanel.setAttribute('hidden', 'hidden');
      eventListPanel.setAttribute('hidden', 'hidden');

      app.mnCreateEvent.parentElement.classList.add('active');
      app.mnCreateAccount.parentElement.classList.remove('active');
      app.mnListEvents.parentElement.classList.remove('active');
    });

    app.mnListEvents.addEventListener('click', event => {
      eventListPanel.removeAttribute('hidden');
      accountCreatePanel.setAttribute('hidden', 'hidden');
      eventCreatePanel.setAttribute('hidden', 'hidden');

      app.mnListEvents.parentElement.classList.add('active');
      app.mnCreateAccount.parentElement.classList.remove('active');
      app.mnCreateEvent.parentElement.classList.remove('active');
    });

    app.btnCreateAccount.addEventListener('click', event => {
      event.preventDefault();

      app.validateAccountCreate();

      let hasErrors = app.invalidInputs.length > 0;

      if (hasErrors) {
        app.invalidInputs.map(elem => elem.parentElement.classList.add('has-warning'));
        app.validationAlert.removeAttribute('hidden');
      } else {

        app.user.name = inputName.value;
        app.user.email = inputEmail.value;
        app.user.password = inputPassword.value;

        localforage.setItem('loggedUser',
          JSON.stringify(app.user)).then(value => {
            app.frmAccountCreate.setAttribute('hidden', 'hidden');
            app.accountCreationSuccessAlert.removeAttribute('hidden');

            setTimeout(() => {
              app.accountCreationSuccessAlert.parentElement.setAttribute('hidden', 'hidden');
            }, 3000);
          });
        };
    });

    app.btnCreateEvent.addEventListener('click', event => {
      event.preventDefault();

      app.validateEventCreate();

      let hasErrors = app.invalidInputs.length > 0;

      if (hasErrors) {
        app.invalidInputs.map(elem => elem.parentElement.classList.add('has-warning'));
        app.eventValidationAlert.removeAttribute('hidden');
      } else {

        if (!app.events) {
          app.events = [];
        }

        let event = {
          name: inputEventName.value,
          type: inputEventType.value,
          host: inputEventHost.value,
          dateStart: moment(inputEventDateStart.value),
          dateEnd: moment(inputEventDateEnd.value),
          // guestList: eventGuestList.value, //FIXME
          locationAddress: inputEventLocation.value,
          notification: inputEventGuestsNotification.value
        }

        console.log(app.events);

        app.events.push(event);

        localforage.setItem('events',
          JSON.stringify(app.events)).then(value => {
            app.frmEventCreate.setAttribute('hidden', 'hidden');
            app.eventCreationSuccessAlert.removeAttribute('hidden');

            setTimeout(() => {
              app.eventCreationSuccessAlert.parentElement.setAttribute('hidden', 'hidden');
            }, 3000);
          });
        }
    });
  }

  function validateAccountCreate() {

    prepareValidation();

    shouldNotBeEmpty(app.inputName);
    shouldNotBeEmpty(app.inputEmail);
    shouldNotBeEmpty(app.inputPassword);
    shouldNotBeEmpty(app.inputPasswordRetype);

    shouldBeAValidEmail(app.inputEmail);

    shouldBeAValidPassword(app.inputPassword);
    shouldBeEqualsPasswords(app.inputPassword, app.inputPasswordRetype);

  }

  function validateEventCreate() {

    prepareValidation();

    shouldNotBeEmpty(app.inputEventName);
    shouldNotBeEmpty(app.inputEventType);
    shouldNotBeEmpty(app.inputEventHost);
    shouldNotBeEmpty(app.inputEventDateStart);
    shouldNotBeEmpty(app.inputEventDateEnd);
    shouldNotBeEmpty(app.inputEventLocation);

    // shouldHaveGuests(); //FIXME

    shouldDateEndAfterDateStart(app.inputEventDateStart, app.inputEventDateEnd);
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

  function shouldDateEndAfterDateStart(elem1, elem2) {
    if (moment(elem1.value).isAfter(elem2.value)) {
      app.invalidInputs.push(elem2);
    }
  }

  function shouldHaveGuests() {
    if (app.eventGuestList.length === 0) {
      app.invalidInputs.push(app.eventGuestListContainer);
      app.invalidInputs.push(app.inputEventGuestName.parentElement);
    }
  }

  function prepareValidation() {
    app.invalidInputs = [];
    app.validationAlert.setAttribute('hidden', 'hidden');
    app.eventValidationAlert.setAttribute('hidden', 'hidden');
    Array.from(document.querySelectorAll('.has-warning')).forEach(elem => elem.classList.remove('has-warning'));
  }

  // localforage.setItem('selectedCities',
  //     JSON.stringify(app.selectedCities)).then(value => console.log('Selected cities saved'));
  // };
  //
  // localforage.getItem('selectedCities').then(value => {
  //   app.selectedCities = value;
  // });

})();
