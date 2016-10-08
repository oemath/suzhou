{% extends 'templates/default.php' %}

{% block title %}Membership{% endblock %}

{% block content %}
<script>
$(function(){
	$('#oemathid-navbar-membership').addClass('active');
});
</script>
Membership
<form class="oemathclass-faform form-group" style="width:90%" action="{{ urlFor('membership.post') }}" method="post" autocomplete="off">
	<div>
		<input type="submit" class="btn btn-success" value="Extend one month">
	</div>

	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>
{% endblock %}
