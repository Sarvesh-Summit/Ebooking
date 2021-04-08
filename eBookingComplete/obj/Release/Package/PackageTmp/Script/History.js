var agencyidvalue = 0;
function AutoFilBookinkMyLog(appRoot) {
    $("#AgencyName").autocomplete({
        source: function (request, response) {
            var parametername = $("#AgencyName").attr("parameter");
            var paramValue = $("#AgencyName").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "BookingApproval/GetTableData";
            var param = {};
            param.ApiName = "/FillAgencyMyLog";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue;
            param.UserId = userid;
            param.IsClassified = 0;
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            if ($('#hdnIsClassified').val() == "0") {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,

                    };
                }));
            }
            else {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,

                    };
                }));
            }
        },

        minLength: 1,
        select: function (event, ui) {
            $('#AgencyId').val(ui.item.key);
            agencyidvalue = ui.item.key;


        },
    }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) agencyidvalue = 0; });
    $('#AgencyName').click(function () {
        $(this).select();
    });
    $("#AgencyName").change(function () { if ($(this).val() === '') if (this.id === 'AgencyName') agencyidvalue = 0; });

    $("#ClientName").autocomplete({
        source: function (request, response) {
            var parametername = $("#ClientName").attr("parameter");
            var paramValue = $("#ClientName").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "BookingApproval/GetTableData";
            var param = {};
            param.ApiName = "/FillClientMyLog";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue;
            param.UserId = userid;
            param.IsClassified = 0;
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            if ($('#hdnIsClassified').val() == "0") {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,

                    };
                }));
            }
            else {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,

                    };
                }));
            }
        },

        minLength: 1,
        select: function (event, ui) {
            $('#ClientId').val(ui.item.key);


        },
    }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) agencyidvalue = 0; });
    $('#ClientName').click(function () {
        $(this).select();
    });
    $("#ClientName").change(function () { if ($(this).val() === '') if (this.id === 'ClientName') agencyidvalue = 0; });
    $("#CanvassorName").autocomplete({
        source: function (request, response) {
            var parametername = $("#CanvassorName").attr("parameter");
            var paramValue = $("#CanvassorName").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "BookingApproval/GetTableData";
            var param = {};
            param.ApiName = "/FillCanvassorMyLog";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue;
            param.UserId = userid;
            param.IsClassified = 0;
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            if ($('#hdnIsClassified').val() == "0") {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,

                    };
                }));
            }
            else {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,

                    };
                }));
            }
        },

        minLength: 1,
        select: function (event, ui) {
            $('#CanvassorId').val(ui.item.key);


        },
    }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) agencyidvalue = 0; });
    $('#CanvassorName').click(function () {
        $(this).select();
    });
    $("#CanvassorName").change(function () { if ($(this).val() === '') if (this.id === 'CanvassorName') agencyidvalue = 0; });
    $("#BookingExe").autocomplete({
        source: function (request, response) {
            var parametername = $("#BookingExe").attr("parameter");
            var paramValue = $("#BookingExe").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "BookingApproval/GetTableData";
            var param = {};
            param.ApiName = "/FillBookingExeMyLog";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue;
            param.UserId = userid;
            param.IsClassified = 0;
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            if ($('#hdnIsClassified').val() == "0") {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,

                    };
                }));
            }
            else {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,

                    };
                }));
            }
        },

        minLength: 1,
        select: function (event, ui) {
            $('#Bookingexeid').val(ui.item.key);


        },
    });
}

function FillPackageDataMyLog() {
    var parametername = $("#Packegid").attr("parameter");
    var url = appRoot + "BookingApproval/GetTableData";
    var param = {};
    param.ApiName = "/FillPackageMyLog";
    param.Parametername = parametername;
    param.UserId = userid;
    param.IsClassified = 0;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var i = 0; i < result.length; i++)
            $("#Packegid").append(new Option(result[i].Value, result[i].ID));

    }
}
function FillStatusDataMyLog() {
    var parametername = $("#StatusId").attr("parameter");
    var url = appRoot + "BookingApproval/GetTableData";
    var param = {};
    param.ApiName = "/FillStatusMyLog";
    param.Parametername = parametername;
    param.UserId = userid;
    param.IsClassified = 0;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var i = 0; i < result.length; i++)
            $("#StatusId").append(new Option(result[i].Value, result[i].ID));
    }
}

