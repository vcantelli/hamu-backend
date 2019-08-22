// const RefusalDAO = require('./DAO/pickUpRefusal')

module.exports = {
  userAlreadyIsOnADelivery,
  openRequests,
  getPickupInfo,
  refusePickUp,
  acceptRequest,
  success,
  saveProblem
}


function userAlreadyIsOnADelivery (userId) {
  // Vai na tabela de delivery
  // Verifica se tem algum pedido com status em andamento deste usuário
  // se tiver retornar true
  return Promise.resolve(false)
  // TODO: Validar com victão isso aqui também
  // return DeliveryDAO.findAll({
  //   where: {
  //     status: {
  //       [Op.or]: ['PICKING_UP', 'DELIVERING']
  //     },
  //     courier_id: userId
  //   }
  // }).then(results => results && results.length > 0)
}


function openRequests (userId) {
  // Vai na tabela de delivery e busca por todos os pedidos que estão esperando alguém aceitar
  // ?: Tem que buscar de acordo com o id do amiguinho?
  return Promise.resolve([
    {
      "store": "Arco Íris",
      "store_address": "Av das Nações, 1916, Parque Oratório, Santo André - SP, 09270-400",
      "telephone": "1144011755",
      "order_number": "853291",
      "vehicle_type": "motorcycle",
      "latitude": -23.6402014,
      "longitude": -46.5406174
    },
    {
      "store": "Arco Íris",
      "store_address": "Av das Nações, 1916, Parque Oratório, Santo André - SP, 09270-400",
      "telephone": "1144011755",
      "order_number": "3242342",
      "vehicle_type": "motorcycle",
      "latitude": -23.6402014,
      "longitude": -46.5406174
    }])
  // TODO: Validar com victão isso aqui também
  // return DeliveryDAO.findAll({
  //   where: {
  //     status: 'OPEN'
  //   }
  // })
}

function getPickupInfo (orderNumber) {
  // Vai na tabela de delivery, busca todas as entregas com status PICKING UP, com aquele order_number, e retorna a com a data de criação mais nova
  // Vai na tabela do fornecedor e pega as informações do fornecedor
  // Vai na tabela do cliente e pega as informações de entrega
  // Vai na tabela do courier e pega as informações do carro dele
  return Promise.resolve({
    store: 'Arco Íris',
    store_address: 'Av das Nações, 1916, Parque Oratório, Santo André - SP, 09270-400',
    telephone: '1144011755',
    order_number: orderNumber,
    vehicle_type: 'motorcycle'
  })
}


function refusePickUp (orderNumber, userId) {
  // Salvar no banco que o fulano de tal recusou o pedido no dia X horário Y
  // Vitão pensou em colocar um vetor no pedido com os caras que recusaram (relacionamento n x m entre DELIVERY e COURIER -> tabela ternária)
  return Promise.resolve({
    orderNumber,
    userId,
    refusalTime: new Date()
  })

  // TODO: Validar a forma como fiz a parte que recusa
  // return RefusalDAO.create({
  //   delivery_id: orderNumber,
  //   courier_id: userId
  // })
}



/**
 * Accepting a delivery request
 * @param {*} orderNumber
 * @param {*} userId
 */
function acceptRequest (orderNumber, userId) {
  // Mudar o status
  // Mudar a data de pick up
  // Associar o usuário ao pedido de entrega
  return Promise.resolve({ orderNumber })
  // TODO: VALIDAR ESTA AQUI TAMBÉM
  // return DeliveryDAO.update({
  //   status: "PICKING_UP",
  //   accepted_at: new Date(),
  //   courier_id: userId,
  // }, { where: { order_number: orderNumber } })
}

/**
 * Success on picking up an order
 * @param {*} orderNumber
 */
function success (orderNumber) {
  return changeOrderStatusToPickedUp(orderNumber)
    .then(() => 'SUCCESS')
  async function changeOrderStatusToPickedUp (orderNumber) {
    const myOrder = await getOrderOnMagento(orderNumber)
    myOrder.changeStatus('PICKED_UP') // TODO: colocar estes estados em um lugar no modelo
    return updateOnMagento(myOrder)
  }

  // TODO: Muito dessas merdas vão estar em un controlador próprio do pedido, essas coisas já existem em hamu.com.br. Pegar na API do magento todas as ordens
  function getOrderOnMagento (orderNumber) {
    return Promise.resolve({ ordenzinha: 'ordenzinha', status: 'TO_PICKUP', changeStatus: (newStatus) => { console.log(`Order status changed to ${newStatus}`) } })
  }

  function updateOnMagento (order) {
    return Promise.resolve()
  }

  // TODO: VALIDAR ESTA AQUI TAMBÉM
  // return DeliveryDAO.update({
  //   status: "DELIVERING",
  //   picked_up_at: new Date(),
  // }, {where: {order_number: orderNumber}})
}



function saveProblem (reason, description, orderNumber) {
  // mudar o status da Delivery para "PICK_UP_PROBLEM"
  // Atualizar os campos
  // pick_up_problem => reason.
  // pick_up_problem_description => description
  // pick_up_problem_at => NOW()
  return Promise.resolve()
  // TODO: Validar esta merda com Victão também
  // return DeliveryDAO.update({
  //   pick_up_problem: reason,
  //   pick_up_problem_description: description,
  //   pick_up_problem_at: new Date(),
  // }, { where: {order_number: orderNumber}})

}
