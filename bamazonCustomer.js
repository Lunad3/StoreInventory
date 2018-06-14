var iqrr = require("inquirer");
var sql  = require("mysql");

var db = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "Customer",
  
    // Your password
    password: "welcom2Bamazon",
    database: "bamazon"
  });
  

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

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

var listProduct = function(){
    var productList = [];
    db.query("SELECT * FROM products", function(err,productsTable){
        if(err) throw err;
        for (var productIndex = 0; productIndex < productsTable.length; productIndex++){
            var str = productsTable[productIndex].item_id.toString() + " : " + productsTable[productIndex].product_name;
            productList.push(str);
        }
    });
    return productList;
};

var productStr2Obj = function(productStr){
    var strComponents = productStr.split(" : ");
    return {name:strComponents[1].trim(), id:strComponents[0].trim()};
};


var listProductStock = function(myProductObj){
    var quantities = [];
    db.query("SELECT * FROM products WHERE item_id LIKE '%" + myProductObj.id + "%';",function(err,product){
        if(err) throw err;
        var quantity = parseInt(product.stock_quantity);
        for (var q = 1; q <= quantity; q++){
            quantities.push(q.toString());
        }
    });
    return quantities;
};

var updateStock = function(newQuantity, Id){
    connection.query(
        "UPDATE auctions SET ? WHERE ?",
        [{
            stock_quantity: newQuantity
          },{
            item_id: Id
        }],
        function(error) {
          if (error) throw err;
          console.log("  ->INVENTORY UPDATED\n");
        }
      );
}

var makePurchase = function (){
    console.log("\n+++++++++++++++++ Purchase ++++++++++++++++\n");
    iqrr.prompt([{
        type:"list",
        message: "select a product:",
        name:"name",
        choices: listProductNames()
    }]).then(function(productStr){
        var product = productStr2Obj(productStr);
        var stockList = listProductStock(product)
        iqrr.prompt([{
            type:"list",
            message: "        Quantity:",
            name: "quantity",
            choices: stockList
        }]).then(function(quantityStr){
            var stockLeft = parseInt(stockList[stockList.length])-parseInt(quantityStr.quantity)
            // purchase.productId (int) && purchse.quantity (int)
            console.log("\n-------------------------------------------\n");
            updateStock(stockLeft,product.id);
            console.log("\n-------------------------------------------\n");
            askContinueShopping();
        });
    });
};

var start = function(){
    console.log("================= Bamazon =================\n");
    makePurchase();
};

db.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });