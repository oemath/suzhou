﻿declare var grade: number;
declare var category: number;
declare var index: number;
declare var count: number;
declare var token: string;
declare var csrf_key: string;
declare var csrf_token: string;

enum Phase {
    Practice = 0, // submit, skip, start view
    Review = 1,
}

function onclickReviewBtn(index: number) {
    if (practice.current == index) return;
    if (index < 0 || index >= practice.problems.length) return;

    let problem: Problem = practice.problems[index];
    practice.showProblem(problem);
}

class Practice {
    public grade: number;
    public category: number;
    public count: number;
    public token: string;

    public problems: Problem[];
    public current: number;

    public phase: Phase;

    public container: string;

    public constructor(grade: number, category: number, count: number, token: string) {
        this.grade = grade;
        this.category = category;
        this.count = count;
        this.token = token;

        this.problems = [];
        this.current = -1;

        this.phase = Phase.Practice;

        this.container = '#oemathid-question-container';
    }


    public ajaxNextProblem(): Problem {
        let problem: Problem = null;

        let data = { grade: this.grade, category: this.category, index: this.problems.length, token: this.token };
        data[csrf_key] = csrf_token;

        $.ajax({
            type: "post",
            url: "/api/problem",
            data: data,
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
            this.problems.push(problem);
            this.enable(problem.index);
            this.setColorSkipped(problem.index);
        }

        return problem;
    }


    private setTextColorWrong(index: number) { $(`#oemathid-reviewbtn-${index}`).css("color", "red"); }
    private setColor(index: number, color: string) { $(`#oemathid-reviewbtn-${index}`).css("background-color", color); }
    private setColorCorrect(index: number) { this.setColor(index, "rgb(192, 255, 190)"); }
    private setColorWrong(index: number) { this.setColor(index, "rgb(255, 192, 190)"); }
    private setColorSkipped(index: number) { this.setColor(index, "rgb(255, 255, 190)"); }
    private enable(index: number) { $(`#oemathid-reviewbtn-${index}`).prop("disabled", false); }

    public problem(): Problem {
        return this.problems[this.current];
    }

    private findNextProblem() {
        let nextProblem: Problem = null;
        // Search to the end for skipped.
        for (let i = this.current + 1; i < this.problems.length; i++) {
            if (this.problems[i].status == Answer.Incomplete) {
                nextProblem = this.problems[i];
                break;
            }
        }

        if (!nextProblem) { // No skipped to the end.
            // If NOT all problems have been seen.
            if (this.problems.length < this.count) {
                nextProblem = this.ajaxNextProblem();
                if (!nextProblem) {
                    // error handling.
                }
            }
            else { // All problems have been seen.
                // Search from beginning for skipped.
                for (let i = 0; i <= this.current; i++) {
                    if (this.problems[i].status == Answer.Incomplete) {
                        nextProblem = this.problems[i];
                        break;
                    }
                }

                if (!nextProblem) { // No skipped.  Let's search for wrong ones.
                    for (let j = 1; j <= this.count; j++) {
                        let i = (this.current + j) % this.count;
                        if (this.problems[i].status == Answer.Wrong) {
                            nextProblem = this.problems[i];
                            break;
                        }
                    }
                }

                if (!nextProblem) { // All problem finished as Correct!
                    alert("Congratulations!");
                    this.onclickStartReview();
                    return;
                }
            }
        }

        if (nextProblem.index != this.current) {
            this.showProblem(nextProblem);
        }        
    }


    public showProblem(problem: Problem) {
        if (problem == null) return;
        problem.appendTo(this.container, this.phase);

        if (this.current != problem.index) {
            $(`#oemathid-reviewbtn-${this.current}`)
                .removeClass('oemathclass-reviewbtn-active')
                .addClass('oemathclass-reviewbtn-inactive');
        }

        $(`#oemathid-reviewbtn-${problem.index}`)
            .removeClass('oemathclass-reviewbtn-inactive')
            .addClass('oemathclass-reviewbtn-active');

        this.current = problem.index;
    }


    public onclickSubmit() {
        let problem: Problem = this.problem();
        let answer: Answer = problem.checkAnswer();

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
    }

    public onclickSkip() {
        this.findNextProblem();
    }

    public onclickStartReview() {
        this.phase = Phase.Review;
        this.problem().appendTo(this.container, this.phase);

        let status: string = this.problems.map(function (a: Problem) { return a.reportStatus; }).join(',');

        let data = { grade: this.grade, category: this.category, status: status, token: this.token };
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
    }

    public onclickFinishReview() {
        $(window).unbind('beforeunload');
        window.location.href = `/math?grade=${grade}`;
    }
}

var practice: Practice = new Practice(grade, category, count, token);

$(function () {

    $(document).keypress(function (e) {
        if (e.which == 13) {
            if (practice) {
                practice.onclickSubmit();
            }
        }
    });

//    $(window).bind('beforeunload', function () { return 'Are you sure to finish the practice?'; });

    let problem: Problem = practice.ajaxNextProblem();
    if (problem) {
        practice.showProblem(problem);
    }
});
