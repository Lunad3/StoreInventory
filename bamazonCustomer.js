// requirer npm modules
var iqrr = require("inquirer");
var sql  = require("mysql");

// create connection to local database
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


//----------------------------- BAMAZON LOGIC: major calls and logic layour for bamazon
//  start: refreshes products and initializes the purchase prompts -> gets product list and feeds it to makePurchase
var start = function(){
    db.query("SELECT * FROM products", function(err,products){
        if(err) throw err;
        makePurchase(products);
    });
};

//  makePurchase: use products list to select a product then select quantity of purchase and finaly update the database
//                prompts use lists of most recent database info, no wrong inputs (YAY!)
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
            console.log("\n+++++++++++++++++++++++++++++++++++++++++++\n");
            var stockLeft = parseInt(stockList[stockList.length-1])-parseInt(quantityStr.quantity)
            updateStock(stockLeft,product.id);
        });
    });
};

//  updateStock: adjusts the selected products stock value, then calls askContinueShopping
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

//  askContinueShoppint: prompts user if they want to continue shopping, if not then close mySQL connection and say goodbye
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


//----------------------------- HELPER FUNCTIONS: these functions help make bamazon logic cleaner

//  products2IdAndNameList: formats products list into list of product ids and name, [{product},...] -> ["(id) : (name)",...]
var products2IdAndNameList = function (list){
    var result = [];
    for (var i=0; i<list.length; i++){
        if (parseInt(list[i].stock_quantity) != 0){
            result.push( list[i].item_id.toString() + " : " + list[i].product_name);
        }
    }
    return result;
};

//  productStr2Obj: turns " (id) : (name) " to {name:"(name)", id:"(id)"}
var productStr2Obj = function(productStr){
    var strComponents = productStr.split(" : ");
    return {name:strComponents[1].trim(), id:strComponents[0].trim()};
};

//  listProductStock: use products list and product id to list all possible purchase ammounts [0 - stockMax] of product
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


//----------------------------- INITIATE BAMAZON: connect to database and then begin bamazon logic
db.connect(function(err) {
    if (err) throw err;
    console.log("================= Bamazon =================\n");
    start();
  });