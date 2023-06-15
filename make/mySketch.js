function setup() {
	
}

function make_quiz() {
	var quiz_elem = {
		"title": document.getElementById("i_title"),
		"hint1": document.getElementById("i_hint1"),
		"hint2": document.getElementById("i_hint2"),
		"hint3": document.getElementById("i_hint3"),
		"answer": document.getElementById("i_answer"),
		"explain": document.getElementById("i_explain"),
		"account": document.getElementById("i_account")
	}
	var quiz_data = {
		"title":quiz_elem["title"].value,
		"hint1":quiz_elem["hint1"].value,
		"hint2":quiz_elem["hint2"].value,
		"hint3":quiz_elem["hint3"].value,
		"answer":quiz_elem["answer"].value,
		"explain":quiz_elem["explain"].value,
		"account":quiz_elem["account"].value,
	};
	var date = new Date();
	var elem_keys = Object.keys(quiz_elem);
	var quiz_keys = Object.keys(quiz_data);
	var i2 = 0;
	console.log(quiz_data)
	for(var b in quiz_data) {
		if(quiz_keys[i2] == "explain") continue;
		if(quiz_data[quiz_keys[i2]] == ""||quiz_data[quiz_keys[i2]] == null) return false; 
		i2++;
	}
	console.log(quiz_keys)
	var i = 0
	for(var h in quiz_data) {
		save_database(quiz_keys[i],quiz_data[quiz_keys[i]],quiz_data["account"],quiz_data["title"]);
		quiz_elem[elem_keys[i]].value = "";
		i++;
	}
	save_database("date",date,quiz_data["account"],quiz_data["title"]);
	save_database(quiz_data["account"],quiz_data["title"],"users","numbers");
}

function draw() {
	
}

function save_database(num,s,mw,d) {
	var db = firebase.firestore();
  var userRef = db.collection(mw).doc(d);
  num = String(num)
  userRef.set({[num]: s}, { merge: true });
}