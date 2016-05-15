{% extends 'templates/default.php' %}

{% block title %}Grade {{grade}} | {{title}}{% endblock %}

{% block content %}
<form>
<h3 id="problem-index">Index: 0</h3>
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
<input type="button" id="problem-prev" onclick="onPrev()" disabled="true" value="<<<Prev">
<input type="button" id="problem-next" onclick="onNext()" value="Next>>>">
</form>
<script>
var grade = {{grade}};
var category = {{category}};
var index = 0;
var count = {{count}};
var token = "{{ token }}";

</script>
<script src="js/utility/Utility.js"></script>
<script src="js/Problem.js"></script>
<script src="js/Practice.js"></script>
{% endblock %}
