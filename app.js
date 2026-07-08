const API_URL =
"https://script.google.com/macros/s/AKfycbxRd2dHhswl0ZX8mPhcleVmjBsO_1dRrKhaGYelWbixczUK4N7yt85xr24NXnXq-uzG/exec";


let users=[];
let items=[];
let containers=[];



async function loadData(){

users = await fetch(API_URL+"?action=getUsers")
.then(r=>r.json());


items = await fetch(API_URL+"?action=getItems")
.then(r=>r.json());


containers = await fetch(API_URL+"?action=getContainers")
.then(r=>r.json());

}



async function login(){

await loadData();


let u=document.getElementById("username").value;
let p=document.getElementById("password").value;



let found = users.find(x=>

x[2]==u && x[3]==p

);



if(found){


document.getElementById("loginPage").style.display="none";

document.getElementById("dashboard").style.display="block";


document.getElementById("currentUser").innerHTML=found[1];


document.getElementById("itemsCount").innerHTML=
items.length-1;


document.getElementById("containersCount").innerHTML=
containers.length-1;


showItems();


}

else{

document.getElementById("loginMsg").innerHTML=
"بيانات الدخول غير صحيحة";

}



}




function showItems(data=items){


let html="";


for(let i=1;i<data.length;i++){


html+=`

<tr>

<td>${data[i][0]}</td>

<td>${data[i][1]}</td>

<td>${data[i][2]}</td>

<td>${data[i][4]}</td>

<td>${data[i][7]}</td>


</tr>


`;

}


document.getElementById("itemsTable").innerHTML=html;


}



function searchItems(){


let value=document.getElementById("search").value;


let result =
items.filter((x,i)=>{

if(i==0)return true;

return x[0].includes(value)
||
x[1].includes(value);


});


showItems(result);


}




function logout(){

location.reload();

}
