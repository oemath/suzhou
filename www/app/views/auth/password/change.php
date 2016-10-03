{% extends 'templates/default.php' %}

{% block title %}
Change password
{% endblock %}

{% block content %}
<script>
$(function() {
	$('#oemathid-navbar-account').addClass('active');
});
</script>

<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
<h4>Change password</h4>
<form class="oemathclass-faform form-group" style="width:90%" action="{{ urlFor('password.change.post') }}" method="post" autocomplete="off">
	<div class="input-group margin-bottom-sm">
	    <span class="input-group-addon"><i class="fa fa-key fa-fw"></i></span>
		<input placeholder="Old password" class="form-control" type="password" name="password_old" id="password_old">
	</div>
	{% if errors.first('password_old') %}
	<p class="oemathclass-form-wrong">{{ errors.first('password_old') }}</p>
	{% endif %}

	<div class="input-group margin-bottom-sm">
	    <span class="input-group-addon"><i class="fa fa-key fa-fw"></i></span>
		<input placeholder="New password" class="form-control" type="password" name="password" id="password">
	</div>
	{% if errors.first('password') %}
	<p class="oemathclass-form-wrong">{{ errors.first('password') }}</p>
	{% endif %}

	<div class="input-group margin-bottom-sm">
	    <span class="input-group-addon"><i class="fa fa-key fa-fw"></i></span>
		<input placeholder="Confirm new password" class="form-control" type="password" name="password_confirm" id="password_confirm">
	</div>
	{% if errors.first('password_confirm') %}
	<p class="oemathclass-form-wrong">{{ errors.first('password_confirm') }}</p>
	{% endif %}

	<div>
		<input type="submit" class="btn btn-success" value="Change password">
	</div>
	
	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>
</div>
</div></div>
{% endblock %}