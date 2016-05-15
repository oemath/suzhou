{% extends 'templates/default.php' %}

{% block title %}Update profile{% endblock %}

{% block content %}
<form action="{{urlFor('account.profile.post')}}" method="post" autocomplete="off">
	<div>
		<label for="email">Email</label>
		<input type="text" name="email" id="email" value="{{ request.post('email') ? request.post('email') : auth.email }}">
		{% if errors.has('email') %}{{ errors.first('email') }}{% endif %}
	</div>

	<div>
		<label for="name">Name</label>
		<input type="text" name="name" id="name" value="{{ request.post('name') ? request.post('name') : auth.realname }}">
		{% if errors.has('name') %}{{ errors.first('name') }}{% endif %}
	</div>

	<div>
		<input type="submit" value="Submit">
	</div>
	
	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>
{% endblock %}
