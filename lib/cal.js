(function($) {

    $.fn.calander = function(options) {
		var settings = $.extend({
			year         : new Date().getFullYear(),
			month        : new Date().getMonth(),
			date        : new Date().getDate(),
			startingWOD: 0,
			eventData		:	null,
			beforeComplete : null,
			complete     : null
		}, options);
		var handle = this;
		
		var today = new Date();
		var calDom = [];
		var weekMap = {
			1:{'shortName':'Mon', 'longName':'Monday'},
			2:{'shortName':'Tue', 'longName':'Tuesday'},
			3:{'shortName':'Wed', 'longName':'Wednesday'},
			4:{'shortName':'Thu', 'longName':'Thursday'},
			5:{'shortName':'Fri', 'longName':'Friday'},
			6:{'shortName':'Sat', 'longName':'Saturday'},
			0:{'shortName':'Sun', 'longName':'Sunday'},
			}
			
		var monthMap = {
			0:{'shortName':'Jan', 'longName':'January'},
			1:{'shortName':'Feb', 'longName':'February'},
			2:{'shortName':'Mar', 'longName':'March'},
			3:{'shortName':'Apr', 'longName':'April'},
			4:{'shortName':'May', 'longName':'May'},
			5:{'shortName':'Jun', 'longName':'June'},
			6:{'shortName':'Jul', 'longName':'July'},
			7:{'shortName':'Aug', 'longName':'August'},
			8:{'shortName':'Sep', 'longName':'September'},
			9:{'shortName':'Oct', 'longName':'October'},
			10:{'shortName':'Nov', 'longName':'November'},
			11:{'shortName':'Dec', 'longName':'December'},
		};
		
		/*
		settings.eventData = [
			{'date':'2016-06-19','title':'Event19', 'desc':'This is the event description'},
			{'date':'2016-06-20','title':'Event20', 'desc':'This is the event description'},
			{'date':'2016-06-20','title':'Event20', 'desc':'This is the event description'},
			{'date':'2016-06-20','title':'Event20', 'desc':'This is the event description'},
			{'date':'2016-06-21','title':'Event21', 'desc':'This is the event description'},
			{'date':'2017-01-01','title':'Event22', 'desc':'This is the event description'},
		]
		*/
		/**
		* Returns an array of days to be shown for the month view.
		* @param int Month starts from 0 to 11
		* @param int indicates day of the week starting from 0 - Mon to 6 - Sun
		*/
		$.fn.getDaysForMonth = function(year, month, startingWOD){
			//Returns the days for a given month
			var date = new Date(year, month), y = date.getFullYear(), 
			firstDay = new Date(y, month, 1), lastDay = new Date(y, month + 1, 0), 
			monthStartingWOD = firstDay.getDay(), lastDayOfPrevMonth = new Date(y, month, 0),
			 prevMonthDatesCount = monthStartingWOD - 1 - startingWOD;
			
			var datesArray = []; var j = prevMonthDatesCount; 
			for(i = prevMonthDatesCount; i >= 0; i--){
				datesArray.push(lastDayOfPrevMonth.getDate() - j);
				j--;
			}
			//console.log(datesArray);
			var temp = datesArray.concat( Array.apply(null, Array(lastDay.getDate() ) ).map(function (_, i) {return i+1;}) )
			return temp.concat(Array.apply(null, Array( 42 - temp.length ) ).map(function (_, i) {return i+1;}));
		};
		
		$.fn.generateHtml = function(data){
			var headerHtml = '<div class="calander-header">'+
			
			'<div class="cal-navigation"><span class="calander-left-nav"><a href="#" id="cal-left-nav" onclick="$.fn.refreshCalander(\'left\')" ><<</a></span>' +
			'<span id="calander-month-name">' + settings.year + '  ' + monthMap[settings.month]['shortName'] + '</span>' +
			'<span class="calander-right-nav"><a href="#" id="cal-right-nav" onclick="$.fn.refreshCalander(\'right\')" >>></a></span></div>' +
			'<div class="cal-toolbar"><a href="#" class="btn" onclick="$.fn.today()">Today</a></div>' +
			'</div>';
			var html = '<table class="mt-cal-table">', cellClass = '';
			html += '<thead><tr>{{head}}</tr></thead>';
			//preparing the week starting day starts
			var temp = [];
			var j=settings.startingWOD; for(i=0; i<7; i++){if(j==7){j=0} temp.push(j); j++;}
			//preparing end
			week = temp.map(function(i){ return weekMap[i]['shortName'];})
			temp = '<th>' + week.join('</th><th>') + '</th>';
			html = html.replace('{{head}}', temp);
			//build the header ends
			//Tbody starts here
			html += '<tbody><tr>{{body}}</tr></tbody>';
			temp = '';
			var monthStart = 0;
			data.map(function(week){
				temp += '<tr>';
				if(monthStart == 0){month = settings.month-1;}
				week.map(function(wod){
					if( ( today.getFullYear() == settings.year) && (today.getMonth() == settings.month )
							&& ( today.getDate() == wod.date ) ){
								cellClass = 'cell today';
							}else{
								cellClass = 'cell';
							}
					
					if( (wod.date == 1) && (monthStart == 0)){ 
						month = settings.month;
						monthStart = 1;
					}
					else if( (wod.date == 1) && (monthStart == 1) ){
						if(settings.month == 11){
							month = 0;
						}else{ 
							month = settings.month + 1;
						}
					}
					
					//if( (month == settings.month+1) ){cellClass = "cell maskcell";}
					
					temp += '<td id="' + month+wod.date + '" class="' + cellClass +'" data-date="' + wod.date + '" data-month="' + month + '">' + wod.date + '<div class="cal-event-details"></div></td>';
				});
				temp += '</tr>';
				//temp += '<tr><th>' + data[week].join('</th><th>') + '</th></tr>';
			});
			html = html.replace('{{body}}', temp);
			//Tbody ends here
			html += '</table>'
			return headerHtml + html;
		}
		
		$.fn.getMonthObject = function(year, month, date, startingWOD){
			//var startingWOD = 0;
			var monthDays = this.getDaysForMonth(year, month, startingWOD);
			var monthObjects = [];
			var weekArray = [];
			monthDays.forEach(function(el, index){
				if(index%7 == 0){
					
					startingDay = startingWOD;
					
					weekArray = [];
					weekArray.push({date:el, day: startingDay});
					
				}else{
					startingDay++;
					weekArray.push({date:el, day: startingDay});
				}
				if(weekArray.length == 7){
						monthObjects.push(weekArray);
				}
				//console.log(weekArray)
				
			});
			return monthObjects;
		};
		
		$.fn.generateCalander =  function(){
			calDom = this.getMonthObject(settings.year, settings.month, settings.date, settings.startingWOD);
			html = this.generateHtml(calDom);
			this.html(html);
			this.populateEventData();
			/*
			$('.cell').mousedown(function(event) {
				switch (event.which) {
					case 1:
						alert('Left Mouse button pressed.');
						break;
					case 2:
						alert('Middle Mouse button pressed.');
						break;
					case 3:
						this.subMenu();
						event.preventDefualt();
						break;
					default:
						alert('You have a strange Mouse!');
				}
			});*/
		};
		
		$.fn.today = function(){
			$(handle).calander(
				{
					year        : today.getFullYear(),
					month       : today.getMonth(),
					date        : today.getDate(),
					startingWOD: settings.startingWOD,
					eventData		:	settings.eventData
				}
			);
		}
		
		$.fn.refreshCalander = function(navDir){
			month = (navDir == "right")?settings.month + 1:settings.month - 1
			year = settings.year;
			if(month == -1){
				year = settings.year - 1;
				month = 11
			}else if(month == 12){
				year = settings.year + 1;
				month = 0;
			}
			
			$(handle).calander(
				{
					year:year,
					month:month,
					startingWOD:settings.startingWOD,
					eventData: settings.eventData
				}
			);
		};
		
		this.populateEventData = function(){
			var eventData = settings.eventData;
			var error = 'Invalid event data: ';
			eventData.map(function(row){
				date = new Date(row.date);
				
				if(date.toString() == "Invalid Date"){
					console.log(error + 'Event date format must be YYYY-mm-dd');
					return;
				}
				
				var temp = '<a href="#" onclick="calHandleEditorDelete(this)" data-date=\''+ row.date +'\' '+
				'data-title=\''+ row.title +'\' '+
				'data-desc=\''+ row.desc +'\' '+
				' class="cal-event-list"><span class="cal-event-title">' + row.title + '</span></a>';
				if( (date.getFullYear() == settings.year) ){ 
					month = date.getMonth();
					
					if( date.getMonth() == settings.month - 1  ){
						month = settings.month - 1;
					}else if( date.getMonth() == settings.month + 1 ){
						month = settings.month + 1;
					}
					
					$('#' + month + date.getDate() +' div.cal-event-details').append(temp);
				}else if( ( (date.getFullYear() - 1) == settings.year ) && (date.getMonth() == 0) ){
					//Event is on next year jan
					console.log($('#' + date.getMonth() + date.getDate() +' div.cal-event-details'))
					$('#' + date.getMonth() + date.getDate() +' div.cal-event-details').append(temp);
				}else if( ( (date.getFullYear() + 1) == settings.year ) && (date.getMonth() == 11) ){
					//Event is on prev year Dec
					$('#' + date.getMonth() + date.getDate() +' div.cal-event-details').append(temp);
				}
			});
		}
		
		this.isLeftMBClicked = function(){
			
		}
		
		
		if($.isFunction( settings.beforeComplete )){
			settings.beforeComplete.call( this );
		}
		
		if($.isFunction( settings.complete )){
			settings.complete.call( this );
		}
		this.generateCalander();
		return ;
    }

}(jQuery));