var ERRORS_KEY = 'payanythingScanErrors';

Template.payanythingScan.created = function() {
  Session.set(ERRORS_KEY, {});
};

Template.payanythingScan.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.payanythingScan.rendered = function() {
    qrScanner.on('scan', function (err, message) {
      if (message) {
        console.log(message);
        //alert(message);
        // paper example 1GxxyXETH2PGRrT31uc8WG4ZfAkM1jVN8P
        // get something like bitcoin:1FawXtf3LjmZBLk3nvBrJiPfuqQ7nMkKjr?amount=0.00446468
        // have seen invalid characters in the pay to address! need to check for these... keep trying if you see them
        // get something like bitcoin:1FawXtf3LjmZBLk3nvBrJiPfuqQ7nMkKjr?amount=0.00446468
        // or just address, or just address with amount?
        // if get just address need to ask for an amount - bonus feature is to get btc price
        var re = /^(\w+)?:?([13][a-km-zA-HJ-NP-Z0-9]{26,33})\??(.*)/;
        //message = 'foo'
        var cinfo = re.exec(message);
        if (cinfo == null) {
          console.log(message + " didn't match regex, still scanning.");
          return;
        }
        if (cinfo.length > 4) { // unparsed text plus three captured items
          console.log(message + " resulted in too many elements in array, still scanning.");
          return;
        }
        // If there are more than three items, keep trying (this probably means there's an invalid var in the address)
        // Three items? Check that first is text, second is valid bitcoin address, third is amount=4.4444 or amount=4.444?message=hi, etc

        // FOR NOW, JUST SUPPORT bitcoin:1FawXtf3LjmZBLk3nvBrJiPfuqQ7nMkKjr?amount=0.00446468 FORMAT
        // ["bitcoin:1FawXtf3LjmZBLk3nvBrJiPfuqQ7nMkKjr?amount=0.00446468", 
        //     "bitcoin", "1FawXtf3LjmZBLk3nvBrJiPfuqQ7nMkKjr", "amount=0.00446468"]
        var coinuri     = message;
        var cointype    = cinfo[1];
        var coinaddress = cinfo[2];
        var coinamount  = cinfo[3];
        var casplit = coinamount.split('=');
        if (casplit.length != 2) {
          console.log("Error splitting amount '" + coinamount + "', still scanning.");
          return;
        }
        coinamount = casplit[1];
        console.log("Amount is " + coinamount);
        //var casplit = coinamount.split('&');
        // handle message, etc... ignore for now
        Session.set('coinuri',coinuri);
        Session.set('cointype',cointype);
        Session.set('coinaddress',coinaddress);
        Session.set('coinamount',coinamount);

        //TODO: call the shapeshift api
        // get nubits amount, construct payment uri

        //TODO: check if valid pay to currency and amount.
        Router.go('/payanythingShift');
      }
    });
}
