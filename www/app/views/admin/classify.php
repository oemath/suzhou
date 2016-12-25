<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>classify</title>
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
    {% if practice_css %}
    	<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
    {% endif %}

<script type="text/javascript"
  src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
	<script>if(typeof(MathJax) === 'undefined') {document.write('<script src="/local/MathJax.js?config=TeX-AMS-MML_HTMLorMML"><\/script>')}</script>

    <script src="http://threejs.org/build/three.js"></script>
    <script src="http://threejs.org/examples/js/controls/OrbitControls.js"></script>
    <script src="http://threejs.org/examples/js/controls/TrackballControls.js"></script>



    <script>
        var Phase;
        (function (Phase) {
            Phase[Phase["Practice"] = 0] = "Practice";
            Phase[Phase["Review"] = 1] = "Review";
        })(Phase || (Phase = {}));
    </script>
    <script src="/js/utility/Utility.js"></script>
    <script src="/js/Problem.js"></script>

    <div class="update-left">
	    <div class="button-left">
	        <label>Pid:</label>
	        <select class="form-control width80" id="prob-pid"></select>
	    </div>
	    <div class="button-left" style="display:none">
	        <label>Type:</label>
			<select id="prob-type" class="form-control width150 oemath-input-catch" disabled>
		        <option value="0">0&nbsp;-&nbsp;Normal</option>
		        <option value="1">1&nbsp;-&nbsp;Inline</option>
		        <option value="2">2&nbsp;-&nbsp;Function</option>
		        <option value="3">3&nbsp;-&nbsp;InlineFunction</option>
		        <option value="4">4&nbsp;-&nbsp;Radio</option>
		        <option value="5">5&nbsp;-&nbsp;TrueFalse</option>
		        <option value="6">6&nbsp;-&nbsp;Checkbox</option>
		        <option value="7">7&nbsp;-&nbsp;Customized</option>
			</select>
	    </div>
	    <div class="button-left">
	        <label>Level:</label>
	        <input type="number" class="form-control width80" id="prob-level" disabled></input>
	    </div>
	    <div class="button-left" style="display:none">
	        <label>Flag:</label>
	        <input type="number" class="form-control oemath-input-catch width80" id="prob-flag" value="0" disabled></input>
	    </div>
	    
	    <div class="button-right" style="display:none">
	        <label>User Level:</label>
			<select id="prob-user" class="form-control width120" disabled>
		        <option value="0">Guest</option>
		        <option value="1">Registered</option>
		        <option value="2">Paid</option>
			</select>
	    </div>
	    <div class="button-right">
	        <label>Grade:</label>
	        <input type="number" class="form-control width80" id="prob-grade" disabled></input>
	    </div>
	    <div class="button-right" style="display:none">
	        <label>Category:</label>
			<select id="prob-cid" class="form-control width240" disabled>
			</select>
	    </div>
	    <div style="clear:both"></div>
	    
 	    <div style="margin-top:10px;display:none">
	        <label>Description:</label>
	        <textarea class="form-control oemath-input-catch oemath-font-monospace" id="prob-problem" style="min-height:220px"></textarea>
	    </div>
	    
	    <div style="margin-top:10px;display:none">
	        <label>Parameters:</label>
	        <textarea class="form-control oemath-input-catch oemath-font-monospace" id="prob-param" style="min-height:256px"></textarea>
	    </div>
	    
	    <div style="margin-top:10px;display:none">
	        <label>Hint:</label>
	        <textarea class="form-control oemath-input-catch" id="prob-hint" style="min-height:78px"></textarea>
	    </div>

		<p id="prob-info">&nbsp;</p>
		

		<form id='oemathid-move-radio-form' onchange="onMoveChange(this)">		
		</form>
		
	    <button id="oemath-update-prev" class="btn oemath-btn-color" style="margin-top:20px; width:50px;" onclick="onclickPrev()">&lt;&lt;</button>
	    <button id="oemath-update-next" class="btn oemath-btn-color" style="margin-top:20px; width:50px;" onclick="onclickNext()">&gt;&gt;</button>
    </div>

    <div class="update-right">
	    <div id="preview-container" class="container oemath-fullwidth oemath-children-left">
	    </div>
    </div>

    <div style="clear:both"></div>


	<script>
		var curr_checked = null;
		
		function onMoveChange(elem) {
			onclickSave();
			onclickNext();
		}

		var DEFAULT_PID = 1;
		var DEFAULT_GRADE = 5;
		var USER_GUEST = 0;
		var USER_REGISTERED = 1;
		var USER_PAID = 2;
		
		var pid_list = [];
		
		var curr_grade;
		var curr_cid;
		var curr_pid;
		var curr_pid_index;

		function saveStatus(pid) {
			$.cookie('oemathcookie-classify-pid', pid);
		}
		
		function retrieve_and_show() {
			var prob = gather_prob_data();
			
		    $.ajax({
		        type: "get",
		        async: true,
		        url: "/move/getproblem",
		        dataType: "json",
		        data: { grade: 0, category: 0, pid: prob.pid, action: 'curr' },
		        success: function (data, textStatus, jqXHR) {
		            if (data.status == "OK") {
			            data.result.pid = prob.pid;
    		            handleGet(data.result);
    		            saveStatus(prob.pid); // save status in cookie
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
	
		function onclickPrev() {
			if (curr_pid_index == 0 ) return;
			$('#prob-pid').val((pid_list[curr_pid_index-1]));
			on_pid_change(pid_list[curr_pid_index-1]);
		}

		function onclickNext() {
			if (curr_pid_index == pid_list.length-1) return;
			$('#prob-pid').val((pid_list[curr_pid_index+1]));
			on_pid_change(pid_list[curr_pid_index+1]);
		}

		function onclickSave() {
			var prob = gather_prob_data();

			if (curr_checked != null) {
				label = $('#oemathid-move-radio-form label[for="oemath-choice-'+curr_checked+'"]').text();
	            label = label.replace(/\((\d+)\)$/, function(m, $1) { return '('+(+$1-1)+')'; });
	            $('#oemathid-move-radio-form label[for="oemath-choice-'+curr_checked+'"]').text(label);
			}

			label = $('#oemathid-move-radio-form label[for="oemath-choice-'+prob.cls+'"]').text();
            label = label.replace(/\((\d+)\)$/, function(m, $1) { return '('+(+$1+1)+')'; });
            $('#oemathid-move-radio-form label[for="oemath-choice-'+prob.cls+'"]').text(label);
			
			var success = false;
		    $.ajax({
		        type: "post",
		        url: "/insert/cls",
		        dataType: "json",
		        async: false,
		        data: { 
			        pid: curr_pid, 
			        cls: prob.cls,
			        {{ csrf_key }}: '{{ csrf_token }}'
			    },
		        success: function (data, textStatus, jqXHR) {
		            if (data.status == "OK") {
						$("#prob-info").text("Saved grade="+curr_grade+"; cid="+curr_cid+"; pid="+curr_pid);
						success = true;
		            }
		            else {
			            $("#prob-info").text("/insert/save FAILED("+data.error+"):" + jqXHR+","+textStatus);
		            }
		        },
		        failure: function (jqXHR, textStatus, errorThrown) {
		            $("#prob-info").text("/insert/save failure:" + jqXHR+","+textStatus+","+errorThrown);
		        },
		        error: function (jqXHR, textStatus, errorThrown) {
		            $("#prob-info").text("/insert/save error:" + jqXHR+","+textStatus+","+errorThrown);
		        },
		    });
		    if (!success) alert('Save failed!');
			return success;
		}


		function showProblem(problem, id, phase)
		{
	        let html = problem.htmlBase;
            html += problem.htmlSubmit;
            html += problem.htmlAnswer;
            html += problem.htmlStartReview;
            html += problem.htmlSkip;
            html += problem.htmlClosing;
            $(id).empty().append(html);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, ".oemathclass-mathjax"], function () { $('.oemathclass-mathjax').css("visibility", "visible"); });

            $('.oemathclass-input').each(function (index) {
                if ("FORM" == $(this).prop('tagName').toUpperCase()) {
                    $('#'+$(this).attr('id')+' input.oemathclass-question-choice').each(function (index) {
                        $(this).prop('checked', $(this).attr('expected') == '1' ? true : false);
                    });
                }
                else if ("INPUT" == $(this).prop('tagName').toUpperCase()) {
                    $(this).val($(this).attr('expected'));
                }
            });

            //            this.fillEntered(this.entered);
		}
		
		function refresh_input_to_preview() {
			var raw_prob = gather_prob_data();
			var problem = new Problem(raw_prob, 1); // 1: prob_index
			problem.process();
			showProblem(problem, '#preview-container', Phase.Review);
			$('#oemathid-practice-submit').css('display','none');
			$('#oemathid-practice-start-review').css('display','none');
			$('#oemathid-practice-skip').css('display','none');
			$('#oemathid-btn-refresh').css('display','none');
			$('.oemathclass-title span').css('display', 'none');
		}
		
		function onclickRefresh() {
			refresh_input_to_preview();
		}
				
		function handleGet(data) {
			$(".oemath-input-catch").on("input", function () {});

			$('#prob-pid').val(data.pid);
//			$('#prob-cid').val(data.cid);
			$('#prob-type').val(data.type);
			$('#prob-level').val(data.level);
			$('#prob-flag').val(data.flag);
			$('#prob-problem').val(data.question);
			$('#prob-param').val(data.parameter);
			$('#prob-hint').val(data.hint);


			$('#oemathid-move-radio-form input').prop('checked', false);
			curr_checked = data.cls;
			if (data.cls != null) {
				$('#oemathid-move-radio-form input[choiceindex='+data.cls+']').prop('checked', true);
			}

			refresh_input_to_preview();
			
/*			$('#oemathid-param-list').empty();
			$('#oemathid-param-list').append('<button type="button" onclick="onclickRawParam()" class="btn oemath-btn-color">Raw</button>');
			var paramList = param.split('$$');
			for (var i=0; i<paramList.length; i++) {
				var eq = paramList[i].indexOf('=');
				if (eq != -1) {
					var key = paramList[i].substr(0, eq).trim();
					paramRawMap[key] = paramList[i].substr(eq+1).trim();
					$('#oemathid-param-list').append('<button type="button" class="btn btn-default" onclick="onclickParam(id)" id="oemath-param-'+i+'">'+key+'</button>'); 
				}
			}*/
		}

		function gather_prob_data() {
			var prob = {};

			prob.type = $('#prob-type').val();  if (!prob.type) { prob.type = 0; $('#prob-type').val(prob.type); }
		    prob.level = $('#prob-level').val(); if (!prob.level) { prob.level = 1; $('#prob-level').val(prob.level); }
		    prob.flag = $('#prob-flag').val(); if (!prob.flag) { prob.flag = 0; $('#prob-flag').val(prob.flag); }
		    prob.question = $('#prob-problem').val();
			prob.parameter = $('#prob-param').val();
			prob.knowledge = "";
		    prob.hint = $('#prob-hint').val();
		    prob.grade = $('#prob-grade').val(); if (!prob.grade) { prob.grade = 3; $('#prob-grade').val(prob.grade); }
		    prob.pid = $('#prob-pid').val(); if (!prob.pid) { prob.pid = 0; $('#prob-pid').val(prob.pid); }
		    prob.user = $('#prob-user').val(); if (!prob.user) { prob.level = USER_REGISTERED; $('#prob-user').val(prob.user); }
		    prob.cls = $('#oemathid-move-radio-form input:checked').attr('choiceindex');

		    return prob;
		}


		function check_prev_next_status()
		{
			if (pid_list.length > 0) {
				$('#oemath-update-prev').prop('disabled', curr_pid_index == 0);
				$('#oemath-update-next').prop('disabled', curr_pid_index == pid_list.length-1);
			}
			else {
				$('#oemath-update-prev').prop('disabled', true);
				$('#oemath-update-next').prop('disabled', true);
			}
		}


		function process_pids(pids)
		{
			pid_list = [];
			opts = '';
			if (pids != null) {
				for (var i=0; i<pids.length; i++) {
					var pid = pids[i];
					opts += '<option value="'+pid+'">'+ pid+'</option>';
					pid_list.push(pid);
				}
			}

			$('#prob-pid').empty();
			$('#prob-pid').append(opts);
			if (pid_list.length > 0) {
				curr_pid = $.cookie('oemathcookie-classify-pid');

				if (curr_pid != null && curr_pid != undefined) {
					for (curr_pid_index=0; curr_pid_index < pid_list.length; curr_pid_index++) {
						if (pid_list[curr_pid_index] == curr_pid) break;
					}
				}

				if (curr_pid_index == undefined || curr_pid_index >= pid_list.length) {
					curr_pid_index = pid_list.length - 1;
					curr_pid = pid_list[curr_pid_index];
				}

				$('#prob-pid').val(curr_pid );
				retrieve_and_show();
			}

			check_prev_next_status();
		}

		
		function get_pids(grade, cid)
		{
			$.ajax({
				type: "get",
				url: "/insert/pids",
				dataType: "json",
				async: false,
				data: { grade: grade, category: cid },
				success: function (data, textStatus, jqXHR) {
					if (data.status == "OK") {
						curr_cid = cid;
						process_pids(data.result);
					}
					else {
			            $("#prob-info").text("/insert/pids FAILED("+data.error+"):" + jqXHR+","+textStatus);
					}
				},
				failure: function (jqXHR, textStatus, errorThrown) {
		            $("#prob-info").text("/insert/pids failure:" + jqXHR+","+textStatus+","+errorThrown);
				},
				error: function (jqXHR, textStatus, errorThrown) {
		            $("#prob-info").text("/insert/pids error:" + jqXHR+","+textStatus+","+errorThrown);
				},
			});
		}

		
		function on_pid_change(new_pid)
		{
			if (parseInt(new_pid) < parseInt(curr_pid)) {
				for (--curr_pid_index; curr_pid_index >= 0; curr_pid_index--) {
					if (pid_list[curr_pid_index] == new_pid) break;
				}
			}
			else {
				for (; curr_pid_index < pid_list.length; curr_pid_index++) {
					if (pid_list[curr_pid_index] == new_pid) break;
				}
			}
			curr_pid = new_pid;

			check_prev_next_status();

			retrieve_and_show();
		}

		$(function() {

			setupCls();
			
			curr_grade = 0;
	        
			$('#oemath-update-prev').prop('disabled', true);
			$('#oemath-update-next').prop('disabled', true);
			
	        $("#prob-pid").on("input", function () {
	            on_pid_change($(this).val());
	        });

			get_pids(0, 0);
	        
	        
		    $(window).keydown(function(event) {
		    	if(event.ctrlKey) {
			    	if (event.key=='s') {
			    		onclickSave();
			    	}
			    	else if (event.key=='.') { //>
			    		onclickNext();
			    	}
			    	else if (event.key==',') { //<
			    		onclickPrev();
			    	}
			    	else if (event.key=='q') { //q: refresh
			    		onclickRefresh();
			    	}
			    	else {
				    	return true;
			    	}

			    	event.preventDefault();
			        return false;
		    	}
		    	return true;
		    });
		});

		function setupCls()
		{
			var cls = [
						'Misc', 
						'Clever Calculation',
						'Integer and Fraction',
						'Probability',
						'Geometry',
						'Logical Reasoning',
						'Word Problem',
					];

			for (var i=0; i<cls.length; i++) {
				cls[i] = cls[i]+' (0)';
			}
			
		    $.ajax({
		        type: "get",
		        async: false,
		        url: "/insert/cls-stat",
		        dataType: "json",
		        data: { },
		        success: function (data, textStatus, jqXHR) {
		            if (data.status == "OK") {
			            rlt = data.result;
			            for (var i=0; i<rlt.length; i++) {
				            if (0<rlt[i].cls && rlt[i].cls<=cls.length) {
					            var idx = rlt[i].cls - 1;
					            cls[idx] = cls[idx].replace(/\((\d+)\)$/, '('+rlt[i].count+')');
				            } 
			            }
    		        }
    		        else {
			            $("#prob-info").text("/insert/cls-stat FAILED("+data.error+"):" + jqXHR+","+textStatus);
    		        }
		        },
		        failure: function (jqXHR, textStatus, errorThrown) {
		            $("#prob-info").text("/insert/cls-stat failure:" + jqXHR+","+textStatus+","+errorThrown);
		        },
		        error: function (jqXHR, textStatus, errorThrown) {
		            $("#prob-info").text("/insert/cls-stat error:" + jqXHR+","+textStatus+","+errorThrown);
		        },
		    });
			

			var htmlCls = "";
			for (var i=1; i<=cls.length; i++) {
				htmlCls += "<div><input type='radio' choiceindex='"+i+"' name='oemath-move-radio' id='oemath-choice-"+i+"' class='oemathclass-question-choice'>";
                htmlCls += "<label for='oemath-choice-"+i+"' class='oemathclass-question-choice-label'>"+cls[i-1]+"</label></div>";
			}
			$('#oemathid-move-radio-form').append(htmlCls);
		}

	</script>


</body>
</html>