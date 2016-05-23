function processProblem(problem) {
    if (problem == null)
        return;
    $('#problem-index').text("Index: " + index);
    $('#problem-type').text(problem.type);
    $('#problem-level').text(problem.level);
    $('#problem-question').text(problem.question);
    $('#problem-parameter').text(problem.parameter);
    $('#problem-knowledge').text(problem.knowledge);
    $('#problem-hint').text(problem.hint);
    problem.process(1);
    $('#problem-question-parsed').text(problem.question);
    $('#oemath-question-container').empty();
    $('#oemath-question-container').append(problem.html);
}
/*function ajaxProblem(grade, category, index) {
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
*/
var Practice = (function () {
    function Practice(grade, category, count, token) {
        this.grade = grade;
        this.category = category;
        this.count = count;
        this.token = token;
        this.problems = [];
        this.current = -1;
    }
    Practice.prototype.ajaxProblem = function () {
        if (this.current >= this.count - 1)
            return null;
        var problem = null;
        $.ajax({
            type: "get",
            url: "/api/problem",
            data: { grade: this.grade, category: this.category, index: this.current + 1, token: this.token },
            dataType: "json",
            async: false,
            success: function (data, textStatus, jqXHR) {
                if (data.status == 'OK') {
                    problem = new Problem(data.result);
                }
                else {
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
        });
        if (problem) {
            ++this.current;
            practice.problems.push(problem);
        }
        return problem;
    };
    return Practice;
})();
var practice = new Practice(grade, category, count, token);
var problem = practice.ajaxProblem();
processProblem(problem);
//# sourceMappingURL=practice.js.map