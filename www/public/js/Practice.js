var Phase;
(function (Phase) {
    Phase[Phase["Practice"] = 0] = "Practice";
    Phase[Phase["Review"] = 1] = "Review";
})(Phase || (Phase = {}));
function showProblem(problem) {
    if (problem == null)
        return;
    /*    $('#problem-index').text("Index: "+index);
        $('#problem-type').text(problem.type);
        $('#problem-level').text(problem.level);
        $('#problem-question').text(problem.question);
        $('#problem-parameter').text(problem.parameter);
        $('#problem-knowledge').text(problem.knowledge);
        $('#problem-hint').text(problem.hint);
        $('#problem-question-parsed').text(problem.question);
        */
    problem.appendTo(practice.container, practice.phase);
}
function onclickReviewBtn(index) {
    if (practice.current == index)
        return;
    if (index < 0 || index >= practice.problems.length)
        return;
    var problem = practice.problems[index];
    showProblem(problem);
    practice.jumpTo(index);
}
var Practice = (function () {
    function Practice(grade, category, count, token) {
        this.grade = grade;
        this.category = category;
        this.count = count;
        this.token = token;
        this.problems = [];
        this.current = -1;
        this.phase = Phase.Practice;
        this.container = '#oemathid-question-container';
    }
    Practice.prototype.ajaxNextProblem = function () {
        var problem = null;
        $.ajax({
            type: "get",
            url: "/api/problem",
            data: { grade: this.grade, category: this.category, index: this.problems.length, token: this.token },
            dataType: "json",
            async: false,
            success: (function (thisObj) {
                return function (data, textStatus, jqXHR) {
                    if (data.status == 'OK') {
                        problem = new Problem(data.result, thisObj.problems.length);
                        problem.process();
                    }
                    else {
                    }
                };
            })(this),
            error: function (jqXHR, textStatus, errorThrown) {
            },
        });
        if (problem) {
            practice.problems.push(problem);
            this.enable(problem.index);
            this.setColorSkipped(problem.index);
            showProblem(problem);
        }
        return problem;
    };
    Practice.prototype.jumpTo = function (index) {
        if (this.current != index) {
            $("#oemathid-reviewbtn-" + this.current)
                .removeClass('oemathclass-reviewbtn-active')
                .addClass('oemathclass-reviewbtn-inactive');
        }
        if (0 <= index && index < this.problems.length) {
            $("#oemathid-reviewbtn-" + index)
                .removeClass('oemathclass-reviewbtn-inactive')
                .addClass('oemathclass-reviewbtn-active');
            this.current = index;
        }
    };
    Practice.prototype.setTextColorWrong = function (index) { $("#oemathid-reviewbtn-" + index).css("color", "red"); };
    Practice.prototype.setColor = function (index, color) { $("#oemathid-reviewbtn-" + index).css("background-color", color); };
    Practice.prototype.setColorCorrect = function (index) { this.setColor(index, "rgb(192, 255, 190)"); };
    Practice.prototype.setColorWrong = function (index) { this.setColor(index, "rgb(255, 192, 190)"); };
    Practice.prototype.setColorSkipped = function (index) { this.setColor(index, "rgb(255, 255, 190)"); };
    Practice.prototype.enable = function (index) { $("#oemathid-reviewbtn-" + index).prop("disabled", false); };
    Practice.prototype.problem = function () {
        return this.problems[this.current];
    };
    Practice.prototype.findNextProblem = function () {
        var nextProblem = null;
        // Search to the end for skipped.
        for (var i = this.current + 1; i < this.problems.length; i++) {
            if (this.problems[i].status == Answer.Incomplete) {
                nextProblem = this.problems[i];
                break;
            }
        }
        if (!nextProblem) {
            // If NOT all problems have been seen.
            if (this.problems.length < this.count) {
                nextProblem = this.ajaxNextProblem();
                if (!nextProblem) {
                }
                else {
                    this.enable(nextProblem.index);
                    this.setColorSkipped(nextProblem.index);
                }
            }
            else {
                // Search from beginning for skipped.
                for (var i = 0; i <= this.current; i++) {
                    if (this.problems[i].status == Answer.Incomplete) {
                        nextProblem = this.problems[i];
                        break;
                    }
                }
                if (!nextProblem) {
                    for (var j = 1; j <= this.count; j++) {
                        var i = (this.current + j) % this.count;
                        if (this.problems[i].status == Answer.Wrong) {
                            nextProblem = this.problems[i];
                            break;
                        }
                    }
                }
                if (!nextProblem) {
                    alert("Congratulations!");
                    this.onclickStartReview();
                    return;
                }
            }
        }
        if (nextProblem.index != this.current) {
            this.jumpTo(nextProblem.index);
            showProblem(nextProblem);
        }
    };
    Practice.prototype.onclickSubmit = function () {
        var problem = this.problem();
        var answer = problem.checkAnswer();
        if (answer == Answer.Incomplete) {
            this.setColorSkipped(this.current);
            // show incomplete dialog
            alert("please enter your answer");
            return;
        }
        else if (answer == Answer.Correct) {
            this.setColorCorrect(this.current);
        }
        else {
            this.setColorWrong(this.current);
            this.setTextColorWrong(this.current);
        }
        problem.status = answer;
        this.findNextProblem();
    };
    Practice.prototype.onclickSkip = function () {
        this.findNextProblem();
    };
    Practice.prototype.onclickStartReview = function () {
        this.phase = Phase.Review;
        this.problem().appendTo(this.container, this.phase);
    };
    Practice.prototype.onclickFinishReview = function () {
    };
    return Practice;
})();
var practice = new Practice(grade, category, count, token);
practice.current = 0;
var problem = practice.ajaxNextProblem();
if (problem) {
    showProblem(problem);
    practice.jumpTo(0);
}
$(document).keypress(function (e) {
    if (e.which == 13) {
        if (practice) {
            practice.onclickSubmit();
        }
    }
});
//# sourceMappingURL=practice.js.map