const API_URL =
"https://script.google.com/macros/s/AKfycbwBtgilwn3Js3VQErXO6J1gw8zIXzqQZzj45dntpiTQjQfc4qWnel-_6kVVFiRbO6Aq/exec";


let users = [];
let items = [];
let containers = [];
let inventory = [];
let requests = [];
let transactions = [];

let newRequestItems = [];



// ============================
// GET DATA FROM GOOGLE SHEETS
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
// LOAD ALL DATA
// ============================

async function loadData(){


    users = await getData("getUsers");

    items = await getData("getItems");

    containers = await getData("getContainers");

    inventory = await getData("getInventory");

    requests = await getData("getRequests");

    transactions = await getData("getTransactions");



    console.log("USERS",users);

    console.log("ITEMS",items);

    console.log("CONTAINERS",containers);

    console.log("INVENTORY",inventory);


}






// ============================
// LOGIN
// ============================

async function login(){


    await loadData();



    let username =
    document.getElementById("username").value.trim();



    let password =
    document.getElementById("password").value.trim();




    let user = users.find(row=>{


        return row[2]==username &&
               row[3]==password;


    });




    if(user){



        document.getElementById("loginPage").style.display="none";


        document.getElementById("system").style.display="block";



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




        updateDashboard();


        showItems();

        showContainers();

        showInventory();


        loadRequestLists();


    }
    else{


        document.getElementById("loginMsg").innerHTML =
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



    document.getElementById("totalStock").innerHTML =
    total.toLocaleString();





    let low = 0;



    for(let i=1;i<inventory.length;i++){



        if(Number(inventory[i][5]) <= 0){


            low++;


        }


    }



    document.getElementById("lowStock").innerHTML =
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






    document.getElementById("pageTitle").innerHTML =
    page.toUpperCase();





    // تحميل بيانات الطلب عند فتح الصفحة

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




    document.getElementById("itemsTable").innerHTML =
    html;


}







function searchItems(){



    let value =
    document.getElementById("search").value.toLowerCase();




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





    document.getElementById("containersTable")
    .innerHTML = html;



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





document.getElementById("inventoryData")
.innerHTML = html;



}

// ============================
// REQUEST SYSTEM
// ============================



function loadRequestLists(){



let containerSelect =
document.getElementById("requestContainer");


let itemSelect =
document.getElementById("requestItem");




if(!containerSelect || !itemSelect){

console.log("Request elements not found");

return;

}







// ============================
// CONTAINERS LIST
// ============================


let containerHTML = "";




if(containers.length > 1){



for(let i=1;i<containers.length;i++){



containerHTML += `


<option value="${containers[i][0]}">


${containers[i][0]} - ${containers[i][1]}


</option>



`;



}



}
else{


containerHTML = `

<option>
لا يوجد كونتينرات
</option>

`;



}



containerSelect.innerHTML =
containerHTML;









// ============================
// ITEMS LIST FROM INVENTORY
// ============================



let itemHTML = "";




if(inventory.length > 1){



for(let i=1;i<inventory.length;i++){



itemHTML += `


<option value="${inventory[i][0]}">


${inventory[i][0]} - ${inventory[i][1]}
(الرصيد: ${inventory[i][5]})


</option>



`;



}



}
else{


itemHTML = `

<option>
لا يوجد أصناف
</option>

`;



}



itemSelect.innerHTML =
itemHTML;



}









// ============================
// ADD REQUEST ITEM
// ============================



function addRequestItem(){



let code =
document.getElementById("requestItem").value;




let item =
inventory.find(row=>row[0]==code);




let qty =
Number(document.getElementById("requestQty").value);





if(!item || qty<=0){


alert("أدخل الصنف والكمية");


return;


}






newRequestItems.push({


ItemCode:item[0],


ItemName:item[1],


Qty:qty,


Unit:item[2]



});






showRequestItems();



}









// ============================
// SHOW REQUEST ITEMS
// ============================



function showRequestItems(){



let html = "";




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


alert("أضف أصناف للطلب");


return;


}







let requestNo =

"PR-" +

new Date().getFullYear()

+

"-"

+

Date.now();







let data = {



action:"saveRequest",


RequestNo:requestNo,


Date:new Date().toLocaleDateString(),



User:"Mohamed",



Container:
document.getElementById("requestContainer").value,



Status:"Open",



QR:requestNo,



items:newRequestItems



};








await fetch(API_URL,{

method:"POST",


body:JSON.stringify(data)


});








document.getElementById("requestMsg").innerHTML =

"✅ تم حفظ الطلب رقم "

+

requestNo;








newRequestItems=[];


showRequestItems();



}









// ============================
// LOGOUT
// ============================


function logout(){


location.reload();


}






