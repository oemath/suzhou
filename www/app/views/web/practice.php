{% extends 'templates/default.php' %}

{% block title %}Grade {{grade}} | {{title}}{% endblock %}

{% block content %}
<div>
<h1><a href="/math?grade={{grade}}" style="color:green">Grade {{grade}}</a> - {{title}}</h1>
<div id="oemathid-reviewbtn-container" style="margin-top:20px">
	<div class="btn-group" role="group" aria-label="...">
		{% for i in 0..count-1 %}
		<button type='button' id='oemathid-reviewbtn-{{i}}' class='btn btn-default oemathclass-reviewbtn-inactive' disabled onclick='onclickReviewBtn({{i}})'>{{i+1}}</button>
		{% endfor %}
	</div>
</div>
</div> 
<div id="oemathid-question-container"></div>
<script>
var grade = {{grade}};
var category = {{cid}};
var index = 0;
var count = {{count}};
var token = "{{token}}";
var csrf_key = "{{csrf_key}}";
var csrf_token = "{{csrf_token}}";

function disabl_backspace()
{
   var rx = /INPUT|SELECT|TEXTAREA/i;

	$(document).bind("keydown keypress", function(e){
		if( e.which == 8 ){ // 8 == backspace
			if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
				e.preventDefault();
			}
		}
	});
}
disabl_backspace();

</script>
<script src="js/utility/Utility.js"></script>
<script src="js/Problem.js"></script>
<script src="js/Practice.js"></script>
{% endblock %}
