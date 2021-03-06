(function($){
$.widget("ui.jsSpreadsheet", { 
	
	options:{
		data : { type: "table", title: "SectionTable", 
				columns: [
					{name: "Column", width:"231px"}
				],
				rows: [					
					[{data:"", metadata:{fontWeight:'normal', fontStyle: 'normal', textAlign: 'left'}}]
				]
		}
	},
	
	_create: function(){
		var jsTableCell = function(rowItem){
			this.data = ko.observable(rowItem.data);
			
			//http://www.comptechdoc.org/independent/web/cgi/javamanual/javastyle.html
			
			this.fontWeight = ko.observable("normal");
			this.fontStyle = ko.observable("normal");
			this.textAlign = ko.observable("left");
			
			if(rowItem.metadata){
				if(rowItem.metadata.fontWeight){
					this.fontWeight(rowItem.metadata.fontWeight);
				}
				if(rowItem.metadata.fontStyle){
					this.fontStyle(rowItem.metadata.fontStyle);
				}
				if(rowItem.metadata.textAlign){
					this.textAlign(rowItem.metadata.textAlign);
				}
			}
			
			
		    this.editing = ko.observable(false);
		    // Behaviors
		    this.edit = function() { 
		    	this.editing(true) 
		    }
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
			self.isTextSelected = ko.observable(false);
			self.columns = ko.observableArray([]);			
			self.rows = ko.observableArray([]);
			self.selectedTableCell = ko.observable(null);
			
			self.setSelectedTableCell = function(){
				self.selectedTableCell(this);
			}				
			
			self.initialize = function(element){
				self.element = element;
				self.$colResizable = $(element).find('table').colResizable(
					{
						postbackSafe	: true, 
						onResize		: self.onResized,
						disable			: self.editMode() ? false : true
					}
				);
				
				self.editMode.subscribe(function(newValue){
				if(newValue){
					self.$colResizable.colResizable(
					{
						postbackSafe	: true, 
						onResize		: self.onResized
					});
					}else{
						self.$colResizable.colResizable({disable:true});
					}
				});
				
				ko.utils.arrayForEach(data.columns, function(tableHeader){
					self.columns.push(new jsTableHeader(tableHeader.name, tableHeader.width));
				});
			
				ko.utils.arrayForEach(data.rows, function(tableRow){		
					var rows = ko.utils.arrayMap(tableRow, function(item) {
						return new jsTableCell(item);
			    	});
					
					self.rows.push(ko.observableArray(rows));
				});
			}; // end initialize
			
			self.setWidths = function(columns){
				$.each(columns, function(index, value){
					self.columns()[index].width($(value).width());
				});
			};
			
			self.onResized = function(e){  
	    		var columns = $(e.currentTarget).find("th");
				self.setWidths(columns);
  			};
			
			self.getData = function(){
				return {
					columns: ko.utils.arrayMap(self.columns(), function(item) {
		        		return {name : item.name(), width: item.width()};
		    		}),
		    		rows: ko.utils.arrayMap(self.rows(), function(item) {
						return ko.utils.arrayMap(item(), function(cell){
							return  {
								value		: cell.data(),
								metadata	: {
									fontWeight	: cell.fontWeight(),
									fontStyle	: cell.fontStyle(),
									textAlign	: cell.textAlign()
								}
							};
						});
		    		})
				}
			}

			self.editModeText = ko.computed(function(){
				if(self.editMode()){
					return "End Edit"
				}
				return "Edit Table"; 
			});
		
			self.toggleEdit = function(){
				if(self.editMode()){
					self.editMode(false);
					self.selectedTableCell(null);
				}
				else{
					self.editMode(true);
				}
			};
			
			self.addRow = function() {
				var newRow = ko.observableArray([]);
				for (var x =0; x < self.columns().length; x++)
				{
					newRow.push(new jsTableCell({data:""}));
				}
				self.rows.push(newRow);
			};
		
			self.addColumn = function() {		
				var columnName = prompt("Enter column name");
				self.$colResizable.colResizable({disable:true});
				self.columns.push(new jsTableHeader(columnName));
				ko.utils.arrayForEach(self.rows(), function(tableRow) {
			        tableRow.push(new jsTableCell({data:""}));
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
				
			self.makeBold = function(){
					var jsTableCell = self.selectedTableCell();
					if(jsTableCell){
						if(jsTableCell.fontWeight() === 'normal')
							jsTableCell.fontWeight('bold');
						else
							jsTableCell.fontWeight('normal');					
					}
			};
			
			self.makeItalic = function(){
					var jsTableCell = self.selectedTableCell();
					if(jsTableCell){
						if(jsTableCell.fontStyle() === 'normal')
							jsTableCell.fontStyle('italic');
						else
							jsTableCell.fontStyle('normal');					
					}
			};
			
			self.makeAlignLeft = function(){
				var jsTableCell = self.selectedTableCell();
				if(jsTableCell){
					jsTableCell.textAlign('left');
				}
			};
			
			self.makeAlignCenter = function(){
				var jsTableCell = self.selectedTableCell();
				if(jsTableCell){
					jsTableCell.textAlign('center');
				}
			};
			
			self.makeAlignRight = function(){
				var jsTableCell = self.selectedTableCell();
				if(jsTableCell){
					jsTableCell.textAlign('right');
				}
			};
		};
		
		var table = new jsTable(this.options.data);
		ko.applyBindingsToNode(this.element[0], {template:{name:'jsSpreadsheet-template'}}, table);
		table.initialize(this.element);
	}
}); //end widget
}(jQuery));