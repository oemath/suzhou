<div id="oemathid-header-left"><p>oemath - Build for Math Contest</p></div>
<div id="oemathid-header-right">
{% if auth %}
	<form action="{{urlFor('logout')}}">
		<button class="btn oemathclass-button oemathclass-header-right-button">Sign out</button>
		<span id="oemathid-header-welcome">Hello <b>{{ auth.username }}</b> </span>
	</form>
{% else %}
	<form action="{{urlFor('register')}}"><button type="submit" class="btn oemathclass-button oemathclass-header-right-button">Sign up</button></form>
	<form action="{{urlFor('login')}}"><button type="submit" class="btn oemathclass-button oemathclass-header-right-button">Sign in</button></form>
{% endif %}
</div>