{% extends 'templates/default.php' %}

{% block title %}
Reset password
{% endblock %}

{% block content %}

<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
<h4>Please set your new password:</h4>
<form class="oemathclass-faform form-group" action="{{ urlFor('password.reset.post') }}?email={{email}}&identifier={{identifier|url_encode}}" method="post" autocomplete="off">
	<div class="input-group margin-bottom-sm">
	    <span class="input-group-addon"><i class="fa fa-key fa-fw"></i></span>
		<input class="form-control" type="password" name="password" id="password" placeholder="New password">
	</div>
	{% if errors.has('password') %}
	<p class="oemathclass-form-wrong">{{ errors.first('password') }}</p>
	{% endif %}

	<div class="input-group margin-bottom-sm">
	  	<span class="input-group-addon"><i class="fa fa-key fa-fw"></i></span>
		<input class="form-control" type="password" name="password_confirm" id="password_confirm" placeholder="Confirm new password">
	</div>
	{% if errors.has('password_confirm') %}
	<p class="oemathclass-form-wrong">{{ errors.first('password_confirm') }}</p>
	{% endif %}

	<div>
		<input type="submit" class="btn btn-success" value="Set password">
	</div>
	
	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>
</div></div></div>

{% endblock %}