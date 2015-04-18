var ERRORS_KEY = 'payanythingErrors';

Template.payanything.created = function() {
  Session.set(ERRORS_KEY, {});
};

Template.payanything.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.payanything.events({
  'click .begin-qrcode-scan-button' : function(){
    //$(".heroandtext").fadeOut();
    //$(".signup-form").fadeIn();
    Router.go('/payanythingScan')
  },
});