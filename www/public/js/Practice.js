var Phase;
(function (Phase) {
    Phase[Phase["Practice"] = 0] = "Practice";
    Phase[Phase["Review"] = 1] = "Review";
})(Phase || (Phase = {}));
function onclickReviewBtn(index) {
    if (practice.current == index)
        return;
    if (index < 0 || index >= practice.problems.length)
        return;
    var problem = practice.problems[index];
    practice.showProblem(problem);
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
    Practice.prototype.ajaxNextProblem = function (cbSuccess, cbFail, cbTimeout) {
        var data = { grade: this.grade, category: this.category, index: this.problems.length, token: this.token };
        data[csrf_key] = csrf_token;
        //$('#loading-indicator').css("left", $(window).width() / 2 - 120).css("top", $(this.container).offset().top + 120).show();
        $.ajax({
            type: "post",
            url: "/api/problem",
            data: data,
            dataType: "json",
            async: true,
            success: (function (thisObj) {
                return function (data, textStatus, jqXHR) {
                    if (data.status == 'OK') {
                        var problem = new Problem(data.result, thisObj.problems.length);
                        problem.process();
                        thisObj.problems.push(problem);
                        thisObj.enable(problem.index);
                        thisObj.setColorSkipped(problem.index);
                        //$('#loading-indicator').hide();
                        cbSuccess(problem);
                    }
                    else if (cbFail) {
                        cbFail();
                    }
                };
            })(this),
            error: function (jqXHR, textStatus, errorThrown) {
                $('#oemathid-dialog-nextproblem-error').modal({ "backdrop": "true" });
                //$('#oemathid-dialog-congrat').show();
                if (cbTimeout) {
                    cbTimeout();
                }
                // fired when timeout
            },
            timeout: 18000 // set timeout to 18 seconds.
        });
        /*        if (problem) {
                    this.problems.push(problem);
                    this.enable(problem.index);
                    this.setColorSkipped(problem.index);
                }
        
                return problem;*/
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
                this.ajaxNextProblem(function (thisObj) {
                    return function (problem) {
                        if (problem.index != thisObj.current) {
                            thisObj.showProblem(problem);
                        }
                    };
                }(this), function () {
                    //fail
                }, function () {
                    // timeout
                });
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
                    //alert("Congratulations!");
                    //this.onclickStartReview();
                    $('#oemathid-dialog-congrat').show();
                    return;
                }
            }
        }
        if (nextProblem != null && nextProblem.index != this.current) {
            this.showProblem(nextProblem);
        }
    };
    Practice.prototype.showProblem = function (problem) {
        if (problem == null)
            return;
        problem.appendTo(this.container, this.phase);
        if (this.current != problem.index) {
            $("#oemathid-reviewbtn-" + this.current)
                .removeClass('oemathclass-reviewbtn-active')
                .addClass('oemathclass-reviewbtn-inactive');
        }
        $("#oemathid-reviewbtn-" + problem.index)
            .removeClass('oemathclass-reviewbtn-inactive')
            .addClass('oemathclass-reviewbtn-active');
        this.current = problem.index;
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
        var status = this.problems.map(function (a) { return a.reportStatus; }).join(',');
        var data = { grade: this.grade, category: this.category, status: status, token: this.token };
        data[csrf_key] = csrf_token; // Required for POST
        // Report status
        $.ajax({
            type: "post",
            url: "/api/report-status",
            data: data,
            dataType: "json",
            async: true,
            success: function (data, textStatus, jqXHR) {
                if (data.status == 'OK') {
                }
                else {
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
        });
    };
    Practice.prototype.onclickFinishReview = function () {
        $(window).unbind('beforeunload');
        window.location.href = "/math?grade=" + grade;
    };
    return Practice;
}());
var practice = new Practice(grade, category, count, token);
function startReview() {
    $('#oemathid-dialog-congrat').hide();
    practice.onclickStartReview();
}
$(function () {
    $(document).keypress(function (e) {
        if (e.which == 13) {
            if (practice) {
                practice.onclickSubmit();
            }
        }
    });
    //    $(window).bind('beforeunload', function () { return 'Are you sure to finish the practice?'; });
    practice.ajaxNextProblem(function (problem) {
        if (problem) {
            practice.showProblem(problem);
        }
    }, function () {
        // error handling
    }, function () {
        // timeout
    });
});
//# sourceMappingURL=Practice.js.map