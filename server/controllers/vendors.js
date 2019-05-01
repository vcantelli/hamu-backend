const jwt = require('jsonwebtoken')
const MagentoAPI = require('magento-api')
const md5 = require('md5')
const { promisify } = require('util')
const { secret, config } = require('../config/jwt')
const {
  cedCsmarketplaceVendorProducts,
  cedCsmarketplaceVendorShop,
  cedCsmarketplaceVendor,
  cedCsmarketplaceVendorDatetime,
  cedCsmarketplaceVendorInt,
  cedCsmarketplaceVendorVarchar,
  customerEntity
} = require('../models')
const magento = new MagentoAPI(require('../config/magento'))

const VENDOR_SINCE = 133
const CUSTOMER_ID = 132
const GENDER = 140
const EMAIL = 142
const COMPANY_NAME = 137
const PHONE = 149
const SHOP_URL = 134
const STATUS = 135
const GROUP = 136
const NAME = 139
const FANTASY_NAME = 144
const COMPANY_ADDRESS = 148
const CNPJ = 161
const FACEBOOK_ID = 153

magento.login = promisify(magento.login).bind(magento)
magento.customer.create = promisify(magento.customer.create).bind(magento.customer)
magento.customer.info = promisify(magento.customer.info).bind(magento.customer)
magento.catalogProduct.create = promisify(magento.catalogProduct.create).bind(magento.catalogProduct)
magento.catalogProduct.info = promisify(magento.catalogProduct.info).bind(magento.catalogProduct)
magento.catalogProduct.update = promisify(magento.catalogProduct.update).bind(magento.catalogProduct)
magento.catalogProductAttributeMedia.create = promisify(magento.catalogProductAttributeMedia.create).bind(magento.catalogProductAttributeMedia)
magento.catalogProductAttributeMedia.list = promisify(magento.catalogProductAttributeMedia.list).bind(magento.catalogProductAttributeMedia)

