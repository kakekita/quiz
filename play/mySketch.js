var user_name = "";

function setup() {
	var ls = localStorage.getItem("user_name");
	if(ls == null) {
		ls = ""
	}
	var user_input = null
	while(user_input == null) {
			user_input = prompt("アカウントの数字の部分を入力（XXXXXXXXX@sch.ed.kakegawa-net.jp）",ls);
	}
	user_name = user_input
	localStorage.setItem('user_name', user_name);
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
		for(var a in arr["value"]) {
			var postRef2 = db.collection(arr["key"]).doc(arr["value"][a]);
			await postRef2.get().then(e => {
				var d = e.data();
				console.log(d);
				dict_m.push(d);
			});
		}
	}
	console.log(dict_m);
	
	var dict_result = dict_m.sort(function(a, b) {
  	return (a.date > b.date) ? -1 : 1;  //オブジェクトの昇順ソート
	});
	
	createTable(dict_result,"all");
}


async function createTable(dict,ni) {
	var mybody = document.getElementById("div_" + ni);
	var mytable = document.createElement("table");
	mytable.classList.add("table_" + ni);
	var mytbody = document.createElement("tbody");
	var db = firebase.firestore();
	var postRef1 = db.collection("favorite").doc(String(user_name));
	var fd = null
	await postRef1.get().then(e => {
		fd = e.data();
	});
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
		var mytd8 = document.createElement("td");
		var mytd9 = document.createElement("td");
		myth.insertAdjacentHTML('beforeend','<a style="color: white" id=f_'+String(k)+' onclick="switch_favorite('+k+')">★</a>');
		mytd1.textContent = String(dict[k]["date"].toDate().getMonth()+1)+"/"+String(dict[k]["date"].toDate().getDate())+" "+String(dict[k]["date"].toDate().getHours())+":"+String("0"+String(dict[k]["date"].toDate().getMinutes())).slice(-2);
		mytd2.textContent = String(dict[k]["title"]);
		mytd2.id = "td4_"+String(k);
		mytd3.textContent = String(dict[k]["hint1"]);
		mytd4.textContent = String(dict[k]["hint2"]);
		mytd5.textContent = String(dict[k]["hint3"]);
		mytd6.insertAdjacentHTML('beforeend','<a class="link_a" id=a_'+String(k)+' onclick="switch_answer('+k+',this.textContent)">表示</a>');
		mytd7.textContent = String(dict[k]["answer"]);
		mytd7.classList.add("hidden");
		mytd7.id = "td1_"+String(k);
		mytd8.textContent = String(dict[k]["explain"]);
		mytd8.classList.add("hidden");
		mytd8.id = "td2_"+String(k);
		mytd9.textContent = String(dict[k]["account"]);
		mytd9.id = "td3_"+String(k);
		mytd9.style.display = "none"
		//if(parseInt(dict[k]["value"]) < 1000) {
		mytr.appendChild(myth);
		mytr.appendChild(mytd1);
		mytr.appendChild(mytd2);
		mytr.appendChild(mytd3);
		mytr.appendChild(mytd4);
		mytr.appendChild(mytd5);
		mytr.appendChild(mytd6);
		mytr.appendChild(mytd7);
		mytr.appendChild(mytd8);
		mytr.appendChild(mytd9);
		mytbody.appendChild(mytr);
	}
	mytable.appendChild(mytbody);
	mybody.appendChild(mytable);
	
	for (var k2 in dict) {
		var elem1 = document.getElementById("f_"+String(k2))
		var elem2 = document.getElementById("td4_"+String(k2))
		var elem3 = document.getElementById("td3_"+String(k2))
		console.log("fd,",fd)
		console.log(elem3.textContent);
		for(var d of Object.keys(fd)) {
			if(elem3.textContent != d) continue;
			console.log(fd[d], elem2.textContent)
			if(fd[d].indexOf(elem2.textContent) != -1) {
				elem1.style.color = "gold";
			}
		}
	}
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

async function switch_favorite(n) {
	var db = firebase.firestore();
	var elem = document.getElementById("f_"+String(n))
	var elem2 = document.getElementById("td3_"+String(n))
	var elem3 = document.getElementById("td4_"+String(n))
	if(elem.style.color == "white") {
		elem.style.color = "gold";
		var postRef1 = db.collection("favorite").doc(String(user_name));
		var fd = [];
		await postRef1.get().then(e => {
			var d = e.data();
			if(d != null) fd = d;
		});
		console.log(fd)
		fd[elem2.textContent].push(elem3.textContent);
		save_database(elem2.textContent,fd[elem2.textContent],"favorite",String(user_name));
	}else if(elem.style.color == "gold") {
		elem.style.color = "white";
		var userRef = db.collection("favorite").doc(String(user_name));
		var fd2 = [];
		await userRef.get().then(e => {
			fd2 = e.data();
			console.log(fd2[elem2.textContent])
			fd2[elem2.textContent].splice(fd2[elem2.textContent].indexOf(elem3.textContent),1);
			console.log(fd2[elem2.textContent])
		});
		save_database(elem2.textContent,fd2[elem2.textContent],"favorite",String(user_name));
	}
}

function save_database(num,s,mw,d) {
	var db = firebase.firestore();
  var userRef = db.collection(mw).doc(d);
  num = String(num)
  userRef.set({[num]: s}, { merge: true });
}