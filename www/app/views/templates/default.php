<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>oemath - Build for Math Contest | {% block title %}{% endblock %}</title>
    
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    <!-- Optional theme -->
    <!-- link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous"-->
    <!-- Latest compiled and minified JavaScript -->
    
    {% if practice_css %}
    	<link rel="stylesheet" href="/css/practice.css">
    {% endif %}
    <link rel="stylesheet" href="/css/oemath.css">
</head>
<body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="/local/jquery.min.js"><\/script>')</script>

    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
	<script>if(typeof($.fn.modal) === 'undefined') {document.write('<script src="/local/bootstrap.min.js"><\/script>')}</script>
    <script>
      $(document).ready(function() {
      var bodyColor = $('body').css('color');
      if(bodyColor != 'rgb(51, 51, 51)') {
      $("head").prepend('<link rel="stylesheet" href="/local/bootstrap.min.css">');}});
    </script>
    {% if practice_css %}
    	<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
    {% endif %}
    <script src="https://use.fontawesome.com/787db97226.js"></script>
<div id="oemathid-page-container">
	<div id="oemathid-page-navigation">{% include 'templates/partials/navigation.php' %}</div>
	{% include 'templates/partials/messages.php' %}
	
	{% if current_page == 'home' %}
	<div id="oemathid-content-carousel">{% include 'templates/partials/carousel.php' %}</div>
	{% endif %}
	<div id="oemathid-page-content">{% block content %}{% endblock %}</div>
	<div id="oemathid-page-footer">{% include 'templates/partials/footer.php' %}</div>
</div>
</body>
</html>