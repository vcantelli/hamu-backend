module.exports = {
  getRoute,
  success,
  problem,
  getProblemReasons
}

function getRoute (orderNumber, userId) {
  return getDeliveryInfo(orderNumber, userId)
    .then(filterData)

  function getDeliveryInfo (orderNumber, userId) {
    const orderIsNotOnDelivering = false
    const userIsNotAllowed = false
    if (orderIsNotOnDelivering)
      throw { code: `ORDER_STATUS_INVALID`, message: `Pedido não está em estatus de entrega`, status: 400 }
    if (userIsNotAllowed)
      throw { code: `NOT_ALLOWED`, message: `Você não pode ter acesso a este pedido`, status: 403 }
    return Promise.resolve({ orderNumber })
  }

  function filterData (data) {
    return Promise.resolve({
      delivery_price: 800,
      customer: "Estevão Trabalhos",
      address: "Waverley Street, 2101, Old Palo Alto, Palo Alto - CA 94301",
      telephone: "11999999999",
      order_number: `${data.orderNumber}`
    })
  }
}

function success (orderNumber) {
  return changeOrderStatusToDelivered(orderNumber)
    .then(() => `SUCCESS`)

  async function changeOrderStatusToDelivered (orderNumber) {
    const myOrder = await getOrderOnMagento(orderNumber)
    myOrder.changeStatus('DELIVERED') // TODO: colocar estes estados em um lugar no modelo
    return updateOnMagento(myOrder)
  }

  function getOrderOnMagento (orderNumber) {
    return Promise.resolve({ ordenzinha: 'ordenzinha', status: 'TO_PICKUP', changeStatus: (newStatus) => { console.log(`Order status changed to ${newStatus}`) } })
  }

  function updateOnMagento (order) {
    return Promise.resolve()
  }
}

function problem () {
  return Promise.resolve('problem')
}

function getProblemReasons () {
  return Promise.resolve('getProblemReasons')
}
