const API_URL =
"https://script.google.com/macros/s/AKfycbxRd2dHhswl0ZX8mPhcleVmjBsO_1dRrKhaGYelWbixczUK4N7yt85xr24NXnXq-uzG/exec";


let users = [];
let items = [];
let containers = [];
let inventory = [];
let requests = [];
let transactions = [];



// تحميل البيانات من Google Sheet

async function loadData(){

try{

users = await fetch(API_URL+"?action=getUsers")
.then(r=>r.json());


items = await fetch(API_URL+"?action=getItems")
.then(r=>r.json());


containers = await fetch(API_URL+"?action=getContainers")
.then(r=>r.json());


inventory = await fetch(API_URL+"?action=getInventory")
.then(r=>r.json());


requests = await fetch(API_URL+"?action=getRequests")
.then(r=>r.json());


transactions = await fetch(API_URL+"?action=getTransactions")
.then(r=>r.json());


}

catch(error){

console.log(error);

alert("حدث خطأ في الاتصال بالبيانات");

}

}




// تسجيل الدخول

async function login(){


await loadData();



let username =
document.getElementById("username").value;


let password =
document.getElementById("password").value;



let user = users.find(row=>{

return row[2]==username &&
row[3]==password;

});



if(user){


document.getElementById("loginPage").style.display="none";


document.getElementById("system").style.display="flex";



document.getElementById("currentUser").innerHTML =
"👤 "+user[1];



document.getElementById("itemsCount").innerHTML =
items.length-1;


document.getElementById("containersCount").innerHTML =
containers.length-1;


document.getElementById("requestsCount").innerHTML =
requests.length-1;


document.getElementById("transactionsCount").innerHTML =
transactions.length-1;



showItems();

showContainers();

showInventory();



}

else{


document.getElementById("loginMsg").innerHTML =
"❌ بيانات الدخول غير صحيحة";


}


}




// تغيير الصفحات

function showPage(page){


let pages=[

"dashboard",
"items",
"containers",
"inventory",
"requests"

];



pages.forEach(p=>{

document.getElementById(p)
.classList.add("hidden");

});



document.getElementById(page)
.classList.remove("hidden");



document.getElementById("pageTitle")
.innerHTML =
page.toUpperCase();



}




// عرض الأصناف

function showItems(data=items){


let html="";


for(let i=1;i<data.length;i++){


html += `

<tr>

<td>${data[i][0]}</td>

<td>${data[i][1]}</td>

<td>${data[i][2]}</td>

<td>${data[i][4]}</td>

<td>${data[i][7]}</td>


</tr>

`;

}


document.getElementById("itemsTable")
.innerHTML=html;


}




// البحث في الأصناف

function searchItems(){


let value =
document.getElementById("search").value;



let result =
items.filter((row,index)=>{


if(index==0)
return true;



return row[0].includes(value)
||
row[1].includes(value);


});



showItems(result);


}





// عرض الكونتينرات

function showContainers(){


let html="";


for(let i=1;i<containers.length;i++){


html +=`

<tr>

<td>${containers[i][0]}</td>

<td>${containers[i][1]}</td>

<td>${containers[i][2]}</td>

<td>${containers[i][3]}</td>


</tr>


`;

}



document.getElementById("containersTable")
.innerHTML=html;


}




// عرض المخزون

function showInventory(){


let html="<table>";

html +=`

<tr>

<th>كود الصنف</th>
<th>الرصيد</th>

</tr>

`;



for(let i=1;i<inventory.length;i++){


html +=`

<tr>

<td>${inventory[i][0]}</td>

<td>${inventory[i][1]}</td>

</tr>

`;

}


html+="</table>";



document.getElementById("inventoryData")
.innerHTML=html;


}




// خروج

function logout(){

location.reload();

}
