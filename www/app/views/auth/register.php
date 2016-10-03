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

<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
<form class="oemathclass-faform form-group" style="width:90%" action="{{ urlFor('register.post') }}" method="post" autocomplete="off">
	<div>
	<h3>Welcome to oemath!</h3>
	<h4>The website build for math contest.</h4>
	</div>
	
	<div class="input-group margin-bottom-sm">
    	<span class="input-group-addon"><i class="fa fa-user fa-fw"></i></span>
		<input placeholder="Username" class="form-control" type="text" name="username" id="username"{% if request.post('username') %} value="{{ request.post('username') }}" {% endif %}>
	</div>
	{% if errors.has('username') %}
	<p class="oemathclass-form-wrong">{{ errors.first('username') }}</p>
	{% endif %}

	<div class="input-group margin-bottom-sm">
    	<span class="input-group-addon"><i class="fa fa-envelope-o fa-fw"></i></span>
		<input class="form-control" placeholder="Email" type="text" name="email" id="email"{% if request.post('email') %} value="{{ request.post('email') }}" {% endif %}>
	</div>
	{% if errors.has('email') %}
	<p class="oemathclass-form-wrong">{{ errors.first('email') }}</p>
	{% endif %}

	<div class="input-group margin-bottom-sm">
    	<span class="input-group-addon"><i class="fa fa-user fa-fw"></i></span>
		<input placeholder="You real name (optional)" class="form-control" type="text" name="realname" id="realname"{% if request.post('realname') %} value="{{ request.post('realname') }}" {% endif %}>
	</div>
	{% if errors.has('realname') %}
	<p class="oemathclass-form-wrong">{{ errors.first('realname') }}</p>
	{% endif %}

	<div class="input-group margin-bottom-sm">
	    <span class="input-group-addon"><i class="fa fa-key fa-fw"></i></span>
		<input placeholder="Password" class="form-control" type="password" name="password" id="password">
	</div>
	{% if errors.has('password') %}
	<p class="oemathclass-form-wrong">{{ errors.first('password') }}</p>
	{% endif %}

	<div class="input-group margin-bottom-sm">
	    <span class="input-group-addon"><i class="fa fa-key fa-fw"></i></span>
		<input placeholder="Confirm password" class="form-control" type="password" name="password_confirm" id="password_confirm">
	</div>
	{% if errors.has('password_confirm') %}
	<p class="oemathclass-form-wrong">{{ errors.first('password_confirm') }}</p>
	{% endif %}

	<div>
	<p>By clicking "Sign up", I acknowledge that I have read and agree to the Terms of Use and Privacy Policy
	</div>
	
	<div>
		<input type="submit" class="btn btn-success" value="Sign up">
	</div>

	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>
</div>
    <div class="col-xs-12 col-sm-6">
    <h3>Sign up on www.oemath.com get more access and track of your practice.</h3>
    </div>
</div></div>

{% endblock %}