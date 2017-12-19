const Inventions = require('../models').Inventions;
const InventionImages = require('../models').InventionImages;
var request = require("request");
var cheerio = require("cheerio");
var https = require('https');
var base64Img = require('base64-img');
var Sequelize = require('sequelize');

module.exports = {
  crawler (req, res) {
    request("https://www.avonstore.com.br/maquiagem", function(err, resp, body){
        if(err)
            console.log("ERROR: "+ err);
        
        var $ = cheerio.load(body);

        var listOfItems = [];
        
        $(".prateleira ul li").each(function(){

            var title = $(this).find(".avt-produto-vip a").attr('title');
            var price = $(this).find(".avt-produto-vip .productPrateleira .oldPrice").text().trim();
            var priceFormated = parseFloat(price.replace(/[^0-9-.]/g, ''));
            var discount = $(this).find(".avt-produto-vip .productPrateleira .bestPrice").text().trim();
            var discountPrice = parseFloat(discount.replace(/[^0-9-.]/g, ''));
            var description = "Produto com " + $(this).find(".avt-produto-vip .productPrateleira .perc").text().trim() + " de desconto";                
            var img = $(this).find(".avt-produto-vip .productPrateleira img").attr('src');
            if(title)
                listOfItems.push({title,description,priceFormated,discountPrice,img})                   
        })

        listOfItems.map((item) => {
            Inventions.create({
                name: item.title,
                description: item.description,
                quantity: 1,
                price: item.priceFormated,
                discountPrice: item.discountPrice,
                CategoryId: 2
            })
            .then(invention => {    
                base64Img.requestBase64(item.img, function(err, res, body) {
                    var newImage = body;
                    InventionImages.create({
                        image: newImage,
                        InventionId: invention.dataValues.id
                    }) 
                })      
            })
            .catch(err => 
                res.status(500).send(err)
            );
        })   
    });
    res.status(500).send();
  }
};