{% extends 'templates/default.php' %}

{% block title %}Update profile{% endblock %}

{% block content %}
<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-6">
<form class="oemathclass-faform form-group" action="{{urlFor('account.profile.post')}}" method="post" autocomplete="off">
	<h4>Update your profile</h4>
	<table class="table">
		<tr>
			<td>Username:</td>
			<td>{{auth.username}}</td>
		</tr>
		<tr>
			<td>Real name:</td>
			<td><input placeholder="Your realname" class="form-control" type="text" name="realname" id="realname" value="{{auth.realname}}"></td>
		</tr>
	
		<tr>
			<td>Email address:</td>
			<td>{{auth.email}}</td>
		</tr>
	</table>

	<div>
		<input type="submit" class="btn btn-success" value="Update">
	</div>
	
	<input type="hidden" name="{{ csrf_key }}" value="{{ csrf_token }}">
</form>
</div></div></div>
{% endblock %}