module.exports = {
  create ({ body }, response) {
    if (customerDataIsIncomplete(body)) {
      return response.status(400).send({ name: 'Missing fields', message: 'There are mandatory fields missing' })
    }

    magento.login().then(() => {
      return magento.customer.create({
        customerData: {
          email: body.email,
          firstname: body.firstname,
          lastname: body.lastname,
          password: body.password,
          website_id: 1,
          store_id: 1,
          group_id: 1
        }
      })
    }).then(customerInfo => {
      return createMarketplaceVendor(body, customerInfo)
    }).then(vendorId => {
      response.status(200).send(vendorId.toString())
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  listProducts ({ decoded }, response) {
    magento.login().then(() => {
      return cedCsmarketplaceVendorProducts.findAll({
        where: { vendor_id: decoded.vendorId }
      })
    }).then(products => {
      return Promise.all(products.map(({ dataValues }) => {
        return new Promise(resolve => {
          magento.catalogProductAttributeMedia.list({
            product: dataValues.product_id
          }).then(Media => {
            resolve({
              ...dataValues,
              Media: Media.map(({ position, url }) => { return { position, url } })
            })
          }).catch(() => {
            resolve({ ...dataValues, Media: [] })
          })
        })
      }))
    }).then(productsList => {
      var newList = productsList.filter(item => !!item)
      console.log(newList)
      response.status(200).send(newList)
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  createProduct ({ body, decoded }, response) {
    let productId

    magento.login().then(() => {
      return magento.catalogProduct.create({
        type: 'simple',
        set: 4,
        sku: body.sku,
        data: {
          category_ids: [body.categoria, body.bairro],
          website_ids: [1],
          name: body.name,
          description: body.description,
          short_description: body.shortDescription,
          weight: body.weight,
          status: '1',
          url_key: body.urlKey,
          url_path: body.urlPath,
          visibility: '4',
          price: body.price,
          tax_class_id: 1,
          meta_title: body.metaTitle,
          meta_keyword: body.metaKeyword,
          meta_description: body.metaDescription
        }
      })
    }).then(product => {
      return cedCsmarketplaceVendorProducts.create({
        vendor_id: decoded.vendorId,
        product_id: product,
        type: 'simple',
        price: body.price,
        special_price: 0,
        name: body.name,
        description: body.description,
        short_description: body.shortDescription,
        sku: body.sku,
        weight: body.weight,
        check_status: 1,
        qty: body.quantity,
        is_in_stock: 1,
        website_ids: '1',
        is_multiseller: 0,
        parent_id: 0
      })
    }).then(result => {
      productId = result.dataValues.product_id
      return new Promise(resolve => {
        magento.catalogProductAttributeMedia.list({
          product: productId
        }).then(() => resolve()).catch(resolve)
      })
    }).then(error => {
      if (error) return Promise.resolve()
      const images = [
        [body.imageBase64, body.imageName],
        [body.image2Base64, body.image2Name],
        [body.image3Base64, body.image3Name]
      ]
      return Promise.all(images.map((img, i) => createProductImage(img[0], img[1], productId, i, magento)))
    }).then(() => {
      response.status(200).send(productId.toString())
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  getProduct ({ params }, response) {
    magento.login().then(() => {
      return Promise.all([
        magento.catalogProduct.info({ id: params.productId }),
        cedCsmarketplaceVendorProducts.find({ where: { product_id: params.productId } })
      ])
    }).then(([product, vendorProduct]) => {
      const newProduct = {
        product_id: Number(product.product_id),
        price: Number(product.price),
        special_price: Number(product.special_price),
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        sku: product.sku,
        qty: vendorProduct && vendorProduct.dataValues.qty,
        category: product.category_ids[0],
        neighbourhood: product.category_ids[1]
      }
      console.log(newProduct)
      response.status(200).send(newProduct)
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  editProduct ({ body, params }, response) {
    magento.login().then(() => {
      return Promise.all([
        magento.catalogProduct.update({
          id: params.productId,
          data: {
            category_ids: [body.categoria, body.bairro],
            price: body.price,
            name: body.name,
            description: body.description,
            short_description: body.shortDescription
          }
        }),
        cedCsmarketplaceVendorProducts.update(
          {
            price: body.price,
            name: body.name,
            description: body.description,
            short_description: body.shortDescription,
            qty: body.quantity
          }, {
            where: {
              product_id: params.productId
            }
          }
        )
      ])
    }).then(() => {
      response.status(200).send(true)
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  edit (_request, response) {
    cedCsmarketplaceVendorShop.find({
      where: { id: 1 }
    }).then(shop => {
      shop.updateAttributes({
        shop_disable: 1
      })
      response.status(200).send(shop)
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  destroy (_request, response) {
    cedCsmarketplaceVendorShop.destroy({
      where: { id: 1 }
    }).then(_shop => {
      response.status(200).send()
    }).catch(err => {
      response.status(500).send(err)
    })
  },

  login ({ body }, response) {
    if (!(body.email && body.password)) return response.status(400).send(false)

    magento.login().then(() => {
      return customerEntity.find({ where: { email: body.email } })
    }).then(customer => {
      if (!customer) throw 403

      return magento.customer.info({ customerId: customer.dataValues.entity_id })
    }).then(customerInfo => {
      if (!checkPasswordHash(body.password, customerInfo.password_hash)) throw 403

      return recoverMarketplaceVendor(customerInfo.customer_id, body.email)
    }).then(vendor => {
      const token = jwt.sign(vendor, secret, config)
      return response.status(200).send({ vendor, token })
    }).catch(error => {
      if (error === 403) return response.status(403).send('0')
      return response.status(400).send(errorSanitizer(error))
    })
  },

  checkFacebookId ({ query }, response) {
    if (!query.facebookId) return response.status(200).send(false)
    cedCsmarketplaceVendorVarchar.find({
      where: {
        attribute_id: 153,
        entity_type_id: 9,
        store_id: 0,
        value: query.facebookId
      }
    }).then(customer => {
      if (customer) response.status(200).send(customer.dataValues.entity_id.toString())
      else return response.status(200).send('0')
    }).catch(err => {
      return response.status(400).send(err)
    })
  },

  addImage ({ body, params }, response) {
    magento.login().then(() => {
      return magento.catalogProductAttributeMedia.list({
        product: params.productId
      })
    }).then(product => {
      return createProductImage(
        body.imageBase64,
        body.imageName,
        params.productId,
        product.lenght,
        magento
      )
    }).then(image => {
      response.status(200).send(image)
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  }
}

function checkPasswordHash (password, stored) {
  const [hash, salt] = stored.split(':')
  return (hash === md5(salt + password))
}

function customerDataIsIncomplete (data) {
  return (
    !data.email ||
    !data.firstname ||
    !data.lastname ||
    !data.password ||
    !data.fantasy_name ||
    !data.company_name ||
    !data.company_address ||
    !data.company_cnpj ||
    !data.telephone
  )
}

function recoverMarketplaceVendor (customerId, email) {
  return new Promise(function (resolve, reject) {
    cedCsmarketplaceVendorInt.find({
      where: {
        attribute_id: CUSTOMER_ID, value: customerId
      }
    }).then(({ entity_id }) => {
      return Promise.all([
        Promise.resolve(entity_id),
        cedCsmarketplaceVendorVarchar.find({ where: generateEntity(9, NAME, 0, entity_id) }),
        Promise.resolve(email),
        // cedCsmarketplaceVendorVarchar.find({ where: generateEntity(9, EMAIL, 0, entity_id) }),
        cedCsmarketplaceVendorVarchar.find({ where: generateEntity(9, PHONE, 0, entity_id) }),
        cedCsmarketplaceVendorVarchar.find({ where: generateEntity(9, CNPJ, 0, entity_id) }),
        cedCsmarketplaceVendorVarchar.find({ where: generateEntity(9, COMPANY_NAME, 0, entity_id) }),
        cedCsmarketplaceVendorVarchar.find({ where: generateEntity(9, FANTASY_NAME, 0, entity_id) }),
        cedCsmarketplaceVendorVarchar.find({ where: generateEntity(9, COMPANY_ADDRESS, 0, entity_id) })
      ])
    }).then(([id, name, email, phone, cnpj, companyName, fantasyName, companyAddress]) => {
      resolve({
        id,
        name: name && name.value || '',
        email,
        phone: phone && phone.value || '',
        cnpj: cnpj && cnpj.value || '',
        companyName: companyName && companyName.value || '',
        fantasyName: fantasyName && fantasyName.value || '',
        companyAddress: companyAddress && companyAddress.value || ''
      })
    }).catch(reject)
  })
}

function createMarketplaceVendor (data, customerInfo) {
  return new Promise(function (resolve, reject) {
    const now = new Date()
    cedCsmarketplaceVendor.create({
      entity_type_id: 9,
      attribute_set_id: 0,
      increment_id: '',
      store_id: 0,
      created_at: now,
      updated_at: now,
      is_active: 1,
      website_id: 1
    }).then(function (vendor) {
      return Promise.all([
        Promise.resolve(vendor.null),
        cedCsmarketplaceVendorDatetime.create(generateEntity(9, VENDOR_SINCE, 0, vendor.null, now)),
        cedCsmarketplaceVendorInt.create(generateEntity(9, CUSTOMER_ID, 0, vendor.null, customerInfo)),
        cedCsmarketplaceVendorInt.create(generateEntity(9, GENDER, 0, vendor.null, 1)),
        cedCsmarketplaceVendorVarchar.create(generateEntity(9, COMPANY_NAME, 0, vendor.null, data.company_name)),
        cedCsmarketplaceVendorVarchar.create(generateEntity(9, PHONE, 0, vendor.null, data.telephone.replace(',', '').replace('.', ''))),
        cedCsmarketplaceVendorVarchar.create(generateEntity(9, SHOP_URL, 0, vendor.null, (data.company_name).toLowerCase().replace(/\s/g, ''))),
        cedCsmarketplaceVendorVarchar.create(generateEntity(9, STATUS, 0, vendor.null, 'approved')),
        cedCsmarketplaceVendorVarchar.create(generateEntity(9, GROUP, 0, vendor.null, 'general')),
        cedCsmarketplaceVendorVarchar.create(generateEntity(9, NAME, 0, vendor.null, `${data.firstname} ${data.lastname}`)),
        cedCsmarketplaceVendorVarchar.create(generateEntity(9, FANTASY_NAME, 0, vendor.null, data.fantasy_name)),
        cedCsmarketplaceVendorVarchar.create(generateEntity(9, COMPANY_ADDRESS, 0, vendor.null, data.company_address)),
        cedCsmarketplaceVendorVarchar.create(generateEntity(9, CNPJ, 0, vendor.null, data.company_cnpj)),
        data.facebookId ? cedCsmarketplaceVendorVarchar.create(generateEntity(9, FACEBOOK_ID, 0, vendor.null, data.facebookId)) : Promise.resolve()
      ])
    }).then(function ([vendorId]) { resolve(vendorId) }).catch(reject)
  })
}

function generateEntity (entity_type_id, attribute_id, store_id, entity_id, value) {
  var result = {}

  if (entity_type_id) result.entity_type_id = entity_type_id
  if (attribute_id) result.attribute_id = attribute_id
  if (store_id) result.store_id = store_id
  if (entity_id) result.entity_id = entity_id
  if (value) result.value = value

  return result
}

function createProductImage (content, name, productId, position, magento) {
  if (!content) return Promise.resolve()
  return new Promise(function (resolve) {
    magento.catalogProductAttributeMedia.create({
      product: productId,
      data: {
        file: { name, content, mime: 'image/jpeg' },
        label: '',
        position,
        types: position === 0 ? ['image', 'small_image', 'thumbnail'] : [],
        exclude: '0'
      }
    }).then(resolve).catch(error => {
      console.error(error)
      resolve()
    })
  })
}

function errorSanitizer (error) {
  return {
    name: error.name || error,
    message: error.message || error
  }
}

// magento.login(function (error, sessId) {
//   if (error) return res.status(500).send(error)
//   magento.catalogProductAttributeMedia.list({
//     product: 163
//   }, function (error, product) {
//     console.log("err" + error)
//     console.log(product)
//   })
// })

// magento.login(function (error, sessId) {
//   if (error) {
//     // deal with error
//     return;
//   }
//   var passwordHash = '45690e2bdeb92e845cdc3080e497a0ef:X5q6mZkXVPQZKKbLl2Fi30LuV8wZD59q'
//   var passwordHash2 = 'X5q6mZkXVPQZKKbLl2Fi30LuV8wZD59q'
//   var password = 'y94rywvx'
//   var hash = md5(passwordHash2 + password)
//   // magento.catalogProduct.info({
//   //   id: 163
//   // }, function (err, product) {
//   //   console.log("err" + err)
//   //   console.log(product)
//   // })
//   var new_image = {
//     file: {
//       content: '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAXABcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDLooor8XP4DCiiigAooooAKKKKAP/Z',
//       mime: 'image/jpeg',
//       name: 'Teste'
//     },
//     label: '',
//     position: 3,
//     types: [],
//     exclude: '0'
//   }
//   // magento.catalogProductAttributeMedia.list({
//   //   product: 163,
//   // }, function (error, product) {
//   //   console.log("err" + error)
//   //   console.log(product)
//   // });

//   magento.customer.login({
//     email: 'v.cantelli@hotmail.com',
//     password: 'y94rywvx'
//   }, function (error, product) {
//     console.log("err" + error)
//     console.log(product)
//   });

//   // magento.customer.info({
//   //   customerId: 34
//   // }, function (error, product) {
//   //   console.log("err" + error)
//   //   console.log(product)
//   // });

//   // magento.catalogProductAttributeMedia.create({
//   //   product: 163,
//   //   data: new_image,
//   // }, function (error, product) {
//   //   console.log("err" + error)
//   //   console.log(product)
//   // });
//   // magento.catalogProduct.list(function (error, product) {
//   //   console.log("err" + error)
//   //   console.log(product)
//   // })
//   // use magento
// })
