{% extends 'templates/default.php' %}

{% block title %}Grade {{grade}}{% endblock %}

{% block content %}
<script>
$(function(){
	$('#oemathid-math-pick').text('Pick a caterogy to practice - Grade ' + {{grade}});
	var color = ["#1aa0b8", "#44b018", "#0fc1b8",
			"#8e38ae", "#00a4e0", "#d84828",
			"#08b818", "#f89818", "#8e38ae"];
	var content_category={
		title: [
            {% for cat in category %}
            "{{cat.title}}",
            {% endfor %}
		],
		cid: [
            {% for cat in category %}
            "{{cat.cid}}",
            {% endfor %}
		]
	};

	var child = '<div>';
	var color = color[{{grade-1}}];
	for (var i=0; i < content_category.title.length; i++) {
		var url = '/practice?grade={{grade}}&cid=' + content_category.cid[i]/* + '&title='+encodeURIComponent(content_category.title[i])*/;
		child += '<div class="oemathclass-math-area oemathclass-math-area-3'+(i%3+1)+'">';
    	child += '<div class="oemathclass-math-category" style="border: 1px solid '+color+'">';
		child += '<center><a class="oemathclass-math-category-title" style="color: '+color+'" href="'+url+'">'+content_category.title[i]+'</a></center>';
		child += '</div>';
		child += '</div>';
	}
	child += '</div>';
	$('#oemathid-content-math-container').append(child);
	
});
</script>
<h1 id="oemathid-math-pick"></h1>
<div id="oemathid-content-math-container"></div>

{% endblock %}