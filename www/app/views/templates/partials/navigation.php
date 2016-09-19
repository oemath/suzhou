<div>
	<div id="oemathid-navbar" class="navbar navbar-default navbar-fixed-top">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
			<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
			<a href="/"><img src=""></a>
		</div>
		<div class="collapse navbar-collapse">
			<ul id="oemathid-navbar-ul" class="nav navbar-nav sm">
				<li id="oemathid-navbar-home"><a href="{{ urlFor('home') }}" class="oemathclass-navbar">Home</a></li>
				<li id="oemathid-navbar-account"  
				{% if auth %}
				class="dropdown"
				{% else %}
				class="dropdown disabled"
				{% endif %}
				">
					<a href="#" class="has-submenu"
					{% if auth %}
					class="dropdown-toggle oemathclass-navbar" 
					{% else %}
					class="disabled dropdown-toggle oemathclass-navbar" 
					{% endif %}
					data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Account</a>
					<ul class="dropdown-menu">
			    		<li><a href="{{urlFor('user.profile', { username: auth.username }) }}">Profile</a></li>
			    		<li><a href="{{ urlFor('password.change') }}">Change password</a></li>
			    		<li><a href="{{ urlFor('account.profile') }}">Update profile</a></li>
			        </ul>
				</li>
				<li id="oemathid-navbar-about" ><a href="{{ urlFor('home') }}" class="oemathclass-navbar">About</a></li>
			</ul>
			<ul id="oemathid-navbar-ul" class="nav navbar-nav navbar-right sm">
				{% if auth %}
				<p class="navbar-text">Hello {{auth.getRealnameOrUsername()}}</p> 
				<li id="oemathid-navbar-logout" ><a href="{{ urlFor('logout') }}">Sign Out</a></li>
				{% else %}
				<li id="oemathid-navbar-login"><a href="{{ urlFor('login') }}" >Sign In</a></li>
				<li id="oemathid-navbar-register"><a href="{{ urlFor('register') }}" >Sign Up</a></li>
				{% endif %}
			</ul>
		</div>
		</div>
	</div>
</div>
