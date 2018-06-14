var iqrr = require("inquirer");
var sql  = require("mysql");

var db = sql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "Customer",
  
    // Your password
    password: "welcom2Bamazon",
    database: "bamazon"
  });
  
var askContinueShopping = function(){
    iqrr.prompt([{
        type:"list",
        message:"Continue Shopping?",
        name: "continueShopping",
        choices: ["yes","no"]
    }]).then(function(input){
        if(input.continueShopping == "yes"){
            start();
        }
        else{

            db.end();
            console.log("\n===========================================\n");
            console.log("  Thanks for shopping with Bamazon");
            console.log("\n===========================================\n");
        }
    });
};

var productStr2Obj = function(productStr){
    var strComponents = productStr.split(" : ");
    return {name:strComponents[1].trim(), id:strComponents[0].trim()};
};


var listProductStock = function(products,id){
    var result = [];
    for (var i=0; i<products.length; i++){
        if (products[i].item_id == id){
            for (var counter=0; counter<=products[i].stock_quantity; counter++){
                result.push(counter.toString());
            }
            return result;
        }
    }
};

var updateStock = function(newStock, Id){
    db.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: newStock
          },{
            item_id: Id
        }],
        function(error) {
          if (error) throw error;
          console.log("  INVENTORY UPDATED");
          console.log("\n-------------------------------------------\n");
          askContinueShopping();
    });
}


var makePurchase = function (products){
    console.log("\n+++++++++++++++++ Purchase ++++++++++++++++\n");
    iqrr.prompt([{
        type:"list",
        message: "select a product:",
        name:"choice",
        choices: products2IdAndNameList(products)
    }]).then(function(productStr){
        var product = productStr2Obj(productStr.choice);
        var stockList = listProductStock(products,product.id)
        iqrr.prompt([{
            type:"list",
            message: "        Quantity:",
            name: "quantity",
            choices: stockList
        }]).then(function(quantityStr){
            var stockLeft = parseInt(stockList[stockList.length-1])-parseInt(quantityStr.quantity)
            console.log("\n-------------------------------------------\n");
            updateStock(stockLeft,product.id);
        });
    });
};

var products2IdAndNameList = function (list){
    var result = [];
    for (var i=0; i<list.length; i++){
        if (parseInt(list[i].stock_quantity) != 0){
            result.push( list[i].item_id.toString() + " : " + list[i].product_name);
        }
    }
    return result;
};

var start = function(){
    db.query("SELECT * FROM products", function(err,products){
        if(err) throw err;
        makePurchase(products);
    });
};

db.connect(function(err) {
    if (err) throw err;
    console.log("================= Bamazon =================\n");
    start();
  });