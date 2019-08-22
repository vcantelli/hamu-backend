module.exports = {
  success,
  fail
}


function success (httpResponse, options) {
  return function (data) {
    const response = data

    if (options && options.csv) {
      const fileExtension = options.fileExtension || 'csv'
      httpResponse.writeHead(200, {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': 'text/csv; charset=utf-8;',
        'Content-Disposition': `inline; filename="${options.name || `arquivo`}.${fileExtension}";`
      })
      httpResponse.end(data)
    } else httpResponse.status(200).json(response)
  }
}

function fail (httpResponse, status) {
  return function (errors) {
    const response = {
      message: errors.message,
      errors: errors.errors
    }
    console.error((new Date()).toISOString(), errors)
    httpResponse.status(status || errors.status || 500).json(response)
  }
}
