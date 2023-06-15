function setup() {
	getData();
}

function draw() {

}

async function getData() {
	var db = firebase.firestore();
	var array = null;
	var postRef1 = db.collection("users").doc("numbers");
	await postRef1.get().then(e => {
  	var d = e.data();
    console.log(d)
		array = Object.keys(d).map((k)=>({ key: k, value: d[k] }));
	});
	console.log(array)
	
	var dict_m = [];
	for(var arr of array) {
		var postRef2 = db.collection(arr["key"]).doc(arr["value"]);
		await postRef2.get().then(e => {
			var d = e.data();
			console.log(d);
			dict_m.push(d);
		});
	}
	console.log(dict_m);
	
	var dict_result = dict_m.sort(function(a, b) {
  	return (a.date > b.date) ? -1 : 1;  //オブジェクトの昇順ソート
	});
	
	createTable(dict_result,"all");
}


function createTable(dict,ni) {
	var mybody = document.getElementById("div_" + ni);
	var mytable = document.createElement("table");
	mytable.classList.add("table_" + ni);
	var mytbody = document.createElement("tbody");
	for (var k in dict) {
		var mytr = document.createElement("tr");
		var myth = document.createElement("th");
		myth.classList.add("th_" + ni);
		var mytd1 = document.createElement("td");
		var mytd2 = document.createElement("td");
		var mytd3 = document.createElement("td");
		var mytd4 = document.createElement("td");
		var mytd5 = document.createElement("td");
		var mytd6 = document.createElement("td");
		var mytd7 = document.createElement("td");
		myth.textContent = String(dict[k]["date"].toDate().getMonth()+1)+"/"+String(dict[k]["date"].toDate().getDate())+" "+String(dict[k]["date"].toDate().getHours())+":"+String(dict[k]["date"].toDate().getMinutes());
		mytd1.textContent = String(dict[k]["title"]);
		mytd2.textContent = String(dict[k]["hint1"]);
		mytd3.textContent = String(dict[k]["hint2"]);
		mytd4.textContent = String(dict[k]["hint3"]);
		mytd5.insertAdjacentHTML('beforeend','<a id=a_'+String(k)+' onclick="switch_answer('+k+',this.textContent)">表示</a>');
		mytd6.textContent = String(dict[k]["answer"]);
		mytd6.classList.add("hidden");
		mytd6.id = "td1_"+String(k);
		mytd7.textContent = String(dict[k]["explain"]);
		mytd7.classList.add("hidden");
		mytd7.id = "td2_"+String(k);
		//if(parseInt(dict[k]["value"]) < 1000) {
		mytr.appendChild(myth);
		mytr.appendChild(mytd1);
		mytr.appendChild(mytd2);
		mytr.appendChild(mytd3);
		mytr.appendChild(mytd4);
		mytr.appendChild(mytd5);
		mytr.appendChild(mytd6);
		mytr.appendChild(mytd7);
		mytbody.appendChild(mytr);
		//}
	}
	mytable.appendChild(mytbody);
	mybody.appendChild(mytable);
}


function switch_answer(n,str) {
	var elem = document.getElementById("td1_"+String(n))
	var elem2 = document.getElementById("td2_"+String(n))
	var elem3 = document.getElementById("a_"+String(n))
	if(str == "表示") {
		elem3.textContent = "隠す";
		elem.classList.remove("hidden");
		elem2.classList.remove("hidden");
	}else if(str == "隠す") {
		elem3.textContent = "表示";
		elem.classList.add("hidden");
		elem2.classList.add("hidden");
	}
}