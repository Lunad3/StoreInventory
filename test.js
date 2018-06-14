var inqrr = require("inquirer");
var objList = [
	{name:"a",size:1},
	{name:"b",size:2},
	{size:3, name:"c"}
];

var nameList = ["1","2","3"];

var a = 12;
console.log(typeof(a));
console.log(typeof(a.toString()));


// inqrr.prompt([{
// 	type:"list",
// 	choices: objList,
// 	message: "choose 1",
// 	name: "choice1"
// }]).then(function(firstInput){
// 	inqrr.prompt([{
// 		type:"list",
// 		choices: nameList,
// 		message:"choice 2",
// 		name: "choice2"
// 	}]).then(function(secondInput){
// 		console.log(firstInput.choice1);
// 		console.log(secondInput.choice2);
// 	});
// });
