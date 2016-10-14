{% extends 'templates/default.php' %}

{% block title %}Grade {{grade}} | {{title}}{% endblock %}

{% block content %}
<script src="http://threejs.org/build/three.js"></script>
<script src="http://threejs.org/examples/js/controls/OrbitControls.js"></script>
<script src="http://threejs.org/examples/js/controls/TrackballControls.js"></script>

<div>
<p class="oemathclass-title"><a href="/math?grade={{grade}}" style="color:green;text-decoration:none;">Grade {{grade}}</a><span style="color:black"> - {{title}}</span></p>
<div id="oemathid-reviewbtn-container" style="margin-top:20px">
	<div class="btn-group" role="group" aria-label="...">
		{% for i in 0..count-1 %}
		<button type='button' id='oemathid-reviewbtn-{{i}}' class='btn btn-default oemathclass-reviewbtn-inactive' disabled onclick='onclickReviewBtn({{i}})'>{{i+1}}</button>
		{% endfor %}
	</div>
</div>
</div> 
<!-- input type="button" onclick="$('#oemathid-dialog-nextproblem-error').modal('show')" value="Congrat"-->
<div id="oemathid-question-container"></div>
<script>
var grade = {{grade}};
var category = {{cid}};
var index = 0;
var count = {{count}};
var token = "{{token}}"; // session token
var userType = {{userType}};
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
<div class="modal" id="oemathid-dialog-nextproblem-error" role="dialog" style="top:30%;"><div class="modal-dialog"><div class="modal-content">
<div class="modal-body"><div>
<h3>Oops, something wrong happened :(</h3><h4>Want to retry?</h4>
</div></div>
<div class="modal-footer">
<button type="button" class="btn btn-default" onclick="$('#oemathid-dialog-nextproblem-error').modal('hide')">Retry</button>
<button type="button" class="btn btn-default" onclick="$('#oemathid-dialog-nextproblem-error').modal('hide')">Close</button>
</div>
</div></div></div>

<div class="modal" id="oemathid-dialog-congrat" role="dialog" style="top:30%;"><div class="modal-dialog"><div class="modal-content">
<div class="modal-header"><h3>Congratulations!</h3></div>
<div class="modal-body">
<div>
<p>You have finished this practice!  Click the "Review" button to review them.</p>
{% if userType == 0 %}
<p>Or <a href="{{urlFor('register')}}">sign up</a> to access more questions.</p>
{% elseif userType == 1 %}
<p>Or <a href="{{urlFor('membership')}}">join membership</a> to access more questions.</p>
{% elseif userType == 2 %}
<p>Or <a href="{{urlFor('membership')}}">extend your membership</a> to access more questions.</p>
{% endif %}
</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-default" onclick="$('#oemathid-dialog-congrat').modal('hide');startReview()">Review</button>
<button type="button" class="btn btn-default" onclick="$('#oemathid-dialog-congrat').modal('hide')">Close</button>
</div>
</div></div></div>
<script src="js/utility/Utility.js"></script>
<script src="js/Problem.js"></script>
<script src="js/Practice.js"></script>
{% endblock %}
