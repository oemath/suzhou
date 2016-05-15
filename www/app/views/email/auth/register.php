{% extends 'email/templates/default.php' %}

{% block content %}
	<p>Thanks for registering to oemath.com!</p>
	<p>Activate your acount using this link: <br>
	{{ baseUrl }}{{ urlFor('activate') }}?email={{ user.email }}&identifier={{ identifier|url_encode }}</p>
{% endblock %}