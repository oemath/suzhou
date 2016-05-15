{% extends 'templates/default.php' %}

{% block title %}
Reset password
{% endblock %}

{% block content %}

<p>Enter your email address to start your password recovery.</p>
<form action="{{ urlFor('password.reset.post') }}?email={{email}}&identifier={{identifier|url_encode}}" method="post" autocomplete="off">
	<div>
		<label for="password">New password</label>
		<input type="password" name="password" id="password">
		{% if errors.has('password') %} {{ errors.first('password') }} {% endif %}
	</div>

	<div>
		<label for="password_confirm">Confirm new password</label>
		<input type="password" name="password_confirm" id="password_confirm">
		{% if errors.has('password_confirm') %} {{ errors.first('password_confirm') }} {% endif %}
	</div>

	<div>
		<input type="submit" value="Change password">
	</div>
	
	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>

{% endblock %}