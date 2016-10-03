{% extends 'templates/default.php' %}

{% block title %}
Forgot password
{% endblock %}

{% block content %}

<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
<h4>Enter your Username or Email address to start your password recovery</h4>
<form class="oemathclass-faform form-group" action="{{ urlFor('password.recover.post') }}" method="post" autocomplete="off">
	<div class="input-group margin-bottom-sm">
    	<span class="input-group-addon"><i class="fa fa-user fa-fw"></i></span>
		<input placeholder="Username/Email address" class="form-control" type="text" name="email" id="email"{% if request.post('email') %} value="{{request.post('email')}}"{% endif %}>
	</div>
	{% if errors.has('email') %}
	<p class="oemathclass-form-wrong">{{ errors.first('email') }}</p>
	{% endif %}

	<div>
		<input type="submit" class="btn btn-success" value="Reset password">
	</div>
	
	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>
</div></div></div>

{% endblock %}