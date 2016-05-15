{% extends 'templates/default.php' %}

{% block title %}User Profile{% endblock %}

{% block content %}
<h2>{{ user.username }}</h2>
<dl>
	{% if user.realname %}
		<dt>Name</dt>
		<dd>{{user.realname}}</dd>
	{% endif %}

	<dt>Email</dt>
	<dd>{{user.email}}</dd>
</dl>
{% endblock %}
