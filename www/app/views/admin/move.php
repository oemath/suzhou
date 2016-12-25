<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>move</title>
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <!-- link href="/css/oemath.css" rel="stylesheet" type="text/css" media="screen" /-->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" type="text/css" media="screen" />

    <link href="/css/practice.css" rel="stylesheet" type="text/css" />
    
    <style>
        body{
            margin: 0 auto;
            text-align: left;
        }

        .width50{ width: 50px; }
        .width80{ width: 80px; }
        .width100{ width: 100px; }
        .width120{ width: 120px; }
        .width150{ width: 150px; }
        .width200{ width: 200px; }
        .width240{ width: 240px; }
        .width300{ width: 300px; }
        .width400{ width: 400px; }
        .width500{ width: 500px; }
        .oemathclass-right { float: right; }
        
        .oemathclass-button{
            background-color: lightgreen;
            border-color: green;
        }

        .oemath-fullwidth{
            width: 100%;
        }
        
        .oemath-input-catch{
        }
        
        .oemath-children-centered{
            text-align: center;
        }
        
        .oemath-children-left{
            text-align: left;
        }
        
        .oemath-padding-bottom{
            padding-bottom: 30px;
        }
        
        .oemath_background-color{
            background-color: rgb(233,255,213);
            border-color: rgb(233,255,213);
            color: #000044;
        }
        .oemath-btn-color{
            background-color: rgb(160,255,120);
            border-color: rgb(160,255,120);
            color: #000066;
        }
        
        .margin-left-10px{
            margin-left: 10px;
        }


        .update-left{
            float: left;
            width: 40%;
            margin: 20px 0 0 20px;
            min-height: 800px;
        }
            
        .update-right{
            float: left;
            border: 1px dashed black;
            margin: 20px 0 0 20px;
            width: 50%;
            mid-width: 1200px;
            min-height: 900px;
        }


		.button-left {
			float: left;
			margin-right: 20px;
		}

		.button-right {
			float: right;
			margin-left: 20px;
		}
		
    </style>
    
</head>

<body>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="/local/jquery.min.js"><\/script>')</script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
    
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
	<script>if(typeof($.fn.modal) === 'undefined') {document.write('<script src="/local/bootstrap.min.js"><\/script>')}</script>
    <script>
      $(document).ready(function() {
      var bodyColor = $('body').css('color');
      if(bodyColor != 'rgb(51, 51, 51)') {
      $("head").prepend('<link rel="stylesheet" href="/local/bootstrap.min.css">');}});
    </script>

    <script src="/js/utility/Utility.js"></script>
    <script src="/js/Problem.js"></script>

    <div class="update-left">
	    <div>
	        <label>Class:</label>
			<select id="prob-cls" class="form-control" style="width:300px">
			</select>
	    </div>
		<p id="prob-info"></p>
	    <button id="oemath-update-next" class="btn oemath-btn-color" style="margin-top:20px; width:150px;" onclick="onclickMove()">Move</button><br><br>
	    <button id="oemath-update-next" class="btn oemath-btn-color" style="margin-top:20px; width:250px;" onclick="onclickMoveall()">Move All</button>
    </div>

	<script>
		var grade = 0;
		var cls = [
					[501, 'Clever Calculation'],
					[502, 'Integer and Fraction'],
					[503, 'Probability'],
					[504, 'Geometry'],
					[505, 'Logical Reasoning'],
					[506, 'Word Problem'],
					[509, 'Miscellaneous']
				];
		
		function retrieve_and_show() {
		    $.ajax({
		        type: "get",
		        async: true,
		        url: "/move/move",
		        dataType: "json",
		        data: { grade: grade, category: clsid},
		        success: function (data, textStatus, jqXHR) {
		            if (data.status == "OK") {
//    		            $("#prob-info").text("");
    		        }
    		        else {
			            $("#prob-info").text("/move/getproblem FAILED("+data.error+"):" + jqXHR+","+textStatus);
    		        }
		        },
		        failure: function (jqXHR, textStatus, errorThrown) {
		            $("#prob-info").text("/move/getproblem failure:" + jqXHR+","+textStatus+","+errorThrown);
		        },
		        error: function (jqXHR, textStatus, errorThrown) {
		            $("#prob-info").text("/move/getproblem error:" + jqXHR+","+textStatus+","+errorThrown);
		        },
		    });
		}

		var grade = 0;
		var cls = [
					[501, 'Clever Calculation'],
					[502, 'Integer and Fraction'],
					[503, 'Probability'],
					[504, 'Geometry'],
					[505, 'Logical Reasoning'],
					[506, 'Word Problem'],
					[509, 'Miscellaneous']
				];

		$(function() {
			if (cls.length > 0) {
				grade = Math.floor(cls[0][0] / 100);
			}
			
			var opt = '';
			for (var i=0; i<cls.length; i++) {
				opt += "<option value='"+cls[i][0]+"'>"+(cls[i][0]+' - '+cls[i][1])+"</option>";
				if (grade != Math.floor(cls[i][0] / 100)) {
					alert('!!mix grades!!');
				}
			}
			$('#prob-cls').append(opt);
//			$('#prob-info').text(grade);
		});
	</script>
</body>
</html>