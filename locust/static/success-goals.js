SuccessGoals = {
    init: function() {
        this.failPercentGoal = 0.10;
        this.responseTimeGoal = 500;
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
        SuccessGoals.setElementStatus(SuccessGoals.failPercentElement, failureOk);
        SuccessGoals.failPercentValue.html(Math.round(report.fail_ratio*100000)/1000 + " %");
        
        var responseTimeOk = report.response_time_percentile_95 < SuccessGoals.responseTimeGoal;
        SuccessGoals.setElementStatus(SuccessGoals.responseTimeElement, responseTimeOk);
        SuccessGoals.responseTimeElement.html(Math.round(report.response_time_percentile_95) + " ms");
        
        SuccessGoals.setElementStatus(SuccessGoals.totalElement, failureOk && responseTimeOk);
        
        if (SuccessGoals.previousState == "hatching" && report["state"]  == "running")
            SuccessGoals.start();
    }
}
