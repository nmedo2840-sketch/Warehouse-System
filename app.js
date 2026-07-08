const API_URL =
"https://script.google.com/macros/s/AKfycbxRd2dHhswl0ZX8mPhcleVmjBsO_1dRrKhaGYelWbixczUK4N7yt85xr24NXnXq-uzG/exec";


// البيانات العامة

let users = [];
let items = [];
let containers = [];
let inventory = [];
let requests = [];
let transactions = [];




// ============================
// جلب البيانات من Google Script
// ============================

async function getData(action){

    try{

        let response = await fetch(
            API_URL + "?action=" + action
        );

        let data = await response.json();

        return data;

    }

    catch(error){

        console.log(action,error);

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






// ============================
// Login
// ============================

async function login(){


    await loadData();



    let username =
    document.getElementById("username").value.trim();


    let password =
    document.getElementById("password").value.trim();



    let user = users.find(row=>{


        return row[2] == username &&
               row[3] == password;


    });





    if(user){


        document.getElementById("loginPage").style.display="none";


        document.getElementById("system").style.display="block";



        document.getElementById("currentUser").innerHTML =
        "👤 "+user[1];



        // الكروت

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



    }

    else{


        document.getElementById("loginMsg").innerHTML =
        "❌ بيانات الدخول غير صحيحة";


    }


}







// ============================
// Dashboard
// ============================


function updateDashboard(){



    // إجمالي الرصيد

    let total = 0;


    for(let i=1;i<inventory.length;i++){


        total += Number(inventory[i][1]) || 0;


    }



    document.getElementById("totalStock").innerHTML =
    total;




    // أصناف تحت الحد الأدنى


    let low = 0;



    for(let i=1;i<items.length;i++){


        let code = items[i][0];

        let minQty = Number(items[i][5]) || 0;



        let stock = inventory.find(row=>{


            return row[0] == code;


        });



        if(stock){


            if(Number(stock[1]) <= minQty){


                low++;

            }

        }


    }




    document.getElementById("lowStock").innerHTML =
    low;



    showLastTransactions();


}





// آخر الحركات

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



    document.getElementById("lastTransactions")
    .innerHTML=html;


}








// ============================
// الصفحات
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


        let element =
        document.getElementById(p);



        if(element){

            element.classList.add("hidden");

        }


    });





    document.getElementById(page)
    .classList.remove("hidden");



    document.getElementById("pageTitle")
    .innerHTML = page.toUpperCase();



}








// ============================
// الأصناف
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



    document.getElementById("itemsTable")
    .innerHTML=html;


}







function searchItems(){



    let value =
    document.getElementById("search").value;



    let result =
    items.filter((row,index)=>{



        if(index==0)
            return true;



        return String(row[0])
        .includes(value)

        ||

        String(row[1])
        .includes(value);



    });




    showItems(result);


}








// ============================
// الكونتينرات
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
    .innerHTML=html;


}








// ============================
// المخزون
// ============================


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



    document.getElementById("inventoryData")
    .innerHTML=html;


}







// ============================
// خروج
// ============================


function logout(){

    location.reload();

}
