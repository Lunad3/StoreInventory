var iqrr = require("inquirer");
var sql  = require("mysql");

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

var formatPurchase = function(idStr, quantityStr){
    //trim the strings
    idStr = idStr.trim();
    quantityStr = quantityStr.trim();
    //check that both arguments str contain only numbers
    if (!isNaN(idStr) && !isNaN(quantityStr) && idStr != "" && quantityStr != ""){
        //return obj with ints
        return {
            "productId": parseInt(idStr),
            "quantity" : parseInt(quantityStr)
        };
    }
};


var askContinueShopping = function(){
    iqrr.prompt([{
        type:"list",
        message:"Continue Shopping?",
        name: "continueShopping",
        choices: ["yes","no"]
    }]).then(function(input){
        if(input.continueShopping == "yes"){
            makePurchase();
        }
        else{
            console.log("\n  ->Thanks for shopping with Bamazon\n");
            console.log("===========================================");
                }
    });
};


var makePurchase = function (){
    console.log("\n+++++++++++++++++ Purchase ++++++++++++++++\n");
    // console.log("+++++++++++++++++++++++++++++++++++++++++++");
    iqrr.prompt([{
            type:"input",
            message: "Product ID of item to purchase:",
            name:"productId",
        },{
            type:"input",
            message: "                      Quantity:",
            name: "quantity"
        }]).then(function(input){
            console.log("\n-------------------------------------------\n");
            // purchase.productId (int) && purchse.quantity (int)
            var purchase = formatPurchase(input.productId,input.quantity);
            if (purchase != undefined){
                console.log("\n-------------------------------------------\n");

                console.log("  ->UPDATE INVENTORY\n");//<--------------------------------------------- INSERT MYSQL LOGIC/function HERE
                
                askContinueShopping();

            }
            else{
                console.log("\n-------------------------------------------\n");
                console.log("  ->Sorry, your input is invalid, please use only numbers");
                console.log("\n+++++++++++++++++++++++++++++++++++++++++++\n");
                askContinueShopping();
            }
    });
};

var Start = function(){
    console.log("================= Bamazon =================\n");
    makePurchase();
};

Start();