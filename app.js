const API_URL =
"https://script.google.com/macros/s/AKfycbxRd2dHhswl0ZX8mPhcleVmjBsO_1dRrKhaGYelWbixczUK4N7yt85xr24NXnXq-uzG/exec";


let users = [];
let items = [];
let containers = [];
let inventory = [];
let requests = [];
let transactions = [];


// =====================
// قراءة البيانات
// =====================

async function getData(action){

    try{

        let res = await fetch(API_URL + "?action=" + action);

        let data = await res.json();

        return data;

    }

    catch(error){

        console.log("Error "+action,error);

        return [];

    }

}



async function loadData(){

    users = await getData("getUsers");

    items = await getData("getItems");

    containers = await getData("getContainers");

    inventory = await getData("getInventory");

    requests = await getData("getRequests");

    transactions = await getData("getTransactions");

}



// =====================
// Login
// =====================

async function login(){


    await loadData();


    let username =
    document.getElementById("username").value.trim();


    let password =
    document.getElementById("password").value.trim();



    let user = users.find(function(row){

        return row[2] == username &&
               row[3] == password;

    });



    if(user){


        document.getElementById("loginPage").style.display="none";


        document.getElementById("system").style.display="block";



        document.getElementById("currentUser").innerHTML =
        "👤 "+user[1];



        document.getElementById("itemsCount").innerHTML =
        items.length > 0 ? items.length-1 : 0;



        document.getElementById("containersCount").innerHTML =
        containers.length > 0 ? containers.length-1 : 0;



        document.getElementById("requestsCount").innerHTML =
        requests.length > 0 ? requests.length-1 : 0;



        document.getElementById("transactionsCount").innerHTML =
        transactions.length > 0 ? transactions.length-1 : 0;



        showItems();

        showContainers();

        showInventory();


    }

    else{


        document.getElementById("loginMsg").innerHTML =
        "❌ اسم المستخدم أو كلمة المرور غير صحيحة";


    }


}



// =====================
// التنقل بين الصفحات
// =====================


function showPage(page){


    let pages = [
        "dashboard",
        "items",
        "containers",
        "inventory",
        "requests"
    ];



    pages.forEach(function(p){

        let el = document.getElementById(p);

        if(el){

            el.classList.add("hidden");

        }

    });



    let selected =
    document.getElementById(page);



    if(selected){

        selected.classList.remove("hidden");

    }



    document.getElementById("pageTitle").innerHTML =
    page.toUpperCase();


}





// =====================
// الأصناف
// =====================


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


    document.getElementById("itemsTable").innerHTML = html;


}




function searchItems(){


    let value =
    document.getElementById("search").value;


    let result = items.filter(function(row,index){


        if(index==0)
            return true;



        return String(row[0]).includes(value)
        ||
        String(row[1]).includes(value);


    });



    showItems(result);


}




// =====================
// الكونتينرات
// =====================


function showContainers(){


    let html="";


    for(let i=1;i<containers.length;i++){


        html += `

        <tr>

        <td>${containers[i][0] || ""}</td>

        <td>${containers[i][1] || ""}</td>

        <td>${containers[i][2] || ""}</td>

        <td>${containers[i][3] || ""}</td>

        </tr>

        `;


    }


    document.getElementById("containersTable").innerHTML =
    html;


}




// =====================
// المخزون
// =====================


function showInventory(){


    let html = `

    <table>

    <tr>

    <th>كود الصنف</th>

    <th>الرصيد</th>

    </tr>

    `;



    for(let i=1;i<inventory.length;i++){


        html += `

        <tr>

        <td>${inventory[i][0]}</td>

        <td>${inventory[i][1]}</td>

        </tr>

        `;


    }



    html += "</table>";



    document.getElementById("inventoryData").innerHTML =
    html;


}




// =====================
// Logout
// =====================


function logout(){

    location.reload();

}
