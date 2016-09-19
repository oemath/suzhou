{% extends 'templates/default.php' %}

{% block title %}
Login
{% endblock %}

{% block content %}
<script>
$(function() {
	$('#oemathid-navbar-login').addClass('active');
});
</script>

<form class="form-group" style="width:300px" action="{{ urlFor('login.post') }}" method="post" autocomplete="off">
	<div>
		<label for="identifier">Username/Email</label>
		<input class="form-control" type="text" name="identifier" id="identifier" placeholder="Username/Email">
		{% if errors.has('identifier') %} {{ errors.first('identifier') }} {% endif %}
	</div>

	<div>
		<label for="password">Password</label>
		<input class="form-control" type="password" name="password" id="password" placeholder="Password">
		{% if errors.has('password') %} {{ errors.first('password') }} {% endif %}
	</div>

	<div>
		<input type="checkbox" name="remember" id="remember">
		<label for="remember">Remember me</label>
	</div>
	

	<div>
		<input type="submit" value="Login">
	</div>
	
	
	<a href="{{ urlFor('password.recover') }}">Forgor your password?</a>
	
	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>

{% endblock %}