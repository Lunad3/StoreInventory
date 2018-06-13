var iqrr = require("inquirer");
var sql  = require("mysql");

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

var formatPurchase = function(idStr, quantityStr){
    //trim the strings
    idStr = idStr.trim();
    quantityStr = quantityStr.trim();
    //check that both arguments str contain only numbers
    if (!isNaN(idStr) && !isNaN(quantityStr)){
        //return obj with ints
        return {
            "productId": parseInt(idStr),
            "quantity" : parseInt(quantityStr)
        };
    }
    else{
        console.log("BamazonCustomer::InputError:: one or more inputs containt non-numer characters");
    }
};


var Start = function (){
    iqrr.prompt([{
            type:"input",
            message: "Product ID of item to purchase: ",
            name:"productId",
        },{
            type:"input",
            message: "                      Quantity:",
            name: "quantity"
        }]).then(function(input){
            // purchase.productId (int) && purchse.quantity (int)
            var purchase = formatPurchase(input.productId,input.quantity);
            if (purchase != undefined){
                
            }


    });
};
