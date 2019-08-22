module.exports = {
  getDeliveryInfoByOrderNumber,
  someoneElseAccepted
}

function getDeliveryInfoByOrderNumber (orderNumber) {
  // vai no banco
  // busca os pedidos de delivery pelo número da ordem (filtrando os cancelados)
  return Promise.resolve({courier_id: '243'})
}

/**
 * De acordo com o objeto que vem do get, verifica se algum entregador que não é o userId passado já está com esta entrega
 * @param {*} deliveryRequest
 * @param {*} userId
 * @returns {boolean}
 */
function someoneElseAccepted (deliveryRequest, userId) {
  return (
    !!deliveryRequest.courier_id
    && deliveryRequest.courier_id !== userId
  )
}
