{% extends 'templates/default.php' %}

{% block title %}Grade {{grade}} | {{title}}{% endblock %}

{% block content %}

<div class="text-center oemath-fullwidth">
	<div class="btn-group" role="group" aria-label="...">
		{% for i in 0..count-1 %}
		<button type='button' id='oemathid-reviewbtn-{{i}}' class='btn btn-default oemathclass-reviewbtn-inactive' disabled onclick='onclickReviewBtn({{i}})'>{{i+1}}</button>
		{% endfor %}
	</div>
</div> 


<h3 id="problem-index">Index: 0</h3>
<input type="button" id="problem-skip" onclick="onclickSkip()" value="Skip">
<div id="oemathid-question-container"></div>
<form>
<table border="1">
<tr><th>Status</th><th><div id="problem-status"></div></th></tr>
<tr><td>Type</td><td><div id="problem-type"></div></td></tr>
<tr><td>Level</td><td><div id="problem-level"></div></td></tr>
<tr><td>Question</td><td><div id="problem-question"></div></td></tr>
<tr><td>Question Parsed</td><td><div id="problem-question-parsed"></div></td></tr>
<tr><td>Parameter</td><td><div id="problem-parameter"></div></td></tr>
<tr><td>Knowledge</td><td><div id="problem-knowledge"></div></td></tr>
<tr><td>Hint</td><td><div id="problem-hint"></div></td></tr>
</table>
</form>
<script>
var grade = {{grade}};
var category = {{category}};
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
