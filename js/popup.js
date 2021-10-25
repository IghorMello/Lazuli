$(function () {
    chrome.storage.sync.get(['total', 'goal'], function (items) {
        var defaultValue = 0;

        if (items.total == null || items.total == "") {
            $('#total').text(defaultValue);
        }
        if (items.goal == null || items.total == "") {
            $('#goal').text(defaultValue);
        }

        $('#total').text(items.total);
        $('#goal').text(items.goal);

        var percentage = (items.total / items.goal) * 100;

        if (percentage < 10 && percentage >= 0) {
            $("#glass").attr("../", "images/one.gif");
        }
        else if (percentage < 25 && percentage >= 10) {
            $("#glass").attr("../", "images/two.gif");
        }
        else if (percentage < 50 && percentage >= 25) {
            $("#glass").attr("../", "images/three.gif");
        }
        else if (percentage < 75 && percentage >= 50) {
            $("#glass").attr("../", "images/four.gif");
        }
        else if (percentage < 100 && percentage >= 75) {
            $("#glass").attr("../", "images/five.gif");
        }
        else if (percentage >= 100) {
            $("#glass").attr("../", "images/goal.gif");
        }
        else {
            $("#glass").attr("../", "images/one.gif");
        }
    });

    $('#addAmount').click(function () {
        chrome.storage.sync.get(['total', 'goal'], function (items) {
            var newTotal = 0;
            if (items.total) {
                newTotal += parseInt(items.total);
            }

            var amount = $('#amount').val();

            if (amount) {
                newTotal += parseInt(amount);
            }

            chrome.storage.sync.set({ 'total': newTotal });
            $('#total').text(newTotal);
            $('#amount').val('');

            if (newTotal >= items.goal) {
                var opt = {
                    type: "basic",
                    title: "Goal Reached. Well Done!",
                    message: "You Reached Your Goal " + items.goal + " !",
                    iconUrl: "../images/icon.png"
                }
                chrome.notifications.create('goalReached', opt, function () { });
            }
            close();
        })
    });
});