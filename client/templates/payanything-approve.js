var ERRORS_KEY = 'payanythingApproveErrors';

Template.payanythingApprove.created = function() {
  Session.set(ERRORS_KEY, {});
};

Template.payanythingApprove.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  },
  coinuri: function() {
    return Session.get("coinuri");
  },
  cointype: function() {
    return Session.get("cointype");
  },
  coinaddress: function() {
    return Session.get("coinaddress");
  },
  coinamount: function() {
    return Session.get("coinamount");
  },

  altcoinuri: function() {
    return Session.get("altcoinuri");
  },
  altcointype: function() {
    return Session.get("altcointype");
  },
  altcoinaddress: function() {
    return Session.get("altcoinaddress");
  },
  altcoinamount: function() {
    return Session.get("altcoinamount");
  }
});

