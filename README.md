This is an experimental project to develop and Event calander based on JQuery library. This plugin currently has the following features:
* Navigate forward and backward through months.
* A today button to highlight the todays date.


Usage Example:
```javascript
<script type="text/javascript">
/**
* calling the calander plugin.
*/
$(function(){
	$("#example").calander(
		{
			year:2016,
			month:05,
			startingWOD:0,
			eventData:[
				{'date':'2016-06-19','title':'Event19', 'desc':'This is the event description'},
				{'date':'2016-06-20','title':'Event20', 'desc':'This is the event description'},
				{'date':'2016-06-20','title':'Event20', 'desc':'This is the event description'},
				{'date':'2016-06-20','title':'Event20', 'desc':'This is the event description'},
				{'date':'2016-06-21','title':'Event21', 'desc':'This is the event description'},
				{'date':'2017-01-01','title':'Event22', 'desc':'This is the event description'},
			]
		}
	);
})

/**
* Call back funciton to handle the view,edit or delete
**/
function calHandleEditorDelete(element){
	var data = $(element).data();
	var html = '<form method="POST" onsubmit="return false;" id="cal-event-edit" name="cal-event-edit">';
	console.log(data);
	for(k in data){
		console.log(k)
		console.log(data[k])
		html += '<br>'+generateTextbox(k, data[k])
	}
	
	html += '<input id="edit" name="edit" value="Edit" class="btn small" type="button" />';
	html += '<input id="delete" name="delete" value="Delete" class="btn small" type="button" />';
	html += '<input id="cancel" name="cancel" value="Close" class="btn small" onclick="$(\'.event-cr-inner\').remove();$(\'.event-cr\').hide();" type="button" />';
	html += '</form>';
	html = '<div class="event-cr-inner">' + html + '</div>'
	$('#event-cr').html(html).show();
	
}

/**
* Function returns the html input tag.
*/
function generateTextbox(el, value){
		return '<input placeholder="Enter the \'"'+el+'\'" value="'+value+'" type="text" id="el" name="el"/>';
	}
</script>
```