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


<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
<form class="oemathclass-faform form-group" style="width:90%" action="{{ urlFor('login.post') }}" method="post" autocomplete="off">
	<h3>Please sign in:</h3>
	<div class="input-group margin-bottom-sm">
	    <span class="input-group-addon"><i class="fa fa-user fa-fw"></i></span>
		<input class="form-control" type="text" name="identifier" id="identifier" placeholder="Username/Email address">
	</div>
	{% if errors.has('identifier') %}
	<p class="oemathclass-form-wrong">{{ errors.first('identifier') }}</p>
	{% endif %}

	<div class="input-group margin-bottom-sm">
	  <span class="input-group-addon"><i class="fa fa-key fa-fw"></i></span>
		<input class="form-control" type="password" name="password" id="password" placeholder="Password">
	</div>
	{% if errors.has('password') %}
	<p class="oemathclass-form-wrong">{{ errors.first('password') }}</p>
	{% endif %}

	<div>
		<input class="form-check-input" type="checkbox" name="remember" id="remember">
		<label class="form-check-label" for="remember">Remember me</label>
	</div>

	<div>
		<input type="submit" class="btn btn-success" value="Log in">
	</div>
	
	
	<a href="{{ urlFor('password.recover') }}">Forgor your password?</a>
	
	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>
</div>
    <div class="col-xs-12 col-sm-6">
    <h3>Join oemath membership to get full access ot thousands of questions!</h3>
    </div>
</div></div>
{% endblock %}