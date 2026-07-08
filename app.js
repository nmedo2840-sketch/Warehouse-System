const API_URL =
"https://script.google.com/macros/s/AKfycby9XPFcyfVbJsD5R2lQLiCseBwU2ddPMNQarUycl5qHxldnmracgk6Rnqqlkkf9MwvZ/exec";



let users = [];
let items = [];
let containers = [];
let inventory = [];
let requests = [];
let transactions = [];

let newRequestItems = [];

let selectedRequestItem = null;
let requestsItems = [];


// ============================
// GET DATA
// ============================


async function getData(action){


    try{


        let response = await fetch(
            API_URL + "?action=" + action
        );


        return await response.json();



    }
    catch(error){


        console.log(action,error);

        return [];


    }


}






// ============================
// LOAD DATA
// ============================


async function loadData(){

    users = await getData("getUsers");

    items = await getData("getItems");

    containers = await getData("getContainers");

    inventory = await getData("getInventory");

    requests = await getData("getRequests");

    requestsItems = await getData("getRequestItems");

    transactions = await getData("getTransactions");


    console.log("Users",users);

    console.log("Containers",containers);

    console.log("Inventory",inventory);

}






// ============================
// LOGIN
// ============================


async function login(){


await loadData();



let username =
document.getElementById("username")
.value.trim();



let password =
document.getElementById("password")
.value.trim();




let user =
users.find(row=>{


return row[2]==username &&
row[3]==password;


});




if(user){


document.getElementById("loginPage")
.style.display="none";


document.getElementById("system")
.style.display="block";



document.getElementById("currentUser")
.innerHTML =
"👤 "+user[1];




document.getElementById("itemsCount")
.innerHTML =
items.length-1;



document.getElementById("containersCount")
.innerHTML =
containers.length-1;



document.getElementById("requestsCount")
.innerHTML =
requests.length-1;



document.getElementById("transactionsCount")
.innerHTML =
transactions.length-1;



updateDashboard();


showItems();


showContainers();


showInventory();

    showRequests();

loadRequestLists();



}

else{


document.getElementById("loginMsg")
.innerHTML =
"❌ بيانات الدخول غير صحيحة";


}


}

// ============================
// DASHBOARD
// ============================


function updateDashboard(){



let total = 0;



for(let i=1;i<inventory.length;i++){


total += Number(inventory[i][5]) || 0;


}



document.getElementById("totalStock")
.innerHTML =
total.toLocaleString();





let low = 0;



for(let i=1;i<inventory.length;i++){



if(Number(inventory[i][5])<=0){


low++;


}


}



document.getElementById("lowStock")
.innerHTML =
low;




showLastTransactions();



}








// ============================
// LAST TRANSACTIONS
// ============================



function showLastTransactions(){



let html="";



let start =
Math.max(1,transactions.length-5);




for(let i=start;i<transactions.length;i++){



html += `


<tr>


<td>${transactions[i][0] || ""}</td>


<td>${transactions[i][2] || ""}</td>


<td>${transactions[i][3] || ""}</td>


<td>${transactions[i][4] || ""}</td>


<td>${transactions[i][6] || ""}</td>


</tr>


`;



}




let table =
document.getElementById("lastTransactions");



if(table){


table.innerHTML = html;


}



}









// ============================
// PAGE NAVIGATION
// ============================



function showPage(page){



let pages=[


"dashboard",

"items",

"containers",

"inventory",

"requests"


];





pages.forEach(p=>{


let section =
document.getElementById(p);



if(section){


section.classList.add("hidden");


}



});





let current =
document.getElementById(page);



if(current){


current.classList.remove("hidden");


}





document.getElementById("pageTitle")
.innerHTML =
page.toUpperCase();






if(page=="requests"){


loadRequestLists();


}



}


// ============================
// ITEMS
// ============================


