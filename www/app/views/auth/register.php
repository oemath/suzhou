{% extends 'templates/default.php' %}

{% block title %}
Register
{% endblock %}


{% block content %}
<script>
$(function() {
	$('#oemathid-navbar-register').addClass('active');
});
</script>

<form class="form-group" style="width:300px" action="{{ urlFor('register.post') }}" method="post" autocomplete="off">
	<div>
		<label for="email">Email</label>
		<input  placeholder="Email" class="form-control" type="text" name="email" id="email"{% if request.post('email') %} value="{{ request.post('email') }}" {% endif %}>
		{% if errors.has('email') %} {{ errors.first('email') }} {% endif %}
	</div>

	<div>
		<label for="username">Username</label>
		<input placeholder="Username" class="form-control" type="text" name="username" id="username"{% if request.post('username') %} value="{{ request.post('username') }}" {% endif %}>
		{% if errors.has('username') %} {{ errors.first('username') }} {% endif %}
	</div>

	<div>
		<label for="password">Password</label>
		<input placeholder="Password" class="form-control" type="password" name="password" id="password">
		{% if errors.has('password') %} {{ errors.first('password') }} {% endif %}
	</div>

	<div>
		<label for="password_confirm">Confirm Password</label>
		<input placeholder="Confirm password" class="form-control" type="password" name="password_confirm" id="password_confirm">
		{% if errors.has('password_confirm') %} {{ errors.first('password_confirm') }} {% endif %}
	</div>

	<div>
		<input type="submit" value="Register">
	</div>

	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>

{% endblock %}