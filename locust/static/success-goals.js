SuccessGoals = {
    init: function() {
        $(".success_goals form").submit(function(event) {
            event.preventDefault();
            document.location = "/?goals=" + $("#goal_fail").val() + ";" + $("#goal_response80").val() + ";" + $("#goal_response95").val();
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
        this.responseTime80Goal = 500;
        this.responseTimeGoal = 2500;
        
        urlParts = document.location.href.split("?");
        if (urlParts.length > 1) {
            queryParts = urlParts[1].split("&");
            for (var i=0; i < queryParts.length; i++) {
                var parts = queryParts[i].split("=")
                if (parts.length > 0 && parts[0] == "goals") {
                    var settings = parts[1].split(";");
                    if (settings.length != 3)
                        break;
                    this.failPercentGoal = parseFloat(settings[0]);
                    this.responseTime80Goal = parseInt(settings[1]);
                    this.responseTimeGoal = parseInt(settings[2]);
                    this.isGoalSet = true;
                }
            }
        }
        
        $("#goal_fail").val(this.failPercentGoal);
        $("#goal_response95").val(this.responseTimeGoal);
        $("#goal_fail_current").html(this.failPercentGoal + "%");
        $("#goal_response95_current").html(this.responseTimeGoal + " ms");
        
        $("#goal_response80").val(this.responseTime80Goal);
        $("#goal_response80_current").html(this.responseTime80Goal + " ms");
        
        if (this.isGoalSet) {
            $(".success_goals .settings").hide();
            $(".success_goals .result").show();
        }
    },
    
    failPercentElement: $(".success_goals .fail_percent .status"),
    failPercentValue: $(".success_goals .fail_percent .status h1"),
    
    responseTime80Element: $(".success_goals .response_time80 .status"),
    responseTime80Element: $(".success_goals .response_time80 .status h1"),
    responseTime95Element: $(".success_goals .response_time95 .status"),
    responseTime95Element: $(".success_goals .response_time95 .status h1"),
    
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
        SuccessGoals.setElementStatus(SuccessGoals.responseTime95Element, responseTimeOk);
        SuccessGoals.responseTime95Element.html(Math.round(report.response_time_percentile_95) + " ms");
        
        var responseTime80Ok = report.response_time_percentile_80 < SuccessGoals.responseTime80Goal;
        SuccessGoals.setElementStatus(SuccessGoals.responseTime80Element, responseTime80Ok);
        SuccessGoals.responseTime80Element.html(Math.round(report.response_time_percentile_80) + " ms");
        
        SuccessGoals.setElementStatus(SuccessGoals.totalElement, failureOk && responseTime80Ok && responseTimeOk);
        $(".success_goals .total h1").html((failureOk && responseTime80Ok && responseTimeOk ? "YES" : "NO"));
        
        if (SuccessGoals.previousState == "hatching" && report["state"]  == "running")
            SuccessGoals.start();
    }
}
