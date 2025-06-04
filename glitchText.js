function glitchText(text) {
  const zalgoUp = [
    '\u030d', '\u030e', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308', '\u0309',
    '\u030a', '\u030b', '\u030c', '\u030f', '\u0310', '\u0311', '\u0312', '\u0313',
    '\u0314', '\u033d', '\u033e', '\u033f', '\u0342', '\u0343', '\u0344', '\u0345',
    '\u0346', '\u034a', '\u034b', '\u034c', '\u0350', '\u0351', '\u0352', '\u0357',
    '\u0358', '\u035b', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368',
    '\u0369', '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u031a'
  ];

  const zalgoDown = [
    '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f',
    '\u0320', '\u0323', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b',
    '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333',
    '\u0339', '\u033a', '\u033b', '\u033c'
  ];

  const zalgoMid = [
    '\u0334', '\u0335', '\u0336', '\u0337', '\u0338', '\u0340', '\u0341', '\u0347',
    '\u0348', '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356'
  ];

  function getRandomChars(arr, max) {
    const count = Math.floor(Math.random() * max) + 1;
    let result = '';
    for (let i = 0; i < count; i++) {
      result += arr[Math.floor(Math.random() * arr.length)];
    }
    return result;
  }

  return text.split('').map(char => {
    return char +
      getRandomChars(zalgoUp, 0) +
      getRandomChars(zalgoMid, 0) +
      getRandomChars(zalgoDown, 4);
  }).join('');
}

console.log(glitchText("んばばばばばばばば"));