function showItems(data=items){



let html="";



for(let i=1;i<data.length;i++){



html += `


<tr>


<td>${data[i][0] || ""}</td>


<td>${data[i][1] || ""}</td>


<td>${data[i][2] || ""}</td>


<td>${data[i][4] || ""}</td>


<td>${data[i][7] || ""}</td>



</tr>


`;



}



let table =
document.getElementById("itemsTable");



if(table){


table.innerHTML = html;


}



}








// ============================
// SEARCH ITEMS
// ============================



function searchItems(){



let value =
document.getElementById("search")
.value
.toLowerCase();





let result =
items.filter((row,index)=>{



if(index==0){

return true;

}



return String(row[0])
.toLowerCase()
.includes(value)


||

String(row[1])
.toLowerCase()
.includes(value);



});





showItems(result);



}









// ============================
// CONTAINERS
// ============================



function showContainers(){



let html="";



for(let i=1;i<containers.length;i++){



html += `


<tr>


<td>${containers[i][0] || ""}</td>


<td>${containers[i][1] || ""}</td>


<td>${containers[i][2] || ""}</td>


<td>${containers[i][3] || ""}</td>


<td>${containers[i][5] || ""}</td>



</tr>


`;



}




let table =
document.getElementById("containersTable");



if(table){


table.innerHTML = html;


}



}









// ============================
// INVENTORY
// ============================



function showInventory(){



let html = `


<table>


<tr>


<th>كود الصنف</th>

<th>الصنف</th>

<th>الوحدة</th>

<th>التصنيف</th>

<th>الموقع</th>

<th>الرصيد</th>

<th>C.SAP</th>


</tr>


`;






for(let i=1;i<inventory.length;i++){



html += `


<tr>


<td>${inventory[i][0] || ""}</td>


<td>${inventory[i][1] || ""}</td>


<td>${inventory[i][2] || ""}</td>


<td>${inventory[i][3] || ""}</td>


<td>${inventory[i][4] || ""}</td>


<td>${inventory[i][5] || 0}</td>


<td>${inventory[i][6] || ""}</td>



</tr>


`;



}






html += "</table>";






let box =
document.getElementById("inventoryData");



if(box){


box.innerHTML = html;


}



}

// ============================
// REQUEST SYSTEM
// ============================



function loadRequestLists(){



let containerSelect =
document.getElementById("requestContainer");



if(!containerSelect){

return;

}





let html="";



for(let i=1;i<containers.length;i++){



html += `


<option value="${containers[i][0]}">


${containers[i][0]} - ${containers[i][1]}


</option>


`;



}



containerSelect.innerHTML = html;



}









// ============================
// SEARCH REQUEST ITEM
// ============================



function searchRequestItem(){



let value =
document.getElementById("itemSearch")
.value
.toLowerCase();





if(value==""){


document.getElementById("itemResult")
.innerHTML="";


return;


}





let result =
inventory.filter((row,index)=>{



if(index==0){

return false;

}




return String(row[0])
.toLowerCase()
.includes(value)


||

String(row[1])
.toLowerCase()
.includes(value)


||

String(row[7])
.toLowerCase()
.includes(value);



});







let html="";



result.slice(0,10).forEach(item=>{



html += `


<div 

style="
padding:10px;
border:1px solid #ddd;
margin:5px;
cursor:pointer;
"


onclick="selectRequestItem('${item[0]}')"



>


<b>${item[0]}</b>
-
${item[1]}


<br>


الوحدة:
${item[2]}


<br>


الرصيد:
${item[5]}



</div>



`;



});






document.getElementById("itemResult")
.innerHTML = html;



}









// ============================
// SELECT ITEM
// ============================



