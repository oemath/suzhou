declare var grade: number;
declare var category: number;
declare var index: number;
declare var count: number;
declare var token: string;

function processProblem(problem: Problem) {
    if (problem == null) return;

    $('#problem-index').text("Index: "+index);

    $('#problem-type').text(problem.type);
    $('#problem-level').text(problem.level);
    $('#problem-question').text(problem.question);
    $('#problem-parameter').text(problem.parameter);
    $('#problem-knowledge').text(problem.knowledge);
    $('#problem-hint').text(problem.hint);

    problem.process(1);
    $('#problem-question-parsed').text(problem.question);
}

function ajaxProblem(grade, category, index) {
    $.ajax({
        type: "get",
        url: "/api/problem",
        data: { grade: grade, category: category, index: index, token: token },
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            if (data.status == 'OK') {
                $('#problem-status').text('OK').css('color', 'green');
                processProblem(new Problem(data.result));
            }
            else {
                $('#problem-status').text(data.result).css('color', 'red');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },
    });
}

function onPrev() {
    if (--index == 0) {
        $('#problem-prev').prop('disabled', true);
    }
    $('#problem-next').prop('disabled', false);
    ajaxProblem(grade, category, index);
}
function onNext() {
    if (++index == count-1) {
        $('#problem-next').prop('disabled', true);
    }
    $('#problem-prev').prop('disabled', false);
    ajaxProblem(grade, category, index);
}

ajaxProblem(grade, category, index);