function GetAllDataMyOrder() {
    if ($('#AgencyName').val().trim() == '') {
        $('#AgencyId').val('');

    }
    if ($('#ClientName').val().trim() == '') {
        $('#ClientId').val('');

    }
    if ($('#CanvassorName').val().trim() == '') {
        $('#CanvassorId').val('');

    }
    $('#MyLogDetails').empty();
    var IsClassified = 0;
    var param = $('#formid').serialize() + "&UserId=" + userid + "&IsClassified=" + IsClassified + "";
    var url = appRoot + "BookingApproval/GetMyLogDetails";
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    var strxml = '';
    if (result.length > 0) {
        var tableHtml = MakeCancelReceiptTable(result);
        $('#MyLogDetails').append(tableHtml);
        //for (var i = 0; i < result.length; i++) {

        //    strxml += '<tr style="color:black;">'
        //    + '<td>' + result[i].SNo + '</td><td>' + result[i].RoNumber + '</td><td></td><td>' + result[i].AgencyName + '</td><td>' + result[i].ClientName + '</td>'
        //    + '<td>' + result[i].ScheduleDate + '</td><td>' + result[i].packageName + '</td><td>' + result[i].Adsize + '</td>'
        //    + '<td>' + result[i].PremiaName + '</td><td>' + result[i].ColorName + '</td><td>' + result[i].Amount + '</td><td>' + result[i].Status + '</td><td>' + result[i].Resend + '</td>'
        //    + '<td>' + result[i].RejectionReason + '</td><td>' + result[i].RejectionNote + '</td>'

        //    + '<td>' + result[i].ROID + '</td><td>' + result[i].BookingDate + '</td><td>' + result[i].AdtypeName + '</td>'
        //    + '<td>' + result[i].Cat1 + '</td><td>' + result[i].Cat2 + '</td>'
        //    + '<td>' + result[i].Cat3 + '</td><td>' + result[i].Cat4 + '</td><td>' + result[i].BookingExecName + '</td><td></td>'
        //    + '<td>' + result[i].CanvassorName + '</td><td>' + result[i].AgencyExec + '</td>';
        //    $('#MyLogDetails').append(strxml);

        //}
    }
    return false;
}

function MakeCancelReceiptTable(data) {
    var table = $("<table/>").addClass('tables');
    if (data.length > 1) {
        $.each(data, function (rowIndex, r) {
            var row = $("<tr/>");
            $.each(r, function (colIndex, c) {
                if (rowIndex > 0 && colIndex == 2) {
                    row.append('<td><a href="#" target="eBooking" role="button" onclick="return ROIDOpenBookingData(' + c + ')" id="lnkOpenBooking" style="color:#6b59ce !important;">' + c + '</a></td>');
                }
                else if (rowIndex > 0 && (colIndex == 1 || colIndex == 6 || colIndex == 8)) {
                    row.append('<td><span class="spntitle10" title="' + c + '">' + c + '</span></td>');
                }
                else if (rowIndex > 0 && (colIndex == 3 || colIndex == 4 || colIndex == 5 || colIndex == 7 || colIndex > 13)) {
                    row.append('<td><span class="spntitle15" title="' + c + '">' + c + '</span></td>');
                }
                else {
                    row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
                }
            });
            table.append(row);
        });
    }
    else {
        table = '<div class="error-box">Sorry !! No Record Found.</div>'
    }
    return table;
}

// 
function ROIDOpenBookingData(Roid) {
    var ebookingpath = appRoot + 'booking/welcome?id=' + userid + '&cid=' + centerid + '& roid=' + Roid;
  //  sessionStorage.setItem("ROID", "" + Roid + "");
    window.open(ebookingpath, 'eBooking');
    return false;
}

