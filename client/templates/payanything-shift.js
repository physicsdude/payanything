var ERRORS_KEY = 'payanythingShiftErrors';
Template.payanythingShift.created = function() {
  Session.set(ERRORS_KEY, {});
};
var shapeShiftIt = function shapeShiftIt() {
    // btc, ltc, ppc, drk, nubits, nmc, ftc, blk, nxt, btcd, qrk, rdd, nbt, bts, bitusd, xcp, xmr
    var sourcetype = 'ltc';
    var targettype = 'btc';
    var pair = sourcetype + '_' + targettype;
    var baseUrl = 'https://cors.shapeshift.io';
    var rateUrl = baseUrl + '/rate/' + pair;
    //var coinaddress = '1GxxyXETH2PGRrT31uc8WG4ZfAkM1jVN8P';
    //var coinaddress = '19ACnBgaJ86U132bkSvu4XSxVrtfnsH7A5';
    var coinamount = Session.get("coinamount");
    var coinaddress = Session.get("coinaddress");
    if (!coinamount) {
      alert("Only paymnents with a specified amount are supported for now.");
      return;
    }
    var xargs = {
      amount:    coinamount,
      withdrawal: coinaddress,
      pair:      pair
    };
    var xargsJSON = JSON.stringify(xargs);
    var fixedTrxUrl = baseUrl + '/sendamount';
    console.log("Calling POST URL: " + fixedTrxUrl);
    console.log("JSON data: " + xargsJSON);

    HTTP.call("POST", fixedTrxUrl,
          {data: xargs},
          function (error, result) {
            if (error) {
              alert("There was an error: " + error);
              console.log(error);
            }
            else {
              console.log(result.content);
              var res = JSON.parse(result.content);
              if (res.error) {
                console.log("Error from API: " + res.error);
                alert("Error from API: " + res.error);
                return shapeShiftIt();
              }
              var altcointype    = sourcetype;
              var altcoinaddress = res.success.deposit;
              var altcoinamount  = res.success.depositAmount;
              var altcoinuri     = "litecoin:" + altcoinaddress + "?amount=" + altcoinamount;
              console.log("altcoin type: " + altcointype);
              console.log("altcoin address: " + altcoinaddress);
              console.log("altcoin amount: "  + altcoinamount);
              console.log("altcoin altcoinuri: "  + altcoinuri);
              Session.set('altcointype',altcointype);
              Session.set('altcoinaddress',altcoinaddress);
              Session.set('altcoinamount',altcoinamount);
              Session.set('altcoinuri',altcoinuri);
              // res.success has these keys:
              // apiPubKey: "shapeshift"
              // deposit: "DCsscuFzuDWXppnTiFHFaYPzBSLTzGSN1e"
              // depositAmount: "2340.42553191"
              // expiration: 1429314132831
              // minerFee: "0.0001"
              // pair: "doge_btc"
              // quotedRate: "4.7e-7"
              // withdrawal: "19ACnBgaJ86U132bkSvu4XSxVrtfnsH7A5"
              // withdrawalAmount: "0.001"

              Router.go('/payanythingApprove');
            }
    });
};

Template.payanythingShift.rendered = function() {
  shapeShiftIt();
};

// Template.payanythingShift.events({
//   'click .test-shift-button' : function(){

//   }
// });

Template.payanythingShift.helpers({
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
  }
});

    //{"amount":123, "withdrawal":"123ABC", "pair":"ltc_btc", returnAddress:"BBBBBBB"}
    // HTTP.call("GET", rateUrl,
    //       function (error, result) {
    //         if (!error) {
    //           console.log("Got rate info, look at result");
    //           debugger;
    //         }
    //       });

    // var mockSuccessResult = {
    //      success:
    //           {
    //             pair: pair,
    //             withdrawal: withdrawal, //-- will match address submitted in post
    //             withdrawalAmount: xargs.amount, // Amount of the output coin you will receive
    //             deposit: <Deposit Address (or memo field if input coin is BTS / BITUSD)>,
    //             depositAmount: <Deposit Amount>, // Exact amount of input coin to send in
    //             expiration: <timestamp when this will expire>,
    //             quotedRate: <the exchange rate to be honored>
    //             apiPubKey: <public API attached to this shift, if one was given>
    //           }
    // };



