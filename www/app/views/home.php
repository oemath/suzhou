{% extends 'templates/default.php' %}

{% block title %}Home{% endblock %}

{% block content %}
<script>
$(function(){
	var content_grade={
		color: ["#1aa0b8", "#44b018", "#0fc1b8",
				"#8e38ae", "#00a4e0", "#d84828",
				"#08b818", "#f89818", "#8e38ae"],
		title: ["First grade", "Second grade", "Third grade",
				"Fourth grade", "Fifth grade", "Sixth grade",
				"Seventh grade", "Eighth grade", "Ninth grade"],
		active: [ 0, 0, 0, 0, 1, 0, 0, 0, 0],
		subtitle: ["", "", "", "", "", "", "", "", ""],
		value: [1, 2, 3, 4, 5, 6, 7, 8, 9]
	};

	var child = '<div>';
	for (var i=0; i < content_grade.title.length; i++) {
		var opacity = content_grade.active[i]?'':'opacity:0.3;';
		var active = content_grade.active[i]?'':'oemathclass-inactive';
		child += '<div class="oemathclass-grade-area oemathclass-grade-area-3'+(i%3+1)+'">';
    	child += '<div class="oemathclass-grade-content '+active+'" style="border: 1px solid '+content_grade.color[i]+'">';
		child += '<a class="oemathclass-grade-link" style="'+opacity+'background-color: '+content_grade.color[i]+'" href="/math?grade='+content_grade.value[i]+'">'+content_grade.value[i]+'</a>';
		child += '<a class="oemathclass-grade-link-text" style="'+opacity+'color: '+content_grade.color[i]+'" href="/math?grade='+content_grade.value[i]+'">'+content_grade.title[i]+'</a>';
		if (!content_grade.active[i]) {
			child += '<h3 style="color:lightgrey">Coming soon...</h3>';
		}
		child += '</div>';
		child += '</div>';
	}
	child += '</div>';
	$('#oemathid-content-grade-container').append(child);
	
});
</script>
<div id="oemathid-content-banner-container">
</div>

<div id="oemathid-content-grade-container"></div>
{% endblock %}
