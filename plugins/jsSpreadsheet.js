(function($){
$.widget("ui.jsSpreadsheet", { 
	
	options:{
		data : { type: "table", title: "SectionTable", 
				columns: [
					{name: "Column", width:"231px"}
				],
				rows: [					
					[{data:""}]
				]
		}
	},
	
	_create: function(){
		var jsTableCell = function(rowItem){
			this.data = ko.observable(rowItem.data);
		    this.editing = ko.observable(false);
		         
		    // Behaviors
		    this.edit = function() { this.editing(true) }
		}
		
		var jsTableHeader = function(columnName, columnWidth){
			if(!columnWidth){
				columnWidth = "231px";
			}
			this.name = ko.observable(columnName);
			this.width = ko.observable(columnWidth);
			this.editing = ko.observable(false);
			this.edit = function(){this.editing(true)}
		}
		
		var jsTable = function(data){
			var self = this;			
			self.editMode = ko.observable(false);
			self.columns = ko.observableArray([]);			
			self.rows = ko.observableArray([]);
			
			self.setWidths = function(columns){
				$.each(columns, function(index, value){
					self.columns()[index].width($(value).width());
				});
			};
			
			self.onResized = function(e){  
	    		var columns = $(e.currentTarget).find("th");
				self.setWidths(columns);
  			};
			
			self.setResizer = function(element){
				self.$colResizable = $(element).find('table').colResizable(
					{
						postbackSafe	: true, 
						onResize		: self.onResized
					}
				);				
			}
			
			self.getData = function(){
				return {
					columns: ko.utils.arrayMap(self.columns(), function(item) {
		        		return {name : item.name(), width: item.width()};
		    		}),
		    		rows: ko.utils.arrayMap(self.rows(), function(item) {
						return ko.utils.arrayMap(item(), function(cell){
							return {value: cell.data()};
						});
		    		})
				}
			}
			
			self.showJson = function(){
				console.log(JSON.stringify(self.getData()));
			}
			
			ko.utils.arrayForEach(data.columns, function(tableHeader){
				self.columns.push(new jsTableHeader(tableHeader.name, tableHeader.width));
			});
			
			ko.utils.arrayForEach(data.rows, function(tableRow){		
				var rows = ko.utils.arrayMap(tableRow, function(item) {
		        	return new jsTableCell(item);
		    	});
				
				self.rows.push(ko.observableArray(rows));
			});
			
			//$("td:first").css("font-style", "italic");
			//$("td:first-child").css("font-style", "italic");
			
			// $("tr").each(function(){
			    // $(this).find('td:first-child:eq(0)').css("font-style", "italic");
			// });
			
			self.editModeText = ko.computed(function(){
				if(self.editMode()){
					return "End Edit"
				}
				return "Edit Table"; 
			});
		
			self.toggleEdit = function(){
				if(self.editMode()){
					self.editMode(false);
				}
				else{
					self.editMode(true);
				}
			};
			
			self.addRow = function() {
				var newRow = ko.observableArray([]);
				for (var x =0; x < self.columns().length; x++)
				{
					newRow.push(new jsTableCell(""));
				}
				self.rows.push(newRow);
			};
		
			self.addColumn = function() {		
				var columnName = prompt("Enter column name");
				self.$colResizable.colResizable({disable:true});
				self.columns.push(new jsTableHeader(columnName));
				ko.utils.arrayForEach(self.rows(), function(tableRow) {
			        tableRow.push(new jsTableCell(""));
			    });
			    
			    self.$colResizable.colResizable(
					{
						postbackSafe	: true, 
						onResize		: self.onResized
					}
				);
			};
			
			self.removeColumn = function(column){
				if(confirm("Remove Column?")){			
					var indexToRemove = self.columns.indexOf(column);
					self.columns.remove(column);
					ko.utils.arrayForEach(self.rows(), function(tableRow){
						tableRow.splice(indexToRemove, 1);
					});
				}
			};
				
			self.editCell = function (){
				
			};
		};
		var table = new jsTable(this.options.data);
		
		ko.applyBindingsToNode(this.element[0], {template:{name:'jsSpreadsheet-template'}}, table);
		table.setResizer(this.element);		
	}
}); //end widget
}(jQuery));