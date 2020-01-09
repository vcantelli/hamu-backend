const jwt = require('jsonwebtoken')
const moment = require('moment')
const MagentoAPI = require('magento-api')
const md5 = require('md5')
const { promisify } = require('util')
const { secret, config } = require('../config/jwt')
const codigoBancos = require('../models/codigo_bancos')
const {
  cedCsmarketplaceVendorProducts,
  cedCsmarketplaceVendorShop,
  cedCsmarketplaceVendor,
  cedCsmarketplaceVendorDatetime,
  cedCsmarketplaceVendorInt,
  cedCsmarketplaceVendorVarchar,
  customerEntity,
  customerEntityDatetime,
  customerEntityVarchar,
  salesFlatOrderItem
} = require('../models')
const magento = new MagentoAPI(require('../config/magento'))

const ENTITY_CUSTOMER = 1
const ENTITY_CS_VENDOR = 9
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
const FIREBASE_TOKEN = 175
const PERSONAL_DOCUMENT = 15
const DATE_OF_BIRTH = 11
const COMPANY_INTERNAL_ADDRESS = 155
const COMPANY_INTERNAL_CITY = 156
const COMPANY_INTERNAL_POSTAL_CODE = 157
const COMPANY_INTERNAL_STATE = 158
const COMPANY_CATEGORY = 176
const COMPANY_HOLDER_NAME = 177
const COMPANY_DOCUMENT = 178
const COMPANY_ACCOUNT_NUMBER = 179
const COMPANY_BANK_NUMBER = 180
const COMPANY_AGENCY_NUMBER = 181
const COMPANY_TYPE_OF_ACCOUNT = 182
const HAS_ACCEPTED_TERMS = 183
const COMPANY_TELEPHONE = 184

magento.login = promisify(magento.login).bind(magento)

magento.customer.create = promisify(magento.customer.create).bind(magento.customer)
magento.customer.info = promisify(magento.customer.info).bind(magento.customer)
magento.customer.update = promisify(magento.customer.update).bind(magento.customer)

magento.catalogCategory.tree = promisify(magento.catalogCategory.tree).bind(magento.catalogCategory)

magento.catalogProduct.create = promisify(magento.catalogProduct.create).bind(magento.catalogProduct)
magento.catalogProduct.info = promisify(magento.catalogProduct.info).bind(magento.catalogProduct)
magento.catalogProduct.update = promisify(magento.catalogProduct.update).bind(magento.catalogProduct)
magento.catalogProduct.delete = promisify(magento.catalogProduct.delete).bind(magento.catalogProduct)

magento.catalogProductAttributeMedia.create = promisify(magento.catalogProductAttributeMedia.create).bind(magento.catalogProductAttributeMedia)
magento.catalogProductAttributeMedia.list = promisify(magento.catalogProductAttributeMedia.list).bind(magento.catalogProductAttributeMedia)
magento.catalogProductAttributeMedia.update = promisify(magento.catalogProductAttributeMedia.update).bind(magento.catalogProductAttributeMedia)

module.exports = {
  registerToken ({ body, decoded }, response) {
    upsertFirebaseToken(body.token, decoded.id).then(function () {
      response.status(200).end()
    }).catch(function (error) {
      response.status(500).send(errorSanitizer(error))
    })
  },

  create ({ body }, response) {
    body.name = body.firstname // TODO: Remover essa jumentisse

    if (customerDataIsIncomplete(body)) {
      return response.status(400).send({ name: 'Missing fields', message: 'There are mandatory fields missing' })
    }

    var customerInfo
    magento.login().then(() => {
      return magento.customer.create({
        customerData: {
          email: body.email,
          firstname: body.name.split(' ')[0],
          lastname: body.name.substr(body.name.indexOf(' ')).trim(),
          password: body.password,
          website_id: 1,
          store_id: 1,
          group_id: 1
        }
      })
    }).then(created => {
      customerInfo = created
      return createMarketplaceVendor(body, customerInfo)
    }).then(() => {
      return recoverMarketplaceVendor(customerInfo, body.email)
    }).then(vendor => {
      const token = jwt.sign(vendor, secret, config)
      return response.status(200).send({ vendor, token })
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  update ({ body, decoded }, response) {
    body.name = body.firstname // TODO: Remover essa jumentisse tambem

    if (customerDataIsIncomplete(body, true)) {
      return response.status(400).send({ name: 'Missing fields', message: 'There are mandatory fields missing' })
    }

    magento.login().then(() => {
      const customerData = {
        email: body.email,
        firstname: body.name.split(' ')[0],
        lastname: body.name.substr(body.name.indexOf(' ')).trim(),
        website_id: 1,
        store_id: 1,
        group_id: 1
      }
      if (body.password) customerData.password = body.password

      return magento.customer.update({
        customerId: decoded.customerId,
        customerData
      })
    }).then(() => {
      return updateMarketplaceVendor(body, decoded.id, decoded.customerId)
    }).then(() => {
      return recoverMarketplaceVendor(decoded.customerId, body.email)
    }).then(vendor => {
      const token = jwt.sign(vendor, secret, config)
      return response.status(200).send({ vendor, token })
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  get ({ decoded }, response) {
    magento.login().then(() => {
      return magento.customer.info({ customerId: decoded.customerId })
    }).then(customerInfo => {
      return getMarketplaceVendor(customerInfo, decoded.id, decoded.customerId)
    }).then(vendor => {
      response.status(200).send(vendor)
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  listProducts ({ decoded }, response) {
    magento.login().then(() => {
      return cedCsmarketplaceVendorProducts.findAll({
        where: { vendor_id: decoded.id }
      })
    }).then(products => {
      return Promise.all(products.map(({ dataValues }) => {
        // TODO: Arrumar o preço para aparecer formatado no front, mas submeter o valor numérico
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
      var newList = productsList.filter(item => !!item && item.check_status === true)
      console.log(newList)
      response.status(200).send(newList)
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  listSales ({ decoded }, response) {
    var listOfProducts = []
    magento.login().then(() => {
      return cedCsmarketplaceVendorProducts.findAll({
        where: { vendor_id: decoded.id }
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
      listOfProducts = productsList.filter(item => !!item).map(item => {
        item.qty = 0
        item.price = 0
        return item
      })
      return salesFlatOrderItem.findAll({ where: { product_id: listOfProducts.map(item => item.product_id) } })
    }).then(productsList => {
      console.log(productsList)
      var totals = productsList.reduce((list, product) => {
        let index = list.findIndex(item => item.id === product.product_id)
        if (index !== -1) {
          list[index].qty++
          list[index].price += product.price
        } else {
          list.push({
            id: product.product_id,
            qty: 1,
            price: product.price
          })
        }
        return list
      }, [])
      var listWithTotals = listOfProducts.map(item => {
        let index = totals.findIndex(item => item.id === item.product_id)
        if (index !== -1) {
          item.qty = totals[index].qty
          item.price = totals[index].price
        }
        return item
      })
      response.status(200).send(listWithTotals)
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  createProduct ({ body, decoded }, response) {
    let productId
    let sku = generateSKU(body.name)
    // TODO: Corrigir submit do preço no app e remover essa merda
    if (isNaN(body.price)) body.price = body.price.replace(/\./g, '').replace(',', '.')

    magento.login().then(() => {
      return magento.catalogProduct.create({
        type: 'simple',
        set: 4,
        sku: sku,
        data: {
          category_ids: [body.category, body.neighborhood],
          website_ids: [1],
          name: body.name,
          description: body.description,
          short_description: body.shortDescription || '',
          weight: body.weight,
          status: '1',
          url_key: body.urlKey || '',
          url_path: body.urlPath || '',
          visibility: '4',
          price: body.price,
          tax_class_id: 1,
          meta_title: body.metaTitle || '',
          meta_keyword: body.metaKeyword || '',
          meta_description: body.metaDescription || '',
          stock_data: {
            qty: body.quantity,
            is_in_stock: 1,
            manage_stock: 1,
            use_config_manage_stock: 1,
            use_config_min_qty: 1,
            use_config_min_sale_qty: 1,
            use_config_max_sale_qty: 1,
            use_config_backorders: 1,
            use_config_notify_stock_qty: 1
          }
        }
      })
    }).then(product => {
      return cedCsmarketplaceVendorProducts.create({
        vendor_id: decoded.id,
        product_id: product,
        type: 'simple',
        price: body.price,
        special_price: 0,
        name: body.name,
        description: body.description,
        short_description: body.shortDescription || '',
        sku: sku,
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
        [body.image1Base64, body.imageName || 'img1'],
        [body.image2Base64, body.image2Name || 'img2'],
        [body.image3Base64, body.image3Name || 'img3']
      ]
      return Promise.all(images.map((img, i) => createProductImage(img[0], img[1], productId, i, magento)))
    }).then(() => {
      response.status(200).send({ sku })
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
    // TODO: Corrigir submit do preço no app e remover essa merda
    if (isNaN(body.price)) body.price = body.price.replace(/\./g, '').replace(',', '.')

    magento.login().then(() => {
      return Promise.all([
        magento.catalogProduct.update({
          id: params.productId,
          data: {
            category_ids: [body.category, body.neighborhood],
            price: body.price,
            name: body.name,
            description: body.description,
            short_description: body.shortDescription || '',
            stock_data: {
              qty: body.quantity,
              is_in_stock: 1,
              manage_stock: 1,
              use_config_manage_stock: 1,
              use_config_min_qty: 1,
              use_config_min_sale_qty: 1,
              use_config_max_sale_qty: 1,
              use_config_backorders: 1,
              use_config_notify_stock_qty: 1
            }
          }
        }),
        cedCsmarketplaceVendorProducts.update(
          {
            price: body.price,
            name: body.name,
            description: body.description,
            short_description: body.shortDescription || '',
            qty: body.quantity
          }, {
            where: {
              product_id: params.productId
            }
          }
        )
      ])
    }).then(() => {
      return new Promise(resolve => {
        magento.catalogProductAttributeMedia.list({
          product: params.productId
        }).then(() => resolve()).catch(resolve)
      })
    }).then(error => {
      if (error) return Promise.resolve()
      const images = [
        body.image1Base64 && !body.image1Base64.includes("www.hamu.com.br") && [body.image1Base64, body.imageName || 'img1'],
        body.image2Base64 && !body.image2Base64.includes("www.hamu.com.br") && [body.image2Base64, body.image2Name || 'img2'],
        body.image3Base64 && !body.image3Base64.includes("www.hamu.com.br") && [body.image3Base64, body.image3Name || 'img3']
      ]
      return Promise.all(images.filter(item => !!item).map((img, i) => updateProductImage(img[0], img[1], params.productId, i, magento)))
    }).then(() => {
      response.status(200).send()
    }).catch(error => {
      response.status(500).send(errorSanitizer(error))
    })
  },

  deleteProduct ({ params }, response) {
    magento.login().then(() => {
      return magento.catalogProduct.delete({ id: Number(params.productId) })
    }).then(() => {
      return cedCsmarketplaceVendorProducts.destroy({ where: { product_id: Number(params.productId) } })
    }).then(() => {
      response.status(200).send()
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
        attribute_id: FACEBOOK_ID,
        entity_type_id: ENTITY_CS_VENDOR,
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

  getCategoriesList (_request, response) {
    magento.login().then(() => {
      return magento.catalogCategory.tree({ parentId: 8 })
    }).then(categories => {
      response.status(200).send({
        categories: categories.children.filter(category => category.is_active === '1').reduce((lista, categoria) => {
          lista.push(categoria)
          if(categoria.children.filter(category => category.is_active === '1').lenght > 0) {
            lista.push(categoria.children.filter(category => category.is_active === '1'))
          }
          return lista
        }, [])
      })
    }).catch(error => {
      if (error === 403) response.status(403).send('0')
      else response.status(400).send(errorSanitizer(error))
    })
  },

  getBankCodes (_request, response) {
    response.status(200).send(codigoBancos)
  },

  getSizes ({ params }, response) {
    // if(params.id === '161') {
    //   response.status(200).send(['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'])
    // }
    if(params.id === 104 || params.id === '104' || params.id === 163 || params.id === '163' || params.id === 164 || params.id === '164' || params.id === 165 ||params.id === '165') {
      response.status(200).send(['EP', 'P', 'M', 'G', 'GG', 'XG'])
    } else {
      response.status(200).send([])
    }
  },

  getTermsHtml (_request, response) {
    response.status(200).json({
      terms: require('../config/terms')
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

function generateSKU (name) {
  name = name.replace(/ /g, '')
  const firstCharacter = name[0]
  const secondCharacter = name[name.length - 1]
  const thirdCharacter = name[parseInt((name.length - 1) / 2)]
  return `${firstCharacter}${secondCharacter}${thirdCharacter}-${generateRandomString(8)}`
}

function generateRandomString (length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function checkPasswordHash (password, stored) {
  const [hash, salt] = stored.split(':')
  return (hash === md5(salt + password))
}

function customerDataIsIncomplete (data, edit = false) {
  return (
    !data.email ||
    !data.name ||
    (!data.password && !edit) ||
    !data.fantasy_name ||
    !data.company_name ||
    !data.company_address ||
    !data.company_cnpj ||
    !data.telephone
  )
}

function upsertFirebaseToken (token, vendorId) {
  return new Promise((resolve, reject) => {
    cedCsmarketplaceVendorVarchar.find({
      where: entity([, FIREBASE_TOKEN, 0, vendorId])
    }).then(result => {
      if (!result) return cedCsmarketplaceVendorVarchar.create(entity([, FIREBASE_TOKEN, 0, vendorId, token]))
      else return result.updateAttributes({ value: token })
    }).then(resolve).catch(reject)
  })
}

function recoverMarketplaceVendor (customerId, email) {
  return new Promise(function (resolve, reject) {
    cedCsmarketplaceVendorInt.find({
      where: {
        attribute_id: CUSTOMER_ID,
        value: Number(customerId)
      }
    }).then((value) => {
      if (!value) throw 403
      return Promise.all([
        Promise.resolve(value.entity_id),
        cedCsmarketplaceVendorVarchar.find({ where: entity([, NAME, 0, value.entity_id]) }),
        Promise.resolve(email),
        // cedCsmarketplaceVendorVarchar.find({ where: entity([, EMAIL, 0, value.entity_id]) }),
        cedCsmarketplaceVendorVarchar.find({ where: entity([, PHONE, 0, value.entity_id]) }),
        cedCsmarketplaceVendorVarchar.find({ where: entity([, CNPJ, 0, value.entity_id]) }),
        cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_NAME, 0, value.entity_id]) }),
        cedCsmarketplaceVendorVarchar.find({ where: entity([, FANTASY_NAME, 0, value.entity_id]) }),
        cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_ADDRESS, 0, value.entity_id]) }),
        cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_CATEGORY, 0, value.entity_id]) }),
      ])
    }).then(([id, name, email, phone, cnpj, companyName, fantasyName, companyAddress, companyCategory]) => {
      resolve({
        id,
        customerId: customerId,
        name: name && name.value || '',
        email,
        phone: phone && phone.value || '',
        cnpj: cnpj && cnpj.value || '',
        companyName: companyName && companyName.value || '',
        fantasyName: fantasyName && fantasyName.value || '',
        companyAddress: companyAddress && companyAddress.value || '',
        companyCategory: companyCategory && companyCategory.value || ''
      })
    }).catch(reject)
  })
}

function createMarketplaceVendor (data, customerInfo) {
  return new Promise(function (resolve, reject) {
    const now = new Date()
    cedCsmarketplaceVendor.create({
      entity_type_id: ENTITY_CS_VENDOR,
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
        cedCsmarketplaceVendorDatetime.create(entity([, VENDOR_SINCE, null, vendor.null, now])),
        cedCsmarketplaceVendorInt.create(entity([, CUSTOMER_ID, 0, vendor.null, customerInfo])),
        cedCsmarketplaceVendorInt.create(entity([, GENDER, 0, vendor.null, 1])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_NAME, 0, vendor.null, data.company_name])),
        cedCsmarketplaceVendorVarchar.create(entity([, PHONE, 0, vendor.null, data.telephone.replace(',', '').replace('.', '')])),
        cedCsmarketplaceVendorVarchar.create(entity([, SHOP_URL, 0, vendor.null, (data.company_name).toLowerCase().replace(/\s/g, '')])),
        cedCsmarketplaceVendorVarchar.create(entity([, STATUS, 0, vendor.null, 'approved'])),
        cedCsmarketplaceVendorVarchar.create(entity([, GROUP, 0, vendor.null, 'general'])),
        cedCsmarketplaceVendorVarchar.create(entity([, NAME, 0, vendor.null, data.name])),
        cedCsmarketplaceVendorVarchar.create(entity([, FANTASY_NAME, 0, vendor.null, data.fantasy_name])),
        cedCsmarketplaceVendorVarchar.create(entity([, EMAIL, 0, vendor.null, data.personal_email])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_ADDRESS, 0, vendor.null, `${data.company_address} ${data.company_address_number}, ${data.company_adj} - ${data.company_neighborhood}`])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_INTERNAL_ADDRESS, 0, vendor.null, `${data.company_address} ${data.company_address_number}, ${data.company_adj} - ${data.company_neighborhood}`])),
        // TODO: Descomentar esse cara quando estivermos recebendo o campo de cidade
        // cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_INTERNAL_CITY, 0, vendor.null, data.company_city])),
        // TODO: Remover esse cara quando estivermos recebendo o campo de cidade
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_INTERNAL_CITY, 0, vendor.null, 'Santo André'])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_INTERNAL_POSTAL_CODE, 0, vendor.null, data.company_postal_code])),
        // TODO: Descomentar esse cara quando estivermos recebendo o campo de estado
        // cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_INTERNAL_STATE, 0, vendor.null, data.company_state])),
        // TODO: Remover esse cara quando estivermos recebendo o campo de estado
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_INTERNAL_STATE, 0, vendor.null, 'São Paulo'])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_CATEGORY, 0, vendor.null, data.company_category])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_HOLDER_NAME, 0, vendor.null, data.company_holder_name])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_DOCUMENT, 0, vendor.null, data.company_document])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_ACCOUNT_NUMBER, 0, vendor.null, data.company_account_number])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_BANK_NUMBER, 0, vendor.null, data.company_bank_number])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_AGENCY_NUMBER, 0, vendor.null, data.company_agency_number])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_TYPE_OF_ACCOUNT, 0, vendor.null, data.company_type_of_account])),
        cedCsmarketplaceVendorVarchar.create(entity([, COMPANY_TELEPHONE, 0, vendor.null, data.company_telephone])),
        cedCsmarketplaceVendorVarchar.create(entity([, HAS_ACCEPTED_TERMS, 0, vendor.null, 1])),
        cedCsmarketplaceVendorVarchar.create(entity([, CNPJ, 0, vendor.null, data.company_cnpj])),
        // TODO: Corrigir gravação da data de aniversário
        data.date_of_birth ? customerEntityDatetime.create(entity([ENTITY_CUSTOMER, DATE_OF_BIRTH, null, customerInfo, data.date_of_birth])) : Promise.resolve(),
        data.personal_document ? customerEntityVarchar.create(entity([ENTITY_CUSTOMER, PERSONAL_DOCUMENT, null, customerInfo, data.personal_document])) : Promise.resolve(),
        data.facebookId ? cedCsmarketplaceVendorVarchar.create(entity([, FACEBOOK_ID, 0, vendor.null, data.facebookId])) : Promise.resolve()
      ])
    }).then(function ([vendorId]) { resolve(vendorId) }).catch(reject)
  })
}

function updateMarketplaceVendor (data, vendorId, customerId) {
  return new Promise(function (resolve, reject) {
    return Promise.all([
      cedCsmarketplaceVendorVarchar.update({ value: data.company_name }, { where: entity([, COMPANY_NAME, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.telephone.replace(',', '').replace('.', '') }, { where: entity([, PHONE, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: (data.company_name).toLowerCase().replace(/\s/g, '') }, { where: entity([, SHOP_URL, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.name }, { where: entity([, NAME, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.fantasy_name }, { where: entity([, FANTASY_NAME, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.personal_email }, { where: entity([, EMAIL, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: `${data.company_address} ${data.company_address_number}, ${data.company_adj} - ${data.company_neighborhood}` }, { where: entity([, COMPANY_ADDRESS, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: `${data.company_address} ${data.company_address_number}, ${data.company_adj} - ${data.company_neighborhood}` }, { where: entity([, COMPANY_INTERNAL_ADDRESS, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_postal_code }, { where: entity([, COMPANY_INTERNAL_POSTAL_CODE, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_category }, { where: entity([, COMPANY_CATEGORY, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_holder_name }, { where: entity([, COMPANY_HOLDER_NAME, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_document }, { where: entity([, COMPANY_DOCUMENT, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_account_number }, { where: entity([, COMPANY_ACCOUNT_NUMBER, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_bank_number }, { where: entity([, COMPANY_BANK_NUMBER, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_agency_number }, { where: entity([, COMPANY_AGENCY_NUMBER, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_type_of_account }, { where: entity([, COMPANY_TYPE_OF_ACCOUNT, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_cnpj }, { where: entity([, CNPJ, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.update({ value: data.company_telephone }, { where: entity([, COMPANY_TELEPHONE, 0, vendorId]) }),
      data.date_of_birth ? customerEntityDatetime.update({ value: data.date_of_birth }, { where: entity([ENTITY_CUSTOMER, DATE_OF_BIRTH, null, customerId]) }) : Promise.resolve(),
      data.personal_document ? customerEntityVarchar.update({ value: data.personal_document }, { where: entity([ENTITY_CUSTOMER, PERSONAL_DOCUMENT, null, customerId]) }) : Promise.resolve(),
      data.facebookId ? cedCsmarketplaceVendorVarchar.update({ value: data.facebookId }, { where: entity([, FACEBOOK_ID, 0, vendorId]) }) : Promise.resolve()
    ]).then(() => { resolve(vendorId) }).catch(reject)
  })
}

function getMarketplaceVendor (data, vendorId, customerId) {
  return new Promise(function (resolve, reject) {
    Promise.all([
      customerEntityDatetime.find({ where: entity([ENTITY_CUSTOMER, DATE_OF_BIRTH, null, customerId]) }),
      customerEntityVarchar.find({ where: entity([ENTITY_CUSTOMER, PERSONAL_DOCUMENT, null, customerId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_NAME, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, PHONE, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, NAME, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, FANTASY_NAME, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, EMAIL, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_ADDRESS, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_INTERNAL_POSTAL_CODE, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_CATEGORY, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_HOLDER_NAME, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_DOCUMENT, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_ACCOUNT_NUMBER, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_BANK_NUMBER, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_AGENCY_NUMBER, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_TYPE_OF_ACCOUNT, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, COMPANY_TELEPHONE, 0, vendorId]) }),
      cedCsmarketplaceVendorVarchar.find({ where: entity([, CNPJ, 0, vendorId]) })
    ]).then(([
      date_of_birth,
      personal_document,
      companyName,
      phone,
      name,
      fantasyName,
      email,
      companyAddress,
      companyInternalPostalCode,
      companyCategory,
      companyHolderName,
      companyDocument,
      companyAccountNumber,
      companyBankNumber,
      companyAgencyNumber,
      companyTypeOfAccount,
      companyTelephone,
      cnpj
    ]) => resolve({
      ...data,
      created_at: data.created_at && new Date(data.created_at).toISOString(),
      updated_at: data.updated_at && new Date(data.updated_at).toISOString(),
      dob: data.dob && moment(data.dob).format('DD/MM/YYYY'),
      date_of_birth: date_of_birth && moment(date_of_birth.value).format('DD/MM/YYYY') || '',
      personal_document: personal_document && personal_document.value || '',
      company_name: companyName && companyName.value || '',
      telephone: phone && phone.value || '',
      firstname: name && name.value || '',
      fantasy_name: fantasyName && fantasyName.value || '',
      personal_email: email && email.value || '',
      company_address: companyAddress && companyAddress.value || '',
      company_address_number: '',
      company_adj: '',
      company_neighborhood: '',
      company_postal_code: companyInternalPostalCode && companyInternalPostalCode.value || '',
      company_category: companyCategory && companyCategory.value || '',
      company_holder_name: companyHolderName && companyHolderName.value || '',
      company_document: companyDocument && companyDocument.value || '',
      company_account_number: companyAccountNumber && companyAccountNumber.value || '',
      company_bank_number: companyBankNumber && companyBankNumber.value || '',
      company_agency_number: companyAgencyNumber && companyAgencyNumber.value || '',
      company_type_of_account: companyTypeOfAccount && companyTypeOfAccount.value || '',
      company_telephone: companyTelephone && companyTelephone.value || '',
      company_cnpj: cnpj && cnpj.value || ''
    })).catch(reject)
  })
}

function entity ([entity_type_id = ENTITY_CS_VENDOR, attribute_id, store_id, entity_id, value]) {
  const result = {}

  if (notNullNorUndef(entity_type_id)) result.entity_type_id = entity_type_id
  if (notNullNorUndef(attribute_id)) result.attribute_id = attribute_id
  if (notNullNorUndef(store_id)) result.store_id = store_id
  if (notNullNorUndef(entity_id)) result.entity_id = entity_id
  if (notNullNorUndef(value)) result.value = value

  return result
}

function notNullNorUndef (value) {
  return value !== null && value !== undefined
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

function updateProductImage (content, name, productId, position, magento) {
  if (!content) return Promise.resolve()
  return new Promise(function (resolve) {
    magento.catalogProductAttributeMedia.update({
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
