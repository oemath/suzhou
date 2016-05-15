{% if user %}
	<p>Hello {{user.getRealnameOrUsername() }},</p>
{% else %}
	<p>Hello there,</p>
{% endif %}

{% block content %}{% endblock %}
