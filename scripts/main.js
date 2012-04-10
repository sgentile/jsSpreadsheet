$(function(){
	
	var fakedata1 = { type: "table", title: "SectionTable", 
				columns: [
					{name: "First Name", width:"100px"}, 
					{name: "Last Name", width:"231px"}, 
					{name: "Zip Code", width:"231px"}
				],
				rows: [					
					[{data:"Sam"}, {data:"Smith"}, {data:"45218"}],
					[{data:"Tom"}, {data:"Jones"}, {data:"21523"}],
				]
		};

	//existing data:
	$("#jsSpreadsheet1").jsSpreadsheet({data : fakedata1});
	//new with default data:
	$("#jsSpreadsheet2").jsSpreadsheet();
});