$(function(){
	
	var fakedata1 = { type: "table", title: "SectionTable", 
				columns: [
					{name: "First Name", width:"200px"}, 
					{name: "Last Name", width:"231px"}, 
					{name: "Zip Code", width:"231px"}
				],
				rows: [					
					["Sam", "Smith", "45218"],
					["Tom", "Jones", "21523"],
				]
		};

	//existing data:
	$("#jsSpreadsheet1").jsSpreadsheet({data : fakedata1});
	//new with default data:
	$("#jsSpreadsheet2").jsSpreadsheet();
});