function selectRequestItem(code){



selectedRequestItem =
inventory.find(row=>row[0]==code);





if(!selectedRequestItem){


return;


}





document.getElementById("selectedItem")
.innerHTML = `


✅ تم اختيار:


<b>
${selectedRequestItem[0]}
-
${selectedRequestItem[1]}
</b>


<br>


الوحدة:
${selectedRequestItem[2]}


<br>


الرصيد الحالي:
${selectedRequestItem[5]}



`;





document.getElementById("itemResult")
.innerHTML="";



}









// ============================
// ADD ITEM TO REQUEST
// ============================



function addRequestItem(){



let qty =
Number(
document.getElementById("requestQty")
.value
);





if(!selectedRequestItem){


alert("اختر الصنف أولا");


return;


}






if(qty<=0){


alert("أدخل الكمية");


return;


}







if(qty > Number(selectedRequestItem[5])){


alert(
"الكمية أكبر من الرصيد المتاح"
);


return;


}







newRequestItems.push({


ItemCode:selectedRequestItem[0],


ItemName:selectedRequestItem[1],


Qty:qty,


Unit:selectedRequestItem[2]


});







showRequestItems();





document.getElementById("itemSearch")
.value="";



document.getElementById("requestQty")
.value="";



document.getElementById("selectedItem")
.innerHTML="";



selectedRequestItem=null;



}









// ============================
// SHOW REQUEST ITEMS
// ============================



function showRequestItems(){



let html="";




newRequestItems.forEach((item,index)=>{



html += `


<tr>


<td>${item.ItemCode}</td>


<td>${item.ItemName}</td>


<td>${item.Qty}</td>


<td>${item.Unit}</td>


<td>


<button onclick="deleteRequestItem(${index})">

❌

</button>


</td>



</tr>



`;



});






document.getElementById("requestItemsTable")
.innerHTML = html;



}









// ============================
// DELETE ITEM
// ============================



function deleteRequestItem(index){


newRequestItems.splice(index,1);


showRequestItems();


}


// ============================
// SAVE REQUEST
// ============================



async function saveRequest(){



if(newRequestItems.length==0){


alert("أضف أصناف للطلب أولا");


return;


}






let requestNo =

"PR-"

+

new Date().getFullYear()

+

"-"

+

Date.now();








let data = {



action:"saveRequest",



RequestNo:requestNo,



Date:
new Date().toLocaleDateString(),




User:
document.getElementById("currentUser").innerText,




Container:
document.getElementById("requestContainer").value,




Status:"Open",




QR:
requestNo,




items:newRequestItems



};








try{



let response = await fetch(API_URL,{


method:"POST",


body:JSON.stringify(data)



});







let result =
await response.text();




console.log(result);






document.getElementById("requestMsg")
.innerHTML =


"✅ تم حفظ الطلب "

+

requestNo;








newRequestItems=[];



showRequestItems();






}

catch(error){



console.log(error);



alert("حدث خطأ أثناء الحفظ");


}



}








// ============================
// LOGOUT
// ============================



function logout(){



location.reload();


}
// ============================
// REQUESTS LIST
// ============================


function showRequests(){


let html="";


for(let i=1;i<requests.length;i++){


html += `

<tr>

<td>${requests[i][0]}</td>

<td>${requests[i][1]}</td>

<td>${requests[i][3]}</td>

<td>${requests[i][4]}</td>

<td>


<button onclick="viewRequest('${requests[i][0]}')">

👁 عرض

</button>



<button onclick="issueRequest('${requests[i][0]}')">

✅ صرف

</button>


</td>


</tr>

`;

}


let table =
document.getElementById("requestsTable");


if(table){

table.innerHTML=html;

}





function viewRequest(no){


let html="<h3>تفاصيل الطلب "+no+"</h3>";



for(let i=1;i<requestsItems.length;i++){


if(requestsItems[i][0]==no){


html+=`

<p>
${requestsItems[i][1]}
-
${requestsItems[i][2]}
-
${requestsItems[i][3]}
${requestsItems[i][4]}
</p>

`;

}


}



document.getElementById("requestDetails")
.innerHTML=html;


}



