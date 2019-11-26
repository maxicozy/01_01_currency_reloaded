/*
 * CURRENCY CONVERTER RELOADED
 * Author: <ich>
 * ---------------------------
 *
 * This converts currencies...somehow.
 *
 * A list of ressources you used, for example links:
 * [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference).
 */

/*
 *  Aufgabe: Baut einen neuen Währungsumrechner. Nachfolgend findet ihr Code der die 
 *  dafür notwendingen Eingabewerte von der Konsole entgegennimmt.
 * 
 *  Dafür müsst ihr das Script wie folgt aufrufen:
 *  npm start -- <Ausgangssumme> <Ausgangswährung-Code> <Zielwährung-Code>
 *  also z.B.
 *  npm start -- 10.0 USD EUR
 * 
 *  Die erwartete Ausgabe ist ein Text in folgender Form:
 *  "Ergebnis: <Ausgangssumme> <Ausgangswährung> = <Ergebnis> <Zielwährung>"
 *  also z.B.
 *  Ergebnis: 10.00 USD = 11.00 EUR
 *  
 *  Das Script soll mindestens drei verschiedene Währungen in beide Richtungen unterstützen
 */


const currencies = require('./currencies');
let args = process.argv.slice(2);
const request = require('request');

request('https://api.exchangeratesapi.io/latest', function (error, response, body) {
  let amount, originalCurrency, targetCurrency;
  let bodyObj = JSON.parse(body);
  for (let currency in bodyObj.rates) {
    if (currencies.hasOwnProperty(currency)) {
      currencies[currency].Kurs = bodyObj.rates[currency];
    } else {
      currencies[currency] = {}
      currencies[currency].Kurs = bodyObj.rates[currency];
    }
  }

  if (args.length < 3) {
    console.log('Error: Not enough input arguments given!');
  } else if (args.length > 3) { 
    console.log('Error: Too many input arguments given!');
  } else if (isNaN(args[0])) {
    console.log(args[0] + ' is not a number')
  } else {
    amount = args[0];
    originalCurrency = args[1];
    targetCurrency = args[2];

    if (currencies.hasOwnProperty(originalCurrency) === false || currencies.hasOwnProperty(targetCurrency) === false) {
      console.log('Error: Given currencies are not supported!');
    } else {
      const amountInEur = amount / currencies[originalCurrency].Kurs;
      const output = amountInEur * currencies[targetCurrency].Kurs;
      let symbolOG = currencies[originalCurrency].Symbol + ' ';
      let symbolTG = currencies[targetCurrency].Symbol + ' ';
      
      if (symbolOG == undefined + ' ') {
        symbolOG = ' ';
      }
      if (symbolTG == undefined + ' ') {
        symbolTG = ' ';
      }
      console.log(amount + symbolOG + originalCurrency + ' entsprechen ' + output + symbolTG + targetCurrency);
    }
  }
});
