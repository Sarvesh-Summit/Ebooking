function getresult(url, param) {
    var result;
    $.ajax({
        url: url,
        async: false,
        type: 'POST',
        data: {
            format: 'json'
        },
        data: param,
        success: function (data) {
            result = data;
        },
        error: function (e) {
            alert('Some technical error');
        }
    });
    return result;
}

var specialKeys = new Array();
specialKeys.push(8); //Backspace
specialKeys.push(9); //Tab
specialKeys.push(46); //Delete
specialKeys.push(36); //Home
specialKeys.push(35); //End
specialKeys.push(37); //Left
specialKeys.push(39); //Right
specialKeys.push(40); //Down
specialKeys.push(38); //Up
function validateCharacters(ths, e, charType, invalidChar) {
    IsValid = false;
    switch (charType) {
        case 'numeric':
            if ((e.shiftKey == false && 47 < e.keyCode && e.keyCode < 58) || (95 < e.keyCode && e.keyCode < 106) ||
                (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode) || e.keyCode == 13)
                IsValid = true;
            // new code for copy+paste add by sarvesh at 30/12/2019.
            if (e.ctrlKey && e.keyCode == 86)
                IsValid = true;
            break;
        case 'alphanumeric':
            //if (!((e.keyCode == 32) || (e.keyCode >= 35 && e.keyCode <= 40) || (e.keyCode >= 65 && e.keyCode <= 90) ||
            //    ((!e.shiftKey) && e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) ||
            //    (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode)))
            // new code add for special keys by sarvesh.
            if (specialKeys.indexOf(e.keyCode) != -1)
                IsValid = true;
            var regex = new RegExp("[ A-Za-z]");
            var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            // new code add for tab key.
            if (e.keyCode == 9)
                IsValid = true;
            if (regex.test(key))
                IsValid = true;
            break;
        case 'selectedInvalidChar':
            var regexs = new RegExp("[" + invalidChar + "]");
            var keys = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (!regexs.test(keys))
                IsValid = true;
            break;
        case 'amount':
            if ((e.shiftKey == false && 47 < e.keyCode && e.keyCode < 58) || (95 < e.keyCode && e.keyCode < 106) ||
                (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode)
                || (e.shiftKey == false && e.keyCode == 190 || e.keyCode == 110))
                IsValid = true;
            break;
        default:
            IsValid = true;
    }
    return IsValid;
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
