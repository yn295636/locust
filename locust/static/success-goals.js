SuccessGoals = {
    init: function() {
        $(".success_goals form").submit(function(event) {
            event.preventDefault();
            document.location = "/?goals=" + $("#goal_fail").val() + ";" + $("#goal_response95").val();
        });
        $("#changeGoals").click(function(event) {
            event.preventDefault();
            $('.success_goals .settings').toggle();
            if ($('.success_goals .settings').is(":visible"))
                $(this).html("- Change Goals");
            else
                $(this).html("+ Change Goals");
        });
        
        this.isGoalSet = false;
        this.failPercentGoal = 0.1;
        this.responseTimeGoal = 500;
        
        urlParts = document.location.href.split("?");
        if (urlParts.length > 1) {
            queryParts = urlParts[1].split("&");
            for (var i=0; i < queryParts.length; i++) {
                var parts = queryParts[i].split("=")
                if (parts.length > 0 && parts[0] == "goals") {
                    var settings = parts[1].split(";");
                    if (settings.length != 2)
                        break;
                    this.failPercentGoal = parseFloat(settings[0]);
                    this.responseTimeGoal = parseInt(settings[1]);
                    this.isGoalSet = true;
                }
            }
        }
        
        $("#goal_fail").val(this.failPercentGoal);
        $("#goal_response95").val(this.responseTimeGoal);
        $("#goal_fail_current").html(this.failPercentGoal + "%");
        $("#goal_response95_current").html(this.responseTimeGoal + " ms");
        
        if (this.isGoalSet) {
            $(".success_goals .settings").hide();
            $(".success_goals .result").show();
        }
    },
    
    failPercentElement: $(".success_goals .fail_percent .status"),
    failPercentValue: $(".success_goals .fail_percent .status h1"),
    
    responseTimeElement: $(".success_goals .response_time .status"),
    responseTimeElement: $(".success_goals .response_time .status h1"),
    
    totalElement: $(".success_goals .total .status"),
    
    previousState: null,
    start: function() {},
    
    setElementStatus: function(element, success) {
        if (success)
            element.removeClass("fail").addClass("success");
        else
            element.removeClass("success").addClass("fail");
    },
    
    updateStats: function(report) {
        var failureOk = report.fail_ratio < SuccessGoals.failPercentGoal;
        SuccessGoals.setElementStatus(SuccessGoals.failPercentElement, failureOk/100);
        SuccessGoals.failPercentValue.html(Math.round(report.fail_ratio*100000)/1000 + " %");
        
        var responseTimeOk = report.response_time_percentile_95 < SuccessGoals.responseTimeGoal;
        SuccessGoals.setElementStatus(SuccessGoals.responseTimeElement, responseTimeOk);
        SuccessGoals.responseTimeElement.html(Math.round(report.response_time_percentile_95) + " ms");
        
        SuccessGoals.setElementStatus(SuccessGoals.totalElement, failureOk && responseTimeOk);
        
        if (SuccessGoals.previousState == "hatching" && report["state"]  == "running")
            SuccessGoals.start();
    }
}
