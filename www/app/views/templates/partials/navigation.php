<ul class="nav nav-pills">
	<li><a href="{{ urlFor('home') }}">Home</a></li>
	{% if auth %}
	<li class="dropdown">
		<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Account</a>
		<ul class="dropdown-menu">
    		<li><a href="{{urlFor('user.profile', { username: auth.username }) }}">Profile</a></li>
    		<li><a href="{{ urlFor('password.change') }}">Change password</a></li>
    		<li><a href="{{ urlFor('account.profile') }}">Update profile</a></li>
        </ul>
	</li>
	{% endif %}
</ul>
