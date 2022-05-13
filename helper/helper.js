function checkSyntax (message, symbol) {
  if (!message) {
    return false
  }

  return message.split(symbol).filter(Boolean)
}

function checkLength (arr, number) {
  if (!arr) {
    return false
  }
  const b = new Number(arr.length)
  if (number != b || number > b || number < b) {
    return false
  }

  return true
}

module.exports = {
  checkSyntax,
  checkLength
}
