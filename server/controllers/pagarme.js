var pagarme = require('pagarme')

module.exports = {
  createTransaction (req, res) {
    pagarme.client.connect({ api_key: 'ak_test_i83ESQmqBsAZZ8C3LJU9A1UeAZWy5Q' })
      .then(client => client.transactions.create({
        'amount': 21000,
        // recusado pelo banco -> 837648_Hti+00felsXTYsLluHPcaKLi4shc+tVzQpnNTNuJCyvvqqRg3lncCYh0eZzVBuLTvH7NW5DiyDi1PIcSZG1TYH+rUvWCOzWBJWS7dpp2XkXyzvKckv+RLFjZ2OOxIl8mVIZZWpjMpOcJULIoGeyP3D6r6uJfxT4vDzWrv/DhCLC5GLUBiuk2hEvGbNwv4wHQe8y0UMnmgHbrNWyg4ZPtHN6Zf57lznprDQUANHBmmaUx7GLXD0Qfumw3RHvzpusfztyrquu2GRKxRZQOEvWvU7T6Pe+Jjrc5Wz+aErmD/mG7h9wxQqNvoI3x3j6+K9jYxXwtLGkzabJqwYpCCfhgAg==
        'card_hash': '837710_A2QAri93NYTjgK/PCmph+w2HM7zl3m1zD3sF8Rzi1O3x+P6PSkmWRrFzZ6r5LwJJ5LLdckqc8BHqxgsafsvb8mVaiYns6yLyADgFZT5YLJUYebR7zrCd249OuiqTc/Ea79MYpbFAqsnZ8v3OduFrMMh+G8Tj7h1Oy/Mcf21rMKut6vkVAMtpPu9RMDKRegQeDwXRTMbbzmq4j+0HgWjSoXOIOnnoKQCeQRwomjPj1PKrk83oRyjpYw1EzIy2kDnqZJwEm1dXeBaqNwKsLuJUaUvNe1IXCaBOJDwBW56H+XrMM3ldLZAyYsz3z8ZFfXER0PQQFPMT10sKCsBzmi4Oow==',
        'payment_method': 'credit_card',
        // 'postback_url': 'endpoint', // Endpoint do sistema que receberá informações a cada atualização da transação. Caso você defina este parâmetro, o processamento da transação se torna assíncrono.
        'soft_descriptor': 'evnts', // Descrição que aparecerá na fatura depois do nome de sua empresa. Máximo de 13 caracteres, sendo alfanuméricos e espaços.
        // 'card_number': '4111111111111111',
        // 'card_cvv': '123',
        // 'card_expiration_date': '0922',
        // 'card_holder_name': 'Morpheus Fishburne',
        'customer': {
          'external_id': '#3311',
          'name': 'Morpheus Fishburne',
          'type': 'individual',
          'country': 'br',
          'email': 'mopheus@nabucodonozor.com',
          'documents': [
            {
              'type': 'cpf',
              'number': '00000000000'
            }
          ],
          'phone_numbers': ['+5511999998888', '+5511888889999'],
          'birthday': '1965-01-01'
        },
        'billing': {
          'name': 'Trinity Moss',
          'address': {
            'country': 'br',
            'state': 'sp',
            'city': 'Cotia',
            'neighborhood': 'Rio Cotia',
            'street': 'Rua Matrix',
            'street_number': '9999',
            'zipcode': '06714360'
          }
        },
        // 'shipping': {
        //   'name': 'Neo Reeves',
        //   'fee': 1000,
        //   'delivery_date': '2000-12-21',
        //   'expedited': true,
        //   'address': {
        //     'country': 'br',
        //     'state': 'sp',
        //     'city': 'Cotia',
        //     'neighborhood': 'Rio Cotia',
        //     'street': 'Rua Matrix',
        //     'street_number': '9999',
        //     'zipcode': '06714360'
        //   }
        // },
        'items': [
          {
            'id': 'r123',
            'title': 'Red pill',
            'unit_price': 10000,
            'quantity': 1,
            'tangible': true
          },
          {
            'id': 'b123',
            'title': 'Blue pill',
            'unit_price': 10000,
            'quantity': 1,
            'tangible': true
          }
        ]
      })
        .then(client.transactions.capture))
      .then(transaction => res.status(200).send(transaction))
      .catch(err => res.status(500).send(err))
  },

  getTransaction (req, res) {
    pagarme.client.connect({ api_key: 'ak_test_i83ESQmqBsAZZ8C3LJU9A1UeAZWy5Q' })
      .then(client => client.transactions.find({ id: 3237660 }))
      .then(transaction => res.status(200).send(transaction))
      .catch(err => res.status(500).send(err))
  },

  refundTransaction (req, res) {
    pagarme.client.connect({ api_key: 'ak_test_i83ESQmqBsAZZ8C3LJU9A1UeAZWy5Q' })
      .then(client => client.transactions.refund({
        transactionId: 3237660
      }))
      .then(refund => res.status(200).send(refund))
      .catch(err => res.status(500).send(err))
  },

  getTransactionEvents (req, res) {
    pagarme.client.connect({ api_key: 'ak_test_i83ESQmqBsAZZ8C3LJU9A1UeAZWy5Q' })
      .then(client => client.events.find({ transactionId: 3237660 }))
      .then(events => res.status(200).send(events))
      .catch(err => res.status(500).send(err))
  },

  getTransactionGatewayOperations (req, res) {
    pagarme.client.connect({ api_key: 'ak_test_i83ESQmqBsAZZ8C3LJU9A1UeAZWy5Q' })
      .then(client => client.gatewayOperations.find({ transactionId: 3237660 }))
      .then(gatewayOperations => res.status(200).send(gatewayOperations))
      .catch(err => res.status(500).send(err))
  }
}
