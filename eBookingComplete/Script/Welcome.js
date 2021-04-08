
var agencyidvalue = 0;
var allowcasualclientid = 0;
var agencypaymentmode = 0;
var agencyembargoid = 0;
var agencyembargoreason = '';
var clientidvalue = 0;
var clientembargoid = 0;
var clientembargoreason = '';
var canvassoridvalue = 0;
var categoryidvalue = 0;
var stylesheetidvalue = 0;

var premiaidvalue = 0;
var premiamincolvalue = 0;
var premiamaxcolvalue = 0;
var premiaminheightvalue = 0;
var premiamaxheightvalue = 0;

var adsizeidvalue = 0;
var adheightvalue = 0;
var adsizecolvalue = 0;
var adsizevalue = 0;

var coloridvalue = 0;

var mattypeidvalue = 0;

var AdtypeId1 = 0;
var AdtypeId2 = 0;
var AdtypeId3 = 0;
var AdtypeId4 = 0;
var qStr;
var userid;
var centerid;
var selectedpackagelist = [];
var selectpeidlist = [];

var AdtypeIdlist = [];
var Adsizeidlist = [];
var AdsizeHeightlist = [];
var AdsizeWidthlist = [];
var Premiaidlist = [];
var Coloridlist = [];
var CardRatelist = [];
var CardAmountlist = [];
var RateCardIDlist = [];
var AdRateIDlist = [];
var MaterialTypelist = [];
var MaterialSourcelist = [];
var BoxTypeIDlist = [];
var UOMIDlist = [];
var Statuslist = [];
var AuditStatuslist = [];
var AgreedRatelist = [];
var AgreedAmountlist = [];
var AgreedDiscAmountlist = [];
var AgreedDiscPerlist = [];
var PreVATAmountlist = [];
var VATPerlist = [];
var VATAmountlist = [];
var AgencyCommissionPerlist = [];
var AgencyCommissionAmountlist = [];
var SchemeIDlist = [];
var SchemeDetailIDlist = [];
var ExtraChargesPerlist = [];
var ExtraChargesAmountlist = [];
var ExtraDiscPerlist = [];
var ExtraDiscAmountlist = [];
var ExtraBoxChargesPerlist = [];
var ExtraBoxChargesAmountlist = [];
var Receivablelist = [];
var ColumnSizelist = [];
var Gutterlist = [];

var Paymentdict = [];
var Customerdict = [];
var enabledays = [];
var Rofilename = [];
var Rofiletype = [];
var Rofiletitle = [];

var Csvfilecount = 0;
var combinedpackage = 0;
var IsLogoPossible = 0;
var HeightLogo = '';


function LoginDetail() {
    $("#allowclassified").css('pointer-events', 'none');
    setTimeout(function () {
        qStr = window.location.href.split('#')[0];
        if (qStr.indexOf("?id=") == -1 || qStr.indexOf("&cid=") == -1) {
            ShowMsg("Login user Logged Out.. Please login");
            return false;
        }
        userid = qStr.split('?')[1].split('=')[1].split('&')[0];
        centerid = qStr.split('&')[1].split('=')[1];
        var url = appRoot + "Booking/GetTableData";
        var param = {};
        param.ApiName = "/FillLoginData";
        param.UserId = userid;
        param.RevenueCentreID = centerid;
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        var logindate = new Date(serverDate);
        if (result.UserName == "" || result.UserName == null || result.CentreName == "" || result.CentreName == null) {
            ShowMsg("Login user Logged Out.. Please login");
            return false;
        }
        var str = result.UserName.charAt(0).toUpperCase() + result.UserName.substring(1).toLowerCase() + " &nbsp;  | &nbsp; " + result.CentreName.charAt(0).toUpperCase() + result.CentreName.substring(1).toLowerCase() + "  &nbsp; | &nbsp;" + " <label onclick='UserLogOut()' style='cursor:pointer;'>Close</label>";
        $(".user-detail").html(str);
        var result = MachineDetail();
        if (result == -2) {
            UserLogOut();
        }
        else {
            BindBookingControl();
            BindAdtypeControl();
            BindPackageControl();
            AutoFilleBookingAgencyCientList(appRoot);
            setTimeout(function () {
                BindBrandControl();
                BindReceiptData();
                BindBranchData();
                BindPrefrenceValues();
                BindUOMControl();
                BindDefaultColorControl();
                LoadSwitchValue();
                UnlockOrder();
                MaterialPath();
                GetUserRight();
                $("#allowclassified").css('pointer-events', 'auto');
                sessionStorage.setItem("UserName", "" + str + "");
                sessionStorage.setItem("UserID", "" + userid + "");
                sessionStorage.setItem("CenterID", "" + centerid + "");
                var roid = parseInt(qStr.split('?')[1].split('=')[3]);
                if (!isNaN(roid)) {
                    setTimeout(function () {
                        GetRoidOnLoadDetail();
                    }, 10);
                }
                DeleteBookingFile();
            }, 100);
        }
    }, 100);
    return false;
}

function UnlockOrder() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/UnlockOrder";
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    var result = getresult(url, param);
}

function MaterialPath() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/MaterialPath";
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        $("#hdnClassifiedMaterialPath").val(result[0].ClassifiedMaterialPath);
        $("#hdnJobPath").val(result[0].JobPath);
        $("#hdnROFilePath").val(result[0].ROFilePath);
        $("#hdnClMatPath").val(result[0].ClMatPath);
    }
}


function GetUserRight() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/GetUserRight";
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);

    if (result[0].AllowDisplayBooking == 0 && result[0].AllowClassifiedBooking == 0) {
        ShowMsg("You do not have rights for booking");
        UserLogOut();
        return;
    }
    if (result[0].AllowDisplayBooking == 0) {
        $("#allowdisplay").css('pointer-events', 'none');
        $("#hdnallowdisplay").val(result[0].AllowDisplayBooking);
    }
    else if (result[0].AllowDisplayBooking == 1) {
        $("#allowclassified").css('pointer-events', 'none');
        $("#hdnallowdisplay").val(result[0].AllowDisplayBooking);
    }
    if (result[0].AllowClassifiedBooking == 0) {
        $("#allowclassified").css('pointer-events', 'none');
        $("#hdnallowclassified").val(result[0].AllowClassifiedBooking);
    }
    else if (result[0].AllowClassifiedBooking == 1) {
        $("#allowdisplay").css('pointer-events', 'none');
        $("#hdnallowclassified").val(result[0].AllowClassifiedBooking);
    }
    if (result[0].AllowClassifiedBooking == 1 && result[0].AllowDisplayBooking == 1) {
        $("#allowclassified").css('pointer-events', '');
        $("#hdnallowclassified").val(result[0].AllowClassifiedBooking);
        $("#allowdisplay").css('pointer-events', '');
        $("#hdnallowdisplay").val(result[0].AllowDisplayBooking);
    }
    if (result[0].AllowCreditBooking == 1) {
        $("[name=paymentlabel]").css('pointer-events', 'none');
        $("#hdnallowcredit").val(result[0].AllowCreditBooking);
    }
    if (result[0].AllowManualBooking == 0) {
        $("#manualbilllabel").css('pointer-events', 'none');
        $("#hdnallowmanualbilling").val(result[0].AllowManualBooking);
    }
    else if (result[0].AllowManualBooking == 1) {
        $("#manualbilllabel").css('pointer-events', 'auto');
        $("#hdnallowmanualbilling").val(result[0].AllowManualBooking);
    }
    if (result[0].AllowSuspendOrder == 0) {
        $("#btnsuspend").css('pointer-events', 'none');
        $("#btnsuspend").css('opacity', '0.5');
        $("#hdnallowsuspend").val(result[0].AllowSuspendOrder);
    }
    else if (result[0].AllowSuspendOrder == 1) {
        $("#btnsuspend").css('pointer-events', 'auto');
        $("#btnsuspend").css('opacity', '');
        $("#hdnallowsuspend").val(result[0].AllowSuspendOrder);
    }
    if (result[0].AllowCancelOrder == 0) {
        $("#btncancel").css('pointer-events', 'none');
        $("#btncancel").css('opacity', '0.5');
        $("#hdnallowcancel").val(result[0].AllowCancelOrder);
    }
    else if (result[0].AllowCancelOrder == 1) {
        $("#btncancel").css('pointer-events', 'auto');
        $("#btncancel").css('opacity', '');
        $("#hdnallowcancel").val(result[0].AllowCancelOrder);
    }
    if (result[0].AllowReceiptCancellation == 0) {
        $("#btncancelreceipt").css('pointer-events', 'none');
        $("#btncancelreceipt").css('opacity', '0.5');
        $("#btnnewcancelreceipt").css('pointer-events', 'none');
        $("#btnnewcancelreceipt").css('opacity', '0.5');
        $("#hdnallowreceiptcancel").val(result[0].AllowReceiptCancellation);
    }
    else {
        $("#hdnallowreceiptcancel").val(result[0].AllowReceiptCancellation);
    }
    if (result[0].AllowVATModification == 0) {
        $("#isVatPer").css('pointer-events', 'none');
        $("#isVatPer").css('opacity', '0.5');
    }
    else {
        $("#isVatPer").css('pointer-events', 'auto');
        $("#isVatPer").css('opacity', '');
    }
    if (result[0].AllowWTModification == 0) {
        $("#isTaxPer").css('pointer-events', 'none');
        $("#isTaxPer").css('opacity', '0.5');
    }
    else {
        $("#isTaxPer").css('pointer-events', 'auto');
        $("#isTaxPer").css('opacity', '');
    }
    $("#hdnIsBrandNecessary").val(result[0].IsBrandNecessary);
    $("#hdnIsProductNecessary").val(result[0].IsProductNecessary);
    if (result[0].AllowDisplayBooking == 0) {
        setTimeout(function () {
            $("[val='1']").click();
            $("#allowdisplay").css('pointer-events', 'none');
            $("#hdnallowdisplay").val(result[0].AllowDisplayBooking);
        }, 10);
    }
}

function MachineDetail() {
    var url = appRoot + "Booking/GetMachineData";
    var param = {};
    var result = getresult(url, param);
    var machinename = result;
    qStr = window.location.href.split('#')[0];
    if (qStr.indexOf("?id=") == -1 || qStr.indexOf("&cid=") == -1) {
        ShowMsg("Login user Logged Out.. Please login");
        return false;
    }
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillMachineData";
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    param.MachineName = machinename;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.IsValid == -2) {
        ShowMsg(result.ErrorMessage);
    }
    else {
        $('#hdnMachineID').val(result.MachineID);
        $('#hdnMachineName').val(result.MachineName);
    }
    return result.IsValid;
}

function BindPrefrenceValues() {
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/BindPrefrenceControlData";
    param.IsDigital = $('#hdnIsDigital').val();
    param.Parametername = "getparameters";
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        $("#hdnbackdatedays").val(result[0].BackBookingDays);
        $("#hdnwriteoffamount").val(result[0].WriteOffAmount);
        $("#hdnmaxdiscountforautoapproval").val(result[0].MaxDiscountForAutoApproval);
        $("#hdntexttypinginbooking").val(result[0].TextTypingInBooking);
        $("#hdnautofoldercreationforclassifiedorders").val(result[0].AutoFolderCreationforClassifiedorders);
        $("#hdnissmenecessaryforbookingorder").val(result[0].IsSMENecessaryForBookingOrder);
        $("#hdnismaterialtyperequired").val(result[0].isMaterialTypeRequired);
        $("#hdndefaultcolorfordispad").val(result[0].DefaultColorForDispAd);
        $("#hdndisplayuom").val(result[0].DisplayUOM);
        $("#hdndefaultpkgid").val(result[0].DefaultPkgID);
    }
    WriteoffAmount = parseFloat($("#hdnwriteoffamount").val());
    if ($("#hdntexttypinginbooking").val() == "0") {
        $('#Classifiedadtext').css('pointer-events', 'none');
        $('#Classifiedadtext').css('opacity', '0.5');
    }
    else {
        $('#Classifiedadtext').css('pointer-events', 'auto');
        $('#Classifiedadtext').css('opacity', '');
    }
}

function BindBookingControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var allFilterElement = $('[newflag = "forXmltype"]');
    var allFilterElementLength = allFilterElement.length;
    for (var i = 0; i < allFilterElementLength; i++) {
        $("#" + allFilterElement[i].id).empty();
        var parametername = $("#" + allFilterElement[i].id).attr("parameter");
        var paramValue = $("#" + allFilterElement[i].id).val();
        if (paramValue === null)
            paramValue = 0;
        var url = appRoot + "Booking/GetTableData";
        var param = {};
        param.ApiName = "/FillControlData";
        param.Parametername = parametername;
        param.UserId = userid;
        param.IsClassified = $('#hdnIsClassified').val();
        param.IsDigital = $('#hdnIsDigital').val();
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        if (result.length > 0) {
            for (var m = 0; m < result.length; m++)
                $("#" + allFilterElement[i].id).append(new Option(result[m].Value, result[m].ID));
        }
    }
}

function AutoFilleBookingAgencyCientList(appRoot) {
    if (IsGetClientClicked == false) {
        $("#clientid").autocomplete({
            source: function (request, response) {
                userid = qStr.split('?')[1].split('=')[1].split('&')[0];
                var parametername = $("#clientid").attr("parameter");
                var paramValue = $("#clientid").val();
                if (paramValue == null)
                    paramValue = 0;
                var url = appRoot + "Booking/GetTableData";
                var param = {};
                param.ApiName = "/FillClientControlData";
                param.Parametername = parametername;
                param.ParamValueStr = paramValue.replace('&', '&amp;');
                param.CustomerTypeID = $("#hdnIsCustomerType").val();
                param.PaymentTypeID = $("#hdnIsPaymentType").val();
                param.UserId = userid;
                param.IsClassified = $('#hdnIsClassified').val();
                var result = getresult(url, param);
                result = jQuery.parseJSON(result);
                response($.map(result, function (item, aa) {
                    return {
                        key: item.ID,
                        value: item.Value,
                        clientembargoid: item.EmbargoID,
                        clientmbargoreason: item.EmbargoReason
                    };
                }));
            },
            open: function () {
                $("ul.ui-menu").height('auto');
            },
            minLength: 1,
            maxHeight: 200,
            autoFocus: true,
            select: function (event, ui) {
                $("#clientid").val(ui.item.value);
                clientidvalue = ui.item.key;
                clientembargoid = ui.item.clientembargoid;
                clientmbargoreason = ui.item.clientmbargoreason;
            },
            change: function (event, ui) {
            }
        }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) clientidvalue = 0; });

        $('#clientid').click(function () {
            $(this).select();
        });
        $("#clientid").change(function () { if ($(this).val() === '') if (this.id === 'clientid') clientidvalue = 0; });
    }
    else {

    }

    $("#agencyid").autocomplete({
        source: function (request, response) {
            userid = qStr.split('?')[1].split('=')[1].split('&')[0];
            var parametername = $("#agencyid").attr("parameter");
            var paramValue = $("#agencyid").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "Booking/GetTableData";
            var param = {};
            param.ApiName = "/FillAgencyControlData";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue.replace('&', '&amp;');
            param.UserId = userid;
            param.IsClassified = $('#hdnIsClassified').val();
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            if ($('#hdnIsClassified').val() == "0") {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,
                        ratecardid: item.DisplayRateCardID,
                        allowcasualclient: item.AllowCasualClient,
                        agencypaymentmode: item.AgencyPaymentmode,
                        agencyembargoid: item.EmbargoID,
                        agencyembargoreason: item.EmbargoReason
                    };
                }));
            }
            else {
                response($.map(result, function (item, aa) {
                    return {
                        value: item.Value,
                        key: item.ID,
                        ratecardid: item.ClassifiedRateCardID,
                        allowcasualclient: item.AllowCasualClient,
                        agencypaymentmode: item.AgencyPaymentmode,
                        agencyembargoid: item.EmbargoID,
                        agencyembargoreason: item.EmbargoReason
                    };
                }));
            }
        },
        open: function () {
            $("ul.ui-menu").height('auto');
        },
        minLength: 1,
        autoFocus: true,
        select: function (event, ui) {
            $("#agencyid").val(ui.item.value);
            agencyidvalue = ui.item.key;
            $("#txtratecardid").val(ui.item.ratecardid);
            allowcasualclientid = ui.item.allowcasualclient;
            agencypaymentmode = ui.item.agencypaymentmode;
            agencyembargoid = ui.item.agencyembargoid;
            agencyembargoreason = ui.item.agencyembargoreason;
        },
    }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) agencyidvalue = 0; });
    $('#agencyid').click(function () {
        $(this).select();
    });
    $("#agencyid").change(function () { if ($(this).val() === '') if (this.id === 'agencyid') agencyidvalue = 0; });

    $("#canvassorid").autocomplete({
        source: function (request, response) {
            userid = qStr.split('?')[1].split('=')[1].split('&')[0];
            var parametername = $("#canvassorid").attr("parameter");
            var paramValue = $("#canvassorid").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "Booking/GetTableData";
            var param = {};
            param.ApiName = "/FillCanvassorControlData";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue.replace('&', '&amp;');
            param.UserId = userid;
            param.IsClassified = $('#hdnIsClassified').val();
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            response($.map(result, function (item, aa) {
                return {
                    key: item.ID,
                    value: item.Value
                };
            }));
        },
        open: function () {
            $("ul.ui-menu").height('auto');
        },
        minLength: 1,
        maxHeight: 200,
        autoFocus: true,
        select: function (event, ui) {
            $("#canvassorid").val(ui.item.value);
            canvassoridvalue = ui.item.key;
        },
    }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) canvassoridvalue = 0; });
    $('#canvassorid').click(function () {
        $(this).select();
    });
    $("#canvassorid").change(function () { if ($(this).val() === '') if (this.id === 'canvassorid') canvassoridvalue = 0; });

    $("#categoryid").autocomplete({
        source: function (request, response) {
            userid = qStr.split('?')[1].split('=')[1].split('&')[0];
            var parametername = $("#categoryid").attr("parameter");
            var paramValue = $("#categoryid").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "Booking/GetTableData";
            var param = {};
            param.ApiName = "/FillCategoryControlData";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue.replace('&', '&amp;');
            param.AdtypeId = $("#adtypeid").val();
            param.UserId = userid;
            param.IsClassified = $('#hdnIsClassified').val();
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            response($.map(result, function (item, aa) {
                return {
                    value: item.Value,
                    key: item.CategoryID,
                    IsLogoPossible: item.IsLogoPossible,
                    HeightLogo: item.HeightLogo
                };
            }));
        },
        open: function () {
            $("ul.ui-menu").height(150);
        },
        minLength: 1,
        autoFocus: true,
        select: function (event, ui) {
            categoryidvalue = 0;
            AdtypeId1 = 0;
            AdtypeId2 = 0;
            AdtypeId3 = 0;
            AdtypeId4 = 0;
            $("#categoryid").val(ui.item.value);
            categoryidvalue = ui.item.key;
            IsLogoPossible = ui.item.IsLogoPossible;
            HeightLogo = ui.item.HeightLogo;
            $("#islogo").val(0);
            $("#txtheight").val('');
            $("#islogo").change();
            //$("#file_center").attr("disabled", "disabled");
            //$("#lblfile").html('');
            //$("#file_center").val('');
            //$("#file_center").attr('title', 'No file chosen');
            if (IsLogoPossible == 1) {
                $("#islogo").removeAttr("disabled");
            }
            else {
                $("#islogo").attr("disabled", "disabled");
            }
            var SelVal = ui.item.key.split(",");
            for (i = SelVal.length - 1; i > -1; i--) {
                switch (i) {
                    case 3:
                        if (SelVal[3] != '') {
                            AdtypeId1 = SelVal[3];
                        }
                        break;

                    case 2:
                        if (SelVal[2] != '') {
                            AdtypeId2 = SelVal[2];
                        }
                        break;
                    case 1:
                        if (SelVal[1] != '') {
                            AdtypeId3 = SelVal[1];
                        }
                        break;
                    case 0:
                        if (SelVal[0] != '') {
                            AdtypeId4 = SelVal[0];
                        }
                        break;
                }
            }
        },
    }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) categoryidvalue = 0; });
    $('#categoryid').click(function () {
        $(this).select();
    });
    $("#categoryid").change(function () { if ($(this).val() === '') if (this.id === 'categoryid') categoryidvalue = 0; });

    $("#colorid").autocomplete({
        source: function (request, response) {
            userid = qStr.split('?')[1].split('=')[1].split('&')[0];
            var parametername = $("#colorid").attr("parameter");
            var paramValue = $("#colorid").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "Booking/GetTableData";
            var param = {};
            param.ApiName = "/FillColorControlData";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue.replace('&', '&amp;');
            param.UserId = userid;
            param.IsClassified = $('#hdnIsClassified').val();
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            response($.map(result, function (item, aa) {
                return {
                    value: item.Value,
                    key: item.ID
                };
            }));
        },
        open: function () {
            $("ul.ui-menu").height(150);
        },
        minLength: 1,
        autoFocus: true,
        select: function (event, ui) {
            $("#colorid").val(ui.item.value);
            colorname = ui.item.value;
            coloridvalue = ui.item.key;
            var color = colorname;
        },
    }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) coloridvalue = 0; });
    $('#colorid').click(function () {
        $(this).select();
    });
    $("#colorid").change(function () { if ($(this).val() === '') if (this.id === 'colorid') coloridvalue = 0; });
}

function BindPremiaAdsize() {
    $("#premiaid").autocomplete({
        source: function (request, response) {
            userid = qStr.split('?')[1].split('=')[1].split('&')[0];
            var parametername = $("#premiaid").attr("parameter");
            var paramValue = $("#premiaid").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "Booking/GetTableData";
            var param = {};
            param.ApiName = "/FillPremiaControlData";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue.replace('&', '&amp;').trim();
            param.UserId = userid;
            param.IsClassified = $('#hdnIsClassified').val();
            param.IsDigital = $('#hdnIsDigital').val();
            var selectedpackage = new Array();
            selectedpackage = $("#packageid").val().toString();
            param.PackageID = selectedpackage;
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            response($.map(result, function (item, aa) {
                return {
                    value: item.Value,
                    key: item.ID,
                    mincolumn: item.MinColumn,
                    maxcolumn: item.MaxColumn,
                    minheight: item.MinHeight,
                    maxheight: item.MaxHeight
                };
            }));
        },
        open: function () {
            $("ul.ui-menu").height(150);
        },
        minLength: 1,
        autoFocus: true,
        select: function (event, ui) {
            $("#premiaid").val(ui.item.value);
            premianame = ui.item.value;
            premiaidvalue = ui.item.key;
            premiamincolvalue = ui.item.mincolumn;
            premiamaxcolvalue = ui.item.maxcolumn;
            premiaminheightvalue = ui.item.minheight;
            premiamaxheightvalue = ui.item.maxheight;
            var premia = premianame;
        },
    }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) premiaidvalue = 0; });
    $('#premiaid').click(function () {
        $(this).select();
    });
    $("#premiaid").change(function () {
        var a = 0;
        if ($(this).val() === '') if (this.id === 'premiaid') premiaidvalue = 0;
    });

    $("#adsizeid").autocomplete({
        source: function (request, response) {
            userid = qStr.split('?')[1].split('=')[1].split('&')[0];
            var parametername = $("#adsizeid").attr("parameter");
            var paramValue = $("#adsizeid").val();
            if (paramValue == null)
                paramValue = 0;
            var url = appRoot + "Booking/GetTableData";
            var param = {};
            param.ApiName = "/FillAdSizeControlData";
            param.Parametername = parametername;
            param.ParamValueStr = paramValue.replace('&', '&amp;');
            param.UserId = userid;
            param.IsClassified = $('#hdnIsClassified').val();
            var selectedpackage = new Array();
            selectedpackage = $("#packageid").val().toString();
            param.PackageID = selectedpackage;
            var result = getresult(url, param);
            result = jQuery.parseJSON(result);
            response($.map(result, function (item, aa) {
                return {
                    value: item.Value,
                    key: item.ID,
                    adheight: item.AdHeight,
                    adsizecolumn: item.AdSizeColumn,
                    adsize: item.AdSizeValue
                };
            }));
        },
        open: function () {
            $("ul.ui-menu").height(150);
        },
        minLength: 1,
        autoFocus: true,
        select: function (event, ui) {
            $("#adsizeid").val(ui.item.adsize);
            adsizename = ui.item.value;
            adsizeidvalue = ui.item.key;
            adheightvalue = ui.item.adheight;
            adsizecolvalue = ui.item.adsizecolumn;
            adsizevalue = ui.item.adsize;
            var res = ValidateAdSize();
            if (res == false) {
                ui.item.value = '';
                $("#adsizeid").val(ui.item.value);
                adsizeidvalue = 0;
                $("#billablesize").val(ui.item.value);
            }
            else {
                $("#billablesize").val(adsizevalue);
                var adsize = adsizename;
            }
        },
    }).keyup(function (e) { if (e.keyCode !== 13 && e.keyCode !== 9 && !e.ctrlKey && e.keyCode !== 27) adsizeidvalue = 0; });
    $('#adsizeid').click(function () {
        $(this).select();
    });
    $("#adsizeid").change(function () { if ($(this).val() === '') if (this.id === 'adsizeid') adsizeidvalue = 0; });
}

function BindAdtypeControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    $("#adtypeid").empty();
    var parametername = $("#adtypeid").attr("parameter");
    var paramValue = $("#adtypeid").val();
    if (paramValue === null)
        paramValue = 0;
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillAdtypeControlData";
    param.Parametername = parametername;
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var m = 0; m < result.length; m++) {
            $("#adtypeid").append('<option value="' + result[m].ID + '" isROL="' + result[m].AllowROL + '" isCD="' + result[m].AllowCD + '" isBoxtype="' + result[m].AllowBoxtype + '">' + result[m].Value + '</option>');
            if (result[m].Flag == 1) {
                $("#adtypeid").val(result[m].ID);
            }

        }
    }
}

function BindPackageControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    $("#packageid").empty();
    var parametername = $("#packageid").attr("parameter");
    var paramValue = $("#packageid").val();
    if (paramValue === null)
        paramValue = 0;
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillPackageControlData";
    param.Parametername = parametername;
    param.AdtypeId = $("#adtypeid").val();
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var m = 0; m < result.length; m++) {
            $("#packageid").append('<option value="' + result[m].ID + '" isvalid="' + result[m].Flag + '">' + result[m].Value + '</option>');
        }
    }
    $("#packageid").trigger("chosen:updated");
}

function PackageRights() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillPackageRights";
    param.Parametername = "packagerights";
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    param.IsClassified = $('#hdnIsClassified').val();
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    param.AdtypeId = $("#adtypeid").val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
}

function BindBrandControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    $("#brandid").empty();
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillBrandData";
    param.Parametername = "brand";
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    param.ProductID = $("#productid").val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var m = 0; m < result.length; m++)
            $("#brandid").append(new Option(result[m].Value, result[m].ID));
    }
}

function BindUOMControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    $("#uomid").empty();
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillUOMData";
    param.Parametername = "uom";
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var m = 0; m < result.length; m++) {
            $("#uomid").append(new Option(result[m].Value, result[m].ID));
        }
        $("#uomid").val($("#hdndisplayuom").val());
    }
}

function BindDefaultUOMControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillDefaultUOMData";
    param.Parametername = "defaultuom";
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    param.StyleSheetID = $("#stylesheetid").val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        $("#uomid").val(result[0].ID);
    }
}

function BindDefaultColorControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillColorControlData";
    param.Parametername = "color";
    param.ParamValueStr = "";
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var m = 0; m < result.length; m++) {
            //if (result[m].Flag == 1) {
            //    $("#colorid").val(result[m].Value);
            //    coloridvalue = result[m].ID;
            //}
            if (result[m].ID === parseInt($("#hdndefaultcolorfordispad").val())) {
                $("#colorid").val(result[m].Value);
                coloridvalue = result[m].ID;
            }
        }
    }
}

function BindRateCardControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    $("#ratecardid").empty();
    var parametername = $("#ratecardid").attr("parameter");
    var paramValue = $("#ratecardid").val();
    if (paramValue === null)
        paramValue = 0;
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillRateCardControlData";
    param.Parametername = parametername;
    param.AgencyID = agencyidvalue;
    param.ClientID = clientidvalue;
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var m = 0; m < result.length; m++) {
            $("#ratecardid").append(new Option(result[m].Value, result[m].ID));
            if (result[m].Flag == 1) {
                $("#ratecardid").val(result[m].ID);
            }

        }
    }
}

function BindStyleSheetControl() {
    selectedStylewithValidPE = [];
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    $("#stylesheetid").empty();
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillStyleSheetData";
    param.Parametername = "style";
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    param.AdtypeId = $("#adtypeid").val();
    param.IsCD = $('#iscd option:selected').val();
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var m = 0; m < result.length; m++) {
            $("#stylesheetid").append(new Option(result[m].Value, result[m].ID));
            selectedStylewithValidPE.push([result[m].StylePackageID, result[m].ID, result[m].Value]);
        }
    }
}

function BindBoxChargesControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillBoxChargesControlData";
    param.Parametername = "getboxcharges";
    param.ParamValueStr = "";
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    param.BoxTypeID = $('#boxtypeid').val();
    param.AdtypeId = $("#adtypeid").val();
    //param.RateCardID = $("#txtratecardid").val();
    param.RateCardID = $("#txtratecardid").val();
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        $("#txtboxchargeper").val(result[0].BoxChargePer);
        $("#txtboxchargeper").html(result[0].BoxChargePer);
        $("#txtboxchargeamount").val(result[0].BoxChargeAmount);
        $("#txtboxchargeamount").html(result[0].BoxChargeAmount.toFixed(2));
    }
}

function ValidateAdSize() {
    var mincol = parseFloat(premiamincolvalue);
    var maxcol = parseFloat(premiamaxcolvalue);
    var minheight = parseFloat(premiaminheightvalue);
    var maxheight = parseFloat(premiamaxheightvalue);
    var adsizecol = parseFloat(adsizecolvalue);
    var adsizeheight = parseFloat(adheightvalue);
    if (mincol > adsizecol || adsizecol > maxcol) {
        if (maxcol != "0.00") {
            ShowMsg("Adsize must be between " + minheight + "*" + mincol + " and " + maxheight + "*" + maxcol + "", $("#adsizeid"));
            $("#adsizeid").val('');
            $("#billablesize").val('');
            setTimeout(function () {
                $("#adsizeid").focus();
            }, 20);
            return false;
        }
    }
    else if (minheight > adsizeheight || adsizeheight > maxheight) {
        if (maxheight != "0.00") {
            ShowMsg("Adsize must be between " + minheight + "*" + mincol + " and " + maxheight + "*" + maxcol + "", $("#adsizeid"));
            $("#adsizeid").val('');
            $("#billablesize").val('');
            setTimeout(function () {
                $("#adsizeid").focus();
            }, 20);
            return false;
        }
    }
}

function ValidateManualAdSize() {
    var mincol = parseFloat(premiamincolvalue);
    var maxcol = parseFloat(premiamaxcolvalue);
    var minheight = parseFloat(premiaminheightvalue);
    var maxheight = parseFloat(premiamaxheightvalue);
    var AdsizeHeight = $("#adsizeid").val().replace(/ /g, '').split("*")[0];
    var AdsizeWidth = $("#adsizeid").val().replace(/ /g, '').split("*")[1];
    if (AdsizeHeight == undefined || AdsizeWidth == undefined) {
        ShowMsg("Please enter valid Ad Size", $("#adsizeid"));
        $("#adsizeid").val('');
        $("#billablesize").val('');
        setTimeout(function () {
            $("#adsizeid").focus();
        }, 20);
        return false;
    }
    var adsizecol = parseFloat(AdsizeWidth);
    var adsizeheight = parseFloat(AdsizeHeight);
    if (mincol > adsizecol || adsizecol > maxcol) {
        ShowMsg("Adsize must be between " + minheight + "*" + mincol + " and " + maxheight + "*" + maxcol + "", $("#adsizeid"));
        $("#adsizeid").val('');
        $("#billablesize").val('');
        setTimeout(function () {
            $("#adsizeid").focus();
        }, 20);
        return false;
    }
    else if (minheight > adsizeheight || adsizeheight > maxheight) {
        ShowMsg("Adsize must be between " + minheight + "*" + mincol + " and " + maxheight + "*" + maxcol + "", $("#adsizeid"));
        $("#adsizeid").val('');
        $("#billablesize").val('');
        setTimeout(function () {
            $("#adsizeid").focus();
        }, 20);
        return false;
    }
    $("#billablesize").val($("#adsizeid").val());
}

function BindReceiptData() {
    var allFilterElement = $('[newflag = "forReceiptXmltype"]');
    var allFilterElementLength = allFilterElement.length;
    for (var i = 0; i < allFilterElementLength; i++) {
        $("#" + allFilterElement[i].id).empty();
        var parametername = $("#" + allFilterElement[i].id).attr("parameter");
        var paramValue = $("#" + allFilterElement[i].id).val();
        if (paramValue === null)
            paramValue = 0;
        var url = appRoot + "Booking/GetTableData";
        var param = {};
        param.ApiName = "/FillReceiptData";
        param.Parametername = parametername;
        param.IsClassified = $('#hdnIsClassified').val();
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        if (result.length > 0) {
            for (var m = 0; m < result.length; m++)
                $("#" + allFilterElement[i].id).append(new Option(result[m].Value, result[m].ID));
        }
    }
}

function BindBranchData() {
    var allFilterElement = $('[newflag = "forBranchXmltype"]');
    var allFilterElementLength = allFilterElement.length;
    for (var i = 0; i < allFilterElementLength; i++) {
        $("#" + allFilterElement[i].id).empty();
        var parametername = $("#" + allFilterElement[i].id).attr("parameter");
        var paramValue = $("#" + allFilterElement[i].id).val();
        if (paramValue === null)
            paramValue = 0;
        var url = appRoot + "Booking/GetTableData";
        var param = {};
        param.ApiName = "/FillBranchData";
        param.Parametername = parametername;
        param.IsClassified = $('#hdnIsClassified').val();
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        if (result.length > 0) {
            for (var m = 0; m < result.length; m++)
                $("#" + allFilterElement[i].id).append('<option value="' + result[m].BranchID + '" bankid="' + result[m].BankID + '" bankname="' + result[m].BankName + '" branchname="' + result[m].BranchName + '">' + result[m].BankBranchCode + '</option>');
        }
    }
}

function LoadSwitchValue() {
    var allFilterElement = $('[newflag = "forSwitchXmltype"]');
    var allFilterElementLength = allFilterElement.length;
    for (var i = 0; i < allFilterElementLength; i++) {
        $("#" + allFilterElement[i].id).empty();
        var parametername = $("#" + allFilterElement[i].id).attr("parameter");
        var paramValue = $("#" + allFilterElement[i].id).val();
        if (paramValue === null)
            paramValue = 0;
        var url = appRoot + "Booking/GetTableData";
        var param = {};
        param.ApiName = "/FillControlData";
        param.Parametername = parametername;
        param.IsClassified = $('#hdnIsClassified').val();
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        if (result.length > 0) {
            for (var m = 0; m < result.length; m++) {
                if (parametername == "paymentmode") {
                    Paymentdict.push({
                        key: result[m].Value,
                        value: result[m].ID
                    });
                    $("#hdnIsPaymentType").val(result[0].ID);
                }
                else if (parametername == "customertype") {
                    Customerdict.push({
                        key: result[m].Value,
                        value: result[m].ID
                    });
                    $("#hdnIsCustomerType").val(result[0].ID);
                }
            }
            $("#" + allFilterElement[i].id).attr("data-on", result[0].Value);
            $("#" + allFilterElement[i].id).attr("data-off", result[1].Value);
        }
    }
    $("#tblreceipt").find("input,button,select").attr("disabled", "disabled");
    $("#tblreceipt").css('display', 'none');
}

function CheckDifferReceipt() {
    if ($("#chkdiffer").prop("checked") == true) {
        $("#tablereceiptdetails").find("input,select").val('');
        $("#tblreceipt").find("input,button,select").attr("disabled", "disabled");
        $("#chkdiffer").removeAttr("disabled");
        $("#hdnchkdiffer").val(1);
        $("#NetReceivableForReceipt").val('');
    }
    else {
        $("#tblreceipt").find("input,button,select").removeAttr("disabled", "disabled");
        $("#hdnchkdiffer").val(0);
    }
}

function SwitchtoggleTypeValue() {
    if ($("#paymenttypetoggle").prop("checked") == true) {
        $("#hdnIsPaymentType").val(2);
        $("#tblreceipt").find("input,button,select").attr("disabled", "disabled");
        $("#tblreceipt").css('display', 'none');
        $("#billtypeid").val(1);
    }
    else if ($("#paymenttypetoggle").prop("checked") == false) {
        if ($("#hdnallowcredit").val() == 1) {
            $("#paymenttypetoggle").prop("checked", true);
            ShowMsg("Can not book prepaid order");
            return false;
        }
        $("#hdnIsPaymentType").val(1);
        $("#tblreceipt").find("input,button,select").removeAttr("disabled");
        $("#tblreceipt").css('display', '');
        $("#txtpaymentmodeid").change();
        if ($("#txtpaymentmodeid1").val() != null)
            $("#txtpaymentmodeid1").change();
        if ($("#txtpaymentmodeid2").val() != null)
            $("#txtpaymentmodeid2").change();
        $("#billtypeid").val(2);
    }
}

function SwitchCustomerTypeValue() {
    if ($("#customertypetoggle").prop("checked") == true) {
        RegularClientActive();
        $("#hdnIsCustomerType").val(Customerdict[0].value);
    }
    else if ($("#customertypetoggle").prop("checked") == false) {
        $("#hdnIsCustomerType").val(Customerdict[1].value);
        CasualClientActive();
    }
}

function CasualClientActive() {
    clientidvalue = 0;
    $("#clientid").val('');
    if (agencyidvalue > 0 && allowcasualclientid == 0) {
        ShowMsg("Casual client booking not allowed for this agency", $("#clientid"));
        $("#billtypeid").prop("disabled", "");
        $("#customertypetoggle").prop("checked", true);
        $("#hdnIsCustomerType").val(Customerdict[0].value);
        $("#clientid").focus();
        return false;
    }
    if (agencyidvalue == 0) {
        if ($("#hdnallowcredit").val() == 1) {
            ShowMsg("Can not book for prepaid order", $("#clientid"));
            $("#clientid").val('');
            $("#clientid").focus();
            return false;
        }
        $("#customertypetoggle").prop("checked", false);
        $("#hdnIsCustomerType").val(Customerdict[1].value);
        $("#paymenttypetoggle").prop("checked", false);
        $("#paylabel").css('pointer-events', 'none');
        setTimeout(function () {
            if ($("#hdnIsPaymentType").val() == 1) {
                $("#billtypeid").prop("disabled", "disabled");
            }
        }, 100);
        IsGetClientClicked = false;
    }
    $("#hdnIsGetClientClicked").val(1);
    $("#clientid").css('width', '85%');
    $("#clientadd").css('display', '');
    $("#clientid").addClass('noncapitalise');
    SwitchtoggleTypeValue();
    $("#clientid").focus();
    IsGetRateClicked = false;
}

function RegularClientActive() {
    $("#hdnIsGetClientClicked").val(0);
    $("#clientid").css('width', '100%');
    $("#clientadd").css('display', 'none');
    $("#billtypeid").prop("disabled", "");
    $("#clientid").addClass('capitalise');
    $("#paylabel").css('pointer-events', 'auto');
    if (agencyidvalue == 0) {
        $("#paymenttypetoggle").prop("checked", true);
        SwitchtoggleTypeValue();
    }
}

function Paymodevalue() {
    if ($("#txtamount").val() == "" && $("#hdnIsPaymentType").val() == 1) {
        $("#tblreceipt").css('pointer-events', '');
        $("#receiptfield2").css('pointer-events', 'none');
        $("#receiptfield3").css('pointer-events', 'none');
        $("#receiptfield2").prop("disabled", true);
        $("#receiptfield3").prop("disabled", true);
        $("#receiptfield1 input").val('');
        $("#receiptfield1 select").val(0);
        $("#receiptfield2 input").val('');
        $("#receiptfield2 select").val(0);
        $("#receiptfield3 input").val('');
        $("#receiptfield3 select").val(0);
        $('#txtpaymentmodeid').val(1);
        $("#txtpaymentmodeid").change();
        $("#txtamount").val($("#txtrecevible").html())
    }
}

function SwitchAgencytoggleTypeValue() {
    if ($("#paymenttypetoggle").prop("checked") == true) {
        $("#hdnIsPaymentType").val(Paymentdict[0].value);
        $("#tblreceipt").find("input,button,select").attr("disabled", "disabled");
        $("#tblreceipt").css('display', 'none');
    }
    else if ($("#paymenttypetoggle").prop("checked") == false) {
        $("#hdnIsPaymentType").val(Paymentdict[1].value);
        $("#tblreceipt").find("input,button,select").removeAttr("disabled");
        $("#tblreceipt").css('display', '');
        $("#txtpaymentmodeid").change();
        if ($("#txtpaymentmodeid1").val() != null)
            $("#txtpaymentmodeid1").change();
        if ($("#txtpaymentmodeid2").val() != null)
            $("#txtpaymentmodeid2").change();
    }
}

function SwitchBackDatetoggle() {
    $('#datePicker').datepicker('refresh');
    $('.search-choice-close').click();
    if ($("#backdatedtoggle").prop("checked") == true) {
        $("#hdnIsBackdate").val(1);
        IsBackDateAllow = true;
        var newdate = new Date();
        newdate.setDate(newdate.getDate() - $("#hdnbackdatedays").val());
        $("#datePicker").datepicker("setDate", newdate);
        callInnerBoxHover();
    }
    else if ($("#backdatedtoggle").prop("checked") == false) {
        $("#hdnIsBackdate").val(0);
        IsBackDateAllow = false;
        $("#datePicker").datepicker("setDate", NxtPublicationDt);
        callInnerBoxHover();
    }
    $('#agencyid').focus();
}

function SwitchManualBilltoggle() {
    if ($("#manualbilltoggle").prop("checked") == true) {
        $("#hdnIsManualBill").val(1);
    }
    else if ($("#manualbilltoggle").prop("checked") == false) {
        $("#hdnIsManualBill").val(0);
    }
    $('#agencyid').focus();
}

function CheckMainPackageidRun() {
    selectedPEwithValidDays = [];
    $("#bookingGrid").html('');
    $('.ui-datepicker-group span').removeClass('ui-state-active');
    enabledays = [];
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillGridControlData";
    param.Parametername = "publishedition";
    var selectedpackage = new Array();
    if ($("#packageid").val() == 0 || $("#packageid").val() == null || $("#packageid").val() == "")
        selectedpackage = selectedpackagelist.toString();
    else
        selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
            packageIDRunDays = result[i].ValidDays;

            if (packageIDRunDays == 0) {
                BindGridControl();
                enabledays = CheckPackageDates();
                if (enabledays.length > 0) {
                    $("#datePicker").datepicker("option", "beforeShowDay", enableAllTheseDays);
                    if (($("#txtOrderNo").val() == '' && $("#txtReceiptNo").val() == '' && $("#txtBookingNo").val() == '')) {
                        EnableSupplimentDates(enabledays[0]);
                    }
                    callInnerBoxHover();
                }
                //else {
                //    ShowMsg()
                //}
            }
            else {
                // if (($("#txtOrderNo").val() == '' && $("#txtReceiptNo").val() == '' && $("#txtBookingNo").val() == '') && packageIDRunDays != 0) {
                dt = BindDateAutomatically();
                selectedPEwithValidDays.push([result[i].PEID, result[i].ValidDays, dt]);
            }

            //}
            //else
            //    selectedPEwithValidDays.push([result[i].PEID, result[i].ValidDays, '']);
        }
    }
}

function CheckPackageidRun() {
    selectedPEwithValidDays = [];
    $("#bookingGrid").html('');
    $('.ui-datepicker-group span').removeClass('ui-state-active');
    enabledays = [];
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillGridControlData";
    param.Parametername = "publishedition";
    var selectedpackage = new Array();
    if ($("#packageid").val() == 0 || $("#packageid").val() == null || $("#packageid").val() == "")
        selectedpackage = selectedpackagelist.toString();
    else
        selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
            packageIDRunDays = result[i].ValidDays;

            if (packageIDRunDays == 0) {
                BindGridControl();
                enabledays = CheckPackageDates();
                $("#datePicker").datepicker("option", "beforeShowDay", enableAllTheseDays);
                if (($("#txtOrderNo").val() == '' && $("#txtReceiptNo").val() == '' && $("#txtBookingNo").val() == '')) {
                    EnableSupplimentDates(enabledays[0]);
                }
                callInnerBoxHover();
            }
            if (($("#txtOrderNo").val() == '' && $("#txtReceiptNo").val() == '' && $("#txtBookingNo").val() == '') && packageIDRunDays != 0) {
                dt = BindDateAutomatically();
                selectedPEwithValidDays.push([result[i].PEID, result[i].ValidDays, dt]);

            }
            else
                selectedPEwithValidDays.push([result[i].PEID, result[i].ValidDays, '']);
        }
    }
}

function EnableSupplimentDates(dateText) {
    selectedDateArray.push(dateText);
    $('[parameter=ProductionDate]').append(new Option(dateText, dateText));
    $('[parameter = NoOfInsertion]').val($('[parameter=ProductionDate]').find("option").length);
    SetMaterialIdByDate();
    calenderFlag = true;
    ctrlKeyPassed = false;
    IsGetRateClicked = false;
    callInnerBoxHover();
}

function enableAllTheseDays(date) {
    var sdate = $.datepicker.formatDate('dd/mm/yy', date)
    if ($.inArray(sdate, enabledays) != -1) {
        return [true];
    }
    return [false];
}

function CheckPackageDates() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillCalenderControlData";
    param.Parametername = "publicationdates";
    var selectedpe = new Array();
    selectedpe = $("#hdnpeid").val().toString();
    param.PEID = selectedpe;
    param.BackdateID = $('#hdnIsBackdate').val();
    param.Backdatedays = $('#hdnbackdatedays').val();
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        for (var m = 0; m < result.length; m++) {
            enabledays.push(result[m].Value.substring(0, 10).replace('-', '/').replace('-', '/'));
        }
    }
    return enabledays;
}


function VerifyCYOP() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    if (list.length == 0)
        $("#bookingGrid").html('');
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/VerifyCYOP";
    param.Parametername = "verifycyop";
    var selectedpackage = new Array();
    if ($("#packageid").val() == 0 || $("#packageid").val() == null || $("#packageid").val() == "")
        selectedpackage = selectedpackagelist.toString();
    else
        selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        if (result[0].ID > 0) {
            $('.search-choice-close').click();
            ShowMsg(result[0].Value, $("#categoryid"));
            $('[parameter=ProductionDate]').find('option').remove();
            $('#datePicker').datepicker('refresh');
            DisableItemRate();
            $("#categoryid").focus();
            return false;
        }
    }
}

function BindGridControl() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    if (list.length == 0)
        $("#bookingGrid").html('');
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillGridControlData";
    param.Parametername = "publishedition";
    var selectedpackage = new Array();
    if ($("#packageid").val() == 0 || $("#packageid").val() == null || $("#packageid").val() == "")
        selectedpackage = selectedpackagelist.toString();
    else
        selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    if (selectedpackage.length > 0) {
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        var strxml = '';
        pakagenamelist = "";
        pelist = [];
        selectpeidlist = [];
        if (result.length > 0) {
            $("#hdnpeid").val(result[0].PEID);
        }
        var totaldateselected = selectedDateArray.length;
        if (totaldateselected > 0) {
            $("#ins").val(totaldateselected);
            if (result.length > 0) {
                Pecodelist = '';
                pakagenamelist = '';
                for (var i = 0; i < result.length; i++) {
                    pakagenamelist += result[i].PackageName + '-';
                    Pecodelist += result[i].PECode + '-';
                    pelist.push(result[i].PEID);
                    selectpeidlist.push(result[i].PEID);
                }
                if (result.length > 1) {
                    pakagenamelist = 'CYOP';
                }
                if ($('#hdnIsClassified').val() == "0") {
                    strxml += '<tr class="parent" style="border-bottom: 5px solid gray;" onclick="Ordergridselected()"><td>&nbsp;&nbsp;</td><td class="margin_left" id="OrderInsNum">' + totaldateselected + '</td><td></td><td class="margin_left">' + pakagenamelist.replace(/(^-)|(-$)/g, "") + '</td><td class="margin_left"></td>'
                        + '<td class="margin_left" id="parenttxtagreedrate"></td><td class="margin_left" id="parenttxtagreedamount"></td><td class="margin_left" id="parenttxtagreediscount"></td>'
                        + '<td class="margin_left" id="txtcolor"></td><td class="margin_left" id="txtpremia"></td><td class="margin_left" id="txtmanualsize"></td>'
                        + '<td class="margin_left" id="parenttxtbillabesize"></td><td class="margin_left" id="parenttxtmattype"></td><td class="margin_left" id="parenttxtcaption"></td><td class="margin_left" id="parenttxtfreeorpaid"></td><td class="margin_left"></td><td class="margin_left"></td><td class="margin_left"></td></tr>';
                }
                else {
                    strxml += '<tr class="parent" style="border-bottom: 5px solid gray;"><td>&nbsp;&nbsp;</td><td class="margin_left" id="OrderInsNum">' + totaldateselected / selectedPEwithValidDays.length + '</td><td></td><td class="margin_left">' + pakagenamelist.replace(/(^-)|(-$)/g, "") + '</td><td class="margin_left"></td>'
                        + '<td class="margin_left" id="parenttxtagreedrate"></td><td class="margin_left" id="parenttxtagreedamount"></td><td class="margin_left" id="parenttxtagreediscount"></td>'
                        + '<td class="margin_left" id="parenttxtmbodysize"></td><td class="margin_left" id="parenttxtmattype"></td><td class="margin_left" id="parenttxtfreeorpaid"></td><td class="margin_left" id="parentcategory"></td><td class="margin_left"></td></tr>';
                }
                if (checkdate == 0 || list.length == 0)
                    $("#bookingGrid").append(strxml);
                $("#hdnpackageid").val(result[0].PackageID);
                $("#hdnpackagename").val(result[0].PackageName);
                $("#hdnpecode").val(result[0].PECode);

                packagelength = $("#packageid").val().toString().split(',').length;
                peidlength = selectpeidlist.toString().split(',').length;
                if (packagelength == 1 && peidlength == 1) {
                    $("#ins").removeAttr("disabled");
                }
                else {
                    $("#ins").attr("disabled", true);
                }
                if ($('#hdnIsClassified').val() == "0") {
                    if (packagelength == 1 && peidlength == 1) {
                        $("#OrderInsNum").html(totaldateselected);
                        $("#ins").val(totaldateselected);
                    }
                    else {
                        $("#OrderInsNum").html(totaldateselected / selectedPEwithValidDays.length);
                        $("#ins").val(totaldateselected / selectedPEwithValidDays.length);
                    }
                }
                else {
                    $("#OrderInsNum").html(totaldateselected / selectedPEwithValidDays.length);
                    $("#ins").val(totaldateselected / selectedPEwithValidDays.length);
                }
                BindDateItemLevelGrid(checkdate);
            }
            else {
                return false;
            }
        }
    }
}

function BindDateItemLevelGrid(newdate) {
    combinedpackage = 0;
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillGridControlData";
    param.Parametername = "publishedition";
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    packagelength = $("#packageid").val().toString().split(',').length;
    peidlength = selectpeidlist.toString().split(',').length;
    param.PackageID = selectedpackage;
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    var strxml = '';
    var selecteddate = new Array();
    selecteddate = selectedDateArray.toString().split(',');
    var totaldateselected = selectedDateArray.length;
    var date = newdate;
    if (date == 0) {
        date = selecteddate[0]
    }
    var insnum = totaldateselected;
    Pecodelist = "";
    if (result.length > 0) {

        var url1 = appRoot + "Booking/GetGridData";
        var param_Ist = {};
        var result1 = getresult(url1, param_Ist);

        result1.PackageID = result[0].PackageID;
        result1.PackageName = result[0].PackageName;
        result1.PECode = result[0].PECode;
        result1.PEID = result[0].PEID;
        result1.Date = date;

        if ($('#hdnIsClassified').val() == "1") {
            result1.InsNum = totaldateselected / selectedPEwithValidDays.length;
            result1.ScheduledDate = ReturnDate(result[0]);//selectedPEwithValidDays[selectedPEwithValidDays.indexOf(result1.PEID)][2];//selectedDateArray[selectedDateArray.length - (result.length)];--  --selectedPEwithValidDays
        }
        else {
            if (packagelength == 1 && peidlength == 1) {
                result1.InsNum = insnum;
                result1.ScheduledDate = date;
            }
            else {
                result1.InsNum = totaldateselected / selectedPEwithValidDays.length;
                result1.ScheduledDate = ReturnDate(result[0]);
            }
        }


        result1.PremiaID = premiaidvalue;
        result1.ColorID = coloridvalue;
        result1.MaterialType = mattypeidvalue;
        result1.AdsizeID = adsizeidvalue;
        if (adsizeidvalue == 0)
            result1.Adsize = adsizename;
        else
            result1.Adsize = 0;
        result1.AdSizeHeight = adheightvalue;
        result1.AdSizeWidth = adsizecolvalue;

        result1.BillableSize = $("#billablesize").val().replace(/ /g, '');
        result1.Billableheight = $("#billablesize").val().replace(/ /g, '').split("*")[0];
        result1.Billablewidth = $("#billablesize").val().replace(/ /g, '').split("*")[1];
        result1.ReadOnlyFlag = "0"; // $("#hdnreadonly").val()
        if ($("#txtOrderNo").val() == "") {
            result1.CategoryID = 0;
            result1.AdtypeID1 = 0;
            result1.AdtypeID2 = 0;
            result1.AdtypeID3 = 0;
            result1.AdtypeID4 = 0;
            result1.StyleSheetID = 0;
        }
        else {
            categoryidvalue = AdtypeId1 + "," + AdtypeId2 + "," + AdtypeId3 + "," + AdtypeId4;;
            result1.CategoryID = AdtypeId1 + "," + AdtypeId2 + "," + AdtypeId3 + "," + AdtypeId4;
            result1.AdtypeID1 = AdtypeId1;
            result1.AdtypeID2 = AdtypeId2;
            result1.AdtypeID3 = AdtypeId3;
            result1.AdtypeID4 = AdtypeId4;
            result1.StyleSheetID = $("#stylesheetid").val();
        }
        result1.Iscd = $("#iscd option:selected").val();
        result1.AgreedDiscPer = $("#txtagreeddiscountper").val();
        result1.AgreedRate = $("#txtagreedrate").val();
        result1.AgreedAmount = $("#txtagreedamount").val();
        result1.ExtraChargesPer = $("#txtextrachargeper").val();
        result1.ExtraChargesAmount = "0";
        result1.ExtraDiscPer = $("#txtextradisper").val();
        result1.ExtraDiscAmount = "0";
        result1.ExtraBoxChargesPer = $("#txtboxchargeper").val();
        result1.ExtraBoxChargesAmount = $("#txtboxchargeamount").val();
        result1.ExtraBoxChargesAmount = $("#txtboxchargeamount").val();
        result1.Status = "0";
        result1.AuditStatus = "0";
        result1.MaterialID = "0";
        result1.StartCol = "0";
        result1.Yposition = "0";
        result1.ItemRateFieldChanged = "0";
        result1.MBodyCount = "";
        result1.U_BodyText = "";
        list.push(result1);
        //if (packagelength == 1 && peidlength > 1) {
        //    for (var i = 1; i < peidlength; i++) {

        if (result.length > 1) {
            for (var i = 1; i < result.length; i++) {

                var url2 = appRoot + "Booking/GetGridData";
                var param_Ist1 = {};
                var result2 = getresult(url1, param_Ist1);
                result2.PackageID = result[1].PackageID;
                result2.PackageName = result[1].PackageName;
                result2.PECode = result[1].PECode;
                result2.PEID = result[1].PEID;
                result2.Date = date;

                if ($('#hdnIsClassified').val() == "1") {
                    result2.InsNum = totaldateselected / selectedPEwithValidDays.length;
                    result2.ScheduledDate = ReturnDate(result[1]); // selectedDateArray[selectedDateArray.length - (result.length - 1)];

                }
                else {
                    if (packagelength == 1 && peidlength == 1) {
                        result2.InsNum = insnum;
                        result2.ScheduledDate = date;
                    }
                    else {
                        result2.InsNum = totaldateselected / selectedPEwithValidDays.length;
                        result2.ScheduledDate = ReturnDate(result[1]);
                    }
                }


                result2.PremiaID = premiaidvalue;
                result2.ColorID = coloridvalue;
                result2.MaterialType = mattypeidvalue;
                result2.AdsizeID = adsizeidvalue;
                if (adsizeidvalue == 0)
                    result2.Adsize = adsizename;
                else
                    result2.Adsize = 0;
                result2.AdSizeHeight = adheightvalue;
                result2.AdSizeWidth = adsizecolvalue;
                result2.BillableSize = $("#billablesize").val().replace(/ /g, '');
                result2.Billableheight = $("#billablesize").val().replace(/ /g, '').split("*")[0];
                result2.Billablewidth = $("#billablesize").val().replace(/ /g, '').split("*")[1];
                result2.ReadOnlyFlag = "0";
                if ($("#txtOrderNo").val() == "") {
                    result2.CategoryID = 0;
                    result2.AdtypeID1 = 0;
                    result2.AdtypeID2 = 0;
                    result2.AdtypeID3 = 0;
                    result2.AdtypeID4 = 0;
                    result2.StyleSheetID = 0;
                }
                else {
                    categoryidvalue = AdtypeId1 + "," + AdtypeId2 + "," + AdtypeId3 + "," + AdtypeId4;;
                    result2.CategoryID = AdtypeId1 + "," + AdtypeId2 + "," + AdtypeId3 + "," + AdtypeId4;
                    result2.AdtypeID1 = AdtypeId1;
                    result2.AdtypeID2 = AdtypeId2;
                    result2.AdtypeID3 = AdtypeId3;
                    result2.AdtypeID4 = AdtypeId4;
                    result2.StyleSheetID = $("#stylesheetid").val();
                }
                result2.Iscd = $("#iscd option:selected").val();

                result2.AgreedDiscPer = $("#txtagreeddiscountper").val();
                result2.AgreedRate = $("#txtagreedrate").val();
                result2.AgreedAmount = $("#txtagreedamount").val();
                result2.ExtraChargesPer = $("#txtextrachargeper").val();
                result2.ExtraChargesAmount = "0";
                result2.ExtraDiscPer = $("#txtextradisper").val();
                result2.ExtraDiscAmount = "0";
                result2.ExtraBoxChargesPer = $("#txtboxchargeper").val();
                result2.ExtraBoxChargesAmount = $("#txtboxchargeamount").val();
                result2.ExtraBoxChargesAmount = $("#txtboxchargeamount").val();
                result2.Status = "0";
                result2.AuditStatus = "0";
                result2.MaterialID = "0";
                result2.StartCol = "0";
                result2.Yposition = "0";
                result2.ItemRateFieldChanged = "0";
                result2.MBodyCount = "";
                result2.U_BodyText = "";
                list.push(result2);

            }
        }

        var premiaid = premianame;
        var colorid = $("#colorid").val();
        var adsizeid = adsizename;
        var billablesize = $("#billablesize").val();
        var txtcaption = $("#txtitemcaption").val();
        var categoryid = $("#categoryid").val();

        var mbodysize = $("#mbodysize").val();
        var mattypeid = $("#mattypeid option:selected").text();
        if ($('#hdnIsClassified').val() == "0")
            var paidvalue = $("#isdisplaypaid option:selected").text();
        else
            var paidvalue = $("#ispaid option:selected").text();
        for (var i = 0; i < result.length; i++) {
            Pecodelist += result[i].PECode + '-';
        }

        for (var k = 0; k < result.length; k++) {
            var newscheduledate = ReturnDate(result[k]);
            listindex = k;
            agreedrate = '';
            agreedamount = '';
            agreeddisamount = '';
            var ReadOnlyFlag = $("#hdnreadonly").val();

            if (totaldateselected == 1) {
                $("#hdnlistindex").val(k);
            }
            if ($('#hdnIsClassified').val() == "1" && peidlength > 1) {
                if (packagelength == 1 && peidlength > 1) {
                    if (totaldateselected == 2) {
                        $("#hdnlistindex").val(k);
                    }
                    else {
                        listindex = parseInt($("#hdnlistindex").val()) + 1;
                        $("#hdnlistindex").val(listindex);
                    }
                }
                else {
                    listindex = parseInt($("#hdnlistindex").val()) + 1;
                    $("#hdnlistindex").val(listindex);
                }
            }
            else {
                listindex = parseInt($("#hdnlistindex").val()) + 1;
                $("#hdnlistindex").val(listindex);
            }

            if ($('#hdnIsClassified').val() == "0") {
                if (packagelength == 1 && peidlength == 1) {
                    strxml += '<tr class="parent" id="singlechild" insNo="' + totaldateselected / selectedPEwithValidDays.length + '" insDt="' + date + '" list-index=' + (totaldateselected - (result.length - k)) + ' name="savegrid" onclick="SelectedGridRow(this)" readonlyflag="0" pkgid="' + result[k].PackageID + '"><td style="display:none;" id="txtvaliddays">' + result[k].ValidDays + '</td><td>&nbsp;&nbsp;</td>'
                        + '<td class="margin_left">' + totaldateselected / selectedPEwithValidDays.length + '</td><td class="margin_left">' + date + '</td><td class="margin_left">' + result[k].PECode + '</td><td class="margin_left"></td>'
                        + '<td class="margin_left">' + agreedrate + '</td><td class="margin_left">' + agreedamount + '</td><td class="margin_left">' + agreeddisamount + '</td>'
                        + '<td class="margin_left">' + colorid + '</td><td class="margin_left">' + premiaid + '</td><td class="margin_left">' + adsizeid + '</td>'
                        + '<td class="margin_left">' + billablesize + '</td><td class="margin_left">' + mattypeid + '</td><td class="margin_left">' + txtcaption + '</td><td class="margin_left" id="txtfreeorpaid">' + paidvalue + '</td><td class="margin_left" id="txtfreeorpaid"></td><td class="margin_left" id="txtfreeorpaid"></td><td class="margin_left"></td></tr>';
                }
                else {
                    strxml += '<tr class="parent" id="singlechild" insNo="' + totaldateselected / selectedPEwithValidDays.length + '" insDt="' + newscheduledate + '" list-index=' + (totaldateselected - (result.length - k)) + ' name="savegrid" onclick="SelectedGridRow(this)" readonlyflag="0" pkgid="' + result[k].PackageID + '"><td style="display:none;" id="txtvaliddays">' + result[k].ValidDays + '</td><td>&nbsp;&nbsp;</td>'
                        + '<td class="margin_left">' + totaldateselected / selectedPEwithValidDays.length + '</td><td class="margin_left">' + newscheduledate + '</td><td class="margin_left">' + result[k].PECode + '</td><td class="margin_left"></td>'
                        + '<td class="margin_left">' + agreedrate + '</td><td class="margin_left">' + agreedamount + '</td><td class="margin_left">' + agreeddisamount + '</td>'
                        + '<td class="margin_left">' + colorid + '</td><td class="margin_left">' + premiaid + '</td><td class="margin_left">' + adsizeid + '</td>'
                        + '<td class="margin_left">' + billablesize + '</td><td class="margin_left">' + mattypeid + '</td><td class="margin_left">' + txtcaption + '</td><td class="margin_left" id="txtfreeorpaid">' + paidvalue + '</td><td class="margin_left" id="txtfreeorpaid"></td><td class="margin_left" id="txtfreeorpaid"></td><td class="margin_left"></td></tr>';
                }
            }
            else {
                if (packagelength == 1 && peidlength == 1) {
                    strxml += '<tr class="parent" id="singlechild" insNo="' + totaldateselected / selectedPEwithValidDays.length + '" insDt="' + newscheduledate + '" list-index=' + (totaldateselected - (result.length - k)) + ' name="savegrid" onclick="SelectedGridRow(this)" readonlyflag="0" pkgid="' + result[k].PackageID + '"><td style="display:none;" id="txtvaliddays">' + result[k].ValidDays + '</td><td>&nbsp;&nbsp;</td>'
                        + '<td class="margin_left">' + totaldateselected / selectedPEwithValidDays.length + '</td><td class="margin_left">' + newscheduledate + '</td><td class="margin_left">' + result[k].PECode + '</td><td class="margin_left"></td>'
                        + '<td class="margin_left">' + agreedrate + '</td><td class="margin_left">' + agreedamount + '</td><td class="margin_left">' + agreeddisamount + '</td>'
                        + '<td class="margin_left">' + mbodysize + '</td><td class="margin_left" id="txtfreeorpaid">Y</td><td class="margin_left" id="txtcategory" style="text-align:left !important;"></td><td class="margin_left"></td><td class="margin_left"></td><td style="display:none;"></td></tr>';
                }
                else {
                    combinedpackage = 1;
                    strxml += '<tr class="parent" id="singlechild" insNo="' + totaldateselected / selectedPEwithValidDays.length + '" insDt="' + newscheduledate + '" list-index=' + (totaldateselected - (result.length - k)) + ' name="savegrid" onclick="SelectedGridRow(this)" readonlyflag="0" pkgid="' + result[k].PackageID + '" gridpeid="' + result[k].PEID + '"><td style="display:none;" id="txtvaliddays">' + result[k].ValidDays + '</td><td>&nbsp;&nbsp;</td>'
                        + '<td class="margin_left">' + totaldateselected / selectedPEwithValidDays.length + '</td><td class="margin_left"><input type="text" class="mydatepicker" value=' + newscheduledate + '></td><td class="margin_left">' + result[k].PECode + '</td><td class="margin_left"></td>'
                        + '<td class="margin_left">' + agreedrate + '</td><td class="margin_left">' + agreedamount + '</td><td class="margin_left">' + agreeddisamount + '</td>'
                        + '<td class="margin_left"></td><td class="margin_left" id="txtfreeorpaid">Y</td><td class="margin_left" id="txtcategory" style="text-align:left !important;"></td><td class="margin_left"></td><td class="margin_left"></td><td style="display:none;"></td></tr>';
                    //  $("#bookingGrid").append(strxml);
                }
            }
        }
        //if (combinedpackage == 0) {
        $("#bookingGrid").append(strxml);
        // }
    }
    if ($('#hdnIsClassified').val() == "1") {
        $("#bookingGrid tr").eq(0).removeClass('orderrowactive');
        $("#bookingGrid tr").eq(0).removeClass('ordergridselected');
        var len = $("#bookingGrid tr").length;
        if (peidlength > 1) {
            if (len < 4) {
                $("#bookingGrid tr").eq(2).click();
            }
            else {
                $("#bookingGrid tr").eq(len - 3).click();
            }
            if ($("#categoryid").val().trim() != "") {
                OpenCategoryDetails();
                //if ($('#hdnIsClassified').val() == "1") {
                //    $("#categoryid").focusout();
                //    $("#stylesheetid").change();
                //    $("#mbodysize").focusout();
                //}
            }
            if ($('#hdnIsClassified').val() == "1") {
                $("#categoryid").focusout();
                $("#stylesheetid").change();
                $("#mbodysize").focusout();
            }
            if (len < 4) {
                $("#bookingGrid tr").eq(1).click();
            }
            else {
                $("#bookingGrid tr").eq(len - 4).click();
            }
            if ($("#categoryid").val().trim() != "") {
                OpenCategoryDetails();
            }
        }
        if (packagelength == 1 && peidlength == 1) {
            if (len < 3) {
                $("#bookingGrid tr").eq(1).click();
            }
            else {
                $("#bookingGrid tr").eq(len - 2).click();
            }
            if ($("#categoryid").val().trim() != "") {
                OpenCategoryDetails();
            }
        }
        if ($('#hdnIsClassified').val() == "1") {
            $("#categoryid").focusout();
            $("#stylesheetid").change();
            $("#mbodysize").focusout();
        }
        $("#bookingGrid tr").eq(1).click();
    }
    setTimeout(function () {
        callInnerBoxHover();
    }, 100);
}


$("#adsizeid").focusout(function () {
    ispefocus = true;
    if ($("#adsizeid").val().trim() != '') {
        if (premiaidvalue == 0) {
            ShowMsg('Please select Premia', $("#premiaid"));
            $("#adsizeid").val('');
            $("#billablesize").val('');
            $("#premiaid").focus();
        }
        else {
            if (adsizeidvalue == "0" && $("#adsizeid").val() != '' && !($("#adsizeid").val().split('*').length == 2 &&
                !isNaN(parseFloat($("#adsizeid").val().split('*')[0])) &&
                !isNaN(parseFloat($("#adsizeid").val().split('*')[1])))) {
                ShowMsg('Please enter valid Ad Size', $("#adsizeid"));
                $("#adsizeid").val('');
                $("#billablesize").val('');
                $("#adsizeid").focus();
            }
            else {
                if ($('.table-ad-detail tr').hasClass('gridselected')) {
                    if (adsizeidvalue == 0)
                        adsizename = $("#adsizeid").val();
                    $('.table-ad-detail tr.gridselected').find('td:eq(11)').text(adsizename);
                    $('.table-ad-detail tr.gridselected').find('td:eq(12)').text($("#billablesize").val());
                    var index = $('.table-ad-detail tr.gridselected').attr('list-index');
                    if (list != null) {
                        if (list.length > index) {
                            list[index].AdsizeID = adsizeidvalue;
                            if (list[index].AdsizeID == "0" && ($("#adsizeid").val().trim() != null || $("#adsizeid").val().trim() != '')) {
                                list[index].AdSize = adsizename;
                                adheightvalue = $("#adsizeid").val().replace(/ /g, '').split("*")[0];
                                adsizecolvalue = $("#adsizeid").val().replace(/ /g, '').split("*")[1];
                                list[index].AdSizeHeight = adheightvalue;
                                list[index].AdSizeWidth = adsizecolvalue;
                            }
                            else {
                                list[index].AdSizeHeight = adheightvalue;
                                list[index].AdSizeWidth = adsizecolvalue;
                            }
                            if (adsizeidvalue == 0)
                                $("#billablesize").val($("#adsizeid").val());
                            else
                                $("#billablesize").val(adheightvalue + "*" + adsizecolvalue);

                            list[index].BillableSize = $("#billablesize").val().replace(/ /g, '');
                            list[index].Billableheight = $("#billablesize").val().replace(/ /g, '').split("*")[0];
                            list[index].Billablewidth = $("#billablesize").val().replace(/ /g, '').split("*")[1];
                            $("#billablesize").focusout()
                        }
                    }
                }
                else {
                    if (adsizeidvalue == 0)
                        adsizename = $("#adsizeid").val();

                    $('.table-ad-detail tr:not(:first-child)').each(function () {
                        if ($(this).attr('readonlyflag') == 0) {
                            $(this).find('td:eq(11)').text(adsizename);
                            $(this).find('td:eq(12)').text($("#billablesize").val());
                            index = $(this).attr('list-index');
                            list[index].AdsizeID = adsizeidvalue;
                            if (list[index].AdsizeID == "0" && ($("#adsizeid").val().trim() != null || $("#adsizeid").val().trim() != '')) {
                                list[index].AdSize = adsizename;
                                adheightvalue = $("#adsizeid").val().replace(/ /g, '').split("*")[0];
                                adsizecolvalue = $("#adsizeid").val().replace(/ /g, '').split("*")[1];
                                list[index].AdSizeHeight = adheightvalue;
                                list[index].AdSizeWidth = adsizecolvalue;
                            }
                            else {
                                list[index].AdSizeHeight = adheightvalue;
                                list[index].AdSizeWidth = adsizecolvalue;
                            }
                            if (adsizeidvalue == 0)
                                $("#billablesize").val($("#adsizeid").val());
                            else
                                $("#billablesize").val(adheightvalue + "*" + adsizecolvalue);

                            list[index].BillableSize = $("#billablesize").val().replace(/ /g, '');
                            list[index].Billableheight = $("#billablesize").val().replace(/ /g, '').split("*")[0];
                            list[index].Billablewidth = $("#billablesize").val().replace(/ /g, '').split("*")[1];
                            $("#billablesize").focusout();
                        }
                    });
                }
                if (adsizeidvalue == "0" && ($("#adsizeid").val().trim() != null || $("#adsizeid").val().trim() != '')) {
                    ValidateManualAdSize();
                }
            }
        }
        IsGetRateClicked = false;
    }
});


$("#billablesize").focusout(function () {
    ispefocus = true;
    if ($("#billablesize").val().trim() != '') {
        if (premiaidvalue == 0) {
            ShowMsg(' Please select Premia', $("#premiaid"));
            $("#billablesize").val('');
            $("#premiaid").focus();
        }
        else {
            if ($("#billablesize").val() != '' && !($("#billablesize").val().split('*').length == 2 &&
                !isNaN(parseFloat($("#billablesize").val().split('*')[0])) &&
                !isNaN(parseFloat($("#billablesize").val().split('*')[1])))) {
                ShowMsg('Please enter valid Ad Size', $("#billablesize"));
                $("#billablesize").val('');
                $("#billablesize").focus();
            }
            else {
                if ($('.table-ad-detail tr').hasClass('gridselected')) {
                    $('.table-ad-detail tr.gridselected').find('td:eq(12)').text($("#billablesize").val());
                    var index = $('.table-ad-detail tr.gridselected').attr('list-index');
                    if (list != null) {
                        if (list.length > index) {
                            list[index].BillableSize = $("#billablesize").val().replace(/ /g, '');
                            list[index].Billableheight = $("#billablesize").val().replace(/ /g, '').split("*")[0];
                            list[index].Billablewidth = $("#billablesize").val().replace(/ /g, '').split("*")[1];
                        }
                    }
                }
                else {

                    $('.table-ad-detail tr:not(:first-child)').each(function () {
                        if ($(this).attr('readonlyflag') == 0) {
                            $(this).find('td:eq(12)').text($("#billablesize").val());
                            index = $(this).attr('list-index');
                            list[index].BillableSize = $("#billablesize").val().replace(/ /g, '');
                            list[index].Billableheight = $("#billablesize").val().replace(/ /g, '').split("*")[0];
                            list[index].Billablewidth = $("#billablesize").val().replace(/ /g, '').split("*")[1];
                        }
                    });
                }

            }
        }
        IsGetRateClicked = false;
    }
});

$("#colorid").focusout(function () {
    ispefocus = true;
    if (coloridvalue == "0" && $("#colorid").val().toLowerCase() != "b & w") {
        $("#colorid").val('');
        colorname = '';
    }
    if ($('.table-ad-detail tr').hasClass('gridselected')) {
        if (coloridvalue == 0)
            colorname = $("#colorid").val();
        $('.table-ad-detail tr.gridselected').find('td:eq(9)').text(colorname);
        var index = $('.table-ad-detail tr.gridselected').attr('list-index');
        if (list != null) {
            if (list.length > index) {
                list[index].ColorID = coloridvalue;
            }
        }
    }
    else {
        if ($("#colorid").val() != "")
            colorname = $("#colorid").val();

        $('.table-ad-detail tr:not(:first-child)').each(function () {
            if ($(this).attr('readonlyflag') == 0) {
                $(this).find('td:eq(9)').text(colorname);
                index = $(this).attr('list-index');
                list[index].ColorID = coloridvalue;
            }
        });
    }
    IsGetRateClicked = false;
});


function ReturnDate(obj) {
    var dt;
    $(selectedPEwithValidDays).each(function () {
        if ($(this)[0] == obj.PEID)
            dt = $(this)[2];
    });
    return dt;
}

function BindRateLevelGrid(result) {
    var strxml = "";
    if (list.length == result.length) {
        for (var l = 0; l < result.length; l++) {
            list[l].AgreedRate = result[l].AgreedRate;
            list[l].AgreedAmount = result[l].AgreedAmount;
            list[l].AgreedDiscPer = result[l].AgreedDiscPer;
            list[l].PremiaID = result[l].PremiaID;
            list[l].ColorID = result[l].ColorID;
            list[l].AdSizeArea = result[l].AdSizeArea;
            list[l].BillableArea = result[l].BillableArea;
            list[l].MaterialType = result[l].MaterialType;
            list[l].MBodyCount = result[l].MBodyCount;
        }
        Originallist = list;
    }

    list = result;
    var selecteddate = new Array();
    selecteddate = selectedDateArray.toString().split(',');
    var totaldateselected = selectedDateArray.length;
    var openselectedpackage = new Array();
    openselectedpackage = $("#packageid").val().toString();
    openpackagelength = $("#packageid").val().toString().split(',').length;
    openpeidlength = selectpeidlist.toString().split(',').length;

    var caption = $("#txtitemcaption").val();
    var materialtype = $("#mattypeid option:selected").text();

    for (var i = 0; i < result.length; i++) {
        var date = result[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/');
        var currentins = result[i].InsNum;
        var insnum = i + 1;
        if (result[i].AdStatus == undefined)
            result[i].AdStatus = "";

        var PackageIDSent;
        if (result[i].PackageIDSent == undefined)
            PackageIDSent = result[i].PackageID;
        else
            PackageIDSent = result[i].PackageIDSent;

        if (result[i].U_BodyText == undefined)
            result[i].U_BodyText = "";
        else
            result[i].U_BodyText = ReplaceBodytext(result[i].U_BodyText);

        if ($('#hdnIsClassified').val() == "0") {
            if (result[i].SizeName == "")
                result[i].SizeName = result[i].Adsize;
            strxml += '<tr class="parent" id="singlechild" insNo="' + (result[i].InsNum) + '" insDt="' + date + '" list-index=' + i + ' name="savegrid" onclick="SelectedSingleGridRow(this)" readonlyflag=' + result[i].ReadOnlyFlag + ' auditstatus=' + result[i].AuditStatus + ' pkgid=' + PackageIDSent + '  ><td style="display:none;" id="txtvaliddays">' + result[i].AdSizeArea + '</td><td>&nbsp;&nbsp;</td>'
                + '<td class="margin_left">' + (result[i].InsNum) + '</td><td class="margin_left">' + date + '</td><td class="margin_left">' + result[i].PECode + '</td><td class="margin_left">' + result[i].AdStatus + '</td>'
                + '<td class="margin_left">' + result[i].AgreedRate.toFixed(2) + '</td><td class="margin_left">' + result[i].AgreedAmount.toFixed(2) + '</td><td class="margin_left">' + result[i].AgreedDiscPer + '</td>'
                + '<td class="margin_left">' + result[i].ColorName + '</td><td class="margin_left">' + result[i].PremiaName + '</td><td class="margin_left">' + result[i].SizeName + '</td>'
                + '<td class="margin_left">' + result[i].BillableSize + '</td><td class="margin_left">' + result[i].MaterialTypeDescription + '</td><td class="margin_left">' + caption + '</td><td class="margin_left" id="txtfreeorpaid">Y</td><td class="margin_left">' + result[i].PremiaRate + '</td><td class="margin_left">' + result[i].ColorRate + '</td><td class="margin_left">' + result[i].BoxNumber + '</td></tr>';

        }
        else {
            if (openpackagelength == 1 && openpeidlength == 1) {
                strxml += '<tr class="parent" id="singlechild" name="savegrid" insNo="' + (result[i].InsNum) + '" insDt="' + date + '" list-index=' + i + ' onclick="SelectedSingleGridRow(this)" readonlyflag=' + result[i].ReadOnlyFlag + ' auditstatus=' + result[i].AuditStatus + '  pkgid=' + PackageIDSent + ' ><td style="display:none;" id="txtvaliddays">' + result[i].AdSizeArea + '</td><td>&nbsp;&nbsp;</td>'
                    + '<td class="margin_left">' + (result[i].InsNum) + '</td><td class="margin_left">' + date + '</td><td class="margin_left">' + result[i].PECode + '</td><td class="margin_left">' + result[i].AdStatus + '</td>'
                    + '<td class="margin_left">' + result[i].AgreedRate.toFixed(2) + '</td><td class="margin_left">' + result[i].AgreedAmount.toFixed(2) + '</td><td class="margin_left">' + result[i].AgreedDiscPer + '</td>'
                    + '<td class="margin_left">' + result[i].MBodyCount + '</td><td class="margin_left" id="txtfreeorpaid">Y</td><td class="margin_left" id="txtfreeorpaid" style="text-align:left !important;">' + result[i].AdClassification + '</td><td class="margin_left">' + result[i].BoxNumber + '</td><td class="margin_left">' + result[i].StyleSheetID + '</td><td style="display:none;">' + result[i].U_BodyText + '</td></tr>';
            }
            else {
                combinedpackage = 1;
                strxml += '<tr class="parent" id="singlechild" name="savegrid" insNo="' + (result[i].InsNum) + '" insDt="' + date + '" list-index=' + i + ' onclick="SelectedSingleGridRow(this)" readonlyflag=' + result[i].ReadOnlyFlag + ' auditstatus=' + result[i].AuditStatus + '  pkgid=' + PackageIDSent + ' gridpeid=' + result[i].PEID + ' ><td style="display:none;" id="txtvaliddays">' + result[i].AdSizeArea + '</td><td>&nbsp;&nbsp;</td>'
                    + '<td class="margin_left">' + (result[i].InsNum) + '</td><td class="margin_left"><input type="text" class="mydatepicker" value=' + date + '></td><td class="margin_left">' + result[i].PECode + '</td><td class="margin_left">' + result[i].AdStatus + '</td>'
                    + '<td class="margin_left">' + result[i].AgreedRate.toFixed(2) + '</td><td class="margin_left">' + result[i].AgreedAmount.toFixed(2) + '</td><td class="margin_left">' + result[i].AgreedDiscPer + '</td>'
                    + '<td class="margin_left">' + result[i].MBodyCount + '</td><td class="margin_left" id="txtfreeorpaid">Y</td><td class="margin_left" id="txtfreeorpaid" style="text-align:left !important;">' + result[i].AdClassification + '</td><td class="margin_left">' + result[i].BoxNumber + '</td><td class="margin_left">' + result[i].StyleSheetID + '</td><td style="display:none;">' + result[i].U_BodyText + '</td></tr>';
            }
        }
    }
    $("#bookingGrid").append(strxml);
    $("#OrderInsNum").html(result[result.length - 1].InsNum);
    $("#ins").val(result[result.length - 1].InsNum);
    setTimeout(function () {
        if ($('#hdnIsClassified').val() == "1")
            $("#singlechild").find("td:eq(1)").click();
    }, 100);
}

function ReplaceBodytext(bodytext) {
    var result = bodytext;
    result = result.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#39;');
    return result;
}

$("#mattypeid").change(function () {
    if ($('.table-ad-detail tr').hasClass('gridselected')) {
        $('.table-ad-detail tr.gridselected').find('td:eq(13)').text($("#mattypeid option:selected").text());
        var index = $('.table-ad-detail tr.gridselected').attr('list-index');
        if (list != null) {
            if (list.length > index) {
                list[index].MaterialType = $("#mattypeid").val();
                mattypeidvalue = $("#mattypeid").val();
            }
        }
    }
    else {

        $('.table-ad-detail tr:not(:first-child)').each(function () {
            if ($(this).attr('readonlyflag') == 0) {
                $(this).find('td:eq(13)').text($("#mattypeid option:selected").text());
                index = $(this).attr('list-index');
                list[index].MaterialType = $("#mattypeid").val();
                mattypeidvalue = $("#mattypeid").val();
            }
        });
    }
});

function IsVatPerCheck() {
    if ($("#isVatPer").prop("checked") == true) {
        $("#hdnIsVatPer").val(1);
        $("#txtvatper").removeAttr("disabled");
    }
    else {
        $("#hdnIsVatPer").val(0);
        $("#txtvatper").attr("disabled", "disabled");
    }
    IsGetRateClicked = false;
}


function GetBookingRate() {
    if ($("#txtOrderNo").val().trim() == null || $("#txtOrderNo").val().trim() == 0 || $("#txtOrderNo").val().trim() == '') {
        CleararrayList();
    }
    var result;
    // BindBoxChargesControl();
    if ($('#hdnIsClassified').val() == "0") {
        result = GetDisplayRate();
    }
    else {
        result = GetClassifiedRate();
    }
    return result;
}


function GetDisplayRate() {
    CardRatelist = [];
    CardAmountlist = [];
    AgreedRatelist = [];
    AgreedAmountlist = [];
    AgreedDiscPerlist = [];
    AgreedDiscAmountlist = [];
    qStr = window.location.href.split('#')[0];
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    if (userid === null || userid === '' || centerid === null || centerid === '') {
        ShowMsg("Login user Logged Out.. Please login");
        return false;
    }
    var selecteddate = new Array();
    selecteddate = selectedDateArray.toString();
    var totalOrder = selectedDateArray.toString().split(',').length;
    if (selecteddate == '' || selecteddate == null) {
        ShowMsg("Please select insertion(s) Date");
        return false;
    }
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/GetDisplayRateData";
    param.UserId = userid;
    param.UserType = $('#hdnUserType').val();
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    param.BookingDate = $('#hdnbookingdate').val();
    param.AgencyID = agencyidvalue;
    param.ClientID = clientidvalue;
    param.PaymentTypeID = $('#hdnIsPaymentType').val();
    param.IsManualBilling = $('#hdnIsManualBill').val();
    if ($('#hdnIsCustomerType').val() == 2) {
        param.ClientName = $('#clientid').val();
        param.ClientVatNum = $('#txtclientvatnum').val();
    }
    else {
        param.ClientName = '';
        param.ClientVatNum = '';
    }
    var selectstatus = new Array();
    selectstatus = Statuslist.toString();
    param.Status = selectstatus;
    if (param.Status == undefined || param.Status == "" || param.Status == null)
        param.Status = 0;

    var selectauditstatus = new Array();
    selectauditstatus = AuditStatuslist.toString();
    param.AuditStatus = selectauditstatus;
    if (param.AuditStatus == undefined || param.AuditStatus == "" || param.AuditStatus == null)
        param.AuditStatus = 0;

    param.CanvassorID = canvassoridvalue;
    param.PublicationId = "0";
    $("#packageid").val(selectedcyopPE[0]);
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    var selectedpe = new Array();
    selectedpe = pelist.toString();
    param.PEID = selectedpe;
    param.BoxTypeID = $('#boxtypeid').val();
    if ($("#txtOrderNo").val().trim() == null || $("#txtOrderNo").val().trim() == 0 || $("#txtOrderNo").val().trim() == '') {
        param.ROID = "0";
    }
    else
        param.ROID = $("#txtOrderNo").val();
    param.ProductID = $("#productid").val();
    param.RONumber = $("#txtronumber").val();
    param.RevenueCentreID = centerid;
    param.BookingCentreID = centerid;
    param.AdtypeId = $("#adtypeid").val();
    param.UOMID = $("#uomid").val();
    if (param.UOMID == null || param.UOMID == '') {
        ShowMsg("Please select UOM", $("#uomid"));
        $("#uomid").focus();
        return false;
    }
    param.DateSelected = selecteddate;
    param.TotalOrders = totalOrder;

    param.Premiaid = premiaidvalue;
    if ($("#premiaid").val().trim() == null || $("#premiaid").val().trim() == '') {
        ShowMsg("Please select Premia", $("#premiaid"));
        $("#premiaid").focus();
        return false;
    }

    param.Colorid = coloridvalue;
    if ($("#colorid").val().trim() == null || $("#colorid").val().trim() == '') {
        ShowMsg("Please select Color", $("#colorid"));
        $("#colorid").focus();
        return false;
    }

    param.Adsizeid = adsizeidvalue;
    param.AdsizeHeight = adheightvalue;
    param.AdsizeWidth = adsizecolvalue;
    if ($("#adsizeid").val().trim() == null || $("#adsizeid").val().trim() == '') {
        ShowMsg("Please select Ad Size", $("#adsizeid"));
        $("#adsizeid").focus();
        return false;
    }
    if (param.Adsizeid == "0" && ($("#adsizeid").val().trim() != null || $("#adsizeid").val().trim() != '')) {
        if ($("#adsizeid").val().replace(/ /g, '').split("*")[1] == undefined) {
            param.Adsize = adheightvalue + "*" + adsizecolvalue;
        }
        else {
            param.Adsize = $("#adsizeid").val().replace(/ /g, '');
            param.AdsizeHeight = $("#adsizeid").val().replace(/ /g, '').split("*")[0];
            param.AdsizeWidth = $("#adsizeid").val().replace(/ /g, '').split("*")[1];
        }
    }
    param.Billablesize = $("#billablesize").val().replace(/ /g, '');
    param.BillableHeight = $("#billablesize").val().replace(/ /g, '').split("*")[0];
    param.BillableWidth = $("#billablesize").val().replace(/ /g, '').split("*")[1];

    BindBoxChargesControl();

    param.RateCardID = $("#ratecardid").val();
    if (param.RateCardID == "" || param.RateCardID == null) {
        param.RateCardID = "0";
    }
    param.AdRateID = "0";
    param.CardRate = "0";
    param.CardAmount = "0";
    param.PreVATAmount = "0";
    param.Receivable = "0";
    param.VATPer = "0";
    param.VATAmount = "0";
    param.Addfiles = "0";
    param.UserMailID = "0";
    param.UserName = "0";
    param.UserMobile = "0";
    param.OrderNumber = "0";
    param.UniqueCode = "0";
    param.AdCartId = "0";
    param.RateFieldChanged = $("#hdnratefieldchanged").val();
    param.ItemRateFieldChanged = $("#hdnitemratefieldchanged").val();
    if (param.RateFieldChanged == "0") {
        param.AgreedRate = "0";
        param.AgreedAmount = "0";
        param.AgreedDiscPer = "0";
    }
    else {
        if ($("#txtagreedrate").val() == null || $("#txtagreedrate").val() == "" || $("#hdnagreedrate").val() == 0)
            param.AgreedRate = "0";
        else
            param.AgreedRate = $("#txtagreedrate").val();
        if ($("#txtagreedamount").val() == null || $("#txtagreedamount").val() == "")
            param.AgreedAmount = "0";
        else {
            if ($("#hdnagreedamount").val() == 0 && ($("#hdnratefieldchanged").val() == 2 || $("#hdnagreedratefieldchanged").val() == 2)) {
                param.AgreedAmount = $("#hdnagreedamountvalue").val();

            }
            else {
                param.AgreedAmount = $("#txtagreedamount").val();
                $("#hdnagreedamountvalue").val($("#txtagreedamount").val());
            }
        }
        if ($("#txtagreeddiscountper").val() == null || $("#txtagreeddiscountper").val() == "")
            param.AgreedDiscPer = "0";
        else
            param.AgreedDiscPer = $("#txtagreeddiscountper").val();
    }
    if ($("#txtagreeddiscountamount").val() == null || $("#txtagreeddiscountamount").val() == "")
        param.AgreedDiscAmount = "0";
    else
        param.AgreedDiscAmount = $("#txtagreeddiscountamount").val();

    if ($("#txtextrachargeper").val() == null || $("#txtextrachargeper").val() == "")
        param.ExtraChargesPer = "0";
    else
        param.ExtraChargesPer = $("#txtextrachargeper").val();

    if ($("#txtextrachargeamount").val() == null || $("#txtextrachargeamount").val() == "")
        param.ExtraChargesAmount = "0";
    else
        param.ExtraChargesAmount = $("#txtextrachargeamount").val();

    if ($("#txtextradisper").val() == null || $("#txtextradisper").val() == "")
        param.ExtraDiscPer = "0";
    else
        param.ExtraDiscPer = $("#txtextradisper").val();

    if ($("#txtextradisamount").val() == null || $("#txtextradisamount").val() == "")
        param.ExtraDiscAmount = "0";
    else
        param.ExtraDiscAmount = $("#txtextradisamount").val();



    if ($("#txtboxchargeper").val() == null || $("#txtboxchargeper").val() == "")
        param.ExtraBoxChargesPer = "0";
    else
        param.ExtraBoxChargesPer = $("#txtboxchargeper").val();
    if ($("#txtboxchargeamount").val() == null || $("#txtboxchargeamount").val() == "")
        param.ExtraBoxChargesAmount = "0";
    else
        param.ExtraBoxChargesAmount = $("#txtboxchargeamount").val();

    if ($("#txtextrachargeper").val() > 0) {
        for (var i = 0; i < list.length; i++) {
            list[i].ExtraChargesPer = $("#txtextrachargeper").val();
            list[i].ExtraChargesAmount = 0;
        }
    }
    else {
        for (var i = 0; i < list.length; i++) {
            list[i].ExtraChargesPer = 0;
            list[i].ExtraChargesAmount = $("#txtextrachargeamount").val();
        }
    }


    if ($("#txtextradisper").val() > 0) {
        for (var i = 0; i < list.length; i++) {
            list[i].ExtraDiscPer = $("#txtextradisper").val();
            list[i].ExtraDiscAmount = 0;
        }
    }
    else {
        for (var i = 0; i < list.length; i++) {
            list[i].ExtraDiscPer = 0;
            list[i].ExtraDiscAmount = $("#txtextradisamount").val();
        }
    }

    if ($("#hdnratefieldchanged").val() == 1) {
        for (var i = 0; i < list.length; i++) {
            list[i].AgreedRate = $("#txtagreedrate").val();
            list[i].AgreedAmount = '';
            list[i].AgreedDiscPer = '';
        }
    }
    else if ($("#hdnratefieldchanged").val() == 2) {
        for (var i = 0; i < list.length; i++) {
            list[i].AgreedRate = '';
            list[i].AgreedAmount = $("#txtagreedamount").val();
            list[i].AgreedDiscPer = '';
        }
    }
    else if ($("#hdnratefieldchanged").val() == 3) {
        for (var i = 0; i < list.length; i++) {
            list[i].AgreedRate = '';
            list[i].AgreedAmount = '';
            list[i].AgreedDiscPer = $("#txtagreeddiscountper").val();
        }

    }

    param.list = list;
    param.IsVatChange = $("#hdnIsVatPer").val();
    param.ModifyVatPer = $("#txtvatper").val();

    $('#divProcessingBox').dialog('open');
    var result = getresult(url, param);
    $('#divProcessingBox').dialog('close');
    result = jQuery.parseJSON(result);
    if (result.length == 0) {
        ShowMsg("Rate not found");
        return false;
    }
    var CardRate = 0;
    var NewCardRate = 0;
    var AgreedDiscAmount = 0;
    var CardAmount = 0;
    var AgreedAmount = 0;
    var ExtraChargesAmount = 0;
    var ExtraDiscAmount = 0;
    var ExtraBoxChargesAmount = 0;
    var AgencyCommissionAmount = 0;
    var PreVATAmount = 0;
    var VATAmount = 0;
    var Receivable = 0;
    var NetReceivable = 0;
    var agreeddiscountper = "";
    var agreedrate = "";
    if (result.length > 0 && result[0].IsValid == 0) {

        var url1 = appRoot + "Booking/GetGridData";
        var param_Ist = {};
        var result1 = getresult(url1, param_Ist);



        for (var i = 0; i < result.length; i++) {
            CardRate = CardRate + result[i].CardRate;

            var insnum = result[0].InsNum; // 1
            if (insnum == result[i].InsNum) {
                NewCardRate = NewCardRate + result[i].CardRate;
                $("#txtcardrate").val(NewCardRate);
            }

            agreeddiscountper = result[0].AgreedDiscPer;
            if ((result[i].AgreedDiscPer == agreeddiscountper) && (agreeddiscountper != '***')) {
                $("#txtagreeddiscountper").val(result[i].AgreedDiscPer);
            }
            else {
                $("#txtagreeddiscountper").val('***');
            }
            AgreedDiscAmount = AgreedDiscAmount + result[i].AgreedDiscAmount;
            $("#txtagreeddiscountamount").val(AgreedDiscAmount);
            CardAmount = CardAmount + result[i].CardAmount;
            $("#txtcardamount").val(CardAmount);
            AgreedAmount = AgreedAmount + result[i].AgreedAmount;
            $("#txtagreedamount").val(AgreedAmount.toFixed(2));
            $("#txtextrachargeper").val(result[i].ExtraChargesPer);
            ExtraChargesAmount = ExtraChargesAmount + result[i].ExtraChargesAmount;
            $("#txtextrachargeamount").val(ExtraChargesAmount.toFixed(2));
            $("#txtextradisper").val(result[i].ExtraDiscPer);
            ExtraDiscAmount = ExtraDiscAmount + result[i].ExtraDiscAmount;
            $("#txtextradisamount").val(ExtraDiscAmount.toFixed(2));
            $("#txtboxchargeper").val(result[i].ExtraBoxChargesPer);
            ExtraBoxChargesAmount = result[0].ExtraBoxChargesAmount;
            $("#txtboxchargeamount").val(ExtraBoxChargesAmount);
            $("#txtcommisionper").val(result[i].AgencyCommissionPer);
            AgencyCommissionAmount = AgencyCommissionAmount + result[i].AgencyCommissionAmount;
            $("#txtcommisionamount").val(AgencyCommissionAmount);
            PreVATAmount = PreVATAmount + result[i].PreVATAmount;
            $("#txtprevatamount").val(PreVATAmount);
            $("#txtvatper").val(result[i].VATPer);
            VATAmount = VATAmount + result[i].VATAmount;
            $("#txtvatamount").val(VATAmount);
            Receivable = Receivable + result[i].Receivable;
            NetReceivable = NetReceivable + result[i].NetReceivable;
            var spilitreceivable = parseFloat(0 + "." + parseInt(Receivable.toString().split(".")[1]));
            if (selectedDateArray.length == 1) {
                if (spilitreceivable >= .50) {
                    $("#txtrecevible").val(parseFloat(Math.round(Receivable)).toFixed(2));
                    if ($("#NetReceivableForReceipt").val() != $("#txtrecevible").val()) {
                        ValidateReceiptDetails(result[0].ReceiptPayTypeID);
                        if ($("#hdnchkdiffer").val() == 0) {
                            $("#txtamount").val(parseFloat(Math.round(Receivable)).toFixed(2));
                            $("#NetReceivableForReceipt").val(parseFloat(Math.round(Receivable)).toFixed(2));
                        }
                    }
                    $("#txtrecevible").html(parseFloat(Math.round(Receivable)).toFixed(2));
                }
                else {
                    $("#txtrecevible").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                    if ($("#NetReceivableForReceipt").val() != $("#txtrecevible").val()) {
                        ValidateReceiptDetails(result[0].ReceiptPayTypeID);
                        if ($("#hdnchkdiffer").val() == 0) {
                            $("#txtamount").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                            $("#NetReceivableForReceipt").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                        }
                    }
                    $("#txtrecevible").html(parseFloat(Math.floor(Receivable)).toFixed(2));
                }
            }
            $("#txtnetamount").html(NetReceivable);
            $("#txtratecardid").val(result[i].RateCardID);
            $("#txtadrateid").val(result[i].AdRateID);
            agreedrate = result[0].AgreedRate;
            if ((result[i].AgreedRate == agreedrate) && (agreedrate != '***')) {
                $("#txtagreedrate").val(result[i].AgreedRate.toFixed(2));
            }
            else {
                $("#txtagreedrate").val('***');
            }
            $("#txtadsizewidth").val(result[i].AdSizeWidth);
            $("#txtadsizeheight").val(result[i].AdSizeHeight);

            AdtypeIdlist.push(result[i].AdTypeID);
            Adsizeidlist.push(result[i].AdsizeID);
            result1.AdsizeID = result[i].AdsizeID;

            AdsizeHeightlist.push(result[i].AdSizeHeight);
            result1.AdSizeHeight = result[i].AdSizeHeight;

            AdsizeWidthlist.push(result[i].AdSizeWidth);
            result1.AdSizeWidth = result[i].AdSizeWidth;


            result1.BillableSize = result[i].BillableSize;
            result1.Billableheight = result[i].BillableSize.split("*")[0];
            result1.Billablewidth = result[i].BillableSize.split("*")[1];

            list.push(result1);

            Premiaidlist.push(result[i].PremiaID);
            Coloridlist.push(result[i].ColorID);
            CardRatelist.push(result[i].CardRate);
            CardAmountlist.push(result[i].CardAmount);
            RateCardIDlist.push(result[i].RateCardID);
            AdRateIDlist.push(result[i].AdRateID);
            AgreedRatelist.push(result[i].AgreedRate);
            AgreedAmountlist.push(result[i].AgreedAmount);
            AgreedDiscPerlist.push(result[i].AgreedDiscPer);
            AgreedDiscAmountlist.push(result[i].AgreedDiscAmount);
            PreVATAmountlist.push(result[i].PreVATAmount);
            VATPerlist.push(result[i].VATPer);
            VATAmountlist.push(result[i].VATAmount);
            AgencyCommissionPerlist.push(result[i].AgencyCommissionPer);
            AgencyCommissionAmountlist.push(result[i].AgencyCommissionAmount);
            SchemeIDlist.push(result[i].SchemeID);
            SchemeDetailIDlist.push(result[i].SchemeDetailID);
            ExtraChargesPerlist.push(result[i].ExtraChargesPer);
            ExtraChargesAmountlist.push(result[i].ExtraChargesAmount);
            ExtraDiscPerlist.push(result[i].ExtraDiscPer);
            ExtraDiscAmountlist.push(result[i].ExtraDiscAmount);
            ExtraBoxChargesPerlist.push(result[i].ExtraBoxChargesPer);
            ExtraBoxChargesAmountlist.push(result[i].ExtraBoxChargesAmount);
            Receivablelist.push(result[i].Receivable);
            MaterialTypelist.push(result[i].MaterialType);
            MaterialSourcelist.push(result[i].MaterialSource);
            UOMIDlist.push(result[i].UOM);
            Statuslist.push(result[i].Status);
            AuditStatuslist.push(result[i].AuditStatus);
            ColumnSizelist.push(result[i].ColumnSize);
            Gutterlist.push(result[i].Gutter);

            $("#txtcardamount").html(CardAmount.toFixed(2));
            $("#txtagreeddiscountamount").html(AgreedDiscAmount.toFixed(2));
            $("#txtboxchargeper").html(result[i].ExtraBoxChargesPer + "%");
            $("#txtboxchargeamount").html(ExtraBoxChargesAmount.toFixed(2));
            $("#txtcommisionper").html(result[i].AgencyCommissionPer + "%");
            $("#txtcommisionamount").html(AgencyCommissionAmount.toFixed(2));
            $("#txtprevatamount").html(PreVATAmount.toFixed(2));
            //$("#txtvatper").html(result[i].VATPer + "%");
            $("#txtvatamount").html(VATAmount.toFixed(2));
            $("#txtnetamount").html(NetReceivable.toFixed(2));
            $("#txtratecardid").html(result[i].RateCardID);
            $("#txtadrateid").html(result[i].AdRateID);
            $("#txtadsizewidth").html(result[i].AdSizeWidth);
            $("#txtadsizeheight").html(result[i].AdSizeHeight);
            $("#hdnschemeid").val(result[0].SchemeID);
            $("#hdnschemedetailid").val(result[0].SchemeDetailID);

        }
        if (selectedDateArray.length > 1) {
            if (spilitreceivable >= .50) {
                $("#txtrecevible").val(parseFloat(Math.round(Receivable)).toFixed(2));
                if ($("#NetReceivableForReceipt").val() != $("#txtrecevible").val()) {
                    ValidateReceiptDetails(result[0].ReceiptPayTypeID);
                    if ($("#hdnchkdiffer").val() == 0) {
                        $("#txtamount").val(parseFloat(Math.round(Receivable)).toFixed(2));
                        $("#NetReceivableForReceipt").val(parseFloat(Math.round(Receivable)).toFixed(2));
                    }
                }
                $("#txtrecevible").html(parseFloat(Math.round(Receivable)).toFixed(2));
            }
            else {
                $("#txtrecevible").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                if ($("#NetReceivableForReceipt").val() != $("#txtrecevible").val()) {
                    ValidateReceiptDetails(result[0].ReceiptPayTypeID);
                    if ($("#hdnchkdiffer").val() == 0) {
                        $("#txtamount").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                        $("#NetReceivableForReceipt").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                    }
                }
                $("#txtrecevible").html(parseFloat(Math.floor(Receivable)).toFixed(2));
            }
        }
        BoxTypeIDlist.push($('#boxtypeid').val());
        $('#bookingGrid tr:not(:first-child)').remove();
        ParentOrderRate();
        $("#txtcardrate").html(NewCardRate.toFixed(2));
        BindRateLevelGrid(result);
        IsGetRateClicked = true;
        Clearhiddenratevalue();
        $("#tblreceipt").css('pointer-events', '');
        RateChangeFlagColor();
        $("#dsitemagrate").val('');
        $("#dsitemagdisc").val('');
        $("#dsitemagamount").val('');
        $("#dsitemagdisc").prop("disabled", "disabled");
        $("#bookingGrid tr").eq(0).removeClass('orderrowactive');
        $("#bookingGrid tr").eq(0).removeClass('ordergridselected');
        return true;
    }
    else if (result[0].IsValid == 1) {
        ShowMsg(result[0].ErrorMessage);
        cleartabletdvalue();
        $('.column-right table tr td input[type="text"]').val('');
        $('.column-right table tr td select').val('');
        $("#receiptfield2").prop("disabled", false);
        $("#receiptfield3").prop("disabled", false);
        $("#receiptfield2").css('pointer-events', '');
        $("#receiptfield3").css('pointer-events', '');
        $('input[type="text"]').removeClass('RateColor');
        $("#hdnratefieldchanged").val(0);
        $("#hdnitemratefieldchanged").val(0);
        $("#dsitemagrate").val('');
        $("#dsitemagdisc").val('');
        $("#dsitemagamount").val('');
        $("#dsitemagdisc").prop("disabled", "disabled");
        $("#bookingGrid tr").eq(0).removeClass('orderrowactive');
        $("#bookingGrid tr").eq(0).removeClass('ordergridselected');
        return false;
    }
    else {
        ShowMsg(result[0].ErrorMessage);
        UserLogOut();
    }
}

function ValidateReceiptDetails(ReceiptPayTypeID) {
    if ($("#hdnchkdiffer").val() == 0) {
        $("#tblreceipt").css('pointer-events', '');
        $("#receiptfield2").css('pointer-events', 'none');
        $("#receiptfield3").css('pointer-events', 'none');
        $("#receiptfield2").prop("disabled", true);
        $("#receiptfield3").prop("disabled", true);
        $("#receiptfield1 input").val('');
        $("#receiptfield1 select").val(0);
        $("#receiptfield2 input").val('');
        $("#receiptfield2 select").val(0);
        $("#receiptfield3 input").val('');
        $("#receiptfield3 select").val(0);
        $('#txtpaymentmodeid').val(ReceiptPayTypeID);
        $("#txtpaymentmodeid").change();
    }
    else {
        $("#tablereceiptdetails").find("input,select").val('');
        $("#tblreceipt").find("input,button,select").attr("disabled", "disabled");
        $("#chkdiffer").removeAttr("disabled");
        $("#NetReceivableForReceipt").val('');
    }
}

function GetClassifiedRate() {
    qStr = window.location.href.split('#')[0];
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    if (userid === null || userid === '' || centerid === null || centerid === '') {
        ShowMsg("Login user Logged Out.. Please login");
        return false;
    }
    var selecteddate = new Array();
    selecteddate = selectedDateArray.toString();
    var totalOrder = selectedDateArray.toString().split(',').length;
    if (selecteddate == '' || selecteddate == null) {
        ShowMsg("Please select insertion(s) Date");
        return false;
    }
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/GetClassifiedRateData";
    param.UserId = userid;
    param.UserType = $('#hdnUserType').val();
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    param.BookingDate = $('#hdnbookingdate').val();
    param.AgencyID = agencyidvalue;
    param.ClientID = clientidvalue;
    param.PaymentTypeID = $('#hdnIsPaymentType').val();
    param.IsManualBilling = $('#hdnIsManualBill').val();
    if ($('#hdnIsCustomerType').val() == 2) {
        param.ClientName = $('#clientid').val();
        param.ClientVatNum = $('#txtclientvatnum').val();
    }
    else {
        param.ClientName = '';
        param.ClientVatNum = '';
    }

    var selectstatus = new Array();
    selectstatus = Statuslist.toString();
    param.Status = selectstatus;
    if (param.Status == undefined || param.Status == "" || param.Status == null)
        param.Status = 0;

    var selectauditstatus = new Array();
    selectauditstatus = AuditStatuslist.toString();
    param.AuditStatus = selectauditstatus;
    if (param.AuditStatus == undefined || param.AuditStatus == "" || param.AuditStatus == null)
        param.AuditStatus = 0;

    param.CanvassorID = canvassoridvalue;
    param.PublicationId = "0";
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    var selectedpe = new Array();
    selectedpe = pelist.toString();
    param.PEID = selectedpe;
    param.BoxTypeID = $('#boxtypeid').val();
    if ($("#txtOrderNo").val().trim() == null || $("#txtOrderNo").val().trim() == 0 || $("#txtOrderNo").val().trim() == '') {
        param.ROID = "0";
    }
    else
        param.ROID = $("#txtOrderNo").val();
    if ($("#categoryid").val().trim() == null || $("#categoryid").val().trim() == '') {
        ShowMsg("Please select Ad classification", $("#categoryid"));
        $("#categoryid").focus();
        return false;
    }
    param.DateSelected = selecteddate;
    param.TotalOrders = totalOrder;
    param.ProductID = $("#productid").val();
    param.RONumber = $("#txtronumber").val();
    param.RevenueCentreID = centerid;
    param.BookingCentreID = centerid;
    param.UOMID = $("#uomid").val();
    param.AdtypeId = $("#adtypeid").val();
    param.AdtypeId1 = AdtypeId1;
    param.AdtypeId2 = AdtypeId2;
    param.AdtypeId3 = AdtypeId3;
    param.AdtypeId4 = AdtypeId4;
    param.IsCD = $('#iscd').val();
    param.IsLogo = $("#islogo").val();
    param.ClassifiedCol = $('#txtcol').val();
    param.StyleSheetID = $("#stylesheetid").val();
    if (param.StyleSheetID == 0 || param.StyleSheetID == null) {
        ShowMsg("Please select StyleSheet", $("#stylesheetid"));
        $("#stylesheetid").focus();
        return false;
    }

    // old code
    //if ($("#iscd").val() == "0") {
    //    if ($("#adtext").val() == "" || $("#adtext").val() == null) {
    //        param.TotalWords = "0";
    //        param.MBodyCount = $("#mbodysize").val();
    //        param.CharCount = "0";
    //    }
    //    else {
    //        param.TotalWords = $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length;
    //        if ($("#mbodysize").val() == "") {
    //            param.MBodyCount = $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length;
    //            $("#mbodysize").val(param.MBodyCount);
    //        }
    //        else {
    //            param.MBodyCount = $("#mbodysize").val();
    //        }
    //        param.CharCount = $("#adtext").val().length;
    //    }
    //    param.MBodyChange = $("#hdnmbodychange").val();
    //    param.AdsizeHeight = param.MBodyCount;

    //    if (param.MBodyCount == null || param.MBodyCount == '' || param.MBodyCount < 1) {
    //        ShowMsg("Please enter no. of words", $("#mbodysize"));
    //        $("#mbodysize").focus();
    //        return false;
    //    }
    //    if ($("#islogo").val() == "1") {
    //        if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
    //            ShowMsg("Please enter valid Height", $("#txtheight"));
    //            $("#txtheight").focus();
    //            return false;
    //        }
    //        else {
    //            param.LogoHeight = $("#txtheight").val();
    //        }
    //    }
    //}
    //else {
    //    if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
    //        ShowMsg("Please enter valid Height", $("#txtheight"));
    //        $("#txtheight").focus();
    //        return false;
    //    }
    //    else {
    //        param.MBodyCount = "0";
    //        param.LogoHeight = "0";
    //        param.TotalWords = "0";
    //        param.AdsizeHeight = $("#txtheight").val();
    //        param.CharCount = "0";
    //    }
    //}

    // new code
    if ($("#iscd").val() == "0") {
        if ($("#adtext").val() == "" || $("#adtext").val() == null) {
            param.TotalWords = "0";
            param.MBodyCount = $("#mbodysize").val();
            param.CharCount = "0";
            param.AdsizeHeight = param.MBodyCount;
            if (param.MBodyCount < 1) {
                ShowMsg("Please enter no. of words", $("#mbodysize"));
                $("#mbodysize").focus();
                return false;
            }
        }
        else {
            param.TotalWords = $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length;
            param.MBodyCount = "0";
            param.CharCount = $("#adtext").val().length;
            param.AdsizeHeight = param.TotalWords;

        }
        param.MBodyChange = $("#hdnmbodychange").val();

        if (param.MBodyCount == null || param.MBodyCount == '') {
            ShowMsg("Please enter no. of words", $("#mbodysize"));
            $("#mbodysize").focus();
            return false;
        }
        if ($("#islogo").val() == "1") {
            if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
                ShowMsg("Please enter valid Height", $("#txtheight"));
                $("#txtheight").focus();
                return false;
            }
            else {
                param.LogoHeight = $("#txtheight").val();
            }
        }
    }
    else {
        if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
            ShowMsg("Please enter valid Height", $("#txtheight"));
            $("#txtheight").focus();
            return false;
        }
        else {
            param.MBodyCount = "0";
            param.LogoHeight = "0";
            param.TotalWords = "0";
            param.AdsizeHeight = $("#txtheight").val();
            param.CharCount = "0";
        }
    }


    BindBoxChargesControl();

    param.AdsizeWidth = 1;
    param.RateCardID = $("#ratecardid").val();
    if (param.RateCardID == "" || param.RateCardID == null) {
        param.RateCardID = "0";
    }
    param.AdRateID = "0";
    param.CardRate = "0";
    param.CardAmount = "0";
    param.PreVATAmount = "0";
    param.Receivable = "0";
    param.VATPer = "0";
    param.VATAmount = "0";
    param.Addfiles = "0";
    param.UserMailID = "0";
    param.UserName = "0";
    param.UserMobile = "0";
    param.OrderNumber = "0";
    param.UniqueCode = "0";
    param.AdCartId = "0";
    param.RateFieldChanged = $("#hdnratefieldchanged").val();
    if (param.RateFieldChanged == "0") {
        param.AgreedRate = "0";
        param.AgreedAmount = "0";
        param.AgreedDiscPer = "0";
    }
    else {
        if ($("#txtagreedrate").val() == null || $("#txtagreedrate").val() == "" || $("#hdnagreedrate").val() == 0)
            param.AgreedRate = "0";
        else
            param.AgreedRate = $("#txtagreedrate").val();
        if ($("#txtagreedamount").val() == null || $("#txtagreedamount").val() == "")
            param.AgreedAmount = "0";
        else {
            if ($("#hdnagreedamount").val() == 0 && ($("#hdnratefieldchanged").val() == 2 || $("#hdnagreedratefieldchanged").val() == 2)) {
                param.AgreedAmount = $("#hdnagreedamountvalue").val();

            }
            else {
                param.AgreedAmount = $("#txtagreedamount").val();
                $("#hdnagreedamountvalue").val($("#txtagreedamount").val());
            }
        }
        if ($("#txtagreeddiscountper").val() == null || $("#txtagreeddiscountper").val() == "")
            param.AgreedDiscPer = "0";
        else
            param.AgreedDiscPer = $("#txtagreeddiscountper").val();
    }
    if ($("#txtagreeddiscountamount").val() == null || $("#txtagreeddiscountamount").val() == "")
        param.AgreedDiscAmount = "0";
    else
        param.AgreedDiscAmount = $("#txtagreeddiscountamount").val();


    if ($("#txtextrachargeper").val() == null || $("#txtextrachargeper").val() == "")
        param.ExtraChargesPer = "0";
    else
        param.ExtraChargesPer = $("#txtextrachargeper").val();

    if ($("#txtextrachargeamount").val() == null || $("#txtextrachargeamount").val() == "")
        param.ExtraChargesAmount = "0";
    else
        param.ExtraChargesAmount = $("#txtextrachargeamount").val();

    if ($("#txtextradisper").val() == null || $("#txtextradisper").val() == "")
        param.ExtraDiscPer = "0";
    else
        param.ExtraDiscPer = $("#txtextradisper").val();

    if ($("#txtextradisamount").val() == null || $("#txtextradisamount").val() == "")
        param.ExtraDiscAmount = "0";
    else
        param.ExtraDiscAmount = $("#txtextradisamount").val();


    if ($("#txtboxchargeper").val() == null || $("#txtboxchargeper").val() == "")
        param.ExtraBoxChargesPer = "0";
    else
        param.ExtraBoxChargesPer = $("#txtboxchargeper").val();
    if ($("#txtboxchargeamount").val() == null || $("#txtboxchargeamount").val() == "")
        param.ExtraBoxChargesAmount = "0";
    else
        param.ExtraBoxChargesAmount = $("#txtboxchargeamount").val();

    if ($("#txtextrachargeper").val() > 0) {
        for (var i = 0; i < list.length; i++) {
            list[i].ExtraChargesPer = $("#txtextrachargeper").val();
            list[i].ExtraChargesAmount = 0;
        }
    }
    else {
        for (var i = 0; i < list.length; i++) {
            list[i].ExtraChargesPer = 0;
            list[i].ExtraChargesAmount = $("#txtextrachargeamount").val();
        }
    }


    if ($("#txtextradisper").val() > 0) {
        for (var i = 0; i < list.length; i++) {
            list[i].ExtraDiscPer = $("#txtextradisper").val();
            list[i].ExtraDiscAmount = 0;
        }
    }
    else {
        for (var i = 0; i < list.length; i++) {
            list[i].ExtraDiscPer = 0;
            list[i].ExtraDiscAmount = $("#txtextradisamount").val();
        }
    }

    if ($("#hdnratefieldchanged").val() == 1) {
        for (var i = 0; i < list.length; i++) {
            list[i].AgreedRate = $("#txtagreedrate").val();
            list[i].AgreedAmount = '';
            list[i].AgreedDiscPer = '';
        }
    }
    else if ($("#hdnratefieldchanged").val() == 2) {
        for (var i = 0; i < list.length; i++) {
            list[i].AgreedRate = '';
            list[i].AgreedAmount = $("#txtagreedamount").val();
            list[i].AgreedDiscPer = '';
        }
    }
    else if ($("#hdnratefieldchanged").val() == 3) {
        for (var i = 0; i < list.length; i++) {
            list[i].AgreedRate = '';
            list[i].AgreedAmount = '';
        }

    }

    if (packagelength > 0) {
        for (var m = 0; m < list.length; m++) {
            if (list[m].AdtypeID1 == 0 || list[m].AdtypeID1 == "") {
                ShowMsg("Please enter all the classifications");
                return false;
            }
        }
    }

    param.list = list;
    param.IsVatChange = $("#hdnIsVatPer").val();
    param.ModifyVatPer = $("#txtvatper").val();

    $('#divProcessingBox').dialog('open');
    var result = getresult(url, param);
    $('#divProcessingBox').dialog('close');
    result = jQuery.parseJSON(result);
    if (result.length == 0) {
        ShowMsg("Rate not found");
        return false;
    }
    AgreedRatelist = [];
    AgreedAmountlist = [];
    AgreedDiscPerlist = [];
    AgreedDiscAmountlist = [];
    CardRatelist = [];
    var CardRate = 0;
    var NewCardRate = 0;
    var NewAgreedRate = 0;
    var AgreedDiscAmount = 0;
    var CardAmount = 0;
    var AgreedAmount = 0;
    var ExtraChargesAmount = 0;
    var ExtraDiscAmount = 0;
    var ExtraBoxChargesAmount = 0;
    var AgencyCommissionAmount = 0;
    var PreVATAmount = 0;
    var VATAmount = 0;
    var Receivable = 0;
    var NetReceivable = 0;
    var agreeddiscountper = "";
    var agreedrate = "";
    if (result.length > 0 && result[0].IsValid == 0) {

        $("#TotalRecordReturn").val(result.length);
        for (var i = 0; i < result.length; i++) {
            CardRate = CardRate + result[i].CardRate;

            var insnum = result[0].InsNum; // 1
            if (insnum == result[i].InsNum) {
                NewCardRate = NewCardRate + result[i].CardRate;
                $("#txtcardrate").val(NewCardRate);
            }
            agreeddiscountper = result[0].AgreedDiscPer;
            AgreedDiscAmount = AgreedDiscAmount + result[i].AgreedDiscAmount;
            $("#txtagreeddiscountamount").val(AgreedDiscAmount);
            CardAmount = CardAmount + result[i].CardAmount;
            $("#txtcardamount").val(CardAmount);
            AgreedAmount = AgreedAmount + result[i].AgreedAmount;
            $("#txtagreedamount").val(AgreedAmount.toFixed(2));
            $("#txtextrachargeper").val(result[i].ExtraChargesPer);
            ExtraChargesAmount = ExtraChargesAmount + result[i].ExtraChargesAmount;
            $("#txtextrachargeamount").val(ExtraChargesAmount.toFixed(2));
            $("#txtextradisper").val(result[i].ExtraDiscPer);
            ExtraDiscAmount = ExtraDiscAmount + result[i].ExtraDiscAmount;
            $("#txtextradisamount").val(ExtraDiscAmount.toFixed(2));
            $("#txtboxchargeper").val(result[i].ExtraBoxChargesPer);
            ExtraBoxChargesAmount = result[0].ExtraBoxChargesAmount;
            $("#txtboxchargeamount").val(ExtraBoxChargesAmount);
            $("#txtcommisionper").val(result[i].AgencyCommissionPer);
            AgencyCommissionAmount = AgencyCommissionAmount + result[i].AgencyCommissionAmount;
            $("#txtcommisionamount").val(AgencyCommissionAmount);
            PreVATAmount = PreVATAmount + result[i].PreVATAmount;
            $("#txtprevatamount").val(PreVATAmount);
            $("#txtvatper").val(result[i].VATPer);
            VATAmount = VATAmount + result[i].VATAmount;
            $("#txtvatamount").val(VATAmount);
            Receivable = Receivable + result[i].Receivable;
            NetReceivable = NetReceivable + result[i].NetReceivable;
            var spilitreceivable = parseFloat(0 + "." + parseInt(Receivable.toString().split(".")[1]));
            if (selectedDateArray.length == 1) {
                if (spilitreceivable >= .50) {
                    $("#txtrecevible").val(parseFloat(Math.round(Receivable)).toFixed(2));
                    if ($("#NetReceivableForReceipt").val() != $("#txtrecevible").val()) {
                        ValidateReceiptDetails(result[0].ReceiptPayTypeID);
                        if ($("#hdnchkdiffer").val() == 0) {
                            $("#txtamount").val(parseFloat(Math.round(Receivable)).toFixed(2));
                            $("#NetReceivableForReceipt").val(parseFloat(Math.round(Receivable)).toFixed(2));
                        }
                    }
                    $("#txtrecevible").html(parseFloat(Math.round(Receivable)).toFixed(2));
                }
                else {
                    $("#txtrecevible").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                    if ($("#NetReceivableForReceipt").val() != $("#txtrecevible").val()) {
                        ValidateReceiptDetails(result[0].ReceiptPayTypeID);
                        if ($("#hdnchkdiffer").val() == 0) {
                            $("#txtamount").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                            $("#NetReceivableForReceipt").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                        }
                    }
                    $("#txtrecevible").html(parseFloat(Math.floor(Receivable)).toFixed(2));
                }
            }
            $("#txtnetamount").html(NetReceivable);
            $("#txtratecardid").val(result[i].RateCardID);
            $("#txtadrateid").val(result[i].AdRateID);
            agreedrate = result[0].AgreedRate;

            if (insnum == result[i].InsNum) {
                NewAgreedRate = NewAgreedRate + result[i].AgreedRate;
            }
            $("#txtadsizewidth").val(result[i].AdSizeWidth);
            $("#txtadsizeheight").val(result[i].AdSizeHeight);

            AdtypeIdlist.push(result[i].AdTypeID);
            Adsizeidlist.push(result[i].AdsizeID);
            AdsizeHeightlist.push(result[i].AdSizeHeight);
            AdsizeWidthlist.push(result[i].AdSizeWidth);
            Premiaidlist.push(result[i].PremiaID);
            Coloridlist.push(result[i].ColorID);
            CardRatelist.push(result[i].CardRate);
            CardAmountlist.push(result[i].CardAmount);
            RateCardIDlist.push(result[i].RateCardID);
            AdRateIDlist.push(result[i].AdRateID);
            AgreedRatelist.push(result[i].AgreedRate);
            AgreedAmountlist.push(result[i].AgreedAmount);
            AgreedDiscPerlist.push(result[i].AgreedDiscPer);
            AgreedDiscAmountlist.push(result[i].AgreedDiscAmount);
            PreVATAmountlist.push(result[i].PreVATAmount);
            VATPerlist.push(result[i].VATPer);
            VATAmountlist.push(result[i].VATAmount);
            AgencyCommissionPerlist.push(result[i].AgencyCommissionPer);
            AgencyCommissionAmountlist.push(result[i].AgencyCommissionAmount);
            SchemeIDlist.push(result[i].SchemeID);
            SchemeDetailIDlist.push(result[i].SchemeDetailID);
            ExtraChargesPerlist.push(result[i].ExtraChargesPer);
            ExtraChargesAmountlist.push(result[i].ExtraChargesAmount);
            ExtraDiscPerlist.push(result[i].ExtraDiscPer);
            ExtraDiscAmountlist.push(result[i].ExtraDiscAmount);
            ExtraBoxChargesPerlist.push(result[i].ExtraBoxChargesPer);
            ExtraBoxChargesAmountlist.push(result[i].ExtraBoxChargesAmount);
            Receivablelist.push(result[i].Receivable);
            MaterialTypelist.push(result[i].MaterialType);
            MaterialSourcelist.push(result[i].MaterialSource);
            UOMIDlist.push(result[i].UOM);
            Statuslist.push(result[i].Status);
            AuditStatuslist.push(result[i].AuditStatus);

            $("#txtagreeddiscountamount").html(AgreedDiscAmount.toFixed(2));
            $("#txtcardamount").html(CardAmount.toFixed(2));
            $("#txtboxchargeper").html(result[i].ExtraBoxChargesPer + "%");
            $("#txtboxchargeamount").html(ExtraBoxChargesAmount.toFixed(2));
            $("#txtcommisionper").html(result[i].AgencyCommissionPer + "%");
            $("#txtcommisionamount").html(AgencyCommissionAmount.toFixed(2));
            $("#txtprevatamount").html(PreVATAmount.toFixed(2));
            //$("#txtvatper").html(result[i].VATPer + "%");
            $("#txtvatamount").html(VATAmount.toFixed(2));
            $("#txtnetamount").html(NetReceivable.toFixed(2));
            $("#txtratecardid").html(result[i].RateCardID);
            $("#txtadrateid").html(result[i].AdRateID);
            $("#txtadsizewidth").html(result[i].AdSizeWidth);
            $("#txtadsizeheight").html(result[i].AdSizeHeight);
            $("#hdnschemeid").val(result[0].SchemeID);
            $("#hdnschemedetailid").val(result[0].SchemeDetailID);

        }
        if (selectedDateArray.length > 1) {
            if (spilitreceivable >= .50) {
                $("#txtrecevible").val(parseFloat(Math.round(Receivable)).toFixed(2));
                if ($("#NetReceivableForReceipt").val() != $("#txtrecevible").val()) {
                    ValidateReceiptDetails(result[0].ReceiptPayTypeID);
                    if ($("#hdnchkdiffer").val() == 0) {
                        $("#txtamount").val(parseFloat(Math.round(Receivable)).toFixed(2));
                        $("#NetReceivableForReceipt").val(parseFloat(Math.round(Receivable)).toFixed(2));
                    }
                }
                $("#txtrecevible").html(parseFloat(Math.round(Receivable)).toFixed(2));
            }
            else {
                $("#txtrecevible").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                if ($("#NetReceivableForReceipt").val() != $("#txtrecevible").val()) {
                    ValidateReceiptDetails(result[0].ReceiptPayTypeID);
                    if ($("#hdnchkdiffer").val() == 0) {
                        $("#txtamount").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                        $("#NetReceivableForReceipt").val(parseFloat(Math.floor(Receivable)).toFixed(2));
                    }
                }
                $("#txtrecevible").html(parseFloat(Math.floor(Receivable)).toFixed(2));
            }
        }
        BoxTypeIDlist.push($('#boxtypeid').val());
        $('#bookingGrid tr:not(:first-child)').remove();
        ParentOrderRate();
        $("#txtcardrate").html(NewCardRate.toFixed(2));
        BindRateLevelGrid(result);
        Clearhiddenratevalue();
        $("#hdnratefieldchanged").val(result[0].RateFieldChanged);
        RateChangeFlagColor();
        IsGetRateClicked = true;
    }
    else if (result[0].IsValid == 1) {
        ShowMsg(result[0].ErrorMessage);
        cleartabletdvalue();
        $('.column-right table tr td input[type="text"]').val('');
        $('.column-right table tr td select').val('');
        $("#receiptfield2").prop("disabled", false);
        $("#receiptfield3").prop("disabled", false);
        $("#receiptfield2").css('pointer-events', '');
        $("#receiptfield3").css('pointer-events', '');
        $('input[type="text"]').removeClass('RateColor');
        $("#hdnratefieldchanged").val(0);
        $("#hdnitemratefieldchanged").val(0);
        return false;
    }
    else {
        ShowMsg(result[0].ErrorMessage);
        UserLogOut();
    }
}

function Clearhiddenratevalue() {
    $("#hdnextrachargeamount").val(0);
    $("#hdnextradiscamount").val(0);
    $("#hdnagreedamount").val(0);
}

function ParentOrderRate() {
    AgreedRateFunction(AgreedRatelist);
    AgreedDiscPerFunction(AgreedDiscPerlist);
    CardRateFunction(CardRatelist);
    $('#parenttxtagreedamount').val($("#txtagreedamount").val());
    $('#parenttxtagreedamount').html(parseFloat($("#txtagreedamount").val()).toFixed(2));
}

function AgreedRateFunction(AgreedRatelist) {
    if (AgreedRatelist.length > 0) {
        var agreedrate = AgreedRatelist[0];
        for (var k = 1; k < AgreedRatelist.length; k++) {
            if (AgreedRatelist[k] != agreedrate) {
                agreedrate = "****";
                $('#parenttxtagreedrate').val(agreedrate);
                $('#parenttxtagreedrate').html(agreedrate);
                $("#txtagreedrate").val(agreedrate);
                break;
            }
            else {
                //packagelength = $("#packageid").val().toString().split(',').length;
                //peidlength = selectpeidlist.toString().split(',').length;
                //if (packagelength == 1 && peidlength == 1) {
                //agreedrate = AgreedRatelist[0];
                //}
                //else {
                //    agreedrate = AgreedRatelist[0] + AgreedRatelist[1];
                //}
                $('#parenttxtagreedrate').val(agreedrate);
                $('#parenttxtagreedrate').html(parseFloat(agreedrate).toFixed(2));
                $("#txtagreedrate").val(parseFloat(agreedrate).toFixed(2));
            }
        }
        if (AgreedRatelist.length == 1) {
            $('#parenttxtagreedrate').val(agreedrate);
            $('#parenttxtagreedrate').html(parseFloat(agreedrate).toFixed(2));
            $("#txtagreedrate").val(parseFloat(agreedrate).toFixed(2));
        }
    }
}

function CardRateFunction(CardRatelist) {
    if (CardRatelist.length > 0) {
        var cardrate = CardRatelist[0];
        for (var k = 1; k < CardRatelist.length; k++) {
            if (CardRatelist[k] != cardrate) {
                cardrate = "****";
                $('#txtcardrate').val(cardrate);
                $('#txtcardrate').html(cardrate);
                break;
            }
            else {
                $('#txtcardrate').val(cardrate);
                $('#txtcardrate').html(parseFloat(cardrate).toFixed(2));
            }
        }
        if (CardRatelist.length == 1) {
            $('#txtcardrate').val(cardrate);
            $('#txtcardrate').html(parseFloat(cardrate).toFixed(2));
        }
    }
}

function AgreedDiscPerFunction(AgreedDiscPerlist) {
    if (AgreedDiscPerlist.length > 0) {
        var agreeddiscountper = AgreedDiscPerlist[0];
        for (var k = 1; k < AgreedDiscPerlist.length; k++) {
            if (AgreedDiscPerlist[k] != agreeddiscountper && AgreedDiscPerlist.length > 1) {
                agreeddiscountper = "****";
                $('#parenttxtagreediscount').val(agreeddiscountper);
                $('#parenttxtagreediscount').html(agreeddiscountper);
                $("#txtagreeddiscountper").val('***');
                break;
            }
            else {
                $('#parenttxtagreediscount').val(agreeddiscountper);
                $('#parenttxtagreediscount').html(agreeddiscountper);
                $("#txtagreeddiscountper").val(agreeddiscountper);
            }
        }
        if (AgreedDiscPerlist.length == 1) {
            $('#parenttxtagreediscount').val(agreeddiscountper);
            $('#parenttxtagreediscount').html(agreeddiscountper);
            $("#txtagreeddiscountper").val(agreeddiscountper);
        }
    }
}

function AgreedAmountFunction(AgreedAmountlist) {
    if (AgreedAmountlist.length > 0) {
        var agreedamount = AgreedAmountlist[0];
        for (var k = 1; k < AgreedAmountlist.length; k++) {
            if (AgreedAmountlist[k] != agreedamount) {
                agreedamount = "****";
                $('#parenttxtagreedamount').val(agreedamount);
                $('#parenttxtagreedamount').html(agreedamount);
                break;
            }
            else {
                agreedamount = $("#parenttxtagreedamount").val();
                $('#parenttxtagreedamount').val(agreedamount);
                $('#parenttxtagreedamount').html(agreedamount);
            }
        }
    }
}

function RateChangeFlagColor() {
    if ($("#hdnratefieldchanged").val() == 1) {
        $("#txtagreedamount").removeClass('RateColor');
        $("#txtagreeddiscountper").removeClass('RateColor');
        $("#txtagreedrate").addClass('RateColor');
    }
    else if ($("#hdnratefieldchanged").val() == 2) {
        $("#txtagreeddiscountper").removeClass('RateColor');
        $("#txtagreedrate").removeClass('RateColor');
        $("#txtagreedamount").addClass('RateColor');
    }
    else if ($("#hdnratefieldchanged").val() == 3) {
        $("#txtagreedrate").removeClass('RateColor');
        $("#txtagreedamount").removeClass('RateColor');
        $("#txtagreeddiscountper").addClass('RateColor');
    }
    else {
        $("#txtagreedrate").removeClass('RateColor');
        $("#txtagreedamount").removeClass('RateColor');
        $("#txtagreeddiscountper").removeClass('RateColor');
    }
}


var newindex;
$("#categoryid").focusout(function () {
    var openselectedpackage = new Array();
    openselectedpackage = $("#packageid").val().toString();
    openpackagelength = $("#packageid").val().toString().split(',').length;
    openpeidlength = selectpeidlist.toString().split(',').length;
    if (categoryidvalue == "0") {
        $("#categoryid").val('');
        AdtypeId1 = 0;
        AdtypeId2 = 0;
        AdtypeId3 = 0;
        AdtypeId4 = 0;
    }
    if ($('.table-ad-detail tr').hasClass('gridselected')) {
        var index = $('.table-ad-detail tr.gridselected').attr('list-index');
        $('.table-ad-detail tr').each(function () {
            if ($(this).find('td:eq(4)').text() == $('.table-ad-detail tr.gridselected').find('td:eq(4)').text()) {
                if (combinedpackage == 0) {
                    var parts = $(this).find('td:eq(3)').text().split('/');
                    var griddate = Number(parts[2] + parts[1] + parts[0]);
                    parts1 = $('.table-ad-detail tr.gridselected').find('td:eq(3)').text().split('/');
                    var selecteddate = Number(parts1[2] + parts1[1] + parts1[0]);
                    if (griddate >= selecteddate && $(this).attr('readonlyflag') == 0) {
                        $(this).find('td:eq(11)').text($("#categoryid").val());
                        index = $(this).attr('list-index');
                        list[index].CategoryID = categoryidvalue;
                        list[index].AdtypeID1 = AdtypeId1;
                        list[index].AdtypeID2 = AdtypeId2;
                        list[index].AdtypeID3 = AdtypeId3;
                        list[index].AdtypeID4 = AdtypeId4;
                        list[index].AdClassification = $("#categoryid").val();
                    }
                }
                else {
                    var parts = $(this).find('td:eq(3)').parent().attr('insDt').split('/');
                    var griddate = Number(parts[2] + parts[1] + parts[0]);
                    parts1 = $('.table-ad-detail tr.gridselected').find('td:eq(3)').parent().attr('insDt').split('/');
                    var selecteddate = Number(parts1[2] + parts1[1] + parts1[0]);
                    if (griddate >= selecteddate && $(this).attr('readonlyflag') == 0) {
                        $(this).find('td:eq(11)').text($("#categoryid").val());
                        index = $(this).attr('list-index');
                        list[index].CategoryID = categoryidvalue;
                        list[index].AdtypeID1 = AdtypeId1;
                        list[index].AdtypeID2 = AdtypeId2;
                        list[index].AdtypeID3 = AdtypeId3;
                        list[index].AdtypeID4 = AdtypeId4;
                        list[index].AdClassification = $("#categoryid").val();
                    }
                }
            }
        });
    }
    else {
        $('.table-ad-detail tr:not(:first-child)').find('td:eq(11)').text($("#categoryid").val());
        for (var i = 0; i < list.length; i++) {
            list[i].CategoryID = categoryidvalue;
            list[i].AdtypeID1 = AdtypeId1;
            list[i].AdtypeID2 = AdtypeId2;
            list[i].AdtypeID3 = AdtypeId3;
            list[i].AdtypeID4 = AdtypeId4;
        }
    }
    IsGetRateClicked = false;
});


$("#stylesheetid").change(function () {
    BindDefaultUOMControl();
    var openselectedpackage = new Array();
    openselectedpackage = $("#packageid").val().toString();
    openpackagelength = $("#packageid").val().toString().split(',').length;
    openpeidlength = selectpeidlist.toString().split(',').length;
    if ($('.table-ad-detail tr').hasClass('gridselected')) {
        var index = $('.table-ad-detail tr.gridselected').attr('list-index');
        $('.table-ad-detail tr').each(function () {
            if ($(this).find('td:eq(4)').text() == $('.table-ad-detail tr.gridselected').find('td:eq(4)').text()) {
                if (combinedpackage == 0) {
                    var parts = $(this).find('td:eq(3)').text().split('/');
                    var griddate = Number(parts[2] + parts[1] + parts[0]);
                    parts1 = $('.table-ad-detail tr.gridselected').find('td:eq(3)').text().split('/');
                    var selecteddate = Number(parts1[2] + parts1[1] + parts1[0]);
                    if (griddate >= selecteddate && $(this).attr('readonlyflag') == 0) {
                        index = $(this).attr('list-index');
                        if (list != null) {
                            if (list.length > index) {
                                list[index].StyleSheetID = $("#stylesheetid").val();//stylesheetidvalue;
                            }
                        }
                        $(this).find('td:eq(13)').text($("#stylesheetid").val());
                    }
                }
                else {
                    var parts = $(this).find('td:eq(3)').parent().attr('insDt').split('/');
                    var griddate = Number(parts[2] + parts[1] + parts[0]);
                    parts1 = $('.table-ad-detail tr.gridselected').find('td:eq(3)').parent().attr('insDt').split('/');
                    var selecteddate = Number(parts1[2] + parts1[1] + parts1[0]);
                    if (griddate >= selecteddate && $(this).attr('readonlyflag') == 0) {
                        index = $(this).attr('list-index');
                        if (list != null) {
                            if (list.length > index) {
                                list[index].StyleSheetID = $("#stylesheetid").val();//stylesheetidvalue;
                            }
                        }
                        $(this).find('td:eq(13)').text($("#stylesheetid").val());
                    }
                }

            }
        });
    }
    else {
        $('.table-ad-detail tr:not(:first-child)').find('td:eq(13)').text($("#stylesheetid").val());
        for (var i = 0; i < list.length; i++) {
            list[i].StyleSheetID = $("#stylesheetid").val();
        }
    }
    IsGetRateClicked = false;
});

var cnfrmboxvalue = true;
var starttime = 0;
var dbclick = false;
function SaveBookingDetail() {

    if (cnfrmboxvalue == true) {

        ispefocus = true;
        if (dbclick == true) {
            return false;
        }
        if (!IsGetRateClicked) {
            var res = GetBookingRate();
            if (res == false)
                return false;
        }
        if ($("#hdnIsCustomerType").val() == "1" && ($("#agencyid").val() == '' || $("#agencyid").val() == null)) {
            ShowMsg("Please select Agency", $("#agencyid"));
            $("#agencyid").focus();
            cnfrmboxvalue = true;
            dbclick = false;
            return false;
        }
        if ($("#clientid").val() == '' || $("#clientid").val() == null) {
            if ($('#hdnIsCustomerType').val() == "2") {
                ShowMsg("Please enter Casual Client", $("#clientid"));
            }
            else {
                ShowMsg("Please select Client", $("#clientid"));
            }
            $("#clientid").focus();
            cnfrmboxvalue = true;
            dbclick = false;
            return false;
        }
        if ($("#txtronumber").val() == '' || $("#txtronumber").val() == null) {
            $("#hdnronumberfocus").val(1);
            ShowMsg("Please enter RO Number", $("#txtronumber"));
            $("#txtronumber").focus();
            cnfrmboxvalue = true;
            dbclick = false;
            return false;
        }
        if ($("#productid").val() == 0 && $("#hdnIsProductNecessary").val() == 1) {
            ShowMsg("Please select Product", $("#productid"));
            $("#productid").focus();
            cnfrmboxvalue = true;
            dbclick = false;
            return false;
        }
        if (($("#brandid").val() == -1 || $("#brandid").val() == null) && $("#hdnIsBrandNecessary").val() == 1) {
            ShowMsg("Please select Brand", $("#brandid"));
            $("#brandid").focus();
            cnfrmboxvalue = true;
            dbclick = false;
            return false;
        }
        if ($("#smeid").val() == 0 && $("#hdnissmenecessaryforbookingorder").val() == 1) {
            ShowMsg("Please select SME", $("#smeid"));
            $("#smeid").focus();
            cnfrmboxvalue = true;
            dbclick = false;
            return false;
        }
        if ($('#hdnIsClassified').val() == "0") {
            if ($("#mattypeid").val() == 0 && $("#hdnismaterialtyperequired").val() == 1) {
                ShowMsg("Please select Material Type", $("#mattypeid"));
                setTimeout(function () {
                    $("#mattypeid").focus();
                }, 500);
                cnfrmboxvalue = true;
                dbclick = false;
                return false;
            }
        }
        if (parseFloat($("#txtagreeddiscountper").val()) > 50) {
            if (parseFloat($("#txtagreeddiscountper").val()) > parseFloat($("#hdnmaxdiscountforautoapproval").val())) {
                $("#rotypeid").val(3);
                if ($("#uncnfrmrsnid").val() == 0) {
                    $("#uncnfrmrsnid").prop("disabled", "")
                    ShowMsg("Please select the reason for unconfirmation", $("#uncnfrmrsnid"));
                    $("#uncnfrmrsnid").focus();
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }
            }
        }
        if ($("#rotypeid").val() == 3) {
            if ($("#uncnfrmrsnid").val() == 0) {
                $("#uncnfrmrsnid").prop("disabled", "")
                ShowMsg("Please select the reason for unconfirmation", $("#uncnfrmrsnid"));
                $("#uncnfrmrsnid").focus();
                cnfrmboxvalue = true;
                dbclick = false;
                return false;
            }
        }
        if ($("#islogo").val() == "1") {
            if ($("#lblfile").html() == '') {
                var files = $("#file_center").get(0).files;
                if (files.length == 0) {
                    ShowMsg("Please attach File", $("#file_center"));
                    $("#file_center").focus();
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }
            }
        }
        setTimeout(function () {
            $("#hdnronumberfocus").val(0);
            var cnfrmmsg = 'Do you want to save this order?';
            if ($("#txtOrderNo").val() != '')
                cnfrmmsg = 'Do you want to update this order?';
            if ($("#txtOrderNo").val() != '' && $("#hdnIsPaymentType").val() == 1 && $("#hdnIsCredit").val() == 0) {
                if ($("#NetReceivableForCheck").val() != $("#txtrecevible").val()) {
                    ShowMsg('This change in RO is affecting Rate / Amount. So RO can`t be updated');
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }
            }


            if (($("#hdnsaveflag").val() == 0 && dbclick == false) || (($("#txtOrderNo").val() > 0 || $("#txtBookingNo").val() > 0) && $("#hdnsaveflag").val() == 1 && dbclick == false)) {
                cnfrmboxvalue = false;
                $('<div title="Adpro"></div>').html(cnfrmmsg).dialog({
                    show: 'blind',
                    closeOnEscape: false,
                    autoOpen: true,
                    hide: 'fold',
                    modal: true,
                    dialogClass: "base-message",
                    buttons: {
                        "Yes": function () {
                            dbclick = true;
                            $(this).dialog("close");
                            $(this).parent().hide();
                            var curTime = new Date().getTime();
                            if ((curTime - starttime) / 1000 < 10) {
                                console.log("Double Click");
                                cnfrmboxvalue = false;
                                return false;
                            }
                            starttime = curTime;
                            qStr = window.location.href.split('#')[0];
                            if (qStr.indexOf("?id=") == -1 || qStr.indexOf("&cid=") == -1) {
                                ShowMsg("Login user Logged Out.. Please login");
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }
                            userid = qStr.split('?')[1].split('=')[1].split('&')[0];
                            centerid = qStr.split('&')[1].split('=')[1];
                            if (userid === null || userid === '' || centerid === null || centerid === '') {
                                ShowMsg("Login user Logged Out.. Please login");
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }

                            var selecteddate = new Array();
                            selecteddate = selectedDateArray.toString();
                            var totalOrder = selectedDateArray.toString().split(',').length;
                            if (selecteddate == '' || selecteddate == null) {
                                ShowMsg("Please select insertion(s) Date");
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }
                            if ($("#txtcardrate").val() == '' || $("#txtcardrate").val() == null) {
                                ShowMsg("Please get Rate");
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }

                            if ($('#hdnIsClassified').val() == "1" && $("#hdnautofoldercreationforclassifiedorders").val() == "1") {
                                var classiresult = CreateClassifiedFolder();
                                if (classiresult == 0) {
                                    ShowMsg("you do not have sufficient access rights on " + $("#hdnClassifiedMaterialPath").val() + " folder");
                                    cnfrmboxvalue = true;
                                    dbclick = false;
                                    return false;
                                }
                            }
                            else {
                                if ($('#mattypeid').val() == "3") {
                                    var jobresult = CreateJobFolder();
                                    if (jobresult == 0) {
                                        ShowMsg("you do not have sufficient access rights on " + $("#hdnJobPath").val() + " folder");
                                        cnfrmboxvalue = true;
                                        dbclick = false;
                                        return false;
                                    }
                                }
                            }
                            var rofile = Rofilename;
                            if (rofile.length > 0) {
                                var roresult = CreateROFolder();
                                if (roresult == 0) {
                                    ShowMsg("you do not have sufficient access rights on " + $("#hdnROFilePath").val() + " folder");
                                    cnfrmboxvalue = true;
                                    dbclick = false;
                                    return false;
                                }
                            }

                            var url = appRoot + "Booking/GetTableData";
                            var param = {};
                            param.UserId = userid;
                            param.UserType = $('#hdnUserType').val();
                            param.IsClassified = $('#hdnIsClassified').val();
                            param.IsDigital = $('#hdnIsDigital').val();
                            if ($("#txtOrderNo").val() == '' && $("#txtReceiptNo").val() == '' && $("#txtBookingNo").val() == '') {
                                var newdate = new Date();
                                bookingdate = ('0' + newdate.getDate()).slice(-2) + '/' + ('0' + (newdate.getMonth() + 1)).slice(-2) + '/' + newdate.getFullYear() + "  " + ('0' + newdate.getHours()).slice(-2) + ":" + ('0' + newdate.getMinutes()).slice(-2) + ":" + ('0' + newdate.getSeconds()).slice(-2) + "." + newdate.getMilliseconds();
                                $("#hdnbookingdate").val(bookingdate);
                                param.BookingDate = $('#hdnbookingdate').val();
                            }
                            else {
                                param.BookingDate = $('#hdnbookingdate').val();
                            }
                            param.RODate = $("#rodatePicker").val();
                            param.MachineID = $('#hdnMachineID').val();
                            param.MachineName = $('#hdnMachineName').val();
                            param.TotalRecordReturn = $("#TotalRecordReturn").val();
                            param.UnConfirmReason = $("#uncnfrmrsnid").val();



                            if ($('#hdnIsClassified').val() == "0") {
                                param.ApiName = "/SaveDisplayData";
                                var selectadpremia = new Array();
                                selectadpremia = Premiaidlist.toString();
                                param.Premiaid = selectadpremia;
                                if ($("#premiaid").val().trim() == null || $("#premiaid").val().trim() == '') {
                                    ShowMsg("Please select Premia", $("#premiaid"));
                                    $("#premiaid").focus();
                                    cnfrmboxvalue = true;
                                    dbclick = false;
                                    return false;
                                }
                                if ($("#colorid").val().trim() == null || $("#colorid").val().trim() == '') {
                                    ShowMsg("Please select Color", $("#colorid"));
                                    $("#colorid").focus();
                                    cnfrmboxvalue = true;
                                    dbclick = false;
                                    return false;
                                }

                                var selectadcolor = new Array();
                                selectadcolor = Coloridlist.toString();
                                param.Colorid = selectadcolor;

                                var selectadsize = new Array();
                                selectadsize = Adsizeidlist.toString();
                                param.Adsizeid = selectadsize;

                                var selectadheight = new Array();
                                selectadheight = AdsizeHeightlist.toString();
                                param.AdsizeHeight = selectadheight;

                                var selectadwidth = new Array();
                                selectadwidth = AdsizeWidthlist.toString();
                                param.AdsizeWidth = selectadwidth;

                                if ($("#adsizeid").val().trim() == null || $("#adsizeid").val().trim() == '') {
                                    ShowMsg("Please select Ad Size", $("#adsizeid"));
                                    $("#adsizeid").focus();
                                    cnfrmboxvalue = true;
                                    dbclick = false;
                                    return false;
                                }
                                if (adsizeidvalue == "0" && ($("#adsizeid").val().trim() != null || $("#adsizeid").val().trim() != '')) {
                                    param.Adsize = $("#adsizeid").val().replace(/ /g, '');
                                }

                                param.Caption = $("#txtitemcaption").val();

                                var adcolumnsize = new Array();
                                adcolumnsize = ColumnSizelist.toString();
                                param.AdColumnSize = adcolumnsize;

                                var gutter = new Array();
                                gutter = Gutterlist.toString();
                                param.Gutter = gutter;

                                param.BillingIns = $('#txtbillingins').val();
                                param.SchedulingIns = $('#txtscheduleins').val();
                                param.ProdInstructions = $('#txtprodins').val();

                                param.Billablesize = $("#billablesize").val().replace(/ /g, '');
                                param.BillableHeight = $("#billablesize").val().replace(/ /g, '').split("*")[0];
                                param.BillableWidth = $("#billablesize").val().replace(/ /g, '').split("*")[1];
                                param.BoxAddress = $('#boxaddressid').val();
                                $("#packageid").val(selectedcyopPE[0]);
                            }
                            else {
                                param.ApiName = "/SaveClassifiedData";
                                param.Caption = $("#txtclitemcaption").val();
                                param.BillingIns = $('#txtclbillingins').val();
                                param.ProdInstructions = $('#txtclprodins').val();
                                param.AdText = $("#adtext").val();
                                param.AdtypeId1 = AdtypeId1;
                                param.AdtypeId2 = AdtypeId2;
                                param.AdtypeId3 = AdtypeId3;
                                param.AdtypeId4 = AdtypeId4;
                                param.IsCD = $('#iscd').val();
                                param.ClassifiedCol = $('#txtcol').val();
                                param.IsLogo = $("#islogo").val();
                                if ($("#islogo").val() == "1") {
                                    var files = $("#file_center").get(0).files;
                                    if (files.length > 0) {
                                        var fileName = files[0].name;
                                        param.FileNames = fileName;
                                        $("#lblfile").html(fileName);
                                    }
                                    else if ($("#lblfile").html() != "") {
                                        param.FileNames = $("#lblfile").html();
                                    }
                                    else {
                                        ShowMsg("Please attach File");
                                        cnfrmboxvalue = true;
                                        dbclick = false;
                                        return false;
                                    }
                                }
                                else if ($("#iscd").val() == "1") {
                                    var files = $("#file_center").get(0).files;
                                    if (files.length > 0) {
                                        var fileName = files[0].name;
                                        param.FileNames = fileName;
                                        $("#lblfile").html(fileName);
                                    }
                                    else {
                                        param.FileNames = $("#lblfile").html();
                                    }
                                }
                                else {
                                    param.FileNames = "";
                                }

                                param.StyleSheetID = $("#stylesheetid").val();
                                if (param.StyleSheetID == 0) {
                                    ShowMsg("Please select StyleSheet", $("#stylesheetid"));
                                    $("#stylesheetid").focus();
                                    cnfrmboxvalue = true;
                                    dbclick = false;
                                    return false;
                                }

                                // old code
                                //if ($("#iscd").val() == "0") {
                                //    if ($("#adtext").val() == "" || $("#adtext").val() == null) {
                                //        param.TotalWords = "0";
                                //        param.MBodyCount = $("#mbodysize").val();
                                //        param.CharCount = "0";
                                //    }
                                //    else {
                                //        param.TotalWords = $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length;
                                //        if ($("#mbodysize").val() == $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length) {
                                //            param.MBodyCount = $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length;
                                //            $("#mbodysize").val(param.MBodyCount);
                                //        }
                                //        else {
                                //            param.MBodyCount = $("#mbodysize").val();
                                //        }
                                //        param.CharCount = $("#adtext").val().length;
                                //    }
                                //    param.MBodyChange = $("#hdnmbodychange").val();
                                //    param.AdsizeHeight = param.MBodyCount;

                                //    if (param.MBodyCount == null || param.MBodyCount == '' || param.MBodyCount < 1) {
                                //        ShowMsg("Please enter no. of words", $("#mbodysize"));
                                //        $("#mbodysize").focus();
                                //        return false;
                                //    }
                                //    if ($("#islogo").val() == "1") {
                                //        if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
                                //            ShowMsg("Please enter valid Height", $("#txtheight"));
                                //            $("#txtheight").focus();
                                //            return false;
                                //        }
                                //        else {
                                //            param.LogoHeight = $("#txtheight").val();
                                //        }
                                //    }
                                //}
                                //else {
                                //    if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
                                //        ShowMsg("Please enter valid Height", $("#txtheight"));
                                //        $("#txtheight").focus();
                                //        return false;
                                //    }
                                //    else {
                                //        param.MBodyCount = "0";
                                //        param.LogoHeight = "0";
                                //        param.TotalWords = "0";
                                //        param.AdsizeHeight = $("#txtheight").val();
                                //        param.CharCount = "0";
                                //    }
                                //}

                                // new code
                                if ($("#iscd").val() == "0") {
                                    if ($("#adtext").val() == "" || $("#adtext").val() == null) {
                                        param.TotalWords = "0";
                                        param.MBodyCount = $("#mbodysize").val();
                                        param.CharCount = "0";
                                        param.AdsizeHeight = param.MBodyCount;
                                        if (param.MBodyCount < 1) {
                                            ShowMsg("Please enter no. of words", $("#mbodysize"));
                                            $("#mbodysize").focus();
                                            cnfrmboxvalue = true;
                                            dbclick = false;
                                            return false;
                                        }
                                    }
                                    else {
                                        param.TotalWords = $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length;
                                        param.MBodyCount = "0";
                                        param.CharCount = $("#adtext").val().length;
                                        param.AdsizeHeight = param.TotalWords;
                                    }
                                    param.MBodyChange = $("#hdnmbodychange").val();
                                    if (param.MBodyCount == null || param.MBodyCount == '') {
                                        ShowMsg("Please enter no. of words", $("#mbodysize"));
                                        $("#mbodysize").focus();
                                        cnfrmboxvalue = true;
                                        dbclick = false;
                                        return false;
                                    }
                                    if ($("#islogo").val() == "1") {
                                        if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
                                            ShowMsg("Please enter valid Height", $("#txtheight"));
                                            $("#txtheight").focus();
                                            cnfrmboxvalue = true;
                                            dbclick = false;
                                            return false;
                                        }
                                        else {
                                            param.LogoHeight = $("#txtheight").val();
                                        }
                                    }
                                }
                                else {
                                    if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
                                        ShowMsg("Please enter valid Height", $("#txtheight"));
                                        $("#txtheight").focus();
                                        cnfrmboxvalue = true;
                                        dbclick = false;
                                        return false;
                                    }
                                    else {
                                        param.MBodyCount = "0";
                                        param.LogoHeight = "0";
                                        param.TotalWords = "0";
                                        param.AdsizeHeight = $("#txtheight").val();
                                        param.CharCount = "0";
                                    }
                                }

                                param.AdsizeWidth = $('#txtcol').val();
                                param.SchedulingIns = "";
                                param.BoxAddress = $('#boxaddressid').val();
                            }
                            param.CustomerTypeID = $('#hdnIsCustomerType').val();
                            param.PaymentTypeID = $('#hdnIsPaymentType').val();
                            param.IsManualBilling = $('#hdnIsManualBill').val();
                            param.PublicationId = "0";
                            var selectedpackage = new Array();
                            selectedpackage = $("#packageid").val().toString();
                            param.PackageID = selectedpackage;

                            if ($("#txtOrderNo").val().trim() == null || $("#txtOrderNo").val().trim() == 0 || $("#txtOrderNo").val().trim() == '') {
                                param.ROID = '';
                            }
                            else {
                                param.ROID = $("#txtOrderNo").val();
                            }
                            param.ROStatus = $("#txtrostatus").val();

                            var selectstatus = new Array();
                            selectstatus = Statuslist.toString();
                            param.Status = selectstatus;

                            var selectauditstatus = new Array();
                            selectauditstatus = AuditStatuslist.toString();
                            param.AuditStatus = selectauditstatus;

                            if (param.PackageID == null || param.PackageID == '') {
                                ShowMsg("Please select Package", $("#packageiddiv"));
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }
                            var selectedpe = new Array();
                            selectedpe = pelist.toString();
                            param.PEID = selectedpe;
                            if ($("#hdnsourceroid").val() == 0) {
                                param.SourceROID = "0";
                            }
                            else
                                param.SourceROID = $("#hdnsourceroid").val();
                            param.ProductID = $("#productid").val();
                            param.RONumber = $("#txtronumber").val();
                            param.AgencyID = agencyidvalue;
                            param.ClientID = clientidvalue;

                            if ($('#hdnIsCustomerType').val() == "2") {
                                param.CasualClientName = $("#clientid").val();
                                param.CasualClientAddress = $("#txtcasualAdd").val();
                                if (param.CasualClientAddress.trim() == '') {
                                    ShowClientMsg("Please enter Casual Client Address", $("#txtcasualAdd"));
                                    //$('#divAddrPopUp').dialog('open');
                                    //$("#txtcasualAdd").focus();
                                    return false;
                                }
                                param.ContactPerson = '';
                                param.CasualClientCity = $("#ddlcasualcity option:selected").text();
                                param.CasualClientZipCode = $("#txtcasualzip").val();
                                param.CasualClientPhoneNo = $("#txtcasualtelephone").val();
                                param.CasualContactPerson = '';
                                param.CasualClientNicNumber = $("#txtcasualidnum").val();
                                param.CasualClientVatNumber = $("#txtclientvatnum").val();
                                param.CasualClientEmailID = '';
                                param.CasualClientPassword = '';
                            }
                            else {
                                param.CasualClientName = '';
                                param.CasualClientAddress = '';
                                param.ContactPerson = '';
                                param.CasualClientCity = '';
                                param.CasualClientZipCode = '';
                                param.CasualClientPhoneNo = '';
                                param.CasualContactPerson = '';
                                param.CasualClientNicNumber = '';
                                param.CasualClientVatNumber = '';
                                param.CasualClientEmailID = '';
                                param.CasualClientPassword = '';
                            }

                            param.CanvassorID = canvassoridvalue;
                            param.RevenueCentreID = centerid;
                            param.BookingCentreID = centerid;
                            var selectadtype = new Array();
                            selectadtype = AdtypeIdlist.toString();
                            param.AdtypeId = selectadtype;
                            if (param.AdtypeId == null || param.AdtypeId == '') {
                                ShowMsg("Please select AdType", $("#adtypeid"));
                                $("#adtypeid").focus();
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }
                            param.AdtypeId1 = AdtypeId1;
                            param.AdtypeId2 = AdtypeId2;
                            param.AdtypeId3 = AdtypeId3;
                            param.AdtypeId4 = AdtypeId4;

                            var selectuomid = new Array();
                            selectuomid = UOMIDlist.toString();
                            param.UOMID = selectuomid;

                            if (param.UOMID == null || param.UOMID == '') {
                                ShowMsg("Please select UOM", $("#uomid"));
                                $("#uomid").focus();
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }
                            param.SMEID = $("#smeid").val();
                            param.BrandID = $('#brandid').val();
                            param.MaterialType = $("#mattypeid").val();
                            param.MaterialSource = $("#matsourceid").val();;
                            param.ROType = $('#rotypeid').val();
                            param.BillType = $('#billtypeid').val();
                            param.RateFieldChanged = $("#hdnratefieldchanged").val();
                            param.ItemRateFieldChanged = $("#hdnitemratefieldchanged").val();
                            param.BoxTypeID = $('#boxtypeid').val();
                            var selectratecardId = new Array();
                            selectratecardId = RateCardIDlist.toString();
                            param.RateCardID = selectratecardId;

                            var selectadrateid = new Array();
                            selectadrateid = AdRateIDlist.toString();
                            param.AdRateID = selectadrateid;

                            var selectcardrate = new Array();
                            selectcardrate = CardRatelist.toString();
                            param.CardRate = selectcardrate;

                            var selectcardamount = new Array();
                            selectcardamount = CardAmountlist.toString();
                            param.CardAmount = selectcardamount;

                            var selectagreedrate = new Array();
                            selectagreedrate = AgreedRatelist.toString();
                            param.AgreedRate = selectagreedrate;

                            var selectagreedamount = new Array();
                            selectagreedamount = AgreedAmountlist.toString();
                            param.AgreedAmount = selectagreedamount;

                            var selectagreeddiscamount = new Array();
                            selectagreeddiscamount = AgreedDiscAmountlist.toString();
                            param.AgreedDiscAmount = selectagreeddiscamount;

                            var selectagreeddiscper = new Array();
                            selectagreeddiscper = AgreedDiscPerlist.toString();
                            param.AgreedDiscPer = selectagreeddiscper;

                            var selectprevatamount = new Array();
                            selectprevatamount = PreVATAmountlist.toString();
                            param.PreVATAmount = selectprevatamount;


                            var selectreceivable = new Array();
                            selectreceivable = Receivablelist.toString();
                            param.Receivable = selectreceivable;

                            var selectvatper = new Array();
                            selectvatper = VATPerlist.toString();
                            param.VATPer = selectvatper;

                            var selectvatamount = new Array();
                            selectvatamount = VATAmountlist.toString();
                            param.VATAmount = selectvatamount;

                            var selectextrachargesper = new Array();
                            selectextrachargesper = ExtraChargesPerlist.toString();
                            param.ExtraChargesPer = selectextrachargesper;

                            var selectextrachargesamount = new Array();
                            selectextrachargesamount = ExtraChargesAmountlist.toString();
                            param.ExtraChargesAmount = selectextrachargesamount;


                            var selectextradiscper = new Array();
                            selectextradiscper = ExtraDiscPerlist.toString();
                            param.ExtraDiscPer = selectextradiscper;

                            var selectextradiscamount = new Array();
                            selectextradiscamount = ExtraDiscAmountlist.toString();
                            param.ExtraDiscAmount = selectextradiscamount;


                            var selectextraboxchargesper = new Array();
                            selectextraboxchargesper = ExtraBoxChargesPerlist.toString();
                            param.ExtraBoxChargesPer = selectextraboxchargesper;

                            var selectextraboxchargesamount = new Array();
                            selectextraboxchargesamount = ExtraBoxChargesAmountlist.toString();
                            param.ExtraBoxChargesAmount = selectextraboxchargesamount;

                            var selectagencycommper = new Array();
                            selectagencycommper = AgencyCommissionPerlist.toString();
                            param.AgencyCommissionPer = selectagencycommper;

                            var selectagencycommamount = new Array();
                            selectagencycommamount = AgencyCommissionAmountlist.toString();
                            param.AgencyCommissionAmount = selectagencycommamount;

                            var selectschemeid = new Array();
                            selectschemeid = SchemeIDlist.toString();
                            param.SchemeID = selectschemeid;

                            var selectschemedetailid = new Array();
                            selectschemedetailid = SchemeDetailIDlist.toString();
                            param.SchemeDetailID = selectschemedetailid;

                            param.DateSelected = selecteddate;
                            param.Addfiles = "0";
                            param.UserMailID = "0";
                            param.UserName = "0";
                            param.UserMobile = "0";
                            param.TotalOrders = totalOrder;
                            param.OrderNumber = "0";
                            param.UniqueCode = "0";
                            param.AdCartId = "0";
                            var totalreceivable = "0";
                            var tenderamount = "0";
                            if ($("#txtamount").val() != '') {
                                totalreceivable = parseFloat($("#txtamount").val());
                            }
                            if ($("#txtamount1").val() != '') {
                                totalreceivable = parseFloat($("#txtamount").val()) + parseFloat($("#txtamount1").val());
                            }
                            if ($("#txtamount2").val() != '') {
                                totalreceivable = parseFloat($("#txtamount").val()) + parseFloat($("#txtamount1").val()) + parseFloat($("#txtamount2").val());
                            }
                            param.TotalReceivable = totalreceivable;
                            param.ReceivableAmount = $("#txtrecevible").val();
                            param.ReceiptAmount = $("#txtreceiptamount").val();
                            if (param.ReceiptAmount == null || param.ReceiptAmount == '' || param.ReceiptAmount == "0") {
                                if ($("#txtpaymentmodeid option:selected").val() == 1) {
                                    tenderamount = parseFloat($("#txtamount").val());
                                }
                                else if ($("#txtpaymentmodeid1 option:selected").val() == 1) {
                                    tenderamount = parseFloat($("#txtamount1").val());
                                }
                                else if ($("#txtpaymentmodeid2 option:selected").val() == 1) {
                                    tenderamount = parseFloat($("#txtamount2").val());
                                }
                                param.ReceiptAmount = tenderamount;
                            }

                            param.WriteoffAmount = $("#txtwriteoffamount").html();

                            param.PaymentModeID = $("#txtpaymentmodeid").val();
                            if (param.PaymentModeID == null || param.PaymentModeID == '')
                                param.PaymentModeID = 0;
                            param.PaymentModeID1 = $("#txtpaymentmodeid1").val();
                            if (param.PaymentModeID1 == null || param.PaymentModeID1 == '')
                                param.PaymentModeID1 = 0;
                            param.PaymentModeID2 = $("#txtpaymentmodeid2").val();
                            if (param.PaymentModeID2 == null || param.PaymentModeID2 == '')
                                param.PaymentModeID2 = 0;

                            param.ChequeNumber = $("#txtchequenum").val();
                            param.ChequeNumber1 = $("#txtchequenum1").val();
                            param.ChequeNumber2 = $("#txtchequenum2").val();
                            param.ChequeDate = "0";
                            param.Amount = $("#txtamount").val();
                            param.Amount1 = $("#txtamount1").val();
                            param.Amount2 = $("#txtamount2").val();

                            param.BankNameID = $("#txtbankname").val();
                            param.BankName = $("#txtbankname option:selected").text();
                            param.BankID = $("#txtbankname option:selected").attr('bankid');
                            param.BranchBankName = $("#txtbankname option:selected").attr('bankname');
                            param.BranchName = $("#txtbankname option:selected").attr('branchname');
                            if (param.BankNameID == null || param.BankNameID == '')
                                param.BankNameID = 0;
                            param.BankNameID1 = $("#txtbankname1").val();
                            param.BankName1 = $("#txtbankname1 option:selected").text();
                            param.BankID1 = $("#txtbankname1 option:selected").attr('bankid');
                            param.BranchBankName1 = $("#txtbankname1 option:selected").attr('bankname');
                            param.BranchName1 = $("#txtbankname1 option:selected").attr('branchname');
                            if (param.BankNameID1 == null || param.BankNameID1 == '')
                                param.BankNameID1 = 0;
                            param.BankNameID2 = $("#txtbankname2").val();
                            param.BankName2 = $("#txtbankname2 option:selected").text();
                            param.BankID2 = $("#txtbankname2 option:selected").attr('bankid');
                            param.BranchBankName2 = $("#txtbankname2 option:selected").attr('bankname');
                            param.BranchName2 = $("#txtbankname2 option:selected").attr('branchname');
                            if (param.BankNameID2 == null || param.BankNameID2 == '')
                                param.BankNameID2 = 0;

                            var orderreceviable = parseFloat($("#txtrecevible").text());
                            var totalorderamount = parseFloat($("#txtamount").val()) + parseFloat($("#txtamount1").val()) + parseFloat($("#txtamount2").val());
                            if ($("#chkdiffer").prop("checked") == false) {
                                if ($("#hdnIsPaymentType").val() == "1") {
                                    var validation = CheckReceiptValidation();
                                    if (validation == false) {
                                        cnfrmboxvalue = true;
                                        dbclick = false;
                                        return false;
                                    }
                                }
                            }

                            param.CheckDifferValue = $("#hdnchkdiffer").val();

                            var selectedrofilename = new Array();
                            selectedrofilename = Rofilename.toString();
                            param.RoFileName = selectedrofilename;

                            var selectedrofiletype = new Array();
                            selectedrofiletype = Rofiletype.toString();
                            param.RoFileType = selectedrofiletype;

                            var selectedrofiletitle = new Array();
                            selectedrofiletitle = Rofiletitle.toString();
                            param.RoFileTitle = selectedrofiletitle;

                            param.FileLength = Rofilename.length;

                            param.list = list;
                            param.SaveFlag = $("#hdnsaveflag").val();
                            param.IsVatChange = $("#hdnIsVatPer").val();


                            $('#divProcessingBox').dialog('open');
                            var result = getresult(url, param);
                            $('#divProcessingBox').dialog('close');
                            result = jQuery.parseJSON(result);
                            if (result.IsValid == -2) {
                                ShowMsg(result.ErrorMessage);
                                cnfrmboxvalue = true;
                                dbclick = false;
                                UserLogOut();
                            }

                            else if (result.IsValid == -12) {
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }

                            else if (result.IsValid == 0) {
                                $("#hdnROFileRoid").val(result.ROID);
                                $("#hdnROFileJobID").val(result.JobSequence);
                                if ($('#hdnIsClassified').val() == "1" && $("#hdnautofoldercreationforclassifiedorders").val() == "1") {
                                    var classiresult = CreateClassifiedFolder();
                                    if (classiresult == 0) {
                                        ShowMsg("you do not have sufficient access rights on " + $("#hdnClassifiedMaterialPath").val() + " folder");
                                        cnfrmboxvalue = true;
                                        dbclick = false;
                                        return false;
                                    }
                                }
                                else {
                                    if ($('#mattypeid').val() == "3") {
                                        var jobresult = CreateJobFolder();
                                        if (jobresult == 0) {
                                            ShowMsg("you do not have sufficient access rights on " + $("#hdnJobPath").val() + " folder");
                                            cnfrmboxvalue = true;
                                            dbclick = false;
                                            return false;
                                        }
                                    }
                                }
                                var rofile = Rofilename;;
                                if (rofile.length > 0) {
                                    var roresult = CreateROFolder();
                                    if (roresult == 0) {
                                        ShowMsg("you do not have sufficient access rights on " + $("#hdnROFilePath").val() + " folder");
                                        cnfrmboxvalue = true;
                                        dbclick = false;
                                        return false;
                                    }
                                    else {
                                        var roresult = SaveBookingFile();
                                        if (roresult == 0) {
                                            ShowMsg("you do not have sufficient access rights on " + $("#hdnROFilePath").val() + " folder");
                                            cnfrmboxvalue = true;
                                            dbclick = false;
                                            return false;
                                        }
                                    }
                                }

                                if ($("#hdnIsPaymentType").val() == 2 && result.ReceiptID == 0) {
                                    var fullmsg = "";
                                    if (result.ErrorMessage == null) {
                                        cnfrmboxvalue = true;
                                        return false;
                                    }
                                    var msglength = result.ErrorMessage.split('.')[1].trim().split('\r').length;
                                    for (var i = 0; i < msglength; i++) {
                                        if (i == 0)
                                            fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[0] + "</span><span style='color:#385723;font-weight:600;margin-left:35px;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[1] + "</span>";
                                        else
                                            fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[i].replace('-', '') + "</span>";
                                    }

                                    var msg = "<span style='color:#385723;'>" + result.ErrorMessage.split('.')[0] + "." + "</span>" + fullmsg + "</span>";

                                    $('<div title="Adpro"></div>').html(msg).dialog({
                                        show: 'blind',
                                        closeOnEscape: false,
                                        autoOpen: true,
                                        hide: 'fold',
                                        modal: true,
                                        dialogClass: "base-message",
                                        buttons: {
                                            "Ok": function () {
                                                $(this).dialog("close");
                                                $(this).parent().hide();
                                                cnfrmboxvalue = true;
                                                dbclick = false;
                                                setTimeout(function () {
                                                    RefreshBooking();
                                                }, 50);
                                                return false;
                                            }
                                        }
                                    });
                                }

                                else if ($("#hdnIsPaymentType").val() == 1 && result.ReceiptID == 0) {
                                    var fullmsg = "";
                                    if (result.ErrorMessage == null) {
                                        cnfrmboxvalue = true;
                                        return false;
                                    }
                                    var msglength = result.ErrorMessage.split('.')[1].trim().split('\r').length;
                                    for (var i = 0; i < msglength; i++) {
                                        if (i == 0)
                                            fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[0] + "</span><span style='color:#385723;font-weight:600;margin-left:35px;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[1] + "</span>";
                                        else
                                            fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[i].replace('-', '') + "</span>";
                                    }

                                    var msg = "<span style='color:#385723;'>" + result.ErrorMessage.split('.')[0] + "." + "</span>" + fullmsg + "</span>";

                                    $('<div title="Adpro"></div>').html(msg).dialog({
                                        show: 'blind',
                                        closeOnEscape: false,
                                        autoOpen: true,
                                        hide: 'fold',
                                        modal: true,
                                        dialogClass: "base-message",
                                        buttons: {
                                            "Ok": function () {
                                                $(this).dialog("close");
                                                $(this).parent().hide();
                                                cnfrmboxvalue = true;
                                                dbclick = false;
                                                ispefocus = false;
                                                ctrlupress = false;
                                                if (agencyidvalue == 0 && $("#hdnIsGetClientClicked").val() == 1) {
                                                    if ($('#hdnIsClassified').val() == "1") {
                                                        $('input[type="text"]').val('');
                                                        $('textarea').val('');
                                                        cleartable();
                                                        EnableElement();
                                                        $("[val='1']").click();
                                                    }
                                                    else {
                                                        $('input[type="text"]').val('');
                                                        cleartable();
                                                        EnableElement();
                                                        $("[val='0']").click();
                                                    }
                                                    $("#hdnratefieldchanged").val(0);
                                                    $("#hdnitemratefieldchanged").val(0);
                                                    $("#NetReceivableForReceipt").val('');
                                                    $('input[type="text"]').removeClass('RateColor');
                                                    $("#hdnsaveflag").val(0);
                                                    CleararrayList();
                                                    list = [];
                                                    ispefocus = false;
                                                    ctrlupress = false;
                                                    $("#clientid").css('width', '85%');
                                                    $("#clientadd").css('display', '');
                                                    $("#clientid").addClass('noncapitalise');
                                                    $("#customertypetoggle").prop("checked", false);
                                                    $("#paymenttypetoggle").prop("checked", false);
                                                    $("#paylabel").css('pointer-events', 'none');
                                                    $("#billtypeid").prop("disabled", "disabled");
                                                    $("#hdnIsCustomerType").val(2);
                                                    $("#isVatPer").prop("checked", false);
                                                    SwitchtoggleTypeValue();
                                                    IsVatPerCheck();
                                                    IsGetClientClicked = false;
                                                    setTimeout(function () {
                                                        $("#clientid").focus();
                                                    }, 500);
                                                    cnfrmboxvalue = true;
                                                    dbclick = false;
                                                    return false;
                                                }
                                                else {
                                                    setTimeout(function () {
                                                        RefreshBooking();
                                                    }, 50);
                                                    cnfrmboxvalue = true;
                                                    dbclick = false;
                                                    return false;
                                                }

                                            }
                                        }
                                    });
                                }

                                if ($("#hdnIsPaymentType").val() == 1 && result.ReceiptID > 0) {
                                    var fullmsg = "";
                                    if (result.ErrorMessage == null) {
                                        cnfrmboxvalue = true;
                                        return false;
                                    }
                                    var msglength = result.ErrorMessage.split('.')[1].trim().split('\r').length;
                                    for (var i = 0; i < msglength; i++) {
                                        if (i == 0)
                                            fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[0] + "</span><span style='color:#385723;font-weight:600;margin-left:35px;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[1] + "</span>";
                                        else
                                            fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[i].replace('-', '') + "</span>";
                                    }
                                    var msg = "<span style='color:#385723;'>" + result.ErrorMessage.split('.')[0] + "." + "</span>" + fullmsg + "<br />" + "<span style='color:#385723;'>" + "\nDo you want to print receipt?" + "</span>";
                                    $('<div title="Adpro"></div>').html(msg).dialog({
                                        show: 'blind',
                                        closeOnEscape: false,
                                        autoOpen: true,
                                        hide: 'fold',
                                        modal: true,
                                        dialogClass: "base-message",
                                        buttons: {
                                            "Ok": function () {
                                                $(this).dialog("close");
                                                $(this).parent().hide();
                                                cnfrmboxvalue = true;
                                                dbclick = false;
                                                Csvfilecount = 0;
                                                $('#txtReceiptNo').val(result.ReceiptID);
                                                PrintfileDownload();
                                                $('#txtReceiptNo').val('');
                                                setTimeout(function () {
                                                    RefreshBooking();
                                                }, 5000);
                                                cnfrmboxvalue = true;
                                                dbclick = false;
                                                return false;
                                            },
                                            Cancel: function () {
                                                $(this).dialog("close");
                                                cnfrmboxvalue = true;
                                                dbclick = false;
                                                if (agencyidvalue == 0 && $("#hdnIsGetClientClicked").val() == 1) {
                                                    if ($('#hdnIsClassified').val() == "1") {
                                                        $('input[type="text"]').val('');
                                                        $('textarea').val('');
                                                        cleartable();
                                                        EnableElement();
                                                        $("[val='1']").click();
                                                    }
                                                    else {
                                                        $('input[type="text"]').val('');
                                                        cleartable();
                                                        EnableElement();
                                                        $("[val='0']").click();
                                                    }
                                                    $("#hdnratefieldchanged").val(0);
                                                    $("#hdnitemratefieldchanged").val(0);
                                                    $("#NetReceivableForReceipt").val('');
                                                    $('input[type="text"]').removeClass('RateColor');
                                                    $("#hdnsaveflag").val(0);
                                                    CleararrayList();
                                                    list = [];
                                                    ispefocus = false;
                                                    ctrlupress = false;
                                                    $("#clientid").css('width', '85%');
                                                    $("#clientadd").css('display', '');
                                                    $("#clientid").addClass('noncapitalise');
                                                    $("#customertypetoggle").prop("checked", false);
                                                    $("#paymenttypetoggle").prop("checked", false);
                                                    $("#paylabel").css('pointer-events', 'none');
                                                    // $("#customerlabel").css('pointer-events', 'none');
                                                    $("#billtypeid").prop("disabled", "disabled");
                                                    $("#hdnIsCustomerType").val(2);
                                                    $("#isVatPer").prop("checked", false);
                                                    SwitchtoggleTypeValue();
                                                    IsVatPerCheck();
                                                    IsGetClientClicked = false;
                                                    setTimeout(function () {
                                                        $("#clientid").focus();
                                                    }, 500);
                                                    cnfrmboxvalue = true;
                                                    dbclick = false;
                                                    return false;
                                                }
                                                else {
                                                    cnfrmboxvalue = true;
                                                    dbclick = false;
                                                    setTimeout(function () {
                                                        RefreshBooking();
                                                    }, 50);
                                                    return false;
                                                }
                                            }
                                        }
                                    });
                                }
                            }

                            else {

                                if (result.IsValid == 2) {

                                    $('<div title="Adpro"></div>').html(result.ErrorMessage).dialog({
                                        show: 'blind',
                                        closeOnEscape: false,
                                        autoOpen: true,
                                        hide: 'fold',
                                        modal: true,
                                        dialogClass: "base-message",
                                        buttons: {
                                            "Yes": function () {
                                                $(this).dialog("close");
                                                $(this).parent().hide();
                                                $("#hdnsaveflag").val(1);
                                                cnfrmboxvalue = true;
                                                dbclick = false;
                                                SaveBookingDetail();
                                            },
                                            "No": function () {
                                                $(this).dialog("close");
                                                cnfrmboxvalue = true;
                                                dbclick = false;
                                                return false;
                                            }
                                        }
                                    });
                                }
                                else if (result.IsValid == 3) {

                                    $('<div title="Adpro"></div>').html(result.ErrorMessage).dialog({
                                        show: 'blind',
                                        closeOnEscape: false,
                                        autoOpen: true,
                                        hide: 'fold',
                                        modal: true,
                                        dialogClass: "base-message",
                                        buttons: {
                                            "Yes": function () {
                                                $(this).dialog("close");
                                                $(this).parent().hide();
                                                $("#hdnsaveflag").val(2);
                                                cnfrmboxvalue = true;
                                                dbclick = false;
                                                SaveBookingDetail();
                                            },
                                            "No": function () {
                                                $(this).dialog("close");
                                                cnfrmboxvalue = true;
                                                dbclick = false;
                                                return false;
                                            }
                                        }
                                    });
                                }
                                else {
                                    ShowMsg(result.ErrorMessage, $("#mattypeid"));
                                    $("#mattypeid").focus();
                                    cnfrmboxvalue = true;
                                    dbclick = false;
                                    return false;
                                }
                            }
                        },
                        "No": function () {
                            $(this).dialog("close");
                            dbclick = false;
                            cnfrmboxvalue = true;
                            return false;
                        }
                    }
                });
            }


            else {
                dbclick = true;
                qStr = window.location.href.split('#')[0];
                if (qStr.indexOf("?id=") == -1 || qStr.indexOf("&cid=") == -1) {
                    ShowMsg("Login user Logged Out.. Please login");
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }
                userid = qStr.split('?')[1].split('=')[1].split('&')[0];
                centerid = qStr.split('&')[1].split('=')[1];
                if (userid === null || userid === '' || centerid === null || centerid === '') {
                    ShowMsg("Login user Logged Out.. Please login");
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }

                var selecteddate = new Array();
                selecteddate = selectedDateArray.toString();
                var totalOrder = selectedDateArray.toString().split(',').length;
                if (selecteddate == '' || selecteddate == null) {
                    ShowMsg("Please select insertion(s) Date");
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }
                if ($("#txtcardrate").val() == '' || $("#txtcardrate").val() == null) {
                    ShowMsg("Please get Rate");
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }

                if ($('#hdnIsClassified').val() == "1" && $("#hdnautofoldercreationforclassifiedorders").val() == "1") {
                    var classiresult = CreateClassifiedFolder();
                    if (classiresult == 0) {
                        ShowMsg("you do not have sufficient access rights on " + $("#hdnClassifiedMaterialPath").val() + " folder");
                        cnfrmboxvalue = true;
                        dbclick = false;
                        return false;
                    }
                }
                else {
                    if ($('#mattypeid').val() == "3") {
                        var jobresult = CreateJobFolder();
                        if (jobresult == 0) {
                            ShowMsg("you do not have sufficient access rights on " + $("#hdnJobPath").val() + " folder");
                            cnfrmboxvalue = true;
                            dbclick = false;
                            return false;
                        }
                    }
                }
                var rofile = Rofilename;
                if (rofile.length > 0) {
                    var roresult = CreateROFolder();
                    if (roresult == 0) {
                        ShowMsg("you do not have sufficient access rights on " + $("#hdnROFilePath").val() + " folder");
                        cnfrmboxvalue = true;
                        dbclick = false;
                        return false;
                    }
                }

                var url = appRoot + "Booking/GetTableData";
                var param = {};
                param.UserId = userid;
                param.UserType = $('#hdnUserType').val();
                param.IsClassified = $('#hdnIsClassified').val();
                param.IsDigital = $('#hdnIsDigital').val();
                if ($("#txtOrderNo").val() == '' && $("#txtReceiptNo").val() == '' && $("#txtBookingNo").val() == '') {
                    var newdate = new Date();
                    bookingdate = ('0' + newdate.getDate()).slice(-2) + '/' + ('0' + (newdate.getMonth() + 1)).slice(-2) + '/' + newdate.getFullYear() + "  " + ('0' + newdate.getHours()).slice(-2) + ":" + ('0' + newdate.getMinutes()).slice(-2) + ":" + ('0' + newdate.getSeconds()).slice(-2) + "." + newdate.getMilliseconds();
                    $("#hdnbookingdate").val(bookingdate);
                    param.BookingDate = $('#hdnbookingdate').val();
                }
                else {
                    param.BookingDate = $('#hdnbookingdate').val();
                }
                param.RODate = $("#rodatePicker").val();
                param.MachineID = $('#hdnMachineID').val();
                param.MachineName = $('#hdnMachineName').val();
                param.TotalRecordReturn = $("#TotalRecordReturn").val();
                param.UnConfirmReason = $("#uncnfrmrsnid").val();




                if ($('#hdnIsClassified').val() == "0") {
                    param.ApiName = "/SaveDisplayData";
                    var selectadpremia = new Array();
                    selectadpremia = Premiaidlist.toString();
                    param.Premiaid = selectadpremia;
                    if ($("#premiaid").val().trim() == null || $("#premiaid").val().trim() == '') {
                        ShowMsg("Please select Premia", $("#premiaid"));
                        $("#premiaid").focus();
                        cnfrmboxvalue = true;
                        dbclick = false;
                        return false;
                    }
                    if ($("#colorid").val().trim() == null || $("#colorid").val().trim() == '') {
                        ShowMsg("Please select Color", $("#colorid"));
                        $("#colorid").focus();
                        cnfrmboxvalue = true;
                        dbclick = false;
                        return false;
                    }

                    var selectadcolor = new Array();
                    selectadcolor = Coloridlist.toString();
                    param.Colorid = selectadcolor;

                    var selectadsize = new Array();
                    selectadsize = Adsizeidlist.toString();
                    param.Adsizeid = selectadsize;

                    var selectadheight = new Array();
                    selectadheight = AdsizeHeightlist.toString();
                    param.AdsizeHeight = selectadheight;

                    var selectadwidth = new Array();
                    selectadwidth = AdsizeWidthlist.toString();
                    param.AdsizeWidth = selectadwidth;

                    if ($("#adsizeid").val().trim() == null || $("#adsizeid").val().trim() == '') {
                        ShowMsg("Please select Ad Size", $("#adsizeid"));
                        $("#adsizeid").focus();
                        cnfrmboxvalue = true;
                        dbclick = false;
                        return false;
                    }
                    if (adsizeidvalue == "0" && ($("#adsizeid").val().trim() != null || $("#adsizeid").val().trim() != '')) {
                        param.Adsize = $("#adsizeid").val().replace(/ /g, '');
                    }

                    param.Caption = $("#txtitemcaption").val();

                    var adcolumnsize = new Array();
                    adcolumnsize = ColumnSizelist.toString();
                    param.AdColumnSize = adcolumnsize;

                    var gutter = new Array();
                    gutter = Gutterlist.toString();
                    param.Gutter = gutter;

                    param.BillingIns = $('#txtbillingins').val();
                    param.SchedulingIns = $('#txtscheduleins').val();
                    param.ProdInstructions = $('#txtprodins').val();

                    param.Billablesize = $("#billablesize").val().replace(/ /g, '');
                    param.BillableHeight = $("#billablesize").val().replace(/ /g, '').split("*")[0];
                    param.BillableWidth = $("#billablesize").val().replace(/ /g, '').split("*")[1];
                    param.BoxAddress = $('#boxaddressid').val();
                    $("#packageid").val(selectedcyopPE[0]);
                }
                else {
                    param.ApiName = "/SaveClassifiedData";
                    param.Caption = $("#txtclitemcaption").val();
                    param.BillingIns = $('#txtclbillingins').val();
                    param.ProdInstructions = $('#txtclprodins').val();
                    param.AdText = $("#adtext").val();
                    param.AdtypeId1 = AdtypeId1;
                    param.AdtypeId2 = AdtypeId2;
                    param.AdtypeId3 = AdtypeId3;
                    param.AdtypeId4 = AdtypeId4;
                    param.IsCD = $('#iscd').val();
                    param.ClassifiedCol = $('#txtcol').val();
                    param.IsLogo = $("#islogo").val();
                    if ($("#islogo").val() == "1") {
                        var files = $("#file_center").get(0).files;
                        if (files.length > 0) {
                            var fileName = files[0].name;
                            param.FileNames = fileName;
                            $("#lblfile").html(fileName);
                        }
                        else if ($("#lblfile").html() != "") {
                            param.FileNames = $("#lblfile").html();
                        }
                        else {
                            ShowMsg("Please attach File");
                            cnfrmboxvalue = true;
                            dbclick = false;
                            return false;
                        }
                    }
                    else if ($("#iscd").val() == "1") {
                        var files = $("#file_center").get(0).files;
                        if (files.length > 0) {
                            var fileName = files[0].name;
                            param.FileNames = fileName;
                            $("#lblfile").html(fileName);
                        }
                        else {
                            param.FileNames = $("#lblfile").html();
                        }
                    }
                    else {
                        param.FileNames = "";
                    }

                    param.StyleSheetID = $("#stylesheetid").val();
                    if (param.StyleSheetID == 0) {
                        ShowMsg("Please select StyleSheet", $("#stylesheetid"));
                        $("#stylesheetid").focus();
                        cnfrmboxvalue = true;
                        dbclick = false;
                        return false;
                    }

                    // old code
                    //if ($("#iscd").val() == "0") {
                    //    if ($("#adtext").val() == "" || $("#adtext").val() == null) {
                    //        param.TotalWords = "0";
                    //        param.MBodyCount = $("#mbodysize").val();
                    //        param.CharCount = "0";
                    //    }
                    //    else {
                    //        param.TotalWords = $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length;
                    //        if ($("#mbodysize").val() == $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length) {
                    //            param.MBodyCount = $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length;
                    //            $("#mbodysize").val(param.MBodyCount);
                    //        }
                    //        else {
                    //            param.MBodyCount = $("#mbodysize").val();
                    //        }
                    //        param.CharCount = $("#adtext").val().length;
                    //    }
                    //    param.MBodyChange = $("#hdnmbodychange").val();
                    //    param.AdsizeHeight = param.MBodyCount;

                    //    if (param.MBodyCount == null || param.MBodyCount == '' || param.MBodyCount < 1) {
                    //        ShowMsg("Please enter no. of words", $("#mbodysize"));
                    //        $("#mbodysize").focus();
                    //        return false;
                    //    }
                    //    if ($("#islogo").val() == "1") {
                    //        if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
                    //            ShowMsg("Please enter valid Height", $("#txtheight"));
                    //            $("#txtheight").focus();
                    //            return false;
                    //        }
                    //        else {
                    //            param.LogoHeight = $("#txtheight").val();
                    //        }
                    //    }
                    //}
                    //else {
                    //    if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
                    //        ShowMsg("Please enter valid Height", $("#txtheight"));
                    //        $("#txtheight").focus();
                    //        return false;
                    //    }
                    //    else {
                    //        param.MBodyCount = "0";
                    //        param.LogoHeight = "0";
                    //        param.TotalWords = "0";
                    //        param.AdsizeHeight = $("#txtheight").val();
                    //        param.CharCount = "0";
                    //    }
                    //}

                    // new code
                    if ($("#iscd").val() == "0") {
                        if ($("#adtext").val() == "" || $("#adtext").val() == null) {
                            param.TotalWords = "0";
                            param.MBodyCount = $("#mbodysize").val();
                            param.CharCount = "0";
                            param.AdsizeHeight = param.MBodyCount;
                            if (param.MBodyCount < 1) {
                                ShowMsg("Please enter no. of words", $("#mbodysize"));
                                $("#mbodysize").focus();
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }
                        }
                        else {
                            param.TotalWords = $("#adtext").val().replace(/(^\s*)|(\s*$)/gi, "").replace(/[ ]{2,}/gi, " ").replace(/\n /, "\n").split(' ').length;
                            param.MBodyCount = "0";
                            param.CharCount = $("#adtext").val().length;
                            param.AdsizeHeight = param.TotalWords;
                        }
                        param.MBodyChange = $("#hdnmbodychange").val();
                        if (param.MBodyCount == null || param.MBodyCount == '') {
                            ShowMsg("Please enter no. of words", $("#mbodysize"));
                            $("#mbodysize").focus();
                            cnfrmboxvalue = true;
                            dbclick = false;
                            return false;
                        }
                        if ($("#islogo").val() == "1") {
                            if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
                                ShowMsg("Please enter valid Height", $("#txtheight"));
                                $("#txtheight").focus();
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }
                            else {
                                param.LogoHeight = $("#txtheight").val();
                            }
                        }
                    }
                    else {
                        if ($("#txtheight").val().trim() == "" || $("#txtheight").val().trim() == null) {
                            ShowMsg("Please enter valid Height", $("#txtheight"));
                            $("#txtheight").focus();
                            cnfrmboxvalue = true;
                            dbclick = false;
                            return false;
                        }
                        else {
                            param.MBodyCount = "0";
                            param.LogoHeight = "0";
                            param.TotalWords = "0";
                            param.AdsizeHeight = $("#txtheight").val();
                            param.CharCount = "0";
                        }
                    }

                    param.AdsizeWidth = $('#txtcol').val();
                    param.SchedulingIns = "";
                    param.BoxAddress = $('#boxaddressid').val();
                }
                param.CustomerTypeID = $('#hdnIsCustomerType').val();
                param.PaymentTypeID = $('#hdnIsPaymentType').val();
                param.IsManualBilling = $('#hdnIsManualBill').val();
                param.PublicationId = "0";
                var selectedpackage = new Array();
                selectedpackage = $("#packageid").val().toString();
                param.PackageID = selectedpackage;

                if ($("#txtOrderNo").val().trim() == null || $("#txtOrderNo").val().trim() == 0 || $("#txtOrderNo").val().trim() == '') {
                    param.ROID = '';
                }
                else {
                    param.ROID = $("#txtOrderNo").val();
                }
                param.ROStatus = $("#txtrostatus").val();

                var selectstatus = new Array();
                selectstatus = Statuslist.toString();
                param.Status = selectstatus;

                var selectauditstatus = new Array();
                selectauditstatus = AuditStatuslist.toString();
                param.AuditStatus = selectauditstatus;

                if (param.PackageID == null || param.PackageID == '') {
                    ShowMsg("Please select Package", $("#packageiddiv"));
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }
                var selectedpe = new Array();
                selectedpe = pelist.toString();
                param.PEID = selectedpe;
                if ($("#hdnsourceroid").val() == 0) {
                    param.SourceROID = "0";
                }
                else
                    param.SourceROID = $("#hdnsourceroid").val();
                param.ProductID = $("#productid").val();
                param.RONumber = $("#txtronumber").val();
                param.AgencyID = agencyidvalue;
                param.ClientID = clientidvalue;

                if ($('#hdnIsCustomerType').val() == "2") {
                    param.CasualClientName = $("#clientid").val();
                    param.CasualClientAddress = $("#txtcasualAdd").val();
                    if (param.CasualClientAddress.trim() == '') {
                        ShowClientMsg("Please enter Casual Client Address", $("#txtcasualAdd"));
                        //$('#divAddrPopUp').dialog('open');
                        //$("#txtcasualAdd").focus();
                        return false;
                    }
                    param.ContactPerson = '';
                    param.CasualClientCity = $("#ddlcasualcity option:selected").text();
                    param.CasualClientZipCode = $("#txtcasualzip").val();
                    param.CasualClientPhoneNo = $("#txtcasualtelephone").val();
                    param.CasualContactPerson = '';
                    param.CasualClientNicNumber = $("#txtcasualidnum").val();
                    param.CasualClientVatNumber = $("#txtclientvatnum").val();
                    param.CasualClientEmailID = '';
                    param.CasualClientPassword = '';
                }
                else {
                    param.CasualClientName = '';
                    param.CasualClientAddress = '';
                    param.ContactPerson = '';
                    param.CasualClientCity = '';
                    param.CasualClientZipCode = '';
                    param.CasualClientPhoneNo = '';
                    param.CasualContactPerson = '';
                    param.CasualClientNicNumber = '';
                    param.CasualClientVatNumber = '';
                    param.CasualClientEmailID = '';
                    param.CasualClientPassword = '';
                }

                param.CanvassorID = canvassoridvalue;
                param.RevenueCentreID = centerid;
                param.BookingCentreID = centerid;
                var selectadtype = new Array();
                selectadtype = AdtypeIdlist.toString();
                param.AdtypeId = selectadtype;
                if (param.AdtypeId == null || param.AdtypeId == '') {
                    ShowMsg("Please select AdType", $("#adtypeid"));
                    $("#adtypeid").focus();
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }
                param.AdtypeId1 = AdtypeId1;
                param.AdtypeId2 = AdtypeId2;
                param.AdtypeId3 = AdtypeId3;
                param.AdtypeId4 = AdtypeId4;

                var selectuomid = new Array();
                selectuomid = UOMIDlist.toString();
                param.UOMID = selectuomid;

                if (param.UOMID == null || param.UOMID == '') {
                    ShowMsg("Please select UOM", $("#uomid"));
                    $("#uomid").focus();
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }
                param.SMEID = $("#smeid").val();
                param.BrandID = $('#brandid').val();
                param.MaterialType = $("#mattypeid").val();
                param.MaterialSource = $("#matsourceid").val();;
                param.ROType = $('#rotypeid').val();
                param.BillType = $('#billtypeid').val();
                param.RateFieldChanged = $("#hdnratefieldchanged").val();
                param.ItemRateFieldChanged = $("#hdnitemratefieldchanged").val();
                param.BoxTypeID = $('#boxtypeid').val();

                var selectratecardId = new Array();
                selectratecardId = RateCardIDlist.toString();
                param.RateCardID = selectratecardId;

                var selectadrateid = new Array();
                selectadrateid = AdRateIDlist.toString();
                param.AdRateID = selectadrateid;

                var selectcardrate = new Array();
                selectcardrate = CardRatelist.toString();
                param.CardRate = selectcardrate;

                var selectcardamount = new Array();
                selectcardamount = CardAmountlist.toString();
                param.CardAmount = selectcardamount;

                var selectagreedrate = new Array();
                selectagreedrate = AgreedRatelist.toString();
                param.AgreedRate = selectagreedrate;

                var selectagreedamount = new Array();
                selectagreedamount = AgreedAmountlist.toString();
                param.AgreedAmount = selectagreedamount;

                var selectagreeddiscamount = new Array();
                selectagreeddiscamount = AgreedDiscAmountlist.toString();
                param.AgreedDiscAmount = selectagreeddiscamount;

                var selectagreeddiscper = new Array();
                selectagreeddiscper = AgreedDiscPerlist.toString();
                param.AgreedDiscPer = selectagreeddiscper;

                var selectprevatamount = new Array();
                selectprevatamount = PreVATAmountlist.toString();
                param.PreVATAmount = selectprevatamount;


                var selectreceivable = new Array();
                selectreceivable = Receivablelist.toString();
                param.Receivable = selectreceivable;

                var selectvatper = new Array();
                selectvatper = VATPerlist.toString();
                param.VATPer = selectvatper;

                var selectvatamount = new Array();
                selectvatamount = VATAmountlist.toString();
                param.VATAmount = selectvatamount;

                var selectextrachargesper = new Array();
                selectextrachargesper = ExtraChargesPerlist.toString();
                param.ExtraChargesPer = selectextrachargesper;

                var selectextrachargesamount = new Array();
                selectextrachargesamount = ExtraChargesAmountlist.toString();
                param.ExtraChargesAmount = selectextrachargesamount;


                var selectextradiscper = new Array();
                selectextradiscper = ExtraDiscPerlist.toString();
                param.ExtraDiscPer = selectextradiscper;

                var selectextradiscamount = new Array();
                selectextradiscamount = ExtraDiscAmountlist.toString();
                param.ExtraDiscAmount = selectextradiscamount;


                var selectextraboxchargesper = new Array();
                selectextraboxchargesper = ExtraBoxChargesPerlist.toString();
                param.ExtraBoxChargesPer = selectextraboxchargesper;

                var selectextraboxchargesamount = new Array();
                selectextraboxchargesamount = ExtraBoxChargesAmountlist.toString();
                param.ExtraBoxChargesAmount = selectextraboxchargesamount;

                var selectagencycommper = new Array();
                selectagencycommper = AgencyCommissionPerlist.toString();
                param.AgencyCommissionPer = selectagencycommper;

                var selectagencycommamount = new Array();
                selectagencycommamount = AgencyCommissionAmountlist.toString();
                param.AgencyCommissionAmount = selectagencycommamount;

                var selectschemeid = new Array();
                selectschemeid = SchemeIDlist.toString();
                param.SchemeID = selectschemeid;

                var selectschemedetailid = new Array();
                selectschemedetailid = SchemeDetailIDlist.toString();
                param.SchemeDetailID = selectschemedetailid;

                param.DateSelected = selecteddate;
                param.Addfiles = "0";
                param.UserMailID = "0";
                param.UserName = "0";
                param.UserMobile = "0";
                param.TotalOrders = totalOrder;
                param.OrderNumber = "0";
                param.UniqueCode = "0";
                param.AdCartId = "0";
                var totalreceivable = "0";
                var tenderamount = "0";
                if ($("#txtamount").val() != '') {
                    totalreceivable = parseFloat($("#txtamount").val());
                }
                if ($("#txtamount1").val() != '') {
                    totalreceivable = parseFloat($("#txtamount").val()) + parseFloat($("#txtamount1").val());
                }
                if ($("#txtamount2").val() != '') {
                    totalreceivable = parseFloat($("#txtamount").val()) + parseFloat($("#txtamount1").val()) + parseFloat($("#txtamount2").val());
                }
                param.TotalReceivable = totalreceivable;
                param.ReceivableAmount = $("#txtrecevible").val();
                param.ReceiptAmount = $("#txtreceiptamount").val();
                if (param.ReceiptAmount == null || param.ReceiptAmount == '' || param.ReceiptAmount == "0") {
                    if ($("#txtpaymentmodeid option:selected").val() == 1) {
                        tenderamount = parseFloat($("#txtamount").val());
                    }
                    else if ($("#txtpaymentmodeid1 option:selected").val() == 1) {
                        tenderamount = parseFloat($("#txtamount1").val());
                    }
                    else if ($("#txtpaymentmodeid2 option:selected").val() == 1) {
                        tenderamount = parseFloat($("#txtamount2").val());
                    }
                    param.ReceiptAmount = tenderamount;
                }

                param.WriteoffAmount = $("#txtwriteoffamount").html();

                param.PaymentModeID = $("#txtpaymentmodeid").val();
                if (param.PaymentModeID == null || param.PaymentModeID == '')
                    param.PaymentModeID = 0;
                param.PaymentModeID1 = $("#txtpaymentmodeid1").val();
                if (param.PaymentModeID1 == null || param.PaymentModeID1 == '')
                    param.PaymentModeID1 = 0;
                param.PaymentModeID2 = $("#txtpaymentmodeid2").val();
                if (param.PaymentModeID2 == null || param.PaymentModeID2 == '')
                    param.PaymentModeID2 = 0;

                param.ChequeNumber = $("#txtchequenum").val();
                param.ChequeNumber1 = $("#txtchequenum1").val();
                param.ChequeNumber2 = $("#txtchequenum2").val();
                param.ChequeDate = "0";
                param.Amount = $("#txtamount").val();
                param.Amount1 = $("#txtamount1").val();
                param.Amount2 = $("#txtamount2").val();

                param.BankNameID = $("#txtbankname").val();
                param.BankName = $("#txtbankname option:selected").text();
                param.BankID = $("#txtbankname option:selected").attr('bankid');
                param.BranchBankName = $("#txtbankname option:selected").attr('bankname');
                param.BranchName = $("#txtbankname option:selected").attr('branchname');
                if (param.BankNameID == null || param.BankNameID == '')
                    param.BankNameID = 0;
                param.BankNameID1 = $("#txtbankname1").val();
                param.BankName1 = $("#txtbankname1 option:selected").text();
                param.BankID1 = $("#txtbankname1 option:selected").attr('bankid');
                param.BranchBankName1 = $("#txtbankname1 option:selected").attr('bankname');
                param.BranchName1 = $("#txtbankname1 option:selected").attr('branchname');
                if (param.BankNameID1 == null || param.BankNameID1 == '')
                    param.BankNameID1 = 0;
                param.BankNameID2 = $("#txtbankname2").val();
                param.BankName2 = $("#txtbankname2 option:selected").text();
                param.BankID2 = $("#txtbankname2 option:selected").attr('bankid');
                param.BranchBankName2 = $("#txtbankname2 option:selected").attr('bankname');
                param.BranchName2 = $("#txtbankname2 option:selected").attr('branchname');
                if (param.BankNameID2 == null || param.BankNameID2 == '')
                    param.BankNameID2 = 0;

                var orderreceviable = parseFloat($("#txtrecevible").text());
                var totalorderamount = parseFloat($("#txtamount").val()) + parseFloat($("#txtamount1").val()) + parseFloat($("#txtamount2").val());
                if ($("#chkdiffer").prop("checked") == false) {
                    if ($("#hdnIsPaymentType").val() == "1") {
                        var validation = CheckReceiptValidation();
                        if (validation == false) {
                            cnfrmboxvalue = true;
                            dbclick = false;
                            return false;
                        }
                    }
                }

                param.CheckDifferValue = $("#hdnchkdiffer").val();

                var selectedrofilename = new Array();
                selectedrofilename = Rofilename.toString();
                param.RoFileName = selectedrofilename;

                var selectedrofiletype = new Array();
                selectedrofiletype = Rofiletype.toString();
                param.RoFileType = selectedrofiletype;

                var selectedrofiletitle = new Array();
                selectedrofiletitle = Rofiletitle.toString();
                param.RoFileTitle = selectedrofiletitle;

                param.FileLength = Rofilename.length;

                param.list = list;
                param.SaveFlag = $("#hdnsaveflag").val();
                param.IsVatChange = $("#hdnIsVatPer").val();


                $('#divProcessingBox').dialog('open');
                var result = getresult(url, param);
                $('#divProcessingBox').dialog('close');
                result = jQuery.parseJSON(result);
                if (result.IsValid == -2) {
                    ShowMsg(result.ErrorMessage);
                    cnfrmboxvalue = true;
                    dbclick = false;
                    UserLogOut();
                }

                else if (result.IsValid == -12) {
                    cnfrmboxvalue = true;
                    dbclick = false;
                    return false;
                }

                else if (result.IsValid == 0) {
                    $("#hdnROFileRoid").val(result.ROID);
                    $("#hdnROFileJobID").val(result.JobSequence);
                    if ($('#hdnIsClassified').val() == "1" && $("#hdnautofoldercreationforclassifiedorders").val() == "1") {
                        var classiresult = CreateClassifiedFolder();
                        if (classiresult == 0) {
                            ShowMsg("you do not have sufficient access rights on " + $("#hdnClassifiedMaterialPath").val() + " folder");
                            cnfrmboxvalue = true;
                            dbclick = false;
                            return false;
                        }
                    }
                    else {
                        if ($('#mattypeid').val() == "3") {
                            var jobresult = CreateJobFolder();
                            if (jobresult == 0) {
                                ShowMsg("you do not have sufficient access rights on " + $("#hdnJobPath").val() + " folder");
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }
                        }
                    }
                    var rofile = Rofilename;;
                    if (rofile.length > 0) {
                        var roresult = CreateROFolder();
                        if (roresult == 0) {
                            ShowMsg("you do not have sufficient access rights on " + $("#hdnROFilePath").val() + " folder");
                            cnfrmboxvalue = true;
                            dbclick = false;
                            return false;
                        }
                        else {
                            var roresult = SaveBookingFile();
                            if (roresult == 0) {
                                ShowMsg("you do not have sufficient access rights on " + $("#hdnROFilePath").val() + " folder");
                                cnfrmboxvalue = true;
                                dbclick = false;
                                return false;
                            }
                        }
                    }

                    if ($("#hdnIsPaymentType").val() == 2 && result.ReceiptID == 0) {
                        var fullmsg = "";
                        if (result.ErrorMessage == null) {
                            cnfrmboxvalue = true;
                            return false;
                        }
                        var msglength = result.ErrorMessage.split('.')[1].trim().split('\r').length;
                        for (var i = 0; i < msglength; i++) {
                            if (i == 0)
                                fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[0] + "</span><span style='color:#385723;font-weight:600;margin-left:35px;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[1] + "</span>";
                            else
                                fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[i].replace('-', '') + "</span>";
                        }

                        var msg = "<span style='color:#385723;'>" + result.ErrorMessage.split('.')[0] + "." + "</span>" + fullmsg + "</span>";

                        $('<div title="Adpro"></div>').html(msg).dialog({
                            show: 'blind',
                            closeOnEscape: false,
                            autoOpen: true,
                            hide: 'fold',
                            modal: true,
                            dialogClass: "base-message",
                            buttons: {
                                "Ok": function () {
                                    $(this).dialog("close");
                                    $(this).parent().hide();
                                    dbclick = false;
                                    setTimeout(function () {
                                        RefreshBooking();
                                    }, 50);
                                    return false;
                                }
                            }
                        });
                    }

                    else if ($("#hdnIsPaymentType").val() == 1 && result.ReceiptID == 0) {
                        var fullmsg = "";
                        if (result.ErrorMessage == null) {
                            cnfrmboxvalue = true;
                            return false;
                        }
                        var msglength = result.ErrorMessage.split('.')[1].trim().split('\r').length;
                        for (var i = 0; i < msglength; i++) {
                            if (i == 0)
                                fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[0] + "</span><span style='color:#385723;font-weight:600;margin-left:35px;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[1] + "</span>";
                            else
                                fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[i].replace('-', '') + "</span>";
                        }

                        var msg = "<span style='color:#385723;'>" + result.ErrorMessage.split('.')[0] + "." + "</span>" + fullmsg + "</span>";

                        $('<div title="Adpro"></div>').html(msg).dialog({
                            show: 'blind',
                            closeOnEscape: false,
                            autoOpen: true,
                            hide: 'fold',
                            modal: true,
                            dialogClass: "base-message",
                            buttons: {
                                "Ok": function () {
                                    $(this).dialog("close");
                                    $(this).parent().hide();
                                    if (agencyidvalue == 0 && $("#hdnIsGetClientClicked").val() == 1) {
                                        if ($('#hdnIsClassified').val() == "1") {
                                            $('input[type="text"]').val('');
                                            $('textarea').val('');
                                            cleartable();
                                            EnableElement();
                                            $("[val='1']").click();
                                        }
                                        else {
                                            $('input[type="text"]').val('');
                                            cleartable();
                                            EnableElement();
                                            $("[val='0']").click();
                                        }
                                        $("#hdnratefieldchanged").val(0);
                                        $("#hdnitemratefieldchanged").val(0);
                                        $("#NetReceivableForReceipt").val('');
                                        $('input[type="text"]').removeClass('RateColor');
                                        $("#hdnsaveflag").val(0);
                                        CleararrayList();
                                        list = [];
                                        ispefocus = false;
                                        ctrlupress = false;
                                        $("#clientid").css('width', '85%');
                                        $("#clientadd").css('display', '');
                                        $("#clientid").addClass('noncapitalise');
                                        $("#customertypetoggle").prop("checked", false);
                                        $("#paymenttypetoggle").prop("checked", false);
                                        $("#paylabel").css('pointer-events', 'none');
                                        $("#billtypeid").prop("disabled", "disabled");
                                        $("#hdnIsCustomerType").val(2);
                                        $("#isVatPer").prop("checked", false);
                                        SwitchtoggleTypeValue();
                                        IsVatPerCheck();
                                        IsGetClientClicked = false;
                                        setTimeout(function () {
                                            $("#clientid").focus();
                                        }, 500);
                                        dbclick = false;
                                        return false;
                                    }
                                    else {
                                        dbclick = false;
                                        setTimeout(function () {
                                            RefreshBooking();
                                        }, 50);
                                        return false;
                                    }

                                }
                            }
                        });
                    }

                    if ($("#hdnIsPaymentType").val() == 1 && result.ReceiptID > 0) {
                        var fullmsg = "";
                        if (result.ErrorMessage == null) {
                            cnfrmboxvalue = true;
                            return false;
                        }
                        var msglength = result.ErrorMessage.split('.')[1].trim().split('\r').length;
                        for (var i = 0; i < msglength; i++) {
                            if (i == 0)
                                fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[0] + "</span><span style='color:#385723;font-weight:600;margin-left:35px;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[0].split('-')[1] + "</span>";
                            else
                                fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[i].replace('-', '') + "</span>";
                        }
                        var msg = "<span style='color:#385723;'>" + result.ErrorMessage.split('.')[0] + "." + "</span>" + fullmsg + "<br />" + "<span style='color:#385723;'>" + "\nDo you want to print receipt?" + "</span>";
                        $('<div title="Adpro"></div>').html(msg).dialog({
                            show: 'blind',
                            closeOnEscape: false,
                            autoOpen: true,
                            hide: 'fold',
                            modal: true,
                            dialogClass: "base-message",
                            buttons: {
                                "Ok": function () {
                                    $(this).dialog("close");
                                    $(this).parent().hide();
                                    Csvfilecount = 0;
                                    $('#txtReceiptNo').val(result.ReceiptID);
                                    PrintfileDownload();
                                    $('#txtReceiptNo').val('');
                                    setTimeout(function () {
                                        RefreshBooking();
                                    }, 5000);
                                    dbclick = false;
                                    return false;
                                },
                                Cancel: function () {
                                    $(this).dialog("close");
                                    if (agencyidvalue == 0 && $("#hdnIsGetClientClicked").val() == 1) {
                                        if ($('#hdnIsClassified').val() == "1") {
                                            $('input[type="text"]').val('');
                                            $('textarea').val('');
                                            cleartable();
                                            EnableElement();
                                            $("[val='1']").click();
                                        }
                                        else {
                                            $('input[type="text"]').val('');
                                            cleartable();
                                            EnableElement();
                                            $("[val='0']").click();
                                        }
                                        $("#hdnratefieldchanged").val(0);
                                        $("#hdnitemratefieldchanged").val(0);
                                        $("#NetReceivableForReceipt").val('');
                                        $('input[type="text"]').removeClass('RateColor');
                                        $("#hdnsaveflag").val(0);
                                        CleararrayList();
                                        list = [];
                                        ispefocus = false;
                                        ctrlupress = false;
                                        $("#clientid").css('width', '85%');
                                        $("#clientadd").css('display', '');
                                        $("#clientid").addClass('noncapitalise');
                                        $("#customertypetoggle").prop("checked", false);
                                        $("#paymenttypetoggle").prop("checked", false);
                                        $("#paylabel").css('pointer-events', 'none');
                                        // $("#customerlabel").css('pointer-events', 'none');
                                        $("#billtypeid").prop("disabled", "disabled");
                                        $("#hdnIsCustomerType").val(2);
                                        $("#isVatPer").prop("checked", false);
                                        SwitchtoggleTypeValue();
                                        IsVatPerCheck();
                                        IsGetClientClicked = false;
                                        setTimeout(function () {
                                            $("#clientid").focus();
                                        }, 500);
                                        dbclick = false;
                                        return false;
                                    }
                                    else {
                                        dbclick = false;
                                        setTimeout(function () {
                                            RefreshBooking();
                                        }, 50);
                                        return false;
                                    }
                                }
                            }
                        });
                    }
                }

                else {
                    if (result.IsValid == 2) {

                        $('<div title="Adpro"></div>').html(result.ErrorMessage).dialog({
                            show: 'blind',
                            closeOnEscape: false,
                            autoOpen: true,
                            hide: 'fold',
                            modal: true,
                            dialogClass: "base-message",
                            buttons: {
                                "Yes": function () {
                                    $(this).dialog("close");
                                    $("#hdnsaveflag").val(1);
                                    dbclick = false;
                                    SaveBookingDetail();
                                },
                                "No": function () {
                                    $(this).dialog("close");
                                    dbclick = false;
                                    return false;
                                }
                            }
                        });

                    }
                    else if (result.IsValid == 3) {

                        $('<div title="Adpro"></div>').html(result.ErrorMessage).dialog({
                            show: 'blind',
                            closeOnEscape: false,
                            autoOpen: true,
                            hide: 'fold',
                            modal: true,
                            dialogClass: "base-message",
                            buttons: {
                                "Yes": function () {
                                    $(this).dialog("close");
                                    $("#hdnsaveflag").val(2);
                                    dbclick = false;
                                    SaveBookingDetail();
                                },
                                "No": function () {
                                    $(this).dialog("close");
                                    dbclick = false;
                                    return false;
                                }
                            }
                        });

                    }
                    else {
                        ShowMsg(result.ErrorMessage, $("#mattypeid"));
                        $("#mattypeid").focus();
                        cnfrmboxvalue = true;
                        dbclick = false;
                        return false;
                    }
                }
            }

        }, 100)

    }

}

function GetBookingDetail() {
    var bkngid = $("#txtBookingNo").val();
    ClearMainScreenFields();
    $("#txtBookingNo").val(bkngid);
    $("#hdnBlockdate").val('');
    $("#hdnsaveflag").val(1);
    $("#bookingGrid").html('');
    $('.action-bar').css('pointer-events', 'auto');
    OrderlevelinfoEnable();
    OrderlevelEnable();
    EnableNewReciptPopup();
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var bookingid = $("#txtBookingNo").val();
    if (bookingid == null || bookingid == '') {
        ShowMsg('Please enter BookingID', $("#txtBookingNo"));
        $("#txtBookingNo").focus();
        return false;
    }
    else if (bookingid != '' && (isNaN(parseInt(bookingid))) || (bookingid.toString().length > 6 && bookingid.toString().length < 10)) {
        ShowMsg('Invalid bookingID');
        return false;
    }
    else if (bookingid.toString().length >= 1 && bookingid.toString().length <= 7) {
        var n = serverDate.getFullYear() - 1000;
        bookingid = parseInt(n) * 1000000 + parseInt(bookingid);
        $("#txtBookingNo").val(bookingid);
    }
    $("#lblfile").html('');
    $("#lblfile").text('');
    $("#file_center").val('');
    $("#file_center").attr('title', 'No file chosen');
    var strxml = "";
    Rofilename = [];
    Rofiletype = [];
    Rofiletitle = [];
    CleararrayList();
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/GetBookingIDData";
    param.BookingID = $("#txtBookingNo").val();
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    var package;
    var CardRate = 0;
    var AgreedDiscAmount = 0;
    var CardAmount = 0;
    var AgreedAmount = 0;
    var ExtraChargesAmount = 0;
    var ExtraDiscAmount = 0;
    var ExtraBoxChargesAmount = 0;
    var AgencyCommissionAmount = 0;
    var PreVATAmount = 0;
    var VATAmount = 0;
    var Receivable = 0;

    //var openselectedpackage = new Array();
    //openselectedpackage = $("#packageid").val().toString();
    //openpackagelength = $("#packageid").val().toString().split(',').length;
    //openpeidlength = selectpeidlist.toString().split(',').length;

    if (result.OpenOrder[0].IsValid == 1) {
        ShowMsg(result.OpenOrder[0].ErrorMessage);
        $("#txtBookingNo").val('');
        return false;
    }

    else if (result.OpenOrder.length > 0 || result.ReceiptOrder.length > 0) {

        if (result.OpenOrder[0].IsClassified == 1) {
            if ($("#hdnallowclassified").val() == 0) {
                ShowMsg("Order can not be opened - Display");
                $("#txtBookingNo").val('');
                return false;
            }
        }
        else {
            if ($("#hdnallowdisplay").val() == 0) {
                ShowMsg("Order can not be opened - Classified");
                $("#txtBookingNo").val('');
                return false;
            }
        }

        if (result.OpenOrder[0].IsManualBilling == "1") {
            if ($("#hdnallowmanualbilling").val() == 0) {
                ShowMsg("Order can not be opened - Manual");
                $("#txtBookingNo").val('');
                return false;
            }
        }

        var url1 = appRoot + "Booking/GetGridData";
        var param_Ist = {};
        var result1 = getresult(url1, param_Ist);

        $('[parameter=DateEditable]').val(1);
        ispefocus = true;
        var selectedpearray = new Array();
        selectedDateArray = [];
        selectedPEwithValidDays = [];
        selectedcyopPE = [];
        disabledDates = [];
        $("#hdnauditdate").val('');
        list = [];
        var count = 0;
        checkdate = 0;
        var bookingid = $("#txtBookingNo").val();
        if (result.OpenOrder[0].IsClassified == 1) {
            if ($('#hdnIsClassified').val() != "1" || $('#hdnIsDigital').val() == "1") {
                $('#hdnIsDigital').val('0');
                $("[val='1']").click();
            }
        }
        else if (result.OpenOrder[0].IsDigital == 1) {
            $('#hdnIsDigital').val('1');
            $("[val='2']").click();
        }
        else {
            if ($('#hdnIsClassified').val() == "1" || $('#hdnIsDigital').val() == "1") {
                $('#hdnIsDigital').val('0');
                $("[val='0']").click();
            }
        }
        $("#txtBookingNo").val(bookingid);
        $('#adtypeid').val(result.OpenOrder[0].AdTypeID);
        BindPackageControl();
        $('#productid').val(result.OpenOrder[0].ProductID);
        BindBrandControl();
        $('#brandid').val(result.OpenOrder[0].BrandID);
        allowcasualclientid = result.OpenOrder[0].AllowCasualClient;
        var agreeddiscountper = "";
        var agreedrate = "";
        var CardRate = 0;
        var NewCardRate = 0;
        var ExtraBoxChargesAmount = 0;
        $('#datePicker').datepicker('option', 'minDate', null);

        $("#agencyid").val(result.OpenOrder[0].AgencyName);
        agencyidvalue = result.OpenOrder[0].AgencyID;
        agencypaymentmode = result.OpenOrder[0].AgencyPaymentMode;
        clientidvalue = result.OpenOrder[0].ClientID;
        if (clientidvalue <= 0) {

            $("#clientid").val(result.OpenOrder[0].CasualClientName);
        }
        else
            $("#clientid").val(result.OpenOrder[0].ClientName);
        $("#canvassorid").val(result.OpenOrder[0].CanvassorName);
        canvassoridvalue = result.OpenOrder[0].CanvassorID;
        $('#txtronumber').val(result.OpenOrder[0].RONumber);
        $("#rodatePicker").datepicker("setDate", result.OpenOrder[0].RODate.substring(0, 10).replace('-', '/').replace('-', '/'));
        $("#hdnbookingdate").val(result.OpenOrder[0].BookingDate);
        $('#adtypeid').val(result.OpenOrder[0].AdTypeID);
        $('#uomid').val(result.OpenOrder[0].UOM);
        $('#smeid').val(result.OpenOrder[0].SMEID);

        $('#mattypeid').val(result.OpenOrder[0].MaterialType);
        mattypeidvalue = $('#mattypeid').val();
        $('#matsourceid').val(result.OpenOrder[0].MaterialSource);
        $('#rotypeid').val(result.OpenOrder[0].ROType);
        $("#uncnfrmrsnid").val(result.OpenOrder[0].ReasonForUnconfirmationID);
        $('#billtypeid').val(result.OpenOrder[0].BillType);
        $('#boxtypeid').val(result.OpenOrder[0].BoxTypeID);
        $('#boxaddressid').val(result.OpenOrder[0].BoxAddress);

        for (var i = 0; i < result.OpenOrder.length; i++) {
            selectedpearray.push(result.OpenOrder[i].PackageID);
            selectedcyopPE.push(selectedpearray);
            if (selectedcyopPE[0] == "") {
                selectedcyopPE = [];
                selectedcyopPE.push(selectedpearray);
            }
            if (i == result.OpenOrder.length - 1) {
                $("#packageid").val(selectedpearray).trigger('chosen:updated');
                OrerPEChange();
            }
            $("#hdnreadonly").val(result.OpenOrder[i].ReadOnlyFlag);
            $('[parameter=ProductionDate]').append(new Option(result.OpenOrder[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/'), result.OpenOrder[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/')));
            mindt = $('[parameter=ProductionDate]').find('option').eq(0).val();
            $('#datePicker').datepicker("setDate", new Date(mindt.split('/')[1] + '/' + mindt.split('/')[0] + '/' + mindt.split('/')[2]));
            $('#datePicker').datepicker("refresh");
            selectedDateArray.push(result.OpenOrder[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/'));

            //$("#agencyid").val(result.OpenOrder[i].AgencyName);
            //agencyidvalue = result.OpenOrder[i].AgencyID;
            //agencypaymentmode = result.OpenOrder[i].AgencyPaymentMode;
            //clientidvalue = result.OpenOrder[i].ClientID;
            //if (clientidvalue <= 0) {

            //    $("#clientid").val(result.OpenOrder[i].CasualClientName);
            //}
            //else
            //    $("#clientid").val(result.OpenOrder[i].ClientName);
            //$("#canvassorid").val(result.OpenOrder[i].CanvassorName);
            //canvassoridvalue = result.OpenOrder[i].CanvassorID;
            //$('#txtronumber').val(result.OpenOrder[i].RONumber);
            //$("#rodatePicker").datepicker("setDate", result.OpenOrder[i].RODate.substring(0, 10).replace('-', '/').replace('-', '/'));
            //$("#hdnbookingdate").val(result.OpenOrder[i].BookingDate);
            //$('#adtypeid').val(result.OpenOrder[i].AdTypeID);
            //$('#uomid').val(result.OpenOrder[i].UOM);
            //$('#smeid').val(result.OpenOrder[i].SMEID);

            //$('#mattypeid').val(result.OpenOrder[i].MaterialType);
            //mattypeidvalue = $('#mattypeid').val();
            //$('#matsourceid').val(result.OpenOrder[i].MaterialSource);
            //$('#rotypeid').val(result.OpenOrder[i].ROType);
            //$("#uncnfrmrsnid").val(result.OpenOrder[i].ReasonForUnconfirmationID);
            //$('#billtypeid').val(result.OpenOrder[i].BillType);
            //$('#boxtypeid').val(result.OpenOrder[i].BoxTypeID);
            //$('#boxaddressid').val(result.OpenOrder[i].BoxAddress);

            if (result.OpenOrder[0].IsClassified != 1) {

                $("#premiaid").val(result.OpenOrder[i].PremiaName);

                premiaidvalue = result.OpenOrder[i].PremiaID;
                premianame = result.OpenOrder[i].PremiaName;
                OpenPremiaDetails(result.OpenOrder[i].PremiaName);
                if (result.OpenOrder[i].SizeName == '') {
                    $("#adsizeid").val(result.OpenOrder[i].Adsize);
                    adsizename = result.OpenOrder[i].Adsize;
                    adheightvalue = adsizename.replace(/ /g, '').split("*")[0];
                    adsizecolvalue = adsizename.replace(/ /g, '').split("*")[1];
                }
                else {
                    $("#adsizeid").val(result.OpenOrder[i].SizeName);
                    adsizename = result.OpenOrder[i].SizeName;
                    OpenAdsizeDetails(result.OpenOrder[i].SizeName);
                }
                adsizeidvalue = result.OpenOrder[i].AdsizeID;
                $("#colorid").val(result.OpenOrder[i].ColorName);
                coloridvalue = result.OpenOrder[i].ColorID;
                colorname = result.OpenOrder[i].ColorName;
                $("#billablesize").val(result.OpenOrder[i].BillableSize);
                $("#txtitemcaption").val(result.OpenOrder[i].Caption);
            }

            else {
                $("#txtclitemcaption").val(result.OpenOrder[i].Caption);
                $("#iscd").val(result.OpenOrder[i].IsCD);
                $("#islogo").val(result.OpenOrder[i].IsLogo);
                if ($("#iscd").val() == 0) {
                    $("#mbodysize").val(result.OpenOrder[i].MBodyCount);
                    if (result.OpenOrder[i].IsLogo == "1") {
                        $("#txtheight").val(result.OpenOrder[i].FileHeight);
                        HeightLogo = result.OpenOrder[i].FileHeight;
                    }
                    else {
                        $("#txtheight").val('');
                    }
                }
                else {
                    $("#mbodysize").val('');
                    $("#txtheight").val(result.OpenOrder[i].BillableHeight);
                    HeightLogo = result.OpenOrder[i].BillableHeight;
                }
                if (result.OpenOrder[0].IsClassified == 1) {
                    $("#iscd").change();
                }
                $("#txtcol").val(result.OpenOrder[i].AdColumns);
                $("#stylesheetid").val(result.OpenOrder[i].StyleSheetID);

                if (result.OpenOrder[i].FileNames != "") {
                    $("#lblfile").html(result.OpenOrder[i].FileNames);
                    $('#file_center').attr('title', result.OpenOrder[i].FileNames);
                }

                $("#adtext").val(result.OpenOrder[i].U_BodyText);
                $("#categoryid").val(result.OpenOrder[i].AdClassification);
                AdtypeId1 = result.OpenOrder[i].AdtypeID1;
                AdtypeId2 = result.OpenOrder[i].AdtypeID2;
                AdtypeId3 = result.OpenOrder[i].AdtypeID3;
                AdtypeId4 = result.OpenOrder[i].AdtypeID4;
            }

            CardRate = CardRate + result.OpenOrder[i].CardRate;

            var insnum = result.OpenOrder[0].InsNum; // 1
            if (insnum == result.OpenOrder[i].InsNum) {
                NewCardRate = NewCardRate + result.OpenOrder[i].CardRate;
                $("#txtcardrate").val(NewCardRate);
            }
            agreeddiscountper = result.OpenOrder[0].AgreedDiscPer;
            AgreedDiscAmount = AgreedDiscAmount + result.OpenOrder[i].AgreedDiscAmount;
            $("#txtagreeddiscountamount").val(AgreedDiscAmount);
            CardAmount = CardAmount + result.OpenOrder[i].CardAmount;
            $("#txtcardamount").val(CardAmount);
            AgreedAmount = AgreedAmount + result.OpenOrder[i].AgreedAmount;
            $("#txtagreedamount").val(AgreedAmount.toFixed(2));

            $("#txtextrachargeper").val(result.OpenOrder[i].ExtraChargesPer);
            ExtraChargesAmount = ExtraChargesAmount + result.OpenOrder[i].ExtraChargesForPE;
            $("#txtextrachargeamount").val(ExtraChargesAmount.toFixed(2));

            $("#txtextradisper").val(result.OpenOrder[i].ExtraDiscPer);
            ExtraDiscAmount = ExtraDiscAmount + result.OpenOrder[i].ExtraDiscAmount;
            $("#txtextradisamount").val(ExtraDiscAmount.toFixed(2));


            $("#hdnratefieldchanged").val(result.OpenOrder[i].RateFieldChanged);
            $("#hdnitemratefieldchanged").val(result.OpenOrder[i].ItemRateFieldChanged);

            $("#txtboxchargeper").val(result.OpenOrder[i].ExtraBoxChargesPer);

            //if (insnum == result.OpenOrder[i].InsNum) {
            //    ExtraBoxChargesAmount = ExtraBoxChargesAmount + result.OpenOrder[i].ExtraBoxChargesAmount;
            //}
            ExtraBoxChargesAmount = result.OpenOrder[0].ExtraBoxChargesAmount;
            $("#txtboxchargeamount").val(ExtraBoxChargesAmount);
            $("#txtcommisionper").val(result.OpenOrder[i].CommissionPer);
            AgencyCommissionAmount = AgencyCommissionAmount + result.OpenOrder[i].CommissionAmount;
            $("#txtcommisionamount").val(AgencyCommissionAmount);
            PreVATAmount = PreVATAmount + result.OpenOrder[i].PreVATAmountforPE;
            $("#txtprevatamount").val(PreVATAmount);
            $("#txtvatper").val(result.OpenOrder[i].VatPer);
            VATAmount = VATAmount + result.OpenOrder[i].VatAmount;
            $("#txtvatamount").val(VATAmount);
            agreedrate = result.OpenOrder[0].AgreedRate;
            $('#txtratecardid').val(result.OpenOrder[i].RateCardID);
            $('#txtadrateid').val(result.OpenOrder[i].AdRateID);

            $("#txtagreeddiscountamount").html(AgreedDiscAmount.toFixed(2));
            $("#txtcardamount").html(CardAmount.toFixed(2));
            $("#txtboxchargeper").html(result.OpenOrder[i].ExtraBoxChargesPer + "%");
            $("#txtboxchargeamount").html(ExtraBoxChargesAmount.toFixed(2));
            $("#txtcommisionper").html(result.OpenOrder[i].CommissionPer + "%");
            $("#txtcommisionamount").html(AgencyCommissionAmount.toFixed(2));
            $("#txtprevatamount").html(PreVATAmount.toFixed(2));
            //$('#txtvatper').html(result.OpenOrder[i].VatPer + "%");
            $("#txtvatamount").html(VATAmount.toFixed(2));
            $('#txtratecardid').html(result.OpenOrder[i].RateCardID);
            $('#txtadrateid').html(result.OpenOrder[i].AdRateID);
            $("#txtrostatus").val(result.OpenOrder[i].ROStatus);
            $("#txtstatus").val(result.OpenOrder[i].Status);
            $("#txtauditstatus").val(result.OpenOrder[i].AuditStatus);
            $('#hdninsnum').val(result.OpenOrder[0].InsNum);
            $('#hdnroid').val(result.OpenOrder[0].ROID);
            $('#spnroid').text(result.OpenOrder[0].ROID);
            $('#hdnsourceroid').val(result.OpenOrder[0].BookingID);
            $('#txtscheduleins').val(result.OpenOrder[i].SchedulingInstructions);

            if (result.OpenOrder[0].IsClassified == 1) {
                $('#txtclbillingins').val(result.OpenOrder[i].BillingInstruction);
                $('#txtclprodins').val(result.OpenOrder[i].ProdInstructions);
            }
            else {
                $('#txtbillingins').val(result.OpenOrder[i].BillingInstruction);
                $('#txtprodins').val(result.OpenOrder[i].ProdInstructions);
            }

            BindGridControl();
            callInnerBoxHover();
            $('#uomid').val(result.OpenOrder[i].UOM);

            AdtypeIdlist.push(result.OpenOrder[i].AdTypeID);

            Adsizeidlist.push(result.OpenOrder[i].AdsizeID);
            result1.AdsizeID = result.OpenOrder[i].AdsizeID;

            AdsizeHeightlist.push(result.OpenOrder[i].BillableHeight);
            AdsizeWidthlist.push(result.OpenOrder[i].BillableColSize);
            Premiaidlist.push(result.OpenOrder[i].PremiaID);
            result1.PremiaID = result.OpenOrder[i].PremiaID;
            Coloridlist.push(result.OpenOrder[i].ColorID);
            result1.ColorID = result.OpenOrder[i].ColorID;

            MaterialTypelist.push(result.OpenOrder[i].MaterialType);
            MaterialSourcelist.push(result.OpenOrder[i].MaterialSource);
            BoxTypeIDlist.push(result.OpenOrder[i].BoxTypeID);
            UOMIDlist.push(result.OpenOrder[i].UOM);
            Statuslist.push(result.OpenOrder[i].Status);
            AuditStatuslist.push(result.OpenOrder[i].AuditStatus);
            CardRatelist.push(result.OpenOrder[i].CardRate);
            CardAmountlist.push(result.OpenOrder[i].CardAmount);
            RateCardIDlist.push(result.OpenOrder[i].RateCardID);
            AdRateIDlist.push(result.OpenOrder[i].AdRateID);

            AgreedRatelist.push(result.OpenOrder[i].AgreedRate);
            result1.AgreedRate = result.OpenOrder[i].AgreedRate;

            AgreedAmountlist.push(result.OpenOrder[i].AgreedAmount);
            result1.AgreedAmount = result.OpenOrder[i].AgreedAmount;

            AgreedDiscPerlist.push(result.OpenOrder[i].AgreedDiscPer);
            result1.AgreedDiscPer = result.OpenOrder[i].AgreedDiscPer;

            AgreedDiscAmountlist.push(result.OpenOrder[i].AgreedDiscAmount);
            result1.AgreedDiscAmount = result.OpenOrder[i].AgreedDiscAmount;

            PreVATAmountlist.push(result.OpenOrder[i].PreVATAmountforPE);
            VATPerlist.push(result.OpenOrder[i].VatPer);
            VATAmountlist.push(result.OpenOrder[i].VatAmount);
            AgencyCommissionPerlist.push(result.OpenOrder[i].CommissionPer);
            AgencyCommissionAmountlist.push(result.OpenOrder[i].CommissionAmount);
            SchemeIDlist.push(result.OpenOrder[i].SchemeID);
            SchemeDetailIDlist.push(result.OpenOrder[i].SchemeDetailID);

            ExtraChargesPerlist.push(result.OpenOrder[i].ExtraChargesPer);
            result1.ExtraChargesPer = result.OpenOrder[i].ExtraChargesPer;

            ExtraChargesAmountlist.push(result.OpenOrder[i].ExtraChargesForPE);
            result1.ExtraChargesAmount = result.OpenOrder[i].ExtraChargesForPE;

            ExtraDiscPerlist.push(result.OpenOrder[i].ExtraDiscPer);
            result1.ExtraDiscPer = result.OpenOrder[i].ExtraDiscPer;

            ExtraDiscAmountlist.push(result.OpenOrder[i].ExtraDiscAmount);
            result1.ExtraDiscAmount = result.OpenOrder[i].ExtraDiscAmount;

            ExtraBoxChargesPerlist.push(result.OpenOrder[i].ExtraBoxChargesPer);
            result1.ExtraBoxChargesPer = result.OpenOrder[i].ExtraBoxChargesPer;

            ExtraBoxChargesAmountlist.push(result.OpenOrder[i].ExtraBoxChargesAmount);
            result1.ExtraBoxChargesAmount = result.OpenOrder[i].ExtraBoxChargesAmount;

            Receivablelist.push(result.OpenOrder[0].Receivable);
            list.push(result1);
        }

        //$("#packageid").val(selectedpearray).trigger('chosen:updated');
        //OrerPEChange();
        if (result.OpenOrder[0].FileNames != "") {
            $("#lblfile").html(result.OpenOrder[0].FileNames);
            $('#file_center').attr('title', result.OpenOrder[0].FileNames);
        }

        $("#ins").val(selectedDateArray.length);

        $("#hdnBlockdate").val(result.OpenOrder[0].BlockB4ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/'));

        $('#bookingGrid tr:not(:first-child)').remove();

        var spilitreceivable = parseFloat(0 + "." + parseInt(result.OpenOrder[0].Receivable.toString().split('.')[1]));
        if (spilitreceivable >= .50) {

            $("#txtrecevible").val(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#txtrecevible").html(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#NetReceivableForCheck").val(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
            // $("#NetReceivableForReceipt").val(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
        }
        else {
            $("#txtrecevible").val(parseFloat(Math.floor(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#txtrecevible").html(parseFloat(Math.floor(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#NetReceivableForCheck").val(parseFloat(Math.floor(result.OpenOrder[0].Receivable)).toFixed(2));
        }
        $("#txtnetamount").val(result.OpenOrder[0].Net);
        $("#txtnetamount").html(result.OpenOrder[0].Net.toFixed(2));
        LoadSwitchValue();
        if (result.OpenOrder[0].PaymentModeID == "2") {
            $("#paymenttypetoggle").prop("checked", true);
            $("#hdnIsPaymentType").val(result.OpenOrder[0].PaymentModeID);
            $("#tblreceipt").find("input,button,select").attr("disabled", "disabled");
            $("#tblreceipt").css('display', 'none');
            EnableElement();
            $(".navigation-item").css('pointer-events', 'none');
            $(".switch-set-right").css('pointer-events', 'none');
            $("#hdnIsCredit").val(1);
        }
        else {
            $("#paymenttypetoggle").prop("checked", false);
            $("#hdnIsPaymentType").val(result.OpenOrder[0].PaymentModeID);
            $("#tblreceipt").find("input,button,select").removeAttr("disabled");
            $("#tblreceipt").css('display', '');

            DisableElement();
        }
        if (result.OpenOrder[0].CustomerTypeID == "1") {
            $("#customertypetoggle").prop("checked", true);
            $("#hdnIsCustomerType").val(result.OpenOrder[0].CustomerTypeID);
            $("#clientid").css('width', '100%');
            $("#clientadd").css('display', 'none');
        }
        else {
            $("#customertypetoggle").prop("checked", false);
            $("#hdnIsCustomerType").val(result.OpenOrder[0].CustomerTypeID);
            $("#clientid").css('width', '85%');
            $("#clientadd").css('display', '');
            $("#txtcasualAdd").val(result.OpenOrder[0].CasualAddress);
            $("#ddlcasualcity").val(result.OpenOrder[0].CityID);
            $("#txtcasualzip").val(result.OpenOrder[0].Zip);
            $("#txtcasualtelephone").val(result.OpenOrder[0].Phone);
            $("#txtcasualidnum").val(result.OpenOrder[0].NicNumber);
            $("#txtclientvatnum").val(result.OpenOrder[0].VatNumber);
        }

        if (result.OpenOrder[0].IsManualBilling == "1") {
            $("#manualbilltoggle").prop("checked", true);
            $("#hdnIsManualBill").val(result.OpenOrder[0].IsManualBilling);
        }
        else {
            $("#manualbilltoggle").prop("checked", false);
            $("#hdnIsManualBill").val(result.OpenOrder[0].IsManualBilling);
        }

        if (result.OpenOrder[0].DeferredPayment == 1) {
            $("#chkdiffer").prop("checked", true);
            $("#hdnchkdiffer").val(result.OpenOrder[0].DeferredPayment);
        }
        else {
            $("#chkdiffer").prop("checked", false);
            $("#hdnchkdiffer").val(result.OpenOrder[0].DeferredPayment);
        }

        //if (result.OpenOrder[0].IsVatChange == 1) {
        //    $("#isVatPer").prop("checked", true);
        //    $("#hdnIsVatPer").val(1);
        //    $("#txtvatper").removeAttr("disabled");
        //}
        //else {
        //    $("#isVatPer").prop("checked", false);
        //    $("#hdnIsVatPer").val(0);
        //    $("#txtvatper").attr("disabled", "disabled");
        //}

        if (result.ReceiptOrder.length > 0 && result.OpenOrder[0].CompositeReceiptID == 0) {
            for (var i = 0; i < result.ReceiptOrder.length; i++) {
                // Receipt Detail
                $("#spnreceiptnum").text(result.ReceiptOrder[0].ReceiptID);
                $("#txtreceiptamount").val(result.ReceiptOrder[0].CashReceived.toFixed(2));
                $("#txtwriteoffamount").val(result.ReceiptOrder[0].WriteOffAmount);
                $("#txtwriteoffamount").html(result.ReceiptOrder[0].WriteOffAmount.toFixed(2));
                $("#txtreturnamount").val(result.ReceiptOrder[0].CashRefund);
                $("#txtreturnamount").html(result.ReceiptOrder[0].CashRefund.toFixed(2));
                if (i == 0) {
                    $("#txtpaymentmodeid").val(result.ReceiptOrder[0].ReceiptPaymentMode);
                    $("#txtbankname").val(result.ReceiptOrder[0].BranchID);
                    $("#txtchequenum").val(result.ReceiptOrder[0].CheckNumber);
                    $("#txtamount").val(result.ReceiptOrder[0].Amount.toFixed(2));
                }
                if (i == 1) {
                    $("#txtpaymentmodeid1").val(result.ReceiptOrder[1].ReceiptPaymentMode);
                    $("#txtbankname1").val(result.ReceiptOrder[1].BranchID);
                    $("#txtchequenum1").val(result.ReceiptOrder[1].CheckNumber);
                    $("#txtamount1").val(result.ReceiptOrder[1].Amount.toFixed(2));
                }
                if (i == 2) {
                    $("#txtpaymentmodeid2").val(result.ReceiptOrder[2].ReceiptPaymentMode);
                    $("#txtbankname2").val(result.ReceiptOrder[2].BranchID);
                    $("#txtchequenum2").val(result.ReceiptOrder[2].CheckNumber);
                    $("#txtamount2").val(result.ReceiptOrder[2].Amount.toFixed(2));
                }
            }
        }
        else {
            if (result.OpenOrder[0].CompositeReceiptID > 0)
                $("#spnreceiptnum").text(result.OpenOrder[0].CompositeReceiptID);
            else
                $("#spnreceiptnum").text("#####");
        }

        var str = "";
        if (result.ROFilesOrder.length > 0) {
            $('#fileGrid').html('');
            for (var i = 0; i < result.ROFilesOrder.length; i++) {
                // RO Files Detail
                Rofilename.push(result.ROFilesOrder[i].ROFileName);
                Rofiletype.push(result.ROFilesOrder[i].ROFileType);
                Rofiletitle.push(result.ROFilesOrder[i].ROFileTitle);

                str += '<tr class="RoidFileRow" onclick="ROIDSelectedFile(this)" filename="' + result.OpenOrder[0].ROFilePath + '/' + result.ROFilesOrder[i].ROFileName + '"><td>' + (i + 1) + '</td>'
                    + '<td>' + result.ROFilesOrder[i].ROFileName + '</td>'
                    + '<td>' + result.ROFilesOrder[i].ROFileType + '</td>'
                    + '<td>' + result.ROFilesOrder[i].ROFileTitle + '</td>'
                    + '<td><button id="btnfileview"  onclick="ROIDFileOpen(this)" filename="' + result.ROFilesOrder[i].ROFileName + '" roid="'
                    + result.ROFilesOrder[i].ROID + '" rofilepath="' + result.OpenOrder[0].ROFilePath + '" rofiletype="' + result.ROFilesOrder[i].ROFileType
                    + '"  >View</button></td></tr>';
            }
            $('#fileGrid').append(str);
        }



        ParentOrderRate();
        $('#txtcardrate').html(NewCardRate.toFixed(2));
        BindRateLevelGrid(result.OpenOrder);
        RateChangeFlagColor();
        if (result.OpenOrder[0].BoxTypeID == 0) {
            $("#boxaddressid").attr('disabled', true);
        }
        else {
            $("#boxaddressid").removeAttr('disabled');
        }

        if ($("#iscd").val() == 0) {
            $("#mbodysize").removeAttr('disabled');
        }
        else {
            $("#mbodysize").attr('disabled', true);
        }
        if ($("#islogo").val() == 0) {
            $("#file_center").attr("disabled", "disabled");
        }
        else {
            $("#file_center").removeAttr("disabled");
        }
        IsCDchange();
        //if (result.OpenOrder[0].PaymentModeID == "2") {
        //    EnableElement();
        //}
        //else {
        //    DisableElement();
        //}
        if (result.OpenOrder[0].PaymentModeID == "1") {
            DisableElement()
        }
        if (result.OpenOrder[0].IsVatChange == 1) {
            $("#isVatPer").prop("checked", true);
            $("#hdnIsVatPer").val(1);
            $("#txtvatper").removeAttr("disabled");
        }
        else {
            $("#isVatPer").prop("checked", false);
            $("#hdnIsVatPer").val(0);
            $("#txtvatper").attr("disabled", "disabled");
        }
        $("#rotypeid").change();
        if ($("#hdnallowcredit").val() == 1) {
            if ($("#hdnIsPaymentType").val() == 1) {
                $("#txtsaveupdate").css('pointer-events', 'none');
                $("#txtsaveupdate").css('opacity', '0.5');
                $("#hdnsaveenable").val(1);
                $("#btncopy").css('pointer-events', 'none');
                $("#btncopy").css('opacity', '0.5');
            }
            else {
                $("#txtsaveupdate").css('pointer-events', 'auto');
                $("#txtsaveupdate").css('opacity', '');
                $("#hdnsaveenable").val(0);
                $("#btncopy").css('pointer-events', 'auto');
                $("#btncopy").css('opacity', '');
            }
        }

        if (result.OpenOrder[0].ROID != 0 || result.OpenOrder[0].ROID != "") {
            $("#txtOrderNo").val(result.OpenOrder[0].ROID);
        }

        $("#txtsaveupdate").text('UPDATE ORDER');

        $('#bookingGrid tr').each(function () {
            if ($(this).attr('auditstatus') > 0) {
                $('#orderlevelinfo').css('pointer-events', 'none');
                DisableElement();
                $('#orderlevelinfo tbody tr:nth-child(even)').css('opacity', '0.5');
                $('#orderlevelinfo tbody tr:nth-child(odd)').css('opacity', '0.5');
                $('#orderlevelinfo tbody tr:nth-child(10)').css('opacity', '');
                $('#matsourceid').parent().css('opacity', '0.5');
                $('#mtsrc').css('opacity', '0.5');

                $('#rofile').removeAttr('disabled');
                $("#txtBookingNo").focus();
            }
        });
        $("#dsitemagrate").prop('disabled', true);
        $("#dsitemagdisc").prop('disabled', true);
        $("#dsitemagamount").prop('disabled', true);
        $("#clitemagrate").prop('disabled', true);
        $("#clitemagdisc").prop('disabled', true);
        $("#clitemagamount").prop('disabled', true);
        ispefocus = false;
        ctrlupress = false;
        cnfrmboxvalue = true;
        dbclick = false;
        setTimeout(function () {
            $("#txtBookingNo").focus();
        }, 400);
    }
    else {
        ShowMsg("Record not found");
        $("#txtBookingNo").val('');
        setTimeout(function () {
            $("#txtBookingNo").focus();
        }, 400);
        return false;
    }
}

function GetRoidOnLoadDetail() {
    var roid = qStr.split('?')[1].split('=')[3];
    $("#txtOrderNo").val(roid);
    GetRoidDetail();
    var clean_uri = qStr.split('&')[0] + '&' + qStr.split('&')[1];
    window.history.replaceState({}, document.title, clean_uri);
}

function GetRoidDetail() {
    var rids = $("#txtOrderNo").val();
    ClearMainScreenFields();
    $("#txtOrderNo").val(rids);
    $("#hdnBlockdate").val('');
    $("#hdnsaveflag").val(1);
    $("#bookingGrid").html('');
    $('.action-bar').css('pointer-events', 'auto');
    OrderlevelinfoEnable();
    OrderlevelEnable();
    EnableNewReciptPopup();
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var roid = $("#txtOrderNo").val();
    if (roid == null || roid == '') {
        ShowMsg('Please enter ROID', $("#txtOrderNo"));
        $("#txtOrderNo").focus();
        return false;
    }
    else if (roid != '' && (isNaN(parseInt(roid))) || (roid.toString().length > 6 && roid.toString().length < 10)) {
        ShowMsg('Invalid ROID');
        return false;
    }
    else if (roid.toString().length >= 1 && roid.toString().length <= 7) {
        var n = serverDate.getFullYear();
        roid = parseInt(n) * 1000000 + parseInt(roid);
        $("#txtOrderNo").val(roid);
    }
    $("#lblfile").html('');
    $("#lblfile").text('');
    $("#file_center").val('');
    $("#file_center").attr('title', 'No file chosen');
    var strxml = "";
    Rofilename = [];
    Rofiletype = [];
    Rofiletitle = [];
    CleararrayList();
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/GetROIDData";
    param.ROID = $("#txtOrderNo").val();
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    var package;
    var CardRate = 0;
    var AgreedDiscAmount = 0;
    var CardAmount = 0;
    var AgreedAmount = 0;
    var ExtraChargesAmount = 0;
    var ExtraDiscAmount = 0;
    var ExtraBoxChargesAmount = 0;
    var AgencyCommissionAmount = 0;
    var PreVATAmount = 0;
    var VATAmount = 0;
    var Receivable = 0;

    //var openselectedpackage = new Array();
    //openselectedpackage = $("#packageid").val().toString();
    //openpackagelength = $("#packageid").val().toString().split(',').length;
    //openpeidlength = selectpeidlist.toString().split(',').length;

    if (result.OpenOrder[0].IsValid == 1) {
        ShowMsg(result.OpenOrder[0].ErrorMessage);
        $("#txtOrderNo").val('');
        return false;
    }

    else if (result.OpenOrder.length > 0 || result.ReceiptOrder.length > 0) {

        if (result.OpenOrder[0].IsClassified == 1) {
            if ($("#hdnallowclassified").val() == 0) {
                ShowMsg("Order can not be opened - Display");
                $("#txtOrderNo").val('');
                return false;
            }
        }
        else {
            if ($("#hdnallowdisplay").val() == 0) {
                ShowMsg("Order can not be opened - Classified");
                $("#txtOrderNo").val('');
                return false;
            }
        }

        if (result.OpenOrder[0].IsManualBilling == "1") {
            if ($("#hdnallowmanualbilling").val() == 0) {
                ShowMsg("Order can not be opened - Manual");
                $("#txtOrderNo").val('');
                return false;
            }
        }

        var url1 = appRoot + "Booking/GetGridData";
        var param_Ist = {};
        var result1 = getresult(url1, param_Ist);

        $('[parameter=DateEditable]').val(1);
        ispefocus = true;
        var selectedpearray = new Array();
        selectedDateArray = [];
        selectedPEwithValidDays = [];
        selectedcyopPE = [];
        disabledDates = [];
        $("#hdnauditdate").val('');
        list = [];
        var count = 0;
        checkdate = 0;
        var roid = $("#txtOrderNo").val();
        if (result.OpenOrder[0].IsClassified == 1) {
            if ($('#hdnIsClassified').val() != "1" || $('#hdnIsDigital').val() == "1") {
                $('#hdnIsDigital').val('0');
                $("[val='1']").click();
            }
        }
        else if (result.OpenOrder[0].IsDigital == 1) {
            $('#hdnIsDigital').val('1');
            $("[val='2']").click();
        }
        else {
            if ($('#hdnIsClassified').val() == "1" || $('#hdnIsDigital').val() == "1") {
                $('#hdnIsDigital').val('0');
                $("[val='0']").click();
            }
        }
        $("#txtOrderNo").val(roid);
        $('#adtypeid').val(result.OpenOrder[0].AdTypeID);
        BindPackageControl();
        $('#productid').val(result.OpenOrder[0].ProductID);
        BindBrandControl();
        $('#brandid').val(result.OpenOrder[0].BrandID);
        allowcasualclientid = result.OpenOrder[0].AllowCasualClient;
        var agreeddiscountper = "";
        var agreedrate = "";
        var CardRate = 0;
        var NewCardRate = 0;
        var ExtraBoxChargesAmount = 0;
        $('#datePicker').datepicker('option', 'minDate', null);


        $("#agencyid").val(result.OpenOrder[0].AgencyName);
        agencyidvalue = result.OpenOrder[0].AgencyID;
        agencypaymentmode = result.OpenOrder[0].AgencyPaymentMode;
        clientidvalue = result.OpenOrder[0].ClientID;
        if (clientidvalue <= 0) {

            $("#clientid").val(result.OpenOrder[0].CasualClientName);
        }
        else
            $("#clientid").val(result.OpenOrder[0].ClientName);
        $("#canvassorid").val(result.OpenOrder[0].CanvassorName);
        canvassoridvalue = result.OpenOrder[0].CanvassorID;
        $('#txtronumber').val(result.OpenOrder[0].RONumber);
        $("#rodatePicker").datepicker("setDate", result.OpenOrder[0].RODate.substring(0, 10).replace('-', '/').replace('-', '/'));
        $("#hdnbookingdate").val(result.OpenOrder[0].BookingDate);
        $('#adtypeid').val(result.OpenOrder[0].AdTypeID);
        $('#uomid').val(result.OpenOrder[0].UOM);
        $('#smeid').val(result.OpenOrder[0].SMEID);

        $('#mattypeid').val(result.OpenOrder[0].MaterialType);
        mattypeidvalue = $('#mattypeid').val();
        $('#matsourceid').val(result.OpenOrder[0].MaterialSource);
        $('#rotypeid').val(result.OpenOrder[0].ROType);
        $("#uncnfrmrsnid").val(result.OpenOrder[0].ReasonForUnconfirmationID);
        $('#billtypeid').val(result.OpenOrder[0].BillType);
        $('#boxtypeid').val(result.OpenOrder[0].BoxTypeID);
        $('#boxaddressid').val(result.OpenOrder[0].BoxAddress);


        for (var i = 0; i < result.OpenOrder.length; i++) {
            selectedpearray.push(result.OpenOrder[i].PackageID);
            selectedcyopPE.push(selectedpearray);
            if (selectedcyopPE[0] == "") {
                selectedcyopPE = [];
                selectedcyopPE.push(selectedpearray);
            }

            if (i == result.OpenOrder.length - 1) {
                $("#packageid").val(selectedpearray).trigger('chosen:updated');
                OrerPEChange();
            }
            $("#hdnreadonly").val(result.OpenOrder[i].ReadOnlyFlag);
            $('[parameter=ProductionDate]').append(new Option(result.OpenOrder[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/'), result.OpenOrder[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/')));
            mindt = $('[parameter=ProductionDate]').find('option').eq(0).val();
            $('#datePicker').datepicker("setDate", new Date(mindt.split('/')[1] + '/' + mindt.split('/')[0] + '/' + mindt.split('/')[2]));
            $('#datePicker').datepicker("refresh");
            selectedDateArray.push(result.OpenOrder[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/'));

            //$("#agencyid").val(result.OpenOrder[i].AgencyName);
            //agencyidvalue = result.OpenOrder[i].AgencyID;
            //agencypaymentmode = result.OpenOrder[i].AgencyPaymentMode;
            //clientidvalue = result.OpenOrder[i].ClientID;
            //if (clientidvalue <= 0) {

            //    $("#clientid").val(result.OpenOrder[i].CasualClientName);
            //}
            //else
            //    $("#clientid").val(result.OpenOrder[i].ClientName);
            //$("#canvassorid").val(result.OpenOrder[i].CanvassorName);
            //canvassoridvalue = result.OpenOrder[i].CanvassorID;
            //$('#txtronumber').val(result.OpenOrder[i].RONumber);
            //$("#rodatePicker").datepicker("setDate", result.OpenOrder[i].RODate.substring(0, 10).replace('-', '/').replace('-', '/'));
            //$("#hdnbookingdate").val(result.OpenOrder[i].BookingDate);
            //$('#adtypeid').val(result.OpenOrder[i].AdTypeID);
            //$('#uomid').val(result.OpenOrder[i].UOM);
            //$('#smeid').val(result.OpenOrder[i].SMEID);

            //$('#mattypeid').val(result.OpenOrder[i].MaterialType);
            //mattypeidvalue = $('#mattypeid').val();
            //$('#matsourceid').val(result.OpenOrder[i].MaterialSource);
            //$('#rotypeid').val(result.OpenOrder[i].ROType);
            //$("#uncnfrmrsnid").val(result.OpenOrder[i].ReasonForUnconfirmationID);
            //$('#billtypeid').val(result.OpenOrder[i].BillType);
            //$('#boxtypeid').val(result.OpenOrder[i].BoxTypeID);
            //$('#boxaddressid').val(result.OpenOrder[i].BoxAddress);
            if (result.OpenOrder[0].IsClassified != 1) {

                $("#premiaid").val(result.OpenOrder[i].PremiaName);

                premiaidvalue = result.OpenOrder[i].PremiaID;
                premianame = result.OpenOrder[i].PremiaName;
                OpenPremiaDetails(result.OpenOrder[i].PremiaName);
                if (result.OpenOrder[i].SizeName == '') {
                    $("#adsizeid").val(result.OpenOrder[i].Adsize);
                    adsizename = result.OpenOrder[i].Adsize;
                    adheightvalue = adsizename.replace(/ /g, '').split("*")[0];
                    adsizecolvalue = adsizename.replace(/ /g, '').split("*")[1];
                }
                else {
                    $("#adsizeid").val(result.OpenOrder[i].SizeName);
                    adsizename = result.OpenOrder[i].SizeName;
                    OpenAdsizeDetails(result.OpenOrder[i].SizeName);
                }
                adsizeidvalue = result.OpenOrder[i].AdsizeID;
                $("#colorid").val(result.OpenOrder[i].ColorName);
                coloridvalue = result.OpenOrder[i].ColorID;
                colorname = result.OpenOrder[i].ColorName;
                $("#billablesize").val(result.OpenOrder[i].BillableSize);
                $("#txtitemcaption").val(result.OpenOrder[i].Caption);
            }
            else {
                $("#txtclitemcaption").val(result.OpenOrder[i].Caption);
                $("#iscd").val(result.OpenOrder[i].IsCD);
                $("#islogo").val(result.OpenOrder[i].IsLogo);
                if ($("#iscd").val() == 0) {
                    $("#mbodysize").val(result.OpenOrder[i].MBodyCount);
                    if (result.OpenOrder[i].IsLogo == "1") {
                        $("#txtheight").val(result.OpenOrder[i].FileHeight);
                        HeightLogo = result.OpenOrder[i].FileHeight;
                    }
                    else {
                        $("#txtheight").val('');
                    }
                }
                else {
                    $("#mbodysize").val('');
                    $("#txtheight").val(result.OpenOrder[i].BillableHeight);
                    HeightLogo = result.OpenOrder[i].BillableHeight;
                }
                if (result.OpenOrder[0].IsClassified == 1) {
                    $("#iscd").change();
                }
                $("#txtcol").val(result.OpenOrder[i].AdColumns);
                $("#stylesheetid").val(result.OpenOrder[i].StyleSheetID);

                if (result.OpenOrder[i].FileNames != "") {
                    $("#lblfile").html(result.OpenOrder[i].FileNames);
                    $('#file_center').attr('title', result.OpenOrder[i].FileNames);
                }

                $("#adtext").val(result.OpenOrder[i].U_BodyText);
                $("#categoryid").val(result.OpenOrder[i].AdClassification);
                AdtypeId1 = result.OpenOrder[i].AdtypeID1;
                AdtypeId2 = result.OpenOrder[i].AdtypeID2;
                AdtypeId3 = result.OpenOrder[i].AdtypeID3;
                AdtypeId4 = result.OpenOrder[i].AdtypeID4;
            }

            CardRate = CardRate + result.OpenOrder[i].CardRate;

            var insnum = result.OpenOrder[0].InsNum; // 1
            if (insnum == result.OpenOrder[i].InsNum) {
                NewCardRate = NewCardRate + result.OpenOrder[i].CardRate;
                $("#txtcardrate").val(NewCardRate);
            }
            agreeddiscountper = result.OpenOrder[0].AgreedDiscPer;
            AgreedDiscAmount = AgreedDiscAmount + result.OpenOrder[i].AgreedDiscAmount;
            $("#txtagreeddiscountamount").val(AgreedDiscAmount);
            CardAmount = CardAmount + result.OpenOrder[i].CardAmount;
            $("#txtcardamount").val(CardAmount);
            AgreedAmount = AgreedAmount + result.OpenOrder[i].AgreedAmount;
            $("#txtagreedamount").val(AgreedAmount.toFixed(2));

            $("#txtextrachargeper").val(result.OpenOrder[i].ExtraChargesPer);
            ExtraChargesAmount = ExtraChargesAmount + result.OpenOrder[i].ExtraChargesForPE;
            $("#txtextrachargeamount").val(ExtraChargesAmount.toFixed(2));

            $("#txtextradisper").val(result.OpenOrder[i].ExtraDiscPer);
            ExtraDiscAmount = ExtraDiscAmount + result.OpenOrder[i].ExtraDiscAmount;
            $("#txtextradisamount").val(ExtraDiscAmount.toFixed(2));


            $("#hdnratefieldchanged").val(result.OpenOrder[i].RateFieldChanged);
            $("#hdnitemratefieldchanged").val(result.OpenOrder[i].ItemRateFieldChanged);

            $("#txtboxchargeper").val(result.OpenOrder[i].ExtraBoxChargesPer);
            ExtraBoxChargesAmount = result.OpenOrder[0].ExtraBoxChargesAmount;
            $("#txtboxchargeamount").val(ExtraBoxChargesAmount);
            $("#txtcommisionper").val(result.OpenOrder[i].CommissionPer);
            AgencyCommissionAmount = AgencyCommissionAmount + result.OpenOrder[i].CommissionAmount;
            $("#txtcommisionamount").val(AgencyCommissionAmount);
            PreVATAmount = PreVATAmount + result.OpenOrder[i].PreVATAmountforPE;
            $("#txtprevatamount").val(PreVATAmount);
            $("#txtvatper").val(result.OpenOrder[i].VatPer);
            VATAmount = VATAmount + result.OpenOrder[i].VatAmount;
            $("#txtvatamount").val(VATAmount);
            agreedrate = result.OpenOrder[0].AgreedRate;
            $('#txtratecardid').val(result.OpenOrder[i].RateCardID);
            $('#txtadrateid').val(result.OpenOrder[i].AdRateID);

            $("#txtagreeddiscountamount").html(AgreedDiscAmount.toFixed(2));
            $("#txtcardamount").html(CardAmount.toFixed(2));
            $("#txtboxchargeper").html(result.OpenOrder[i].ExtraBoxChargesPer + "%");
            $("#txtboxchargeamount").html(ExtraBoxChargesAmount.toFixed(2));
            $("#txtcommisionper").html(result.OpenOrder[i].CommissionPer + "%");
            $("#txtcommisionamount").html(AgencyCommissionAmount.toFixed(2));
            $("#txtprevatamount").html(PreVATAmount.toFixed(2));
            //$('#txtvatper').html(result.OpenOrder[i].VatPer + "%");
            $("#txtvatamount").html(VATAmount.toFixed(2));
            $('#txtratecardid').html(result.OpenOrder[i].RateCardID);
            $('#txtadrateid').html(result.OpenOrder[i].AdRateID);
            $("#txtrostatus").val(result.OpenOrder[i].ROStatus);
            $("#txtstatus").val(result.OpenOrder[i].Status);
            $("#txtauditstatus").val(result.OpenOrder[i].AuditStatus);
            $('#hdninsnum').val(result.OpenOrder[0].InsNum);
            $('#hdnroid').val(result.OpenOrder[0].ROID);
            $('#spnroid').text(result.OpenOrder[0].ROID);
            $('#hdnsourceroid').val(result.OpenOrder[0].BookingID);
            $('#txtscheduleins').val(result.OpenOrder[i].SchedulingInstructions);

            if (result.OpenOrder[0].IsClassified == 1) {
                $('#txtclbillingins').val(result.OpenOrder[i].BillingInstruction);
                $('#txtclprodins').val(result.OpenOrder[i].ProdInstructions);
            }
            else {
                $('#txtbillingins').val(result.OpenOrder[i].BillingInstruction);
                $('#txtprodins').val(result.OpenOrder[i].ProdInstructions);
            }

            BindGridControl();
            callInnerBoxHover();
            $('#uomid').val(result.OpenOrder[i].UOM);

            AdtypeIdlist.push(result.OpenOrder[i].AdTypeID);

            Adsizeidlist.push(result.OpenOrder[i].AdsizeID);
            result1.AdsizeID = result.OpenOrder[i].AdsizeID;

            AdsizeHeightlist.push(result.OpenOrder[i].BillableHeight);
            AdsizeWidthlist.push(result.OpenOrder[i].BillableColSize);
            Premiaidlist.push(result.OpenOrder[i].PremiaID);
            result1.PremiaID = result.OpenOrder[i].PremiaID;
            Coloridlist.push(result.OpenOrder[i].ColorID);
            result1.ColorID = result.OpenOrder[i].ColorID;

            MaterialTypelist.push(result.OpenOrder[i].MaterialType);
            MaterialSourcelist.push(result.OpenOrder[i].MaterialSource);
            BoxTypeIDlist.push(result.OpenOrder[i].BoxTypeID);
            UOMIDlist.push(result.OpenOrder[i].UOM);
            Statuslist.push(result.OpenOrder[i].Status);
            AuditStatuslist.push(result.OpenOrder[i].AuditStatus);
            CardRatelist.push(result.OpenOrder[i].CardRate);
            CardAmountlist.push(result.OpenOrder[i].CardAmount);
            RateCardIDlist.push(result.OpenOrder[i].RateCardID);
            AdRateIDlist.push(result.OpenOrder[i].AdRateID);

            AgreedRatelist.push(result.OpenOrder[i].AgreedRate);
            result1.AgreedRate = result.OpenOrder[i].AgreedRate;

            AgreedAmountlist.push(result.OpenOrder[i].AgreedAmount);
            result1.AgreedAmount = result.OpenOrder[i].AgreedAmount;

            AgreedDiscPerlist.push(result.OpenOrder[i].AgreedDiscPer);
            result1.AgreedDiscPer = result.OpenOrder[i].AgreedDiscPer;

            AgreedDiscAmountlist.push(result.OpenOrder[i].AgreedDiscAmount);
            result1.AgreedDiscAmount = result.OpenOrder[i].AgreedDiscAmount;

            PreVATAmountlist.push(result.OpenOrder[i].PreVATAmountforPE);
            VATPerlist.push(result.OpenOrder[i].VatPer);
            VATAmountlist.push(result.OpenOrder[i].VatAmount);
            AgencyCommissionPerlist.push(result.OpenOrder[i].CommissionPer);
            AgencyCommissionAmountlist.push(result.OpenOrder[i].CommissionAmount);
            SchemeIDlist.push(result.OpenOrder[i].SchemeID);
            SchemeDetailIDlist.push(result.OpenOrder[i].SchemeDetailID);

            ExtraChargesPerlist.push(result.OpenOrder[i].ExtraChargesPer);
            result1.ExtraChargesPer = result.OpenOrder[i].ExtraChargesPer;

            ExtraChargesAmountlist.push(result.OpenOrder[i].ExtraChargesForPE);
            result1.ExtraChargesAmount = result.OpenOrder[i].ExtraChargesForPE;

            ExtraDiscPerlist.push(result.OpenOrder[i].ExtraDiscPer);
            result1.ExtraDiscPer = result.OpenOrder[i].ExtraDiscPer;

            ExtraDiscAmountlist.push(result.OpenOrder[i].ExtraDiscAmount);
            result1.ExtraDiscAmount = result.OpenOrder[i].ExtraDiscAmount;

            ExtraBoxChargesPerlist.push(result.OpenOrder[i].ExtraBoxChargesPer);
            result1.ExtraBoxChargesPer = result.OpenOrder[i].ExtraBoxChargesPer;

            ExtraBoxChargesAmountlist.push(result.OpenOrder[i].ExtraBoxChargesAmount);
            result1.ExtraBoxChargesAmount = result.OpenOrder[i].ExtraBoxChargesAmount;

            Receivablelist.push(result.OpenOrder[0].Receivable);
            list.push(result1);
        }

        //$("#packageid").val(selectedpearray).trigger('chosen:updated');
        //OrerPEChange();
        if (result.OpenOrder[0].FileNames != "") {
            $("#lblfile").html(result.OpenOrder[0].FileNames);
            $('#file_center').attr('title', result.OpenOrder[0].FileNames);
        }

        $("#ins").val(selectedDateArray.length);

        $("#hdnBlockdate").val(result.OpenOrder[0].BlockB4ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/'));

        $('#bookingGrid tr:not(:first-child)').remove();

        var spilitreceivable = parseFloat(0 + "." + parseInt(result.OpenOrder[0].Receivable.toString().split('.')[1]));
        if (spilitreceivable >= .50) {

            $("#txtrecevible").val(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#txtrecevible").html(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#NetReceivableForCheck").val(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
        }
        else {
            $("#txtrecevible").val(parseFloat(Math.floor(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#txtrecevible").html(parseFloat(Math.floor(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#NetReceivableForCheck").val(parseFloat(Math.floor(result.OpenOrder[0].Receivable)).toFixed(2));
        }
        $("#txtnetamount").val(result.OpenOrder[0].Net);
        $("#txtnetamount").html(result.OpenOrder[0].Net.toFixed(2));
        LoadSwitchValue();
        if (result.OpenOrder[0].PaymentModeID == "2") {
            $("#paymenttypetoggle").prop("checked", true);
            $("#hdnIsPaymentType").val(result.OpenOrder[0].PaymentModeID);
            $("#tblreceipt").find("input,button,select").attr("disabled", "disabled");
            $("#tblreceipt").css('display', 'none');
            EnableElement();
            $(".navigation-item").css('pointer-events', 'none');
            $(".switch-set-right").css('pointer-events', 'none');
            $("#hdnIsCredit").val(1);
        }
        else {
            $("#paymenttypetoggle").prop("checked", false);
            $("#hdnIsPaymentType").val(result.OpenOrder[0].PaymentModeID);
            $("#tblreceipt").find("input,button,select").removeAttr("disabled");
            $("#tblreceipt").css('display', '');
            DisableElement();
        }
        if (result.OpenOrder[0].CustomerTypeID == "1") {
            $("#customertypetoggle").prop("checked", true);
            $("#hdnIsCustomerType").val(result.OpenOrder[0].CustomerTypeID);
            $("#clientid").css('width', '100%');
            $("#clientadd").css('display', 'none');
        }
        else {
            $("#customertypetoggle").prop("checked", false);
            $("#hdnIsCustomerType").val(result.OpenOrder[0].CustomerTypeID);
            $("#clientid").css('width', '85%');
            $("#clientadd").css('display', '');
            $("#txtcasualAdd").val(result.OpenOrder[0].CasualAddress);
            $("#ddlcasualcity").val(result.OpenOrder[0].CityID);
            $("#txtcasualzip").val(result.OpenOrder[0].Zip);
            $("#txtcasualtelephone").val(result.OpenOrder[0].Phone);
            $("#txtcasualidnum").val(result.OpenOrder[0].NicNumber);
            $("#txtclientvatnum").val(result.OpenOrder[0].VatNumber);
        }

        if (result.OpenOrder[0].IsManualBilling == "1") {
            $("#manualbilltoggle").prop("checked", true);
            $("#hdnIsManualBill").val(result.OpenOrder[0].IsManualBilling);
        }
        else {
            $("#manualbilltoggle").prop("checked", false);
            $("#hdnIsManualBill").val(result.OpenOrder[0].IsManualBilling);
        }

        if (result.OpenOrder[0].DeferredPayment == 1) {
            $("#chkdiffer").prop("checked", true);
            $("#hdnchkdiffer").val(result.OpenOrder[0].DeferredPayment);
        }
        else {
            $("#chkdiffer").prop("checked", false);
            $("#hdnchkdiffer").val(result.OpenOrder[0].DeferredPayment);
        }

        //if (result.OpenOrder[0].IsVatChange == 1) {
        //    $("#isVatPer").prop("checked", true);
        //    $("#hdnIsVatPer").val(1);
        //    $("#txtvatper").removeAttr("disabled");
        //}
        //else {
        //    $("#isVatPer").prop("checked", false);
        //    $("#hdnIsVatPer").val(0);
        //    $("#txtvatper").attr("disabled", "disabled");
        //}

        if (result.ReceiptOrder.length > 0 && result.OpenOrder[0].CompositeReceiptID == 0) {
            for (var i = 0; i < result.ReceiptOrder.length; i++) {
                // Receipt Detail
                $("#spnreceiptnum").text(result.ReceiptOrder[0].ReceiptID);
                $("#txtreceiptamount").val(result.ReceiptOrder[0].CashReceived.toFixed(2));
                $("#txtwriteoffamount").val(result.ReceiptOrder[0].WriteOffAmount);
                $("#txtwriteoffamount").html(result.ReceiptOrder[0].WriteOffAmount.toFixed(2));
                $("#txtreturnamount").val(result.ReceiptOrder[0].CashRefund);
                $("#txtreturnamount").html(result.ReceiptOrder[0].CashRefund.toFixed(2));
                if (i == 0) {
                    $("#txtpaymentmodeid").val(result.ReceiptOrder[0].ReceiptPaymentMode);
                    $("#txtbankname").val(result.ReceiptOrder[0].BranchID);
                    $("#txtchequenum").val(result.ReceiptOrder[0].CheckNumber);
                    $("#txtamount").val(result.ReceiptOrder[0].Amount.toFixed(2));
                }
                if (i == 1) {
                    $("#txtpaymentmodeid1").val(result.ReceiptOrder[1].ReceiptPaymentMode);
                    $("#txtbankname1").val(result.ReceiptOrder[1].BranchID);
                    $("#txtchequenum1").val(result.ReceiptOrder[1].CheckNumber);
                    $("#txtamount1").val(result.ReceiptOrder[1].Amount.toFixed(2));
                }
                if (i == 2) {
                    $("#txtpaymentmodeid2").val(result.ReceiptOrder[2].ReceiptPaymentMode);
                    $("#txtbankname2").val(result.ReceiptOrder[2].BranchID);
                    $("#txtchequenum2").val(result.ReceiptOrder[2].CheckNumber);
                    $("#txtamount2").val(result.ReceiptOrder[2].Amount.toFixed(2));
                }
            }
        }
        else {
            if (result.OpenOrder[0].CompositeReceiptID > 0)
                $("#spnreceiptnum").text(result.OpenOrder[0].CompositeReceiptID);
            else
                $("#spnreceiptnum").text("#####");
        }

        var str = "";
        if (result.ROFilesOrder.length > 0) {
            $('#fileGrid').html('');
            for (var i = 0; i < result.ROFilesOrder.length; i++) {
                // RO Files Detail
                Rofilename.push(result.ROFilesOrder[i].ROFileName);
                Rofiletype.push(result.ROFilesOrder[i].ROFileType);
                Rofiletitle.push(result.ROFilesOrder[i].ROFileTitle);

                str += '<tr class="RoidFileRow" onclick="ROIDSelectedFile(this)" filename="' + result.OpenOrder[0].ROFilePath + '/' + result.ROFilesOrder[i].ROFileName + '"><td>' + (i + 1) + '</td>'
                    + '<td>' + result.ROFilesOrder[i].ROFileName + '</td>'
                    + '<td>' + result.ROFilesOrder[i].ROFileType + '</td>'
                    + '<td>' + result.ROFilesOrder[i].ROFileTitle + '</td>'
                    + '<td><button id="btnfileview"  onclick="ROIDFileOpen(this)" filename="' + result.ROFilesOrder[i].ROFileName + '" roid="'
                    + result.ROFilesOrder[i].ROID + '" rofilepath="' + result.OpenOrder[0].ROFilePath + '" rofiletype="' + result.ROFilesOrder[i].ROFileType
                    + '"  >View</button></td></tr>';
            }
            $('#fileGrid').append(str);
        }



        ParentOrderRate();
        $('#txtcardrate').html(NewCardRate.toFixed(2));
        BindRateLevelGrid(result.OpenOrder);
        RateChangeFlagColor();
        if (result.OpenOrder[0].BoxTypeID == 0) {
            $("#boxaddressid").attr('disabled', true);
        }
        else {
            $("#boxaddressid").removeAttr('disabled');
        }

        if (result.OpenOrder[0].IsClassified == 1) {
            $("#mattypeid").attr("disabled", true);
        }
        else {
            $("#mattypeid").attr("disabled", false);
        }
        if ($("#iscd").val() == 0) {
            $("#mbodysize").removeAttr('disabled');
        }
        else {
            $("#mbodysize").attr('disabled', true);
        }
        if ($("#islogo").val() == 0) {
            $("#file_center").attr("disabled", "disabled");
        }
        else {
            $("#file_center").removeAttr("disabled");
        }
        IsCDchange();
        //if (result.OpenOrder[0].PaymentModeID == "2") {
        //    EnableElement();
        //}
        //else {
        //    DisableElement();
        //}
        if (result.OpenOrder[0].PaymentModeID == "1") {
            DisableElement()
        }
        if (result.OpenOrder[0].IsVatChange == 1) {
            $("#isVatPer").prop("checked", true);
            $("#hdnIsVatPer").val(1);
            $("#txtvatper").removeAttr("disabled");
        }
        else {
            $("#isVatPer").prop("checked", false);
            $("#hdnIsVatPer").val(0);
            $("#txtvatper").attr("disabled", "disabled");
        }
        $("#rotypeid").change();
        if ($("#hdnallowcredit").val() == 1) {
            if ($("#hdnIsPaymentType").val() == 1) {
                $("#txtsaveupdate").css('pointer-events', 'none');
                $("#txtsaveupdate").css('opacity', '0.5');
                $("#hdnsaveenable").val(1);
                $("#btncopy").css('pointer-events', 'none');
                $("#btncopy").css('opacity', '0.5');
            }
            else {
                $("#txtsaveupdate").css('pointer-events', 'auto');
                $("#txtsaveupdate").css('opacity', '');
                $("#hdnsaveenable").val(0);
                $("#btncopy").css('pointer-events', 'auto');
                $("#btncopy").css('opacity', '');
            }
        }
        if (result.OpenOrder[0].BookingID != 0 || result.OpenOrder[0].BookingID != "") {
            $("#txtBookingNo").val(result.OpenOrder[0].BookingID);
            //$('.action-bar').css('pointer-events', 'none');
            //$('#btnneworder').css('pointer-events', 'auto');
            $("#btngetrate").css('pointer-events', 'none');
            $("#btngetrate").css('opacity', '0.5');
            $("#txtsaveupdate").css('pointer-events', 'none');
            $("#txtsaveupdate").css('opacity', '0.5');
            $("#hdnrateenable").val(1);
            $("#hdnsaveenable").val(1);
            DisableElement();
            $("#adsizeid").attr("disabled", "disabled");
            $("#billablesize").attr("disabled", "disabled");
        }

        $("#txtsaveupdate").text('UPDATE ORDER');

        $('#bookingGrid tr').each(function () {
            if ($(this).attr('auditstatus') > 0) {
                $('#orderlevelinfo').css('pointer-events', 'none');
                DisableElement();
                $('#orderlevelinfo tbody tr:nth-child(even)').css('opacity', '0.5');
                $('#orderlevelinfo tbody tr:nth-child(odd)').css('opacity', '0.5');
                $('#orderlevelinfo tbody tr:nth-child(10)').css('opacity', '');
                $('#matsourceid').parent().css('opacity', '0.5');
                $('#mtsrc').css('opacity', '0.5');

                $('#rofile').removeAttr('disabled');
                $("#txtOrderNo").focus();
            }
        });
        $("#dsitemagrate").prop('disabled', true);
        $("#dsitemagdisc").prop('disabled', true);
        $("#dsitemagamount").prop('disabled', true);
        $("#clitemagrate").prop('disabled', true);
        $("#clitemagdisc").prop('disabled', true);
        $("#clitemagamount").prop('disabled', true);
        ispefocus = false;
        ctrlupress = false;
        cnfrmboxvalue = true;
        dbclick = false;
        setTimeout(function () {
            $("#txtOrderNo").focus();
        }, 400);
    }

    else {
        ShowMsg("Record not found");
        $("#txtOrderNo").val('');
        setTimeout(function () {
            $("#txtOrderNo").focus();
        }, 400);
        return false;
    }

}

function GetReceiptDetail() {
    Csvfilecount = 0;
    $("#hdnBlockdate").val('');
    $("#hdnsaveflag").val(1);
    $("#bookingGrid").html('');
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var receiptid = $("#txtReceiptNo").val();
    if (receiptid == null || receiptid == '') {
        ShowMsg('Please enter ReceiptID', $("#txtReceiptNo"));
        $("#txtReceiptNo").focus();
        return false;
    }
    else if (receiptid != '' && (isNaN(parseInt(receiptid))) || (receiptid.toString().length > 7 && receiptid.toString().length < 10)) {
        ShowMsg('Invalid ReceiptID');
        return false;
    }
    else if (receiptid.toString().length >= 1 && receiptid.toString().length <= 8) {
        var n = serverDate.getYear();
        receiptid = parseInt(n) * 10000000 + parseInt(receiptid);
        $("#txtReceiptNo").val(receiptid);
    }
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/GetReceiptData";
    param.ReceiptID = $("#txtReceiptNo").val();
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    param.IsClassified = $('#hdnIsClassified').val();
    param.IsDigital = $('#hdnIsDigital').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    Rofilename = [];
    Rofiletype = [];
    Rofiletitle = [];
    var package;
    var CardRate = 0;
    var NewCardRate = 0;
    var AgreedDiscAmount = 0;
    var CardAmount = 0;
    var AgreedAmount = 0;
    var ExtraChargesAmount = 0;
    var ExtraDiscAmount = 0;
    var ExtraBoxChargesAmount = 0;
    var AgencyCommissionAmount = 0;
    var PreVATAmount = 0;
    var VATAmount = 0;
    var Receivable = 0;

    //var openselectedpackage = new Array();
    //openselectedpackage = $("#packageid").val().toString();
    //openpackagelength = $("#packageid").val().toString().split(',').length;
    //openpeidlength = selectpeidlist.toString().split(',').length;


    if (result.CompoReceiptOrder != undefined) {
        DisableNewReciptPopup();
        $('#divNewReceiptPopUp').dialog('open');
        $("#txtrcptagencyname").val(result.CompoReceiptOrder[0].AgencyName);
        $("#hdnrcptagencyid").val(result.CompoReceiptOrder[0].AgencyID);
        $("#hdnrcptcasualclientid").val(result.CompoReceiptOrder[0].ClientID);
        $("#txtrcptcasualclientname").val(result.CompoReceiptOrder[0].CasualClient);
        $("#hdnrcptcasualclientaddress").val(result.CompoReceiptOrder[0].CasualAddress);
        $("#hdnrcptcasualclientcity").val(result.CompoReceiptOrder[0].City);
        $("#hdnrcptcasualclientzip").val(result.CompoReceiptOrder[0].Zip);
        $("#hdnrcptcasualclientphone").val(result.CompoReceiptOrder[0].Phone);
        PendingROID(result.CompoReceiptROID);
        BindPendingRoPaymode();
        BindPendingRoBranch();
        var TotalNetAmount = 0;
        for (var i = 0; i < result.CompoReceiptROID.length; i++) {
            $("input[pendingro=" + result.CompoReceiptROID[i].ROID + "]").click();
            TotalNetAmount = TotalNetAmount + result.CompoReceiptROID[i].Net;
        }

        $("#txtcanceltotalamount").val(TotalNetAmount);
        $("#txtcanceltotalamount").html(TotalNetAmount.toFixed(2));

        CompositeReceiptDetailsFill(result.CompoReceiptOrder);

        if ($("#hdnallowreceiptcancel").val() == "0") {
            $("#btncancelreceipt").css('pointer-events', 'none');
            $("#btncancelreceipt").css('opacity', '0.5');
            $("#btnnewcancelreceipt").css('pointer-events', 'none');
            $("#btnnewcancelreceipt").css('opacity', '0.5');
        }
        else {
            $("#btncancelreceipt").css('pointer-events', 'auto');
            $("#btncancelreceipt").css('opacity', '');
            $("#btnnewcancelreceipt").css('pointer-events', 'auto');
            $("#btnnewcancelreceipt").css('opacity', '');
        }
        $("#txtNewReceiptNo").val($("#txtReceiptNo").val());
    }

    else if (result.OpenOrder[0].IsValid == 1) {
        ShowMsg(result.OpenOrder[0].ErrorMessage);
        $("#txtReceiptNo").val('');
        return false;
    }

    else if (result.OpenOrder.length > 0 || result.ReceiptOrder.length > 0) {

        if (result.OpenOrder[0].IsClassified == 1) {
            if ($("#hdnallowclassified").val() == 0) {
                ShowMsg("Order can not be opened - Display");
                $("#txtOrderNo").val('');
                return false;
            }
        }
        else {
            if ($("#hdnallowdisplay").val() == 0) {
                ShowMsg("Order can not be opened - Classified");
                $("#txtOrderNo").val('');
                return false;
            }
        }

        if (result.OpenOrder[0].IsManualBilling == "1") {
            if ($("#hdnallowmanualbilling").val() == 0) {
                ShowMsg("Order can not be opened - Manual");
                $("#txtOrderNo").val('');
                return false;
            }
        }

        var url1 = appRoot + "Booking/GetGridData";
        var param_Ist = {};
        var result1 = getresult(url1, param_Ist);

        $('[parameter=DateEditable]').val(1);
        ispefocus = true;
        var selectedpearray = new Array();
        selectedDateArray = [];
        selectedPEwithValidDays = [];
        selectedcyopPE = [];
        disabledDates = [];
        $("#hdnauditdate").val('');
        list = [];
        var count = 0;
        checkdate = 0;
        var receiptid = $("#txtReceiptNo").val();
        if (result.OpenOrder[0].IsClassified == 1) {
            if ($('#hdnIsClassified').val() != "1" || $('#hdnIsDigital').val() == "1") {
                $('#hdnIsDigital').val('0');
                $("[val='1']").click();
            }
        }
        else if (result.OpenOrder[0].IsDigital == 1) {
            $('#hdnIsDigital').val('1');
            $("[val='2']").click();
        }
        else {
            if ($('#hdnIsClassified').val() == "1" || $('#hdnIsDigital').val() == "1") {
                $('#hdnIsDigital').val('0');
                $("[val='0']").click();
            }
        }
        $("#txtReceiptNo").val(receiptid);
        $('#adtypeid').val(result.OpenOrder[0].AdTypeID);
        BindPackageControl();
        $('#productid').val(result.OpenOrder[0].ProductID);
        BindBrandControl();
        $('#brandid').val(result.OpenOrder[0].BrandID);
        allowcasualclientid = result.OpenOrder[0].AllowCasualClient;
        var agreeddiscountper = "";
        var agreedrate = "";
        var CardRate = 0;
        var NewCardRate = 0;
        var ExtraBoxChargesAmount = 0;

        $("#agencyid").val(result.OpenOrder[0].AgencyName);
        agencyidvalue = result.OpenOrder[0].AgencyID;
        agencypaymentmode = result.OpenOrder[0].AgencyPaymentMode;
        clientidvalue = result.OpenOrder[0].ClientID;
        if (clientidvalue <= 0) {

            $("#clientid").val(result.OpenOrder[0].CasualClientName);
        }
        else
            $("#clientid").val(result.OpenOrder[0].ClientName);
        $("#canvassorid").val(result.OpenOrder[0].CanvassorName);
        canvassoridvalue = result.OpenOrder[0].CanvassorID;
        $('#txtronumber').val(result.OpenOrder[0].RONumber);
        $("#rodatePicker").datepicker("setDate", result.OpenOrder[0].RODate.substring(0, 10).replace('-', '/').replace('-', '/'));
        $("#hdnbookingdate").val(result.OpenOrder[0].BookingDate);
        $('#adtypeid').val(result.OpenOrder[0].AdTypeID);
        $('#uomid').val(result.OpenOrder[0].UOM);
        $('#smeid').val(result.OpenOrder[0].SMEID);

        $('#mattypeid').val(result.OpenOrder[0].MaterialType);
        mattypeidvalue = $('#mattypeid').val();
        $('#matsourceid').val(result.OpenOrder[0].MaterialSource);
        $('#rotypeid').val(result.OpenOrder[0].ROType);
        $("#uncnfrmrsnid").val(result.OpenOrder[0].ReasonForUnconfirmationID);
        $('#billtypeid').val(result.OpenOrder[0].BillType);
        $('#boxtypeid').val(result.OpenOrder[0].BoxTypeID);
        $('#boxaddressid').val(result.OpenOrder[0].BoxAddress);

        for (var i = 0; i < result.OpenOrder.length; i++) {
            selectedpearray.push(result.OpenOrder[i].PackageID);
            selectedcyopPE.push(selectedpearray);
            if (selectedcyopPE[0] == "") {
                selectedcyopPE = [];
                selectedcyopPE.push(selectedpearray);
            }
            if (i == result.OpenOrder.length - 1) {
                $("#packageid").val(selectedpearray).trigger('chosen:updated');
                OrerPEChange();
            }
            $("#hdnreadonly").val(result.OpenOrder[i].ReadOnlyFlag);
            $('[parameter=ProductionDate]').append(new Option(result.OpenOrder[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/'), result.OpenOrder[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/')));
            mindt = $('[parameter=ProductionDate]').find('option').eq(0).val();
            $('#datePicker').datepicker("setDate", new Date(mindt.split('/')[1] + '/' + mindt.split('/')[0] + '/' + mindt.split('/')[2]));
            $('#datePicker').datepicker("refresh");
            selectedDateArray.push(result.OpenOrder[i].ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/'));

            //$("#agencyid").val(result.OpenOrder[i].AgencyName);
            //agencyidvalue = result.OpenOrder[i].AgencyID;
            //agencypaymentmode = result.OpenOrder[i].AgencyPaymentMode;
            //clientidvalue = result.OpenOrder[i].ClientID;
            //if (clientidvalue <= 0) {

            //    $("#clientid").val(result.OpenOrder[i].CasualClientName);
            //}
            //else
            //    $("#clientid").val(result.OpenOrder[i].ClientName);
            //$("#canvassorid").val(result.OpenOrder[i].CanvassorName);
            //canvassoridvalue = result.OpenOrder[i].CanvassorID;
            //$('#txtronumber').val(result.OpenOrder[i].RONumber);
            //$("#rodatePicker").datepicker("setDate", result.OpenOrder[i].RODate.substring(0, 10).replace('-', '/').replace('-', '/'));
            //$("#hdnbookingdate").val(result.OpenOrder[i].BookingDate);
            //$('#adtypeid').val(result.OpenOrder[i].AdTypeID);
            //$('#uomid').val(result.OpenOrder[i].UOM);
            //$('#smeid').val(result.OpenOrder[i].SMEID);

            //$('#mattypeid').val(result.OpenOrder[i].MaterialType);
            //mattypeidvalue = $('#mattypeid').val();
            //$('#matsourceid').val(result.OpenOrder[i].MaterialSource);
            //$('#rotypeid').val(result.OpenOrder[i].ROType);
            //$("#uncnfrmrsnid").val(result.OpenOrder[i].ReasonForUnconfirmationID);
            //$('#billtypeid').val(result.OpenOrder[i].BillType);
            //$('#boxtypeid').val(result.OpenOrder[i].BoxTypeID);
            //$('#boxaddressid').val(result.OpenOrder[i].BoxAddress);

            if (result.OpenOrder[0].IsClassified != 1) {

                $("#premiaid").val(result.OpenOrder[i].PremiaName);

                premiaidvalue = result.OpenOrder[i].PremiaID;
                premianame = result.OpenOrder[i].PremiaName;
                OpenPremiaDetails(result.OpenOrder[i].PremiaName);
                if (result.OpenOrder[i].SizeName == '') {
                    $("#adsizeid").val(result.OpenOrder[i].Adsize);
                    adsizename = result.OpenOrder[i].Adsize;
                    adheightvalue = adsizename.replace(/ /g, '').split("*")[0];
                    adsizecolvalue = adsizename.replace(/ /g, '').split("*")[1];
                }
                else {
                    $("#adsizeid").val(result.OpenOrder[i].SizeName);
                    adsizename = result.OpenOrder[i].SizeName;
                    OpenAdsizeDetails(result.OpenOrder[i].SizeName);
                }
                adsizeidvalue = result.OpenOrder[i].AdsizeID;
                $("#colorid").val(result.OpenOrder[i].ColorName);
                coloridvalue = result.OpenOrder[i].ColorID;
                colorname = result.OpenOrder[i].ColorName;
                $("#billablesize").val(result.OpenOrder[i].BillableSize);
                $("#txtitemcaption").val(result.OpenOrder[i].Caption);
            }

            else {
                $("#txtclitemcaption").val(result.OpenOrder[i].Caption);
                $("#iscd").val(result.OpenOrder[i].IsCD);
                $("#islogo").val(result.OpenOrder[i].IsLogo);
                if ($("#iscd").val() == 0) {
                    $("#mbodysize").val(result.OpenOrder[i].MBodyCount);
                    if (result.OpenOrder[i].IsLogo == "1") {
                        $("#txtheight").val(result.OpenOrder[i].FileHeight);
                        HeightLogo = result.OpenOrder[i].FileHeight;
                    }
                    else {
                        $("#txtheight").val('');
                    }
                }
                else {
                    $("#mbodysize").val('');
                    $("#txtheight").val(result.OpenOrder[i].BillableHeight);
                    HeightLogo = result.OpenOrder[i].BillableHeight;
                }
                if (result.OpenOrder[0].IsClassified == 1) {
                    $("#iscd").change();
                }
                $("#txtcol").val(result.OpenOrder[i].AdColumns);
                $("#stylesheetid").val(result.OpenOrder[i].StyleSheetID);

                if (result.OpenOrder[i].FileNames != "") {
                    $("#lblfile").html(result.OpenOrder[i].FileNames);
                    $('#file_center').attr('title', result.OpenOrder[i].FileNames);
                }

                $("#adtext").val(result.OpenOrder[i].U_BodyText);
                $("#categoryid").val(result.OpenOrder[i].AdClassification);
                AdtypeId1 = result.OpenOrder[i].AdtypeID1;
                AdtypeId2 = result.OpenOrder[i].AdtypeID2;
                AdtypeId3 = result.OpenOrder[i].AdtypeID3;
                AdtypeId4 = result.OpenOrder[i].AdtypeID4;
            }

            CardRate = CardRate + result.OpenOrder[i].CardRate;

            var insnum = result.OpenOrder[0].InsNum; // 1
            if (insnum == result.OpenOrder[i].InsNum) {
                NewCardRate = NewCardRate + result.OpenOrder[i].CardRate;
                $("#txtcardrate").val(NewCardRate);
            }
            agreeddiscountper = result.OpenOrder[0].AgreedDiscPer;
            AgreedDiscAmount = AgreedDiscAmount + result.OpenOrder[i].AgreedDiscAmount;
            $("#txtagreeddiscountamount").val(AgreedDiscAmount);
            CardAmount = CardAmount + result.OpenOrder[i].CardAmount;
            $("#txtcardamount").val(CardAmount);
            AgreedAmount = AgreedAmount + result.OpenOrder[i].AgreedAmount;
            $("#txtagreedamount").val(AgreedAmount.toFixed(2));
            $("#txtextrachargeper").val(result.OpenOrder[i].ExtraChargesPer);
            ExtraChargesAmount = ExtraChargesAmount + result.OpenOrder[i].ExtraChargesForPE;
            $("#txtextrachargeamount").val(ExtraChargesAmount.toFixed(2));
            $("#txtextradisper").val(result.OpenOrder[i].ExtraDiscPer);
            ExtraDiscAmount = ExtraDiscAmount + result.OpenOrder[i].ExtraDiscAmount;
            $("#txtextradisamount").val(ExtraDiscAmount.toFixed(2));
            $("#hdnratefieldchanged").val(result.OpenOrder[i].RateFieldChanged);
            $("#hdnitemratefieldchanged").val(result.OpenOrder[i].ItemRateFieldChanged);
            $("#txtboxchargeper").val(result.OpenOrder[i].ExtraBoxChargesPer);
            ExtraBoxChargesAmount = result.OpenOrder[0].ExtraBoxChargesAmount;
            $("#txtboxchargeamount").val(ExtraBoxChargesAmount);
            $("#txtcommisionper").val(result.OpenOrder[i].CommissionPer);
            AgencyCommissionAmount = AgencyCommissionAmount + result.OpenOrder[i].CommissionAmount;
            $("#txtcommisionamount").val(AgencyCommissionAmount);
            PreVATAmount = PreVATAmount + result.OpenOrder[i].PreVATAmountforPE;
            $("#txtprevatamount").val(PreVATAmount);
            $("#txtvatper").val(result.OpenOrder[i].VatPer);
            VATAmount = VATAmount + result.OpenOrder[i].VatAmount;
            $("#txtvatamount").val(VATAmount);
            agreedrate = result.OpenOrder[0].AgreedRate;
            $('#txtratecardid').val(result.OpenOrder[i].RateCardID);
            $('#txtadrateid').val(result.OpenOrder[i].AdRateID);
            $("#txtagreeddiscountamount").html(AgreedDiscAmount.toFixed(2));
            $("#txtcardamount").html(CardAmount.toFixed(2));
            $("#txtboxchargeper").html(result.OpenOrder[i].ExtraBoxChargesPer + "%");
            $("#txtboxchargeamount").html(ExtraBoxChargesAmount.toFixed(2));
            $("#txtcommisionper").html(result.OpenOrder[i].CommissionPer + "%");
            $("#txtcommisionamount").html(AgencyCommissionAmount.toFixed(2));
            $("#txtprevatamount").html(PreVATAmount.toFixed(2));
            //$('#txtvatper').html(result.OpenOrder[i].VatPer + "%");
            $("#txtvatamount").html(VATAmount.toFixed(2));
            $('#txtratecardid').html(result.OpenOrder[i].RateCardID);
            $('#txtadrateid').html(result.OpenOrder[i].AdRateID);
            $("#txtrostatus").val(result.OpenOrder[i].ROStatus);
            $("#txtstatus").val(result.OpenOrder[i].Status);
            $("#txtauditstatus").val(result.OpenOrder[i].AuditStatus);
            $('#hdninsnum').val(result.OpenOrder[0].InsNum);
            $('#hdnroid').val(result.OpenOrder[0].ROID);
            $('#spnroid').text(result.OpenOrder[0].ROID);
            $('#hdnsourceroid').val(result.OpenOrder[0].SourceOrder);
            $('#txtscheduleins').val(result.OpenOrder[i].SchedulingInstructions);

            if (result.OpenOrder[0].IsClassified == 1) {
                $('#txtclbillingins').val(result.OpenOrder[i].BillingInstruction);
                $('#txtclprodins').val(result.OpenOrder[i].ProdInstructions);
            }
            else {
                $('#txtbillingins').val(result.OpenOrder[i].BillingInstruction);
                $('#txtprodins').val(result.OpenOrder[i].ProdInstructions);
            }

            BindGridControl();
            callInnerBoxHover();
            $('#uomid').val(result.OpenOrder[i].UOM);

            AdtypeIdlist.push(result.OpenOrder[i].AdTypeID);

            Adsizeidlist.push(result.OpenOrder[i].AdsizeID);
            result1.AdsizeID = result.OpenOrder[i].AdsizeID;

            AdsizeHeightlist.push(result.OpenOrder[i].BillableHeight);
            AdsizeWidthlist.push(result.OpenOrder[i].BillableColSize);
            Premiaidlist.push(result.OpenOrder[i].PremiaID);
            result1.PremiaID = result.OpenOrder[i].PremiaID;
            Coloridlist.push(result.OpenOrder[i].ColorID);
            result1.ColorID = result.OpenOrder[i].ColorID;

            MaterialTypelist.push(result.OpenOrder[i].MaterialType);
            MaterialSourcelist.push(result.OpenOrder[i].MaterialSource);
            BoxTypeIDlist.push(result.OpenOrder[i].BoxTypeID);
            UOMIDlist.push(result.OpenOrder[i].UOM);
            Statuslist.push(result.OpenOrder[i].Status);
            AuditStatuslist.push(result.OpenOrder[i].AuditStatus);
            CardRatelist.push(result.OpenOrder[i].CardRate);
            CardAmountlist.push(result.OpenOrder[i].CardAmount);
            RateCardIDlist.push(result.OpenOrder[i].RateCardID);
            AdRateIDlist.push(result.OpenOrder[i].AdRateID);

            AgreedRatelist.push(result.OpenOrder[i].AgreedRate);
            result1.AgreedRate = result.OpenOrder[i].AgreedRate;

            AgreedAmountlist.push(result.OpenOrder[i].AgreedAmount);
            result1.AgreedAmount = result.OpenOrder[i].AgreedAmount;

            AgreedDiscPerlist.push(result.OpenOrder[i].AgreedDiscPer);
            result1.AgreedDiscPer = result.OpenOrder[i].AgreedDiscPer;

            AgreedDiscAmountlist.push(result.OpenOrder[i].AgreedDiscAmount);
            result1.AgreedDiscAmount = result.OpenOrder[i].AgreedDiscAmount;

            PreVATAmountlist.push(result.OpenOrder[i].PreVATAmountforPE);
            VATPerlist.push(result.OpenOrder[i].VatPer);
            VATAmountlist.push(result.OpenOrder[i].VatAmount);
            AgencyCommissionPerlist.push(result.OpenOrder[i].CommissionPer);
            AgencyCommissionAmountlist.push(result.OpenOrder[i].CommissionAmount);
            SchemeIDlist.push(result.OpenOrder[i].SchemeID);
            SchemeDetailIDlist.push(result.OpenOrder[i].SchemeDetailID);

            ExtraChargesPerlist.push(result.OpenOrder[i].ExtraChargesPer);
            result1.ExtraChargesPer = result.OpenOrder[i].ExtraChargesPer;

            ExtraChargesAmountlist.push(result.OpenOrder[i].ExtraChargesForPE);
            result1.ExtraChargesAmount = result.OpenOrder[i].ExtraChargesForPE;

            ExtraDiscPerlist.push(result.OpenOrder[i].ExtraDiscPer);
            result1.ExtraDiscPer = result.OpenOrder[i].ExtraDiscPer;

            ExtraDiscAmountlist.push(result.OpenOrder[i].ExtraDiscAmount);
            result1.ExtraDiscAmount = result.OpenOrder[i].ExtraDiscAmount;

            ExtraBoxChargesPerlist.push(result.OpenOrder[i].ExtraBoxChargesPer);
            result1.ExtraBoxChargesPer = result.OpenOrder[i].ExtraBoxChargesPer;

            ExtraBoxChargesAmountlist.push(result.OpenOrder[i].ExtraBoxChargesAmount);
            result1.ExtraBoxChargesAmount = result.OpenOrder[i].ExtraBoxChargesAmount;

            Receivablelist.push(result.OpenOrder[0].Receivable);
            list.push(result1);
        }

        //$("#packageid").val(selectedpearray).trigger('chosen:updated');
        //OrerPEChange();
        if (result.OpenOrder[0].FileNames != "") {
            $("#lblfile").html(result.OpenOrder[0].FileNames);
            $('#file_center').attr('title', result.OpenOrder[0].FileNames);
        }

        $("#ins").val(selectedDateArray.length);
        $("#hdnBlockdate").val(result.OpenOrder[0].BlockB4ScheduledDate.substring(0, 10).replace('-', '/').replace('-', '/'));
        $('#bookingGrid tr:not(:first-child)').remove();
        var spilitreceivable = parseFloat(0 + "." + parseInt(result.OpenOrder[0].Receivable.toString().split('.')[1]));
        if (spilitreceivable >= .50) {
            $("#txtrecevible").val(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#txtrecevible").html(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#NetReceivableForCheck").val(parseFloat(Math.round(result.OpenOrder[0].Receivable)).toFixed(2));
        }
        else {
            $("#txtrecevible").val(parseFloat(Math.floor(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#txtrecevible").html(parseFloat(Math.floor(result.OpenOrder[0].Receivable)).toFixed(2));
            $("#NetReceivableForCheck").val(parseFloat(Math.floor(result.OpenOrder[0].Receivable)).toFixed(2));
        }
        $("#txtnetamount").val(result.OpenOrder[0].Net);
        $("#txtnetamount").html(result.OpenOrder[0].Net.toFixed(2));
        LoadSwitchValue();
        if (result.OpenOrder[0].PaymentModeID == "2") {
            $("#paymenttypetoggle").prop("checked", true);
            $("#hdnIsPaymentType").val(result.OpenOrder[0].PaymentModeID);
            $("#tblreceipt").find("input,button,select").attr("disabled", "disabled");
            $("#tblreceipt").css('display', 'none');
            EnableElement();
            $(".navigation-item").css('pointer-events', 'none');
            $(".switch-set-right").css('pointer-events', 'none');
            $("#hdnIsCredit").val(1);
        }
        else {
            $("#paymenttypetoggle").prop("checked", false);
            $("#hdnIsPaymentType").val(result.OpenOrder[0].PaymentModeID);
            $("#tblreceipt").find("input,button,select").removeAttr("disabled");
            $("#tblreceipt").css('display', '');
            DisableElement();
        }
        if (result.OpenOrder[0].CustomerTypeID == "1") {
            $("#customertypetoggle").prop("checked", true);
            $("#hdnIsCustomerType").val(result.OpenOrder[0].CustomerTypeID);
            $("#clientid").css('width', '100%');
            $("#clientadd").css('display', 'none');
        }
        else {
            $("#customertypetoggle").prop("checked", false);
            $("#hdnIsCustomerType").val(result.OpenOrder[0].CustomerTypeID);
            $("#clientid").css('width', '85%');
            $("#clientadd").css('display', '');
            $("#txtcasualAdd").val(result.OpenOrder[0].CasualAddress);
            $("#ddlcasualcity").val(result.OpenOrder[0].CityID);
            $("#txtcasualzip").val(result.OpenOrder[0].Zip);
            $("#txtcasualtelephone").val(result.OpenOrder[0].Phone);
            $("#txtcasualidnum").val(result.OpenOrder[0].NicNumber);
            $("#txtclientvatnum").val(result.OpenOrder[0].VatNumber);
        }

        if (result.OpenOrder[0].IsManualBilling == "1") {
            $("#manualbilltoggle").prop("checked", true);
            $("#hdnIsManualBill").val(result.OpenOrder[0].IsManualBilling);
        }
        else {
            $("#manualbilltoggle").prop("checked", false);
            $("#hdnIsManualBill").val(result.OpenOrder[0].IsManualBilling);
        }
        if (result.OpenOrder[0].DeferredPayment == 1) {
            $("#chkdiffer").prop("checked", true);
            $("#hdnchkdiffer").val(result.OpenOrder[0].DeferredPayment);
        }
        else {
            $("#chkdiffer").prop("checked", false);
            $("#hdnchkdiffer").val(result.OpenOrder[0].DeferredPayment);
        }

        //if (result.OpenOrder[0].IsVatChange == 1) {
        //    $("#isVatPer").prop("checked", true);
        //    $("#hdnIsVatPer").val(1);
        //    $("#txtvatper").removeAttr("disabled");
        //}
        //else {
        //    $("#isVatPer").prop("checked", false);
        //    $("#hdnIsVatPer").val(0);
        //    $("#txtvatper").attr("disabled", "disabled");
        //}

        if (result.ReceiptOrder.length > 0) {
            for (var i = 0; i < result.ReceiptOrder.length; i++) {
                // Receipt Detail
                $("#spnreceiptnum").text(result.ReceiptOrder[0].ReceiptID);
                $("#txtreceiptamount").val(result.ReceiptOrder[0].CashReceived.toFixed(2));
                $("#txtwriteoffamount").val(result.ReceiptOrder[0].WriteOffAmount);
                $("#txtwriteoffamount").html(result.ReceiptOrder[0].WriteOffAmount.toFixed(2));
                $("#txtreturnamount").val(result.ReceiptOrder[0].CashRefund);
                $("#txtreturnamount").html(result.ReceiptOrder[0].CashRefund.toFixed(2));
                if (i == 0) {
                    $("#txtpaymentmodeid").val(result.ReceiptOrder[0].ReceiptPaymentMode);
                    $("#txtbankname").val(result.ReceiptOrder[0].BranchID);
                    $("#txtchequenum").val(result.ReceiptOrder[0].CheckNumber);
                    $("#txtamount").val(result.ReceiptOrder[0].Amount.toFixed(2));
                }
                if (i == 1) {
                    $("#txtpaymentmodeid1").val(result.ReceiptOrder[1].ReceiptPaymentMode);
                    $("#txtbankname1").val(result.ReceiptOrder[1].BranchID);
                    $("#txtchequenum1").val(result.ReceiptOrder[1].CheckNumber);
                    $("#txtamount1").val(result.ReceiptOrder[1].Amount.toFixed(2));
                }
                if (i == 2) {
                    $("#txtpaymentmodeid2").val(result.ReceiptOrder[2].ReceiptPaymentMode);
                    $("#txtbankname2").val(result.ReceiptOrder[2].BranchID);
                    $("#txtchequenum2").val(result.ReceiptOrder[2].CheckNumber);
                    $("#txtamount2").val(result.ReceiptOrder[2].Amount.toFixed(2));
                }
            }
        }


        var str = "";
        if (result.ROFilesOrder.length > 0) {
            $('#fileGrid').html('');
            for (var i = 0; i < result.ROFilesOrder.length; i++) {
                // RO Files Detail
                Rofilename.push(result.ROFilesOrder[i].ROFileName);
                Rofiletype.push(result.ROFilesOrder[i].ROFileType);
                Rofiletitle.push(result.ROFilesOrder[i].ROFileTitle);

                str += '<tr class="RoidFileRow" onclick="ROIDSelectedFile(this)" filename="' + result.ROFilesOrder[i].ROFileName + '"><td>' + (i + 1) + '</td>'
                    + '<td>' + result.ROFilesOrder[i].ROFileName + '</td>'
                    + '<td>' + result.ROFilesOrder[i].ROFileType + '</td>'
                    + '<td>' + result.ROFilesOrder[i].ROFileTitle + '</td>'
                    + '<td><button id="btnfileview"  onclick="ROIDFileOpen(this)" filename="' + result.ROFilesOrder[i].ROFileName + '" roid="' + result.ROFilesOrder[i].ROID
                    + '" rofilepath="' + result.OpenOrder[0].ROFilePath + '" rofiletype="' + result.ROFilesOrder[i].ROFileType + '"  >View</button></td></tr>';
            }
            $('#fileGrid').append(str);
        }
        ParentOrderRate();
        $('#txtcardrate').html(NewCardRate.toFixed(2));
        BindRateLevelGrid(result.OpenOrder);
        $('.action-bar').css('pointer-events', 'none');
        $('#btnneworder').css('pointer-events', 'auto');
        $('#btnnewreceipt').css('pointer-events', 'auto');
        $('#btnprint').css('pointer-events', 'auto');
        if ($("#hdnallowreceiptcancel").val() == "0") {
            $("#btncancelreceipt").css('pointer-events', 'none');
            $("#btncancelreceipt").css('opacity', '0.5');
            $("#btnnewcancelreceipt").css('pointer-events', 'none');
            $("#btnnewcancelreceipt").css('opacity', '0.5');
        }
        else {
            $("#btncancelreceipt").css('pointer-events', 'auto');
            $("#btncancelreceipt").css('opacity', '');
            $("#btnnewcancelreceipt").css('pointer-events', 'auto');
            $("#btnnewcancelreceipt").css('opacity', '');
        }
        RateChangeFlagColor();
        if (result.OpenOrder[0].BoxTypeID == 0) {
            $("#boxaddressid").attr('disabled', true);
        }
        else {
            $("#boxaddressid").removeAttr('disabled');
        }

        if (result.OpenOrder[0].IsClassified == 1) {
            $("#mattypeid").attr("disabled", true);
        }
        else {
            $("#mattypeid").attr("disabled", false);
        }
        if ($("#iscd").val() == 0) {
            $("#mbodysize").removeAttr('disabled');
        }
        else {
            $("#mbodysize").attr('disabled', true);
        }
        if ($("#islogo").val() == 0) {
            $("#file_center").attr("disabled", "disabled");
        }
        else {
            $("#file_center").removeAttr("disabled");
        }
        IsCDchange();
        //if (result.OpenOrder[0].PaymentModeID == "2") {
        //    EnableElement();
        //}
        //else {
        //    DisableElement();
        //}
        if (result.OpenOrder[0].PaymentModeID == "1") {
            DisableElement()
        }
        if (result.OpenOrder[0].IsVatChange == 1) {
            $("#isVatPer").prop("checked", true);
            $("#hdnIsVatPer").val(1);
            $("#txtvatper").removeAttr("disabled");
        }
        else {
            $("#isVatPer").prop("checked", false);
            $("#hdnIsVatPer").val(0);
            $("#txtvatper").attr("disabled", "disabled");
        }
        $("#rotypeid").change();
        if ($("#hdnallowcredit").val() == 1) {
            if ($("#hdnIsPaymentType").val() == 1) {
                $("#txtsaveupdate").css('pointer-events', 'none');
                $("#txtsaveupdate").css('opacity', '0.5');
                $("#hdnsaveenable").val(1);
                $("#btncopy").css('pointer-events', 'none');
                $("#btncopy").css('opacity', '0.5');
            }
            else {
                $("#txtsaveupdate").css('pointer-events', 'auto');
                $("#txtsaveupdate").css('opacity', '');
                $("#hdnsaveenable").val(0);
                $("#btncopy").css('pointer-events', '');
                $("#btncopy").css('opacity', '');
            }
        }
        $('#spnroid').text(result.OpenOrder[0].ROID);
        $("#txtsaveupdate").text('UPDATE ORDER');
        ispefocus = false;
        ctrlupress = false;
        cnfrmboxvalue = true;
        dbclick = false;
        setTimeout(function () {
            $("#txtReceiptNo").focus();
        }, 400);
    }
    else {
        ShowMsg("Record not found");
        $("#txtReceiptNo").val('');
        setTimeout(function () {
            $("#txtReceiptNo").focus();
        }, 400);
        return false;
    }
}

function IsCDchange() {
    var isROL = $("#adtypeid option:selected").attr('isROL');
    var isCD = $("#adtypeid option:selected").attr('isCD');
    if (isROL == 1 && isCD == 1) {
        $("#iscd").removeAttr("disabled");
        $("#islogo").removeAttr("disabled");
        if ($("#iscd").val() == 0) {
            if ($("#islogo").val() == 0)
                $("#file_center").attr("disabled", "disabled");
            else
                $("#file_center").removeAttr("disabled");
            $("#mbodysize").removeAttr("disabled");
        }
        else if ($("#iscd").val() == 0 && $("#islogo").val() == 1) {
            $("#file_center").removeAttr("disabled");
            $("#mbodysize").attr("disabled", "disabled");
        }
        else {
            if ($("#islogo").val() == 0)
                $("#file_center").attr("disabled", "disabled");
            else
                $("#file_center").removeAttr("disabled");
            $("#mbodysize").attr("disabled", "disabled");
        }
    }
    else if (isROL == 1) {
        $("#iscd").val(0);
        $("#iscd").attr("disabled", "disabled");
        $("#islogo").removeAttr("disabled");
        $("#txtcol").val(1);
        $("#mbodysize").removeAttr("disabled");
        $("#txtheight").attr("disabled", "disabled");
        $("#txtcol").attr("disabled", "disabled");
        if ($("#islogo").val() == 0)
            $("#file_center").attr("disabled", "disabled");
        else
            $("#file_center").removeAttr("disabled");
    }
    else if (isCD == 1) {
        $("#iscd").val(1);
        $("#iscd").attr("disabled", "disabled");
        $("#islogo").attr("disabled", "disabled");
        $("#txtcol").val(1);
        $("#mbodysize").attr("disabled", "disabled");
        $("#txtheight").removeAttr("disabled");
        $("#txtcol").removeAttr("disabled");
        if ($("#islogo").val() == 0)
            $("#file_center").attr("disabled", "disabled");
        else
            $("#file_center").removeAttr("disabled");
    }
    if ($("#iscd").val() == "0") {
        if ($("#islogo").val() == "0")
            $("#txtheight").val('');
        $("#islogo").removeAttr("disabled");
        $("#txtcol").val(1);
        $("#mbodysize").removeAttr("disabled");
        if ($("#islogo").val() == "1") {
            $("#txtheight").removeAttr("disabled");
            $("#txtcol").removeAttr("disabled");
        }
        else {
            $("#txtheight").attr("disabled", "disabled");
            $("#txtcol").attr("disabled", "disabled");
        }
    }
    else {
        $("#mbodysize").val('');
        $("#islogo").val(0);
        $("#islogo").attr("disabled", "disabled");
        $("#txtcol").val(1);
        $("#mbodysize").attr("disabled", "disabled");
        $("#txtheight").removeAttr("disabled");
        $("#txtcol").removeAttr("disabled");
        $("#file_center").removeAttr("disabled");
    }
}

function OrerPEChange() {
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val();
    if ($("#txtOrderNo").val().trim() != '' || $("#txtReceiptNo").val().trim() != '') {
        if (selectedpackage.length > 1) {
            var res = VerifyCYOP();
            if (res == false) {
                return false;
            }
        }
        var isvalid = $('#packageid option:selected').attr('isvalid');
        if (isvalid == 1) {
            if ($('#hdnIsClassified').val() != "1") {
                ShowMsg("You do not have booking rights For Selected PE / PEs", $("#premiaid"));
            }
            else {
                ShowMsg("You do not have booking rights For Selected PE / PEs", $("#categoryid"));
            }
            if ($('.chosen-choices li').length == 3)
                $('.chosen-choices li:nth-child(2) a').click();
            else
                $('.chosen-choices li:nth-child(1) a').click();
            return false;
        }
        else if (isvalid == 2) {
            ShowMsg("Invalid AdType for the selected publication", $("#adtypeid"));
            if ($('.chosen-choices li').length == 3)
                $('.chosen-choices li:nth-child(2) a').click();
            else
                $('.chosen-choices li:nth-child(1) a').click();
            $("#adtypeid").focus();
            return false;
        }
    }
    list = [];
    checkdate = 0;
    if ($('#hdnIsClassified').val() == "1") {
        categoryidvalue = 0;
        AdtypeId1 = 0;
        AdtypeId2 = 0;
        AdtypeId3 = 0;
        AdtypeId4 = 0;
        $("#mbodysize").val('');
        $("#txtheight").val('');
        $("#mbodysize").prop("disabled", "");
        $("#txtheight").prop("disabled", "disabled");
        $("#txtcol").prop("disabled", "disabled");
        $("#file_center").prop("disabled", "disabled");
        $("#file_center").attr('title', 'No file chosen');
        $("#categoryid").val('');
        $("#txtclitemcaption").val('');
        BindDefaultUOMControl();
        $("#iscd").change();
    }
    else {
        $("#premiaid").val('');
        premiaidvalue = 0;
        $("#adsizeid").val('');
        $("#billablesize").val('');
        adsizeidvalue = 0;
        BindDefaultColorControl();
        BindPremiaAdsize();
        $("#txtitemcaption").val('');
    }
    $('#datePicker').datepicker('refresh');
    cleartabletdvalue();
    $('.column-right table tr td input[type="text"]').val('');
    $('.column-right table tr td select').val('');
    CheckPackageidRun();
    $('#datePicker').datepicker("refresh");
    //BindGridControl();
    //callInnerBoxHover();
    IsGetRateClicked = false;
}

function CheckReceiptValidation() {
    if ($("#txtpaymentmodeid").val() == '4') {
        if ($("#txtbankname").val() == 0) {
            ShowMsg("Please select  Bank", $("#txtbankname"));
            $("#txtbankname").focus();
            return false;
        }
        else if ($("#txtchequenum").val().trim() == '') {
            ShowMsg("Please enter Number", $("#txtchequenum"));
            $("#txtchequenum").focus();
            return false;
        }
    }
    else if ($("#txtpaymentmodeid1").val() == '4') {
        if ($("#txtbankname1").val() == 0) {
            ShowMsg("Please select  Bank", $("#txtbankname1"));
            $("#txtbankname1").focus();
            return false;
        }
        else if ($("#txtchequenum1").val().trim() == '') {
            ShowMsg("Please enter Number", $("#txtchequenum1"));
            $("#txtchequenum1").focus();
            return false;
        }

    }
    else if ($("#txtpaymentmodeid2").val() == '4') {
        if ($("#txtbankname2").val() == 0) {
            ShowMsg("Please select  Bank", $("#txtbankname2"));
            $("#txtbankname2").focus();
            return false;
        }
        else if ($("#txtchequenum2").val().trim() == '') {
            ShowMsg("Please enter Number", $("#txtchequenum2"));
            $("#txtchequenum2").focus();
            return false;
        }
    }
    if ($("#txtamount").val() != '' && $("#txtpaymentmodeid").val() == null) {
        ShowMsg("Please select PaymentMode", $("#txtpaymentmodeid"));
        $("#txtpaymentmodeid").focus();
        return false;
    }
    if ($("#txtamount1").val() != '' && $("#txtpaymentmodeid1").val() == null) {
        ShowMsg("Please select PaymentMode", $("#txtpaymentmodeid1"));
        $("#txtpaymentmodeid1").focus();
        return false;
    }
    if ($("#txtamount2").val() != '' && $("#txtpaymentmodeid2").val() == null) {
        ShowMsg("Please select PaymentMode", $("#txtpaymentmodeid2"));
        $("#txtpaymentmodeid2").focus();
        return false;
    }

    if ($("#txtamount").val() != '' && ($("#txtchequenum").val().trim() == '' && $("#txtpaymentmodeid").val() == null)) {
        ShowMsg("Please select PaymentMode", $("#txtpaymentmodeid"));
        $("#txtpaymentmodeid").focus();
        return false;
    }

    if ($("#txtamount1").val() != '' && ($("#txtchequenum1").val().trim() == '' && $("#txtpaymentmodeid1").val() == null)) {
        ShowMsg("Please select PaymentMode", $("#txtpaymentmodeid1"));
        $("#txtpaymentmodeid1").focus();
        return false;
    }

    if ($("#txtamount2").val() != '' && ($("#txtchequenum2").val().trim() == '' && $("#txtpaymentmodeid2").val() == null)) {
        ShowMsg("Please select PaymentMode", $("#txtpaymentmodeid2"));
        $("#txtpaymentmodeid2").focus();
        return false;
    }

    if (($("#txtbankname").val() != 0 && $("#txtbankname").val() != null) && $("#txtpaymentmodeid").val() == null) {
        ShowMsg("Please select PaymentMode", $("#txtpaymentmodeid"));
        $("#txtpaymentmodeid").focus();
        return false;
    }
    if (($("#txtbankname1").val() != 0 && $("#txtbankname1").val() != null) && $("#txtpaymentmodeid1").val() == null) {
        ShowMsg("Please select PaymentMode", $("#txtpaymentmodeid1"));
        $("#txtpaymentmodeid1").focus();
        return false;
    }
    if (($("#txtbankname2").val() != 0 && $("#txtbankname2").val() != null) && $("#txtpaymentmodeid2").val() == null) {
        ShowMsg("Please select PaymentMode", $("#txtpaymentmodeid2"));
        $("#txtpaymentmodeid2").focus();
        return false;
    }
}

function OpenPremiaDetails(paramValue) {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var parametername = $("#premiaid").attr("parameter");
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillPremiaControlData";
    param.Parametername = parametername;
    param.ParamValueStr = paramValue.replace('&', '&amp;').trim();
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        premiamincolvalue = result[0].MinColumn;
        premiamaxcolvalue = result[0].MaxColumn;
        premiaminheightvalue = result[0].MinHeight;
        premiamaxheightvalue = result[0].MaxHeight;
        premiaidvalue = result[0].ID;
        premianame = result[0].Value;
    }
}

function OpenAdsizeDetails(paramValue) {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var parametername = $("#adsizeid").attr("parameter");
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillAdSizeControlData";
    param.Parametername = parametername;
    param.ParamValueStr = paramValue.replace('&', '&amp;');
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var selectedpackage = new Array();
    selectedpackage = $("#packageid").val().toString();
    param.PackageID = selectedpackage;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        adheightvalue = result[0].AdHeight;
        adsizecolvalue = result[0].AdSizeColumn;
        adsizevalue = result[0].AdSizeValue;
        adsizeidvalue = result[0].ID;
        adsizename = result[0].Value;
    }
    else {
        adheightvalue = paramValue.split('*')[0];
        adsizecolvalue = paramValue.split('*')[1];
        adsizevalue = paramValue;
        adsizeidvalue = 0;
        adsizename = paramValue;
    }
}

function OpenColorDetails(paramValue) {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var parametername = $("#colorid").attr("parameter");
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillColorControlData";
    param.Parametername = parametername;
    param.ParamValueStr = paramValue.replace('&', '&amp;');
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        colorname = result[0].Value;
        coloridvalue = result[0].ID;
    }
}

function OpenCategoryDetails() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var parametername = $("#categoryid").attr("parameter");
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillCategoryControlData";
    param.Parametername = parametername;
    param.ParamValueStr = $("#categoryid").val().replace('&', '&amp;').split('-')[0];
    param.AdtypeId = $("#adtypeid").val();
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length == 1) {
        var SelVal = result[0].CategoryID.split(",");
        categoryidvalue = result[0].CategoryID;
        IsLogoPossible = result[0].IsLogoPossible;
        //HeightLogo = result[0].HeightLogo;
        if (IsLogoPossible == 1) {
            $("#islogo").removeAttr("disabled");
        }
        else {
            $("#islogo").attr("disabled", "disabled");
        }
        //if ($("#islogo").val() == 1) {
        //    $("#txtheight").val(HeightLogo);
        //    if (HeightLogo > 0)
        //        $("#txtheight").attr("disabled", "disabled");
        //    else
        //        $("#txtheight").removeAttr("disabled");
        //}
        //else {
        //    $("#txtheight").val('');
        //}
        for (i = SelVal.length - 1; i > -1; i--) {
            switch (i) {
                case 3:
                    if (SelVal[3] != '') {
                        AdtypeId1 = SelVal[3];
                    }
                    break;

                case 2:
                    if (SelVal[2] != '') {
                        AdtypeId2 = SelVal[2];
                    }
                    break;
                case 1:
                    if (SelVal[1] != '') {
                        AdtypeId3 = SelVal[1];
                    }
                    break;
                case 0:
                    if (SelVal[0] != '') {
                        AdtypeId4 = SelVal[0];
                    }
                    break;
            }
        }
    }
}

function RefreshBooking() {
    ispefocus = true;
    dbclick = false;
    $("#txtBoxnum").text('');
    $("#spnreceiptnum").text('#####');
    $("#spnroid").text('#####');
    $("#lblfile").html('');
    $("#lblrofile").html('');
    $("#lblfile").text('');
    $("#file_center").val('');
    $("#file_center").attr('title', 'No file chosen');
    Rofilename = [];
    Rofiletype = [];
    Rofiletitle = [];
    selectedcyopPE = [];
    list = [];
    disabledDates = [];
    $("#hdnauditdate").val('');
    NxtPublicationDt = new Date(serverDate);
    NxtPublicationDt.setDate(NxtPublicationDt.getDate() + 1);
    $("#datePicker").datepicker("option", "minDate", NxtPublicationDt);
    $("#datePicker").datepicker("option", "beforeShowDay", CalCheckDateSelectable);
    checkdate = 0;
    $('input[type="text"]').removeClass('RateColor');
    $("#ins").removeAttr("disabled");
    $("#hdnratefieldchanged").val(0);
    $("#hdnitemratefieldchanged").val(0);
    EnableElement();
    $("#brandid").empty();
    $("#hdnsaveflag").val(0);
    $("#hdnsaveenable").val(0);
    $("#isVatPer").prop("checked", false);
    $("#hdnIsVatPer").val(0);
    $("#txtvatper").attr("disabled", "disabled");
    $("#chkdiffer").prop("checked", false);
    CheckDifferReceipt();
    EnableNewReciptPopup();
    if ($('#hdnIsClassified').val() == 1) {
        $("#hdncategoryname").val("");
        OrderlevelinfoEnable();
        OrderlevelEnable();
        cleartable();
        $('input[type="text"]').val('');
        $('textarea').val('');
        $("[val='1']").click();
        $("#ins").val(0);
        $("#txtsaveupdate").text('SAVE ORDER');
        $("#boxaddressid").attr('disabled', true);
        $("#boxaddressid").val('');
        $("#NetReceivableForReceipt").val('');
        $("#backdatedtoggle").prop("checked", false);
        $("#manualbilltoggle").prop("checked", false);

        if ($("#hdnallowcredit").val() == 1) {
            $("#paymenttypetoggle").prop("checked", true);
            $("#hdnIsPaymentType").val(2);
            $("#txtsaveupdate").css('pointer-events', 'auto');
            $("#txtsaveupdate").css('opacity', '');
            $("#hdnsaveenable").val(0);
            $("#btncopy").css('pointer-events', '');
            $("#btncopy").css('opacity', '');
        }
        $("#customertypetoggle").prop("checked", true);
        $("#paymenttypetoggle").prop("checked", true);
        $("#clientid").css('width', '100%');
        $("#clientadd").css('display', 'none');
        $("#billtypeid").prop("disabled", "");
        $("#clientid").addClass('capitalise');
        $("#hdnIsCustomerType").val(1);
        $('input[type="text"]').attr('autocomplete', 'off');
        SwitchBackDatetoggle();
        SwitchManualBilltoggle();
        DeleteBookingFile();
    }
    else {
        window.location.reload(true);
    }
    DisableItemRate();
    UnlockOrder();
    ispefocus = false;
    ctrlupress = false;
}


function RefreshData() {
    $("#bookingGrid tr").eq(0).removeClass('orderrowactive');
    $("#bookingGrid tr").eq(0).removeClass('ordergridselected');
    $("#spnreceiptnum").text('#####');
    $("#spnroid").text('#####');
    $("#lblfile").html('');
    $("#lblrofile").html('');
    $("#lblfile").text('');
    $("#file_center").val('');
    $("#file_center").attr('title', 'No file chosen');
    var orderno = $("#txtOrderNo").val('');
    $('input[type="text"]').val('');
    $('textarea').val('');
    $("#txtreturnamount").val('');
    $("#txtreturnamount").html('');
    $("#txtwriteoffamount").html('');
    $("#txtwriteoffamount").html('');
    $("#ins").val(0);
    $("#ins").removeAttr("disabled");
    $("#hdnsaveenable").val(0);
    $("#hdnIsCredit").val(0);
    $("#isVatPer").prop("checked", false);
    $("#hdnIsVatPer").val(0);
    $("#txtvatper").attr("disabled", "disabled");
    //$('select').prop('selectedIndex', 0);
    NxtPublicationDt = new Date(serverDate);
    NxtPublicationDt.setDate(NxtPublicationDt.getDate() + 1);
    $("#datePicker").datepicker("option", "minDate", NxtPublicationDt);
    // $("#datePicker").datepicker("option", "minDate", "0");
    $('#datePicker').datepicker('refresh');
    $("#bookingGrid").html('');
    $("#brandid").empty();
    $("#ratecardid").empty();
    selectedDateArray = [];
    selectedpackagelist = [];
    selectpeidlist = [];
    $("#backdatedtoggle").prop("checked", false);
    $("#manualbilltoggle").prop("checked", false);
    $("#customertypetoggle").prop("checked", true);
    $("#paymenttypetoggle").prop("checked", true);
    $("#clientid").css('width', '100%');
    $("#clientadd").css('display', 'none');
    $("#billtypeid").prop("disabled", "");
    $("#clientid").addClass('capitalise');
    $("#chkdiffer").prop("checked", false);
    $("#hdnIsCustomerType").val(1);
    CheckDifferReceipt();
    SwitchtoggleTypeValue();
    SwitchBackDatetoggle();
    SwitchManualBilltoggle();
    $("#islogo").val(0);
    $("#islogo").change();
    $('#hdnsourceroid').val(0);
}

function DisableElement() {
    $(".secondary-navigation").find("input,button,select").attr("disabled", "disabled");
    $(".navigation-item").css('pointer-events', 'none');
    $(".switch-set-left").css('pointer-events', 'none');
    $(".switch-set-right").css('pointer-events', 'none');
    $(".filter-bar").find("input,button,select").removeAttr("disabled");
    $(".main-content").find("input,button,select").attr("disabled", "disabled");
    $("#clientadd").removeAttr("disabled");
    $("#divAddrPopUp").find("input,button,select").attr("disabled", "disabled");
    $("#btncasualcancel").removeAttr("disabled");
    $("#adsizeid").removeAttr("disabled");
    $("#billablesize").removeAttr("disabled");
    $("#txtscheduleins").removeAttr("disabled");
    $("#txtbillingins").removeAttr("disabled");
    $("#categoryid").removeAttr("disabled");
    $("#txtcolorperdiscperamount").attr("disabled", "disabled");
    $("#txtpremiaperdiscperamount").attr("disabled", "disabled");
    $("#txtextrachargeper").attr("disabled", "disabled");
    $("#txtextrachargeamount").attr("disabled", "disabled");
    $("#txtextradisper").attr("disabled", "disabled");
    $("#txtextradisamount").attr("disabled", "disabled");
    if ($('#hdnIsClassified').val() == "1") {
        $("#mattypeid").attr("disabled", "disabled");
    }
    $("#packageiddiv").css('pointer-events', 'none');
    $("#datePicker").css('pointer-events', 'none');
}

function EnableElement() {
    $('.action-bar').css('pointer-events', 'auto');
    $("#btngetrate").css('pointer-events', 'auto');
    $("#btngetrate").css('opacity', '');
    $("#txtsaveupdate").css('pointer-events', 'auto');
    $("#txtsaveupdate").css('opacity', '');
    $("#hdnrateenable").val(0);
    $("#hdnsaveenable").val(0);
    //$("#hdnIsVatPer").val(0);
    //$("#txtvatper").attr("disabled", "disabled");
    $(".secondary-navigation").find("input,button,select,a").removeAttr("disabled");
    $(".navigation-item").css('pointer-events', 'auto');
    $(".switch-set-left").css('pointer-events', 'auto');
    $(".switch-set-right").css('pointer-events', 'auto');
    $(".main-content").find("input,button,select").removeAttr("disabled");
    $("#divAddrPopUp").find("input,button,select").removeAttr("disabled");
    $("#txtcolorperdiscperamount").attr("disabled", "disabled");
    $("#txtpremiaperdiscperamount").attr("disabled", "disabled");
    $("#txtextrachargeper").attr("disabled", "disabled");
    $("#txtextrachargeamount").attr("disabled", "disabled");
    $("#txtextradisper").attr("disabled", "disabled");
    $("#txtextradisamount").attr("disabled", "disabled");
    $("#packageiddiv").css('pointer-events', 'auto');
    $("#datePicker").css('pointer-events', 'auto');
    if ($('#hdnIsClassified').val() == "1") {
        $("#mattypeid").attr("disabled", "disabled");
        if ($("#iscd").val() == "0") {
            if ($("#islogo").val() == "1") {
                $("#txtheight").removeAttr("disabled");
                $("#txtcol").removeAttr("disabled");
            }
            else {
                $("#txtheight").prop("disabled", "disabled");
                $("#txtcol").prop("disabled", "disabled");
            }
        }
        else {
            $("#txtheight").removeAttr("disabled");
            $("#txtcol").removeAttr("disabled");
        }
    }
    $("#rotypeid").change();
}

function DisableNewReciptPopup() {
    ClearMainScreenFields();
    $("#newreciptheader").find("input,select").attr("disabled", "disabled");
    $("#newreciptheader").css('pointer-events', 'none');
    $("#newreciptheader1").find("input,select").attr("disabled", "disabled");
    $("#newreciptheader1").css('pointer-events', 'none');
    $(".cancelrcpt-table-bx").find("input,button,select").attr("disabled", "disabled");
    $(".cancelrcpt-table-bx").css('pointer-events', 'none');
    $(".pendingro-table-bx").find("input,select").attr("disabled", "disabled");
    $(".pendingro-table-bx").css('pointer-events', 'none');
    $(".table-newreciept-total").find("input,select").attr("disabled", "disabled");
    $(".table-newreciept-total").css('pointer-events', 'none');
    $('#divreceipt-btn').css('pointer-events', 'none');
    $('#btnneworder').css('pointer-events', 'auto');
    $('#btnnewreceipt').css('pointer-events', 'auto');
    $('#btncancelorder').css('pointer-events', 'auto');
    $('#btnprintnewreceipt').css('pointer-events', 'auto');
    $('#btnclearnewreceipt').css('pointer-events', 'auto');
    $('#btnclosenewreceipt').css('pointer-events', 'auto');
}

function EnableNewReciptPopup() {
    $("#newreciptheader").find("input,select").removeAttr("disabled");
    $("#newreciptheader").css('pointer-events', 'auto');
    $("#newreciptheader1").find("input,select").removeAttr("disabled");
    $("#newreciptheader1").css('pointer-events', 'auto');
    $(".cancelrcpt-table-bx").find("input,button,select").removeAttr("disabled");
    $(".cancelrcpt-table-bx").css('pointer-events', 'auto');
    $(".pendingro-table-bx").find("input,select").removeAttr("disabled");
    $(".pendingro-table-bx").css('pointer-events', 'auto');
    $(".table-newreciept-total").find("input,select").removeAttr("disabled");
    $(".table-newreciept-total").css('pointer-events', 'auto');
    $("#divreceipt-btn").css('pointer-events', 'auto');

    $("#txtadvancereceiptid").prop("disabled", true);
    $("#txtadvancereceiptid1").prop("disabled", true);
    $("#txtadvancereceiptid2").prop("disabled", true);

    $("#txtadvanceutilised").prop("disabled", true);
    $("#txtadvanceutilised1").prop("disabled", true);
    $("#txtadvanceutilised2").prop("disabled", true);
}

function DisableItemRate() {
    $("#dsitemagrate").val('');
    $("#dsitemagdisc").val('');
    $("#dsitemagamount").val('');
    $("#dsitemagrate").prop("disabled", "disabled");
    $("#dsitemagdisc").prop("disabled", "disabled");
    $("#dsitemagamount").prop("disabled", "disabled");

    $("#clitemagrate").val('');
    $("#clitemagdisc").val('');
    $("#clitemagamount").val('');
    $("#clitemagrate").prop("disabled", "disabled");
    $("#clitemagdisc").prop("disabled", "disabled");
    $("#clitemagamount").prop("disabled", "disabled");
}

function DisableCopyCLItemRate() {
    $("#dsitemagrate").val('');
    $("#dsitemagdisc").val('');
    $("#dsitemagamount").val('');
    $("#dsitemagrate").prop("disabled", "disabled");
    $("#dsitemagamount").prop("disabled", "disabled");

    $("#clitemagrate").val('');
    $("#clitemagdisc").val('');
    $("#clitemagamount").val('');
    $("#clitemagrate").prop("disabled", "disabled");
    $("#clitemagamount").prop("disabled", "disabled");
}

function OrderlevelinfoEnable() {
    $('#orderlevelinfo').css('pointer-events', 'auto');
    $('#orderlevelinfo tbody tr:nth-child(even)').css('opacity', '');
    $('#orderlevelinfo tbody tr:nth-child(odd)').css('opacity', '');
    $('#orderlevelinfo tbody tr:nth-child(10)').css('opacity', '');
    $('#matsourceid').parent().css('opacity', '');
    $('#mtsrc').css('opacity', '');
}


function OrderlevelEnable() {
    $('#orderlevelrate').css('pointer-events', 'auto');
    $('#orderlevelrate').css('opacity', '');
    $('#dstabledetail').css('pointer-events', 'auto');
    $('#dstabledetail').css('opacity', '');
    $('#cltabledetail').css('pointer-events', 'auto');
    $('#cltabledetail').css('opacity', '');
    $('#displaytext').css('pointer-events', 'auto');
    $('#displaytext').css('opacity', '');
    if ($("#hdntexttypinginbooking").val() == "0") {
        $('#Classifiedadtext').css('pointer-events', 'none');
        $('#Classifiedadtext').css('opacity', '0.5');
    }
    else {
        $('#Classifiedadtext').css('pointer-events', 'auto');
        $('#Classifiedadtext').css('opacity', '');
    }

    if ($("#hdnallowsuspend").val() == 1) {
        $("#btnsuspend").css('pointer-events', 'auto');
        $("#btnsuspend").css('opacity', '');
    }
    if ($("#hdnallowcancel").val() == 1) {
        $("#btncancel").css('pointer-events', 'auto');
        $("#btncancel").css('opacity', '');
    }
    AuditedOrderlevelEnable();
}

function AuditedOrderlevelDisable() {
    $('#rodatePicker').css('pointer-events', 'none');
    $('#rodatePicker').css('opacity', '0.5');
    $('#adtypeid').css('pointer-events', 'none');
    $('#adtypeid').css('opacity', '0.5');
    $('#mattypeid').css('pointer-events', 'none');
    $('#mattypeid').css('opacity', '0.5');
    $('#packageid').css('pointer-events', 'none');
    $('#packageid').css('opacity', '0.5');
    $('#boxtypeid').css('pointer-events', 'none');
    $('#boxtypeid').css('opacity', '0.5');
    $('#billtypeid').css('pointer-events', 'none');
    $('#billtypeid').css('opacity', '0.5');
    $('#uomid').css('pointer-events', 'none');
    $('#uomid').css('opacity', '0.5');
    $('#matsourceid').css('pointer-events', 'none');
    $('#matsourceid').css('opacity', '0.5');
    $('#rofile').css('pointer-events', 'none');
    $('#rofile').css('opacity', '0.5');
    $('#uncnfrmrsnid').css('pointer-events', 'none');
    $('#uncnfrmrsnid').css('opacity', '0.5');
    $('.multiselect-native-select').css('pointer-events', 'none');
    $('.multiselect-native-select').css('opacity', '0.5');
}


function AuditedOrderlevelEnable() {
    $('#rodatePicker').css('pointer-events', 'auto');
    $('#rodatePicker').css('opacity', '');
    $('#adtypeid').css('pointer-events', 'auto');
    $('#adtypeid').css('opacity', '');
    $('#mattypeid').css('pointer-events', 'auto');
    $('#mattypeid').css('opacity', '');
    $('#packageid').css('pointer-events', 'auto');
    $('#packageid').css('opacity', '');
    $('#boxtypeid').css('pointer-events', 'auto');
    $('#boxtypeid').css('opacity', '');
    $('#billtypeid').css('pointer-events', 'auto');
    $('#billtypeid').css('opacity', '');
    $('#uomid').css('pointer-events', 'auto');
    $('#uomid').css('opacity', '');
    $('#matsourceid').css('pointer-events', 'auto');
    $('#matsourceid').css('opacity', '');
    $('#rofile').css('pointer-events', 'auto');
    $('#rofile').css('opacity', '');
    $('#uncnfrmrsnid').css('pointer-events', 'auto');
    $('#uncnfrmrsnid').css('opacity', '');
    $('.multiselect-native-select').css('pointer-events', 'auto');
    $('.multiselect-native-select').css('opacity', '');
}

function RefreshRate() {
    cleartabletdvalue();
    $('.column-right table tr td input[type="text"]').val('');
    $('.column-right table tr td select').val('');
    IsGetRateClicked = false;
}

function cleartable() {
    $("#txtcardrate").html('');
    $("#txtcardamount").html('');
    $("#txtboxchargeper").html('0%');
    $("#txtboxchargeamount").html('0.00');
    $("#txtcommisionper").html('0%');
    $("#txtcommisionamount").html('0.00');
    $("#txtprevatamount").html('0.00');
    //$("#txtvatper").html('0%');
    $("#txtvatamount").html('0.00');
    $("#txtnetamount").html('0.00');
    $("#txtrecevible").html('0.00');

}

function cleartabletdvalue() {
    $("#txtcardrate").html('0.00');
    $("#txtcardamount").html('0.00');
    $("#txtagreeddiscountamount").html('0.00');
    $("#txtboxchargeper").html('0%');
    $("#txtboxchargeamount").html('0.00');
    $("#txtcommisionper").html('0%');
    $("#txtcommisionamount").html('0.00');
    $("#txtprevatamount").html('0.00');
    //$("#txtvatper").html('0%');
    $("#txtvatamount").html('0.00');
    $("#txtnetamount").html('0.00');
    $("#txtrecevible").html('0.00');
}

function ROIDFileOpen(th) {
    var filename = $(th).attr('filename');
    var filetype = $(th).attr('rofiletype');
    var FilePath = $(th).attr('rofilepath');

    var URL = '' + FilePath + '\\' + filename + filetype + '';
    var filename = URL;
    //window.open(''+FilePath + '\\' + filename + filetype,null);
    var URLs = appRoot + '/Handler/FileDownload.ashx?filename=' + encodeURIComponent(filename);
    window.open(URLs);
}

function ROIDSelectedFile(th) {
    $(".selected-row,.table-selected-row").removeClass("selected-row").removeClass("table-selected-row");
    $(th).addClass("selected-row");
    $('.RoidFileRow').css("background", "");
    $('.RoidFileRow').css("color", "#000")
    $(th).css("background", "#385723");
    $(th).css("color", "#fff");
}

function CancelOrder() {
    $("#CancelorderPopUp").dialog("close");
    var cnfrmmsg = 'Do you want to cancel order?';

    $('<div title="Adpro"></div>').html(cnfrmmsg).dialog({
        show: 'blind',
        closeOnEscape: false,
        autoOpen: true,
        hide: 'fold',
        modal: true,
        dialogClass: "base-message",
        buttons: {
            "Yes": function () {
                $(this).dialog("close");
                userid = qStr.split('?')[1].split('=')[1].split('&')[0];
                var url = appRoot + "Booking/GetTableData";
                var param = {};
                param.ApiName = "/CancelOrder";
                param.ROID = $("#txtOrderNo").val();
                if (param.ROID == null || param.ROID == '') {
                    ShowMsg("Please enter ROID to cancel RO");
                    return false;
                }
                param.PEID = $("#hdnpeid").val();
                param.InsNum = $("#hdninsnum").val();
                param.ReleaseID = 0;
                param.Orderlevel = 1;
                param.UOMID = $("#uomid").val();
                param.CancelReasonID = $("#Cancelresonid").val();
                param.CancelRemarks = $("#Cancelremarkid").val();
                if (param.UOMID == null || param.UOMID == '') {
                    ShowMsg("Please select UOM", $("#uomid"));
                    $("#uomid").focus();
                    return false;
                }
                param.UserId = userid;
                param.IsClassified = $('#hdnIsClassified').val();
                var result = getresult(url, param);
                result = jQuery.parseJSON(result);
                if (result.IsValid == "0") {
                    ShowMsg(result.ErrorMessage);
                    window.location.reload(true);
                    $("#Cancelremarkid").val('');
                    $("#Suspendremarkid").val('');
                }
                else {
                    ShowMsg(result.ErrorMessage);
                    $("#txtOrderNo").val('');
                    return false;
                }
            },
            "No": function () {
                $(this).dialog("close");
                return false;
            }
        }
    });
}

function SuspendOrder() {
    $('#SuspendorderPopUp').dialog('close');
    var cnfrmmsg = 'Do you want to suspend order?';

    $('<div title="Adpro"></div>').html(cnfrmmsg).dialog({
        show: 'blind',
        closeOnEscape: false,
        autoOpen: true,
        hide: 'fold',
        modal: true,
        dialogClass: "base-message",
        buttons: {
            "Yes": function () {
                $(this).dialog("close");
                userid = qStr.split('?')[1].split('=')[1].split('&')[0];
                var url = appRoot + "Booking/GetTableData";
                var param = {};
                param.ApiName = "/SuspendOrder";
                param.ROID = $("#txtOrderNo").val();
                if (param.ROID == null || param.ROID == '') {
                    ShowMsg("Please enter ROID to suspend RO");
                    return false;
                }
                param.PEID = $("#hdnpeid").val();
                param.InsNum = $("#hdninsnum").val();
                param.ReleaseID = 0;
                param.Orderlevel = 1;
                param.UOMID = $("#uomid").val();
                if (param.UOMID == null || param.UOMID == '') {
                    ShowMsg("Please select UOM", $("#uomid"));
                    $("#uomid").focus();
                    return false;
                }
                param.UserId = userid;
                param.IsClassified = $('#hdnIsClassified').val();
                param.SuspendReasonID = $("#Suspendreasonid").val();
                param.SuspendRemarks = $("#Suspendremarkid").val();
                var result = getresult(url, param);
                result = jQuery.parseJSON(result);
                if (result.IsValid == "0") {
                    ShowMsg(result.ErrorMessage);
                    window.location.reload(true);
                    $("#Cancelremarkid").val('');
                    $("#Suspendremarkid").val('');
                }
                else {
                    ShowMsg(result.ErrorMessage);
                    $("#txtOrderNo").val('');
                    return false;
                }
            },
            "No": function () {
                $(this).dialog("close");
                return false;
            }
        }
    });
}

function GetCopyOrder() {
    if ($("#txtOrderNo").val() == '' || $("#txtOrderNo").val() == null) {
        ShowMsg("Please enter ROID for copy RO", $("#txtOrderNo"));
        $("#txtOrderNo").focus();
        return false;
    }
    else {
        ispefocus = true;
        $("#hdnratefieldchanged").val(0);
        $("#hdnitemratefieldchanged").val(0);
        RateChangeFlagColor();
        EnableElement();
        $("#txtBookingNo").val('');
        $("#txtOrderNo").val('');
        $("#txtReceiptNo").val('');
        $("#hdnsaveflag").val(0);
        $("#hdnsaveenable").val(0);
        $("#hdnsourceroid").val(0);
        $("#ins").val(0);
        $("#OrderInsNum").text('');
        $("#txtronumber").val('');
        $("#mattypeid").val(0);
        $("#categoryid").val('');
        $("#hdnreadonly").val(0);
        $("#hdnIsCredit").val(0);
        $("#isVatPer").prop("checked", false);
        $("#hdnIsVatPer").val(0);
        $("#txtvatper").attr("disabled", "disabled");
        categoryidvalue = 0;
        AdtypeId1 = 0;
        AdtypeId2 = 0;
        AdtypeId3 = 0;
        AdtypeId4 = 0;
        $("#parenttxtagreedrate").text('');
        $("#parenttxtagreedamount").text('');
        $("#parenttxtagreediscount").text('');
        $("#NetReceivableForReceipt").val('');
        $("#txtrecevible").val('');
        $("#mbodysize").val('');
        $("#txtheight").val('');
        $("#islogo").val(0);
        $("#lblfile").html('');
        $("#lblrofile").html('');
        $("#spnreceiptnum").text('#####');
        $("#spnroid").text('#####');
        $("#txtsaveupdate").text('SAVE ORDER');
        cleartabletdvalue();
        $('.column-right table tr td input[type="text"]').val('');
        $('.column-right table tr td select').val('');
        $("#txtreturnamount").val('');
        $("#txtreturnamount").html('');
        $("#txtwriteoffamount").html('');
        $("#txtwriteoffamount").html('');
        $("#rotypeid").val(1);
        $("#uncnfrmrsnid").val(0);
        OrderlevelinfoEnable();
        OrderlevelEnable();
        $('[parameter=ProductionDate]').find('option').remove();
        NxtPublicationDt = new Date(serverDate);
        NxtPublicationDt.setDate(NxtPublicationDt.getDate() + 1);
        $("#datePicker").datepicker("option", "minDate", NxtPublicationDt);
        // $("#datePicker").datepicker("option", "minDate", "0");
        $("#rodatePicker").datepicker("setDate", new Date());
        var newdate = new Date();
        bookingdate = ('0' + newdate.getDate()).slice(-2) + '/' + ('0' + (newdate.getMonth() + 1)).slice(-2) + '/' + newdate.getFullYear() + "  " + ('0' + newdate.getHours()).slice(-2) + ":" + ('0' + newdate.getMinutes()).slice(-2) + ":" + ('0' + newdate.getSeconds()).slice(-2) + "." + newdate.getMilliseconds();
        $("#hdnbookingdate").val(bookingdate);
        $("#chkdiffer").prop("checked", false);
        CheckDifferReceipt();

        if ($("#iscd").val() == "0") {
            if ($("#islogo").val() == "1") {
                $("#txtheight").prop("disabled", "");
                $("#txtcol").prop("disabled", "");
            }
            else {
                $("#txtheight").prop("disabled", "disabled");
                $("#txtcol").prop("disabled", "disabled");
            }
        }
        else {
            $("#txtheight").prop("disabled", "");
            $("#txtcol").prop("disabled", "");
        }
        CopyorderChanges();
        UnlockOrder();
        if (agencyidvalue > 0 && clientidvalue > 0) {
            if (agencypaymentmode != 1) {
                $("#hdnIsPaymentType").val(2);
                $("#paymenttypetoggle").prop("checked", true);
                $("#tblreceipt").find("input,button,select").attr("disabled", "disabled");
                $("#tblreceipt").css('display', 'none');
                $("#billtypeid").val(1);
            }
        }
        IsGetRateClicked = false;
        if ($('#hdnIsClassified').val() == "1") {
            DisableCopyCLItemRate();
        }
        else {
            DisableItemRate();
        }
        ispefocus = false;
        ctrlupress = false;
    }
}

window.onbeforeunload = function () {
    UnlockOrder();
};


function CopyorderChanges() {
    $("#bookingGrid").html('');
    list = [];
    checkdate = 0;
    categoryidvalue = 0;
    AdtypeId1 = 0;
    AdtypeId2 = 0;
    AdtypeId3 = 0;
    AdtypeId4 = 0;
    $("#mbodysize").val('');
    $("#txtheight").val('');
    $("#mbodysize").prop("disabled", "");
    $("#txtheight").prop("disabled", "disabled");
    $("#txtcol").prop("disabled", "disabled");
    $("#file_center").prop("disabled", "disabled");
    $("#file_center").attr('title', 'No file chosen');
    $("#categoryid").val('');
    $('#datePicker').datepicker('refresh');
    cleartabletdvalue();
    $('.column-right table tr td input[type="text"]').val('');
    $('.column-right table tr td select').val('');
    if ($("#txtOrderNo").val().trim() == '' && $("#txtReceiptNo").val().trim() == '') {
        var selectedpackage = new Array();
        selectedpackage = $("#packageid").val();
        if (selectedpackage.length > 1 && $('#hdnIsClassified').val() == "1") {
            var res = VerifyCYOP();
            if (res == false) {
                return false;
            }
        }
        if (selectedpackage.length > 1 && $('#hdnIsClassified').val() != "1") {
            $('.chosen-choices li:nth-child(2) a').click();
            ShowMsg("Multiple package not allowed", $("#packageiddiv"));
            $("#packageiddiv").focus();
            return false;
        }
        var isvalid = $('#packageid option:selected').attr('isvalid');;
        if (isvalid == 1) {
            $('.chosen-choices li:nth-child(1) a').click();
            ShowMsg("You do not have booking rights For Selected PE / PEs", $("#packageiddiv"));
            $("#packageiddiv").focus();
            return false;
        }
        else if (isvalid == 2) {
            $('.chosen-choices li:nth-child(1) a').click();
            ShowMsg("Invalid AdType for the selected publication", $("#packageiddiv"));
            $("#packageiddiv").focus();
            return false;
        }

        selectedDateArray = [];
    }

    if ($('#hdnIsClassified').val() == "1") {
        $("#iscd").change();
    }
    CheckPackageidRun();
    BindGridControl();
    callInnerBoxHover();
    IsGetRateClicked = false;
}

$("#clientid").keydown(function (e) {
    if (e.keyCode == 114) {
        e.preventDefault();
        $("#customerlabel").click();
        $("#clientid").focus();
    }
    IsGetRateClicked = false;
});

function CasualSave() {
    if ($("#txtcasualAdd").val().trim() == '') {
        ShowMsg("Please enter Casual Client Address", $("#txtcasualAdd"));
        $("#txtcasualAdd").focus();
        return false;
    }
    else {
        $('#divAddrPopUp').dialog('close');
        $("#canvassorid").focus();
    }
}

function BookingAddressDetail() {
    if ($("#clientid").val() == '') {
        ShowMsg("Please enter Client Name", $("#clientid"));
        setTimeout(function () {
            $("#clientid").focus();
        }, 100);
        return false;
    }
    else {
        $('#divAddrPopUp').dialog('open');
        setTimeout(function () {
            $("#txtcasualAdd").focus();
        }, 100);
    }
}

function BookingHistoryDetail() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    $('#lblhistoryPopupData').html('');
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/BookingHistory";
    param.ROID = $("#txtOrderNo").val();
    if (param.ROID == null || param.ROID == '') {
        ShowMsg("Please enter ROID to get RO History");
        return false;
    }
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    $('#divProcessingBox').dialog('open');
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    $('#divProcessingBox').dialog('close');
    if (result.length > 1) {
        var tableHtml = makeHistoryTable(result);
        $('#lblhistoryPopupData').append(tableHtml);
        $('#divhistoryPopUp').dialog('open');
    }
    else {
        $('#lblhistoryPopupData').css('text-align', 'center').html("Record not found!");
        $('#divhistoryPopUp').dialog('open');
        return false;
    }
}

function BookingMyLogDetail() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    $('#lbllogPopupData').html('');
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/MyLog";
    param.AgencyID = agencyidvalue;
    param.Adsizeid = $("#adsizeid").val();
    if (param.AgencyID == null || param.AgencyID == '') {
        ShowMsg("Please select Agency", $("#agencyid"));
        $("#agencyid").focus();
        return false;
    }
    param.ClientID = clientidvalue;
    if (param.ClientID == null || param.ClientID == '') {
        ShowMsg("Please select Client", $("#clientid"));
        $("#clientid").focus();
        return false;
    }
    param.UserId = userid;
    param.IsClassified = $('#hdnIsClassified').val();
    $('#divProcessingBox').dialog('open');
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    $('#divProcessingBox').dialog('close');
    if (result.length > 1) {
        var tableHtml = makeHistoryTable(result);
        $('#lbllogPopupData').append(tableHtml);
        $('#divlogPopUp').dialog('open');
    }
    else {
        $('#lbllogPopupData').css('text-align', 'center').html("Record not found!");
        $('#divlogPopUp').dialog('open');
        return false;
    }
}

function BookingVieOrder() {
    $('#lblViewOrderPopupData').html('');
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/ViewOrder";
    param.ROID = $("#txtOrderNo").val();
    if (param.ROID == null || param.ROID == '') {
        param.ROID = 0;
    }
    else {
        param.ROID;

    }
    param.AgencyID = agencyidvalue;
    if (param.AgencyID == null || param.AgencyID == '') {
        param.AgencyID = 0;
    }
    else {
        param.AgencyID;
    }
    param.ClientID = clientidvalue;
    if (param.ClientID == null || param.ClientID == '') {
        param.ClientID = 0;
    }
    else {
        param.ClientID;
    }
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 1) {
        var tableHtml = makeViewOrderTable(result);
        $('#lblViewOrderPopupData').append(tableHtml);
        $('#divViewOrderPopUp').dialog('open');
    }
    else {
        $('#lblViewOrderPopupData').css('text-align', 'center').html("Record not found!");
        $('#divViewOrderPopUp').dialog('open');
        return false;
    }
}

function makeViewOrderTable(data) {
    var table = $("<table/>").addClass('tables');
    if (data.length > 1) {
        $.each(data, function (rowIndex, r) {
            var row = $("<tr/>");
            $.each(r, function (colIndex, c) {
                if (data[0][colIndex] != 'Agency Name')
                    row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
                else
                    row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").html('<span class="agency-name" title="' + c + '">' + c + '</span>'));


            });
            table.append(row);
        });
    }
    else {
        table = '<div class="error-box">Sorry.. Record not found!</div>'
    }
    return table;
}

function makeHistoryTable(data) {
    var table = $("<table/>").addClass('tables');
    if (data.length > 1) {
        $.each(data, function (rowIndex, r) {
            var row = $("<tr/>");
            $.each(r, function (colIndex, c) {
                row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
            });
            table.append(row);
        });
    }
    else {
        table = '<div class="error-box">Sorry.. Record not found!</div>'
    }
    return table;
}

function CreateClassifiedFolder(roid) {
    var url = appRoot + "Booking/CreateFolder";
    var param = {};
    param.FilePath = $("#hdnClassifiedMaterialPath").val();
    param.ROID = $("#hdnROFileRoid").val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    return result;
}

function CreateJobFolder() {
    var url = appRoot + "Booking/CreateFolder";
    var param = {};
    param.FilePath = $("#hdnJobPath").val();
    param.ROID = $("#hdnROFileJobID").val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    return result;
}

function CreateROFolder() {
    var url = appRoot + "Booking/CreateFolder";
    var param = {};
    param.FilePath = $("#hdnROFilePath").val();
    param.ROID = $("#hdnROFileRoid").val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    return result;
}

function SaveBookingFile() {
    var url = appRoot + "Booking/Savefile";
    var param = {};
    param.FilePath = $("#hdnROFilePath").val();
    param.ROID = $("#hdnROFileRoid").val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    return result;
}

function DeleteBookingFile() {
    var url = appRoot + "Booking/Deletefile";
    var param = {};
    var result = getresult(url, param);
}

function CDFileUpload() {
    var files = $("#file_center").get(0).files;
    var filepath = "";
    if ($("#iscd").val() == "1") {
        filepath = $("#hdnClMatPath").val() + "\\Display\\";
    }
    else if ($("#islogo").val() == "1") {
        filepath = $("#hdnClMatPath").val() + "\\Logo\\";
    }
    var fileData = new FormData();
    fileData.append('NewFileName', files[0].name);
    fileData.append('ClMatPath', filepath);
    for (var i = 0; i < files.length; i++) {
        fullFileName = files[i].name;
        fileData.append(files[0].name, files[i]);
    }
    $.ajax({
        type: "POST",
        url: appRoot + "Booking/CDFileUpload",
        dataType: "json",
        contentType: false, // Not to set any content header
        processData: false, // Not to process data
        data: fileData,
        success: function (result, status, xhr) {
        },
        error: function (xhr, status, error) {
            ShowMsg(status);
        }
    });
}

function Ordergridselected() {
    $("#bookingGrid tr").eq(1).click();
    $('.table-ad-detail tr:not(:first-child)').removeClass('rowactive');
    $('.table-ad-detail tr:not(:first-child)').removeClass('gridselected');
    $("#bookingGrid tr").eq(0).addClass('orderrowactive');
    $("#bookingGrid tr").eq(0).addClass('ordergridselected');
    $("#packageid").val(selectedcyopPE[0]);
}

function SelectedGridRow(th) {
    $("#bookingGrid tr").eq(0).removeClass('orderrowactive');
    $("#bookingGrid tr").eq(0).removeClass('ordergridselected');
    $('.table-ad-detail #singlechild').removeClass('rowactive');
    $(th).addClass('rowactive');
    $('.table-ad-detail #singlechild').removeClass('gridselected');
    $(th).addClass('gridselected');
    if ($("#txtOrderNo").val() != '') {
        $('.table-ad-detail tr:not(:first-child)').each(function () {
            if ($(this).attr('readonlyflag') == 1) {
                AuditedOrderlevelDisable();
                $('#orderlevelrate').css('pointer-events', 'none');
                $('#orderlevelrate').css('opacity', '0.5');
                $("#btnsuspend").css('pointer-events', 'none');
                $("#btnsuspend").css('opacity', '0.5');
                $("#btncancel").css('pointer-events', 'none');
                $("#btncancel").css('opacity', '0.5');
                $("#mbodysize").prop("disabled", "disabled");

                if ($(this).attr('auditstatus') > 0) {
                    var date = $("#hdnBlockdate").val();;
                    var parts = date.split('/');
                    date = (parseInt(parts[0]) + 1) + "/" + parts[1] + "/" + parts[2];
                    $("#datePicker").datepicker("option", "minDate", date);
                }
            }
        });

        if ($(th).attr('readonlyflag') == 1) {
            $('#dstabledetail').css('pointer-events', 'none');
            $('#dstabledetail').css('opacity', '0.5');
            $('#cltabledetail').css('pointer-events', 'none');
            $('#cltabledetail').css('opacity', '0.5');
            $('#displaytext').css('pointer-events', 'none');
            $('#displaytext').css('opacity', '0.5');
            $('#Classifiedadtext').css('pointer-events', 'none');
            $('#Classifiedadtext').css('opacity', '0.5');
        }
        else {
            $('#dstabledetail').css('pointer-events', 'auto');
            $('#dstabledetail').css('opacity', '');
            $('#cltabledetail').css('pointer-events', 'auto');
            $('#cltabledetail').css('opacity', '');
            $('#displaytext').css('pointer-events', 'auto');
            $('#displaytext').css('opacity', '');
            $('#premiaid').prop("disabled", "");
            $('#colorid').prop("disabled", "");
            $('#txtitemcaption').prop("disabled", "");

            if ($("#hdntexttypinginbooking").val() == "0") {
                $('#Classifiedadtext').css('pointer-events', 'none');
                $('#Classifiedadtext').css('opacity', '0.5');
            }
            else {
                $('#Classifiedadtext').css('pointer-events', 'auto');
                $('#Classifiedadtext').css('opacity', '');
            }
        }
    }
    $("#dsitemagdisc").prop("disabled", "");
    $("#clitemagdisc").prop("disabled", "");
    $('#spnins').text($(th).find('td:eq(2)')[0].textContent);
    $('#spndate').text($(th).find('td:eq(3)')[0].textContent);
    $('#spnpe').text($(th).find('td:eq(4)')[0].textContent);

    if ($('#hdnIsClassified').val() !== "1") {
        $('#premiaid').val($(th).find('td:eq(10)')[0].textContent);
        $('#colorid').val($(th).find('td:eq(9)')[0].textContent);
        $('#adsizeid').val($(th).find('td:eq(11)')[0].textContent);
        $('#billablesize').val($(th).find('td:eq(12)')[0].textContent);
        OpenColorDetails($('#colorid').val());
        OpenPremiaDetails($('#premiaid').val());
        OpenAdsizeDetails($('#adsizeid').val());
        if ($(th).find('td:eq(13)')[0].textContent == "") {
            mattypeidvalue = 0;
        }
        else {
            $("#mattypeid").find("option:contains(" + $(th).find('td:eq(13)')[0].textContent + ")").prop('selected', 'selected');
            mattypeidvalue = $("#mattypeid").val();
        }
        $("#dsitemagrate").val($(th).find('td:eq(6)')[0].textContent);
        $("#dsitemagdisc").val($(th).find('td:eq(8)')[0].textContent);
        $("#dsitemagamount").val($(th).find('td:eq(7)')[0].textContent);
        var pkgid = $(th).attr("pkgid");
        if (pkgid != undefined) {
            $("#packageid").val(pkgid);
        }
    }
    else {
        $('#categoryid').val($(th).find('td:eq(11)')[0].textContent);
        OpenCategoryDetails();
        $("#clitemagrate").val($(th).find('td:eq(6)')[0].textContent);
        $("#clitemagdisc").val($(th).find('td:eq(8)')[0].textContent);
        $("#clitemagamount").val($(th).find('td:eq(7)')[0].textContent);
        var pkgid = $(th).attr("pkgid");
        var stylesheetlength = SelectPEStyleSheet(pkgid);
        var selectedpackage = new Array();
        selectedpackage = $("#packageid").val();
        if ($(th).find('td:eq(13)')[0].textContent == "" && stylesheetlength == 1) {
            $('#stylesheetid').change();
        }
        else {
            if ($(th).find('td:eq(13)')[0].textContent == "") {
                $("#stylesheetid").prepend(new Option('', '0'));
            }
            $('#stylesheetid').val($(th).find('td:eq(13)')[0].textContent);
        }
        peidlength = selectpeidlist.toString().split(',').length;
        if (peidlength != 1) {
            CheckGridRun($(th).find('td:eq(0)')[0].textContent, $(th).attr("insDt"));
        }
        $('#adtext').val($(th).find('td:eq(14)')[0].textContent);
        $('#mbodysize').val($(th).find('td:eq(9)')[0].textContent);
        WordAdtextDisable($(th).attr('readonlyflag'));
    }
    // callInnerBoxHover();
}

function SelectPEStyleSheet(pkgid) {
    var stylesheetlength = 0;
    $("#stylesheetid").empty();
    for (var i = 0; i < selectedStylewithValidPE.length; i++) {
        if (selectedStylewithValidPE[i][0] == pkgid) {
            $("#stylesheetid").append(new Option(selectedStylewithValidPE[i][2], selectedStylewithValidPE[i][1]));
            stylesheetlength = stylesheetlength + 1;
        }
    }
    return stylesheetlength;
}

function WordAdtextDisable(readonlyflag) {
    var adtextdisable = 0;
    var mbodydisable = 0;

    for (var m = 0; m < list.length; m++) {
        if (list[m].MBodyCount == "0") {
            list[m].MBodyCount = "";
        }
    }

    if ($("#mbodysize").val() == "0") {
        $("#mbodysize").val('');
    }

    for (var m = 0; m < list.length; m++) {
        if (list[m].MBodyCount != "") {
            adtextdisable = 1;
        }

        if (list[m].U_BodyText != "") {
            mbodydisable = 1;
        }
    }

    //if (readonlyflag != 1) {
    //    //if (adtextdisable == 1) {
    //    //    $('#Classifiedadtext').css('pointer-events', 'none');
    //    //    $('#Classifiedadtext').css('opacity', '0.5');
    //    //}
    //    //else {
    //    //    $('#Classifiedadtext').css('pointer-events', 'auto');
    //    //    $('#Classifiedadtext').css('opacity', '');
    //    //}

    //    if (mbodydisable == 1) {
    //        $("#mbodysize").attr("disabled", true);
    //    }
    //    else {
    //        $("#mbodysize").removeAttr("disabled");
    //    }
    //}

}

function SelectedSingleGridRow(th) {
    $("#bookingGrid tr").eq(0).removeClass('orderrowactive');
    $("#bookingGrid tr").eq(0).removeClass('ordergridselected');
    $('.table-ad-detail #singlechild').removeClass('rowactive');
    $(th).addClass('rowactive');
    $('.table-ad-detail #singlechild').removeClass('gridselected');
    $(th).addClass('gridselected');
    if ($("#txtOrderNo").val() != '') {
        $('.table-ad-detail tr:not(:first-child)').each(function () {
            if ($(this).attr('readonlyflag') == 1) {
                AuditedOrderlevelDisable();
                $('#orderlevelrate').css('pointer-events', 'none');
                $('#orderlevelrate').css('opacity', '0.5');
                $("#btnsuspend").css('pointer-events', 'none');
                $("#btnsuspend").css('opacity', '0.5');
                $("#btncancel").css('pointer-events', 'none');
                $("#btncancel").css('opacity', '0.5');
                $("#mbodysize").prop("disabled", "disabled");
                if ($(this).attr('auditstatus') > 0) {
                    var date = $("#hdnBlockdate").val();;
                    var parts = date.split('/');
                    date = (parseInt(parts[0]) + 1) + "/" + parts[1] + "/" + parts[2];
                    $("#datePicker").datepicker("option", "minDate", date);
                }
            }
        });

        if ($(th).attr('readonlyflag') == 1) {
            $('#dstabledetail').css('pointer-events', 'none');
            $('#dstabledetail').css('opacity', '0.5');
            $('#cltabledetail').css('pointer-events', 'none');
            $('#cltabledetail').css('opacity', '0.5');
            $('#displaytext').css('pointer-events', 'none');
            $('#displaytext').css('opacity', '0.5');
            $('#Classifiedadtext').css('pointer-events', 'none');
            $('#Classifiedadtext').css('opacity', '0.5');
            AuditedOrderlevelDisable();
            $('#orderlevelrate').css('pointer-events', 'none');
            $('#orderlevelrate').css('opacity', '0.5');
            $("#btnsuspend").css('pointer-events', 'none');
            $("#btnsuspend").css('opacity', '0.5');
            $("#btncancel").css('pointer-events', 'none');
            $("#btncancel").css('opacity', '0.5');
        }
        else {
            $('#dstabledetail').css('pointer-events', 'auto');
            $('#dstabledetail').css('opacity', '');
            $('#cltabledetail').css('pointer-events', 'auto');
            $('#cltabledetail').css('opacity', '');
            $('#displaytext').css('pointer-events', 'auto');
            $('#displaytext').css('opacity', '');
            $('#premiaid').prop("disabled", "");
            $('#colorid').prop("disabled", "");
            $('#txtitemcaption').prop("disabled", "");
            if ($("#hdntexttypinginbooking").val() == "0") {
                $('#Classifiedadtext').css('pointer-events', 'none');
                $('#Classifiedadtext').css('opacity', '0.5');
            }
            else {
                $('#Classifiedadtext').css('pointer-events', 'auto');
                $('#Classifiedadtext').css('opacity', '');
            }
        }
    }
    $("#dsitemagdisc").prop("disabled", "");
    $("#clitemagdisc").prop("disabled", "");
    $('#spnins').text($(th).find('td:eq(2)')[0].textContent);
    $('#spndate').text($(th).find('td:eq(3)')[0].textContent);
    $('#spnpe').text($(th).find('td:eq(4)')[0].textContent);

    if ($('#hdnIsClassified').val() !== "1") {
        $('#premiaid').val($(th).find('td:eq(10)')[0].textContent);
        $('#colorid').val($(th).find('td:eq(9)')[0].textContent);
        $('#adsizeid').val($(th).find('td:eq(11)')[0].textContent);
        $('#billablesize').val($(th).find('td:eq(12)')[0].textContent);
        OpenColorDetails($('#colorid').val());
        OpenPremiaDetails($('#premiaid').val());
        OpenAdsizeDetails($('#adsizeid').val());
        if ($(th).find('td:eq(13)')[0].textContent == "") {
            mattypeidvalue = 0;
        }
        else {
            $("#mattypeid").find("option:contains(" + $(th).find('td:eq(13)')[0].textContent + ")").prop('selected', 'selected');
            mattypeidvalue = $("#mattypeid").val();
        }
        $("#dsitemagrate").val($(th).find('td:eq(6)')[0].textContent);
        $("#dsitemagdisc").val($(th).find('td:eq(8)')[0].textContent);
        $("#dsitemagamount").val($(th).find('td:eq(7)')[0].textContent);
        var pkgid = $(th).attr("pkgid");
        if (pkgid != undefined) {
            $("#packageid").val(pkgid);
        }
    }
    else {
        $('#categoryid').val($(th).find('td:eq(11)')[0].textContent);
        OpenCategoryDetails();
        $("#clitemagrate").val($(th).find('td:eq(6)')[0].textContent);
        $("#clitemagdisc").val($(th).find('td:eq(8)')[0].textContent);
        $("#clitemagamount").val($(th).find('td:eq(7)')[0].textContent);
        var pkgid = $(th).attr("pkgid");
        var stylesheetlength = SelectPEStyleSheet(pkgid);
        var selectedpackage = new Array();
        selectedpackage = $("#packageid").val();
        if ($(th).find('td:eq(13)')[0].textContent == "" && stylesheetlength == 1)
            $('#stylesheetid').change();
        else {
            if ($(th).find('td:eq(13)')[0].textContent == "") {
                $("#stylesheetid").prepend(new Option('', '0'));
            }
            $('#stylesheetid').val($(th).find('td:eq(13)')[0].textContent);
        }

        peidlength = selectpeidlist.toString().split(',').length;
        if (peidlength != 1) {
            CheckGridRun($(th).find('td:eq(0)')[0].textContent, $(th).attr("insDt"));
        }
        $('#adtext').val($(th).find('td:eq(14)')[0].textContent);
        $('#mbodysize').val($(th).find('td:eq(9)')[0].textContent);
        WordAdtextDisable($(th).attr('readonlyflag'));
    }
    // callInnerBoxHover();
}

function CheckReadonyvalue(date) {
    var res = 0;
    readonlyvalue = $('[insDt ="' + date + '"]').attr("readonlyflag");
    if (readonlyvalue == 1) {
        ShowMsg("Can not remove locked order insertion");
        res = 1;
    }
    return res;
}

function RemoveTableRow(date) {
    selectedDateArray.splice(selectedDateArray.indexOf(date), 1);
    insNo = $('[insDt ="' + date + '"]').attr("insNo");
    $('[insDt ="' + date + '"]').eq(0).remove();
    while ($('[insNo="' + insNo + '"]').length > 0) {
        insDt = $('[insNo="' + insNo + '"]').eq(0).attr('insDt');
        $('[insNo="' + insNo + '"]').remove();
        if (selectedDateArray.indexOf(insDt) > -1) {
            selectedDateArray.splice(selectedDateArray.indexOf(insDt), 1);
            $('[parameter=ProductionDate]').find('option[value="' + insDt + '"]').eq(0).remove();
        }
    }
    peidlength = selectpeidlist.toString().split(',').length;
    rowNum = 1;
    var tempList = new Array();
    $.each(list, function (ind, value) {
        obj = list[ind];
        if ($('[name="savegrid"][insno="' + obj.InsNum + '"]').length > 0) {
            obj.InsNum = Math.round(rowNum / peidlength);
            tempList.push(obj);
            rowNum++;
        }
    });
    list = tempList;
    rowNum = 0
    if ($('#hdnIsClassified').val() == "1")
        $('[name="savegrid"]').each(function () { $(this).attr('list-index', rowNum); rowNum++; });
    else
        $('[name="savegrid"]').each(function () { $(this).attr('list-index', rowNum); $(this).attr('insno', (rowNum + 1)); rowNum++; });

    callInnerBoxHover();

    if ($('#hdnIsClassified').val() == "1") {
        $("#OrderInsNum").html(selectedDateArray.length / selectedPEwithValidDays.length);
        $("#ins").val(selectedDateArray.length / selectedPEwithValidDays.length);
        if (AdtypeId1 != 0 && selectedDateArray.length > 0)
            GetBookingRate();
    }
    else {
        packagelength = $("#packageid").val().toString().split(',').length;
        peidlength = selectpeidlist.toString().split(',').length;
        if (packagelength == 1 && peidlength == 1) {
            $("#OrderInsNum").html(selectedDateArray.length);
            $("#ins").val(selectedDateArray.length);
        }
        else {
            $("#OrderInsNum").html(selectedDateArray.length / selectedPEwithValidDays.length);
            $("#ins").val(selectedDateArray.length / selectedPEwithValidDays.length);
        }
        if ($("#txtrecevible").val() != "" && selectedDateArray.length > 0)
            GetBookingRate();
    }
}


$("#btndaily").click(function () {
    if ($("#ins").val() > 0) {
        $('#datePicker').datepicker("setDate", new Date());
        $('#datePicker').datepicker("refresh");
        if (ctrlKeyPassed)
            DateSFeature();
        else
            DateDFeature();

        ctrlKeyPassed = false;
    }
    else {
        ShowMsg("Please enter valid no. of Insertion(s)");
        return false;
    }
});

function DateDFeature() {
    list = [];
    selectedDateArray = [];
    $('.ui-state-active').removeClass('ui-state-active');
    gapDays = parseInt($('#txtDayGap').val());
    if ($('[parameter=ProductionDate]').find('option').length != 0) {
        $('#bookingGrid tr:not(:first-child)').remove();
        strDate = $('[parameter=ProductionDate] option').eq(0).val();
        $('[parameter=ProductionDate]').find('option').remove();
        tempDate = new Date(strDate.split('/')[1] + '/' + strDate.split('/')[0] + '/' + strDate.split('/')[2]);
        noOfIns = parseInt($('[parameter="NoOfInsertion"]').val());
        count = 0;
        tempDate.setDate(tempDate.getDate() + 0);
        while (parseInt(count) < parseInt(noOfIns)) {
            while (CheckDateSelectable(tempDate) != "true,") {
                tempDate.setDate(tempDate.getDate() + 1);
            }
            strDate = (tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()) + '/' +
                (tempDate.getMonth() < 9 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
            $('[parameter=ProductionDate]').append(new Option(strDate, strDate));
            count = count + 1;
            tempDate.setDate(tempDate.getDate() + 1);

            if ($('#hdnIsClassified').val() == "1") {
                PushSelectedDateToArray(strDate);
            }
            else {
                var selectedpackage = new Array();
                selectedpackage = $("#packageid").val().toString();
                packagelength = $("#packageid").val().toString().split(',').length;
                peidlength = selectpeidlist.toString().split(',').length;
                if (packagelength == 1 && peidlength == 1) {
                    selectedDateArray.push(strDate);
                }
                else {
                    PushSelectedDateToArray(strDate);
                }
            }
            BindDateItemLevelGrid(strDate);
        }
        $("#OrderInsNum").html($("#ins").val());
        callInnerBoxHover();
        $('#txtDayGap').val('1');
    }
    else {
        ShowMsg('Please select insertion(s) Date');
        return false;
    }
}

function DateSFeature() {
    list = [];
    selectedDateArray = [];
    $('.ui-state-active').removeClass('ui-state-active');
    gapDays = parseInt($('#txtDayGap').val());
    if ($('[parameter=ProductionDate]').find('option').length != 0) {
        $('#bookingGrid tr:not(:first-child)').remove();
        strDate = $('[parameter=ProductionDate] option').eq(0).val();
        $('[parameter=ProductionDate]').find('option').remove();
        tempDate = new Date(strDate.split('/')[1] + '/' + strDate.split('/')[0] + '/' + strDate.split('/')[2]);
        noOfIns = parseInt($('[parameter="NoOfInsertion"]').val());
        count = 0;
        tempDate.setDate(tempDate.getDate() + 0);
        while (parseInt(count) < parseInt(noOfIns)) {
            while (CheckDateSelectable(tempDate) != "true,") {
                tempDate.setDate(tempDate.getDate() + 1);
            }
            strDate = (tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()) + '/' +
                (tempDate.getMonth() < 9 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
            $('[parameter=ProductionDate]').append(new Option(strDate, strDate));
            count = count + 1;
            tempDate.setDate(tempDate.getDate() + 0);

            if ($('#hdnIsClassified').val() == "1") {
                PushSelectedDateToArray(strDate);
            }
            else {
                var selectedpackage = new Array();
                selectedpackage = $("#packageid").val().toString();
                packagelength = $("#packageid").val().toString().split(',').length;
                peidlength = selectpeidlist.toString().split(',').length;
                if (packagelength == 1 && peidlength == 1) {
                    selectedDateArray.push(strDate);
                }
                else {
                    PushSelectedDateToArray(strDate);
                }
            }
            BindDateItemLevelGrid(strDate);
        }
        callInnerBoxHover();
        $('#txtDayGap').val('1');
    }
    else {
        ShowMsg('Please select insertion(s) Date');
        return false;
    }
}

function ValidateReceiptAmount() {
    $("#txtwriteoffamount").val(0);
    $("#txtwriteoffamount").html('');
    if ($("#txtamount").val() != "" && $("#txtrecevible").val() != "") {
        var receiptamount = parseFloat($("#txtamount").val());
        var receviable = parseFloat($("#txtrecevible").val());
        if ($("#txtamount1").val() == "") {
            if (receviable > (receiptamount + WriteoffAmount)) {
                var receiptamount1 = parseFloat(receviable - receiptamount);
                $("#txtamount1").val(receiptamount1.toFixed(2));
            }
            else {
                $("#receiptfield2").css('pointer-events', 'none');
                $("#receiptfield2").prop("disabled", true);
            }
            if (receviable > (receiptamount + receiptamount1 + WriteoffAmount)) {
                var receiptamount2 = parseFloat(receviable - (receiptamount + receiptamount1));
                $("#txtamount2").val(receiptamount2.toFixed(2));
            }
            else {
                $("#receiptfield3").css('pointer-events', 'none');
                $("#receiptfield3").prop("disabled", true);
            }
        }
        else {
            $("#txtamount1").val(parseFloat($("#txtamount1").val()).toFixed(2));
            var receiptamount1 = parseFloat($("#txtamount1").val());
            if (receviable > (receiptamount + receiptamount1 + WriteoffAmount)) {
                var receiptamount2 = parseFloat(receviable - (receiptamount + receiptamount1));
                $("#txtamount2").val(receiptamount2.toFixed(2));
            }
            else {
                $("#receiptfield3").css('pointer-events', 'none');
                $("#receiptfield3").prop("disabled", true);
            }
        }
    }
    else {
        $("#txtamount").val('');
        $("#txtamount1").val('');
        $("#txtamount2").val('');
    }

}

function ValidateTotalAmount() {
    var receviable = 0;
    var totalamount = parseFloat($("#txtreceiptamount").val());

    if ($("#txtpaymentmodeid option:selected").val() == 1) {
        receviable = parseFloat($("#txtamount").val());
        $("#txtreceiptamount").prop("disabled", "");
    }
    else if ($("#txtpaymentmodeid1 option:selected").val() == 1) {
        receviable = parseFloat($("#txtamount1").val());
        $("#txtreceiptamount").prop("disabled", "");
    }
    else if ($("#txtpaymentmodeid2 option:selected").val() == 1) {
        receviable = parseFloat($("#txtamount2").val());
        $("#txtreceiptamount").prop("disabled", "");
    }
    else {
        $("#txtreceiptamount").prop("disabled", "disabled");
    }

    if (!isNaN(totalamount) && !isNaN(receviable)) {
        if (totalamount < receviable) {
            $("#txtreceiptamount").val(0);
            $("#txtreturnamount").val(0);
            $("#txtreturnamount").html(0);
            ShowMsg("Tender amount can not be less than cash amount", $("#txtreceiptamount"));
            $("#txtreceiptamount").focus();
            return false;
        }
        else {
            var returnamount = totalamount - receviable;
            $("#txtreturnamount").val(returnamount);
            $("#txtreturnamount").html(parseFloat(returnamount).toFixed(2));
        }
    }
}

function TotalWriteoffAmount() {
    var totalamount;
    var receviable = parseFloat($("#txtrecevible").val());
    totalamount = parseFloat($("#txtamount").val());
    if ($("#txtamount1").val() != '') {
        totalamount = parseFloat($("#txtamount").val()) + parseFloat($("#txtamount1").val());
    }
    if ($("#txtamount2").val() != '') {
        totalamount = parseFloat($("#txtamount").val()) + parseFloat($("#txtamount1").val()) + parseFloat($("#txtamount2").val());
    }
    var writeoffamount = parseFloat(receviable - totalamount);
    if (writeoffamount < 0) {
        writeoffamount = 0;
    }
    if (totalamount < (parseFloat(receviable - WriteoffAmount))) {
        $("#txtwriteoffamount").val(WriteoffAmount);
        $("#txtwriteoffamount").html(WriteoffAmount);
    }
    else {
        $("#txtwriteoffamount").val(writeoffamount);
        $("#txtwriteoffamount").html(writeoffamount);
    }
}

$(window).bind('keydown', function (event) {
    if (event.ctrlKey || event.metaKey) {
        if (event.keyCode == 78) {
            ctrlKeyPassed = true;
        }
    }
});

$(window).bind('keyup', function (event) {
    if (ctrlKeyPassed)
        ctrlKeyPassed = false;
});


$("#premiaid").focusout(function () {
    $(".rowactive").find('td:eq(10)')[0] = premianame;
});

function UserLogOut() {
    var url = appRoot + "Booking/Logout";
    var param = {};
    var result = getresult(url, param);
    UnlockOrder();
    window.open('', '_self').close();
    location.assign(appRoot + "account/login");
}


function CheckDateSelectable(date) {
    var curDate = new Date(serverDate);
    $('#lnkTodayDate').html(' &nbsp; Today : ' + ("0" + curDate.getDate()).slice(-2) + '/' + ("0" + (curDate.getMonth() + 1)).slice(-2) + '/' + curDate.getFullYear())
    if (IsBackDateAllow) {
        var backdays = parseInt($("#hdnbackdatedays").val());
        curDate.setDate(curDate.getDate() - backdays);
        if (date > curDate)
            if ((packageIDRunDays & Math.pow(2, (date.getDay() - 1) < 0 ? 6 : (date.getDay() - 1))) > 0)
                return [true, ''];
            else
                return [false, ''];
        else
            return [false, ''];
    }
    else {
        if (date > curDate)
            if ((packageIDRunDays & Math.pow(2, (date.getDay() - 1) < 0 ? 6 : (date.getDay() - 1))) > 0)
                return [true, ''];
            else
                return [false, ''];
        else
            return [false, ''];
    }
    $('#datePicker').datepicker('refresh');
}

function CalCheckDateSelectable(date) {
    var curDate = new Date(serverDate);
    $('#lnkTodayDate').html(' &nbsp; Today : ' + ("0" + curDate.getDate()).slice(-2) + '/' + ("0" + (curDate.getMonth() + 1)).slice(-2) + '/' + curDate.getFullYear());
    var valid = [false, ''];
    for (i = 0; i < selectedPEwithValidDays.length; i++) {
        temPackageIDRunDays = selectedPEwithValidDays[i][1];
        if (IsBackDateAllow) {
            var backdays = parseInt($("#hdnbackdatedays").val());
            curDate.setDate(curDate.getDate() - backdays);
            if (date > curDate)
                if ((temPackageIDRunDays & Math.pow(2, (date.getDay() - 1) < 0 ? 6 : (date.getDay() - 1))) > 0)
                    return [true, ''];
                else
                    return [false, ''];
            else
                return [false, ''];
        }
        else {
            if (date > curDate)
                if ((temPackageIDRunDays & Math.pow(2, (date.getDay() - 1) < 0 ? 6 : (date.getDay() - 1))) > 0) {
                    valid = [true, ''];
                    break;
                }
                else
                    valid = [false, ''];
            else
                valid = [false, ''];
        }
    }
    return valid;
}

function BindDateAutomatically() {
    if (IsBackDateAllow) {
        NxtPublicationDt.setDate(serverDate.getDate() - parseInt($("#hdnbackdatedays").val() - 1));
    }
    else
        NxtPublicationDt = new Date(serverDate);
    tempDate = NxtPublicationDt;
    while (CheckDateSelectable(tempDate) != "true,") {
        tempDate.setDate(tempDate.getDate() + 1);
    }
    strDate = (tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()) + '/' +
        (tempDate.getMonth() < 9 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    $('[parameter=ProductionDate]').append(new Option(strDate, strDate));
    selectedDateArray.push(strDate);
    callInnerBoxHover();
    return strDate;
}

$('#lnkTodayDate').click(function () {
    $('#datePicker').datepicker("setDate", new Date());
    $('#datePicker').datepicker("refresh");
});

//function callInnerBoxHover() {
//    $('.ui-state-active').removeClass('ui-state-active');
//    $('[parameter=ProductionDate]').find('option').each(function () {
//        curDate = $(this).val();
//        $('[data-year=' + curDate.split('/')[2] + '][data-month=' + (parseInt(curDate.split('/')[1]) - 1) + '] a').each(function () {
//            var year = new Date().getFullYear();
//            if (parseInt($(this).html()) == parseInt(curDate.split('/')[0]) && this.nodeName == 'A') {
//                $(this).addClass('ui-state-active');
//                if ($('[parameter=ProductionDate]').find('option[value="' + curDate + '"]').length > 1)
//                    $(this).css('background', ' #8c97df 50% 50% repeat-x');
//            }
//        });
//        $('.ui-datepicker-group span:contains("' + monthNames[parseInt(curDate.split('/')[1]) - 1] + '")').parent().parent().parent().find('table tr td').find('span').each(function () {
//            if (parseInt($(this).html()) == parseInt(curDate.split('/')[0]) && this.nodeName == 'A') {
//                $(this).addClass('ui-state-active');
//                if ($('[parameter=ProductionDate]').find('option[value="' + curDate + '"]').length > 1)
//                    $(this).css('background', ' #8c97df 50% 50% repeat-x');
//            }
//        });
//    });
//    calenderFlag = false;
//}

function callInnerBoxHover() {
    $('.ui-state-active').removeClass('ui-state-active');
    $('[parameter=ProductionDate]').find('option').each(function () {
        curDate = $(this).val();
        $('[data-year=' + curDate.split('/')[2] + '][data-month=' + (parseInt(curDate.split('/')[1]) - 1) + '] a').each(function () {
            if (parseInt($(this).html()) == parseInt(curDate.split('/')[0])) {
                $(this).addClass('ui-state-active');
                if ($('[parameter=ProductionDate]').find('option[value="' + curDate + '"]').length > 1)
                    $(this).css('background', ' #8c97df 50% 50% repeat-x');
            }
        });
        $('.ui-datepicker-group span:contains("' + monthNames[parseInt(curDate.split('/')[1]) - 1] + '")').parent().parent().parent().find('table tr td').find('span').each(function () {
            if (parseInt($(this).html()) == parseInt(curDate.split('/')[0])) {
                $(this).addClass('ui-state-active');
                if ($('[parameter=ProductionDate]').find('option[value="' + curDate + '"]').length > 1)
                    $(this).css('background', ' #8c97df 50% 50% repeat-x');
            }
        });
    });
    calenderFlag = false;
}
//$('#innerBox').hover(function () {
//    if (calenderFlag)
//        callInnerBoxHover();
//});

function SetMaterialIdByDate() {
    var MaterialId = $('[parameter=AdMaterialIdList]').val().split(',');
    strMaterialNew = '';
    $('[parameter=ProductionDate] option').each(function () {
        LoopDate = $(this).val();
        datefind = '';
        $.each(MaterialId, function (index, val) {
            if (val.match("^" + LoopDate)) {
                datefind = val + ',';
            }
        });
        strMaterialNew += (datefind != '' ? datefind : '#,');
    });
    $('[parameter=AdMaterialIdList]').val(strMaterialNew);
}


function CleararrayList() {
    AdtypeIdlist = [];
    Adsizeidlist = [];
    AdsizeHeightlist = [];
    AdsizeWidthlist = [];
    Premiaidlist = [];
    Coloridlist = [];
    MaterialTypelist = [];
    MaterialSourcelist = [];
    BoxTypeIDlist = [];
    UOMIDlist = [];
    Statuslist = [];
    AuditStatuslist = [];
    CardRatelist = [];
    CardAmountlist = [];
    RateCardIDlist = [];
    AdRateIDlist = [];
    AgreedRatelist = [];
    AgreedAmountlist = [];
    AgreedDiscPerlist = [];
    AgreedDiscAmountlist = [];
    PreVATAmountlist = [];
    VATPerlist = [];
    VATAmountlist = [];
    AgencyCommissionPerlist = [];
    AgencyCommissionAmountlist = [];
    SchemeIDlist = [];
    SchemeDetailIDlist = [];
    ExtraChargesPerlist = [];
    ExtraChargesAmountlist = [];
    ExtraDiscPerlist = [];
    ExtraDiscAmountlist = [];
    ExtraBoxChargesPerlist = [];
    ExtraBoxChargesAmountlist = [];
    Receivablelist = [];
}

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
        autoFocus: true,
        select: function (event, ui) {
            $('#AgencyId').val(ui.item.key);


        },
    });
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
        autoFocus: true,
        select: function (event, ui) {
            $('#ClientId').val(ui.item.key);


        },
    });
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
        autoFocus: true,
        select: function (event, ui) {
            $('#CanvassorId').val(ui.item.key);


        },
    });
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
        autoFocus: true,
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

function IsCDSelected() {
    if ($('.table-ad-detail tr').hasClass('gridselected')) {
        var index = $('.table-ad-detail tr.gridselected').attr('list-index');
        if (list != null) {
            if (list.length > index) {
                list[index].Iscd = $("#iscd option:selected").val();
            }
        }
    }
    else {
        for (var i = 0; i < list.length; i++) {
            list[i].Iscd = $("#iscd option:selected").val();
        }
    }
}

var dateToday = new Date();
$('#CancelDateid').datepicker({
    numberOfMonths: 1,
    dateFormat: 'dd/mm/yy',
    changeMonth: true,
    changeYear: true,
    minDate: 0,
});
$('#CancelDateid').datepicker("setDate", new Date());

function CancelReceipt() {
    $('#textremark').val('');
    var Receipetid = $('#txtReceiptNo').val();
    if (Receipetid == '') {
        ShowMsg('Please enter the ReceiptID');
        return false;
    }
    $('#CancelReceiptPopUp').dialog('open');
}

function CancelReceiptOk() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var Receipetid = $('#txtReceiptNo').val();
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/BookingCancelReceipt";
    param.Parametername = 'cancelreceipt';
    param.ReceiptID = Receipetid;
    param.UserId = userid
    param.CancelReceiptDate = $('#CancelDateid').val();
    param.CancelReceiptRemark = $('#textremark').val();
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        $('#CancelReceiptPopUp').dialog('close');
        if ($('#hdnIsClassified').val() == "0") {
            $('input[type="text"]').val('');
            cleartable();
            EnableElement();
            $("[val='0']").click();
        }
        else {
            $('input[type="text"]').val('');
            cleartable();
            EnableElement();
            $("[val='1']").click();
        }
        $('input[type="text"]').removeClass('RateColor');
        $("#hdnratefieldchanged").val(0);
        $("#hdnitemratefieldchanged").val(0);
        ShowMsg(result[0].Message);
    }
}

function SavePrint(Receipetid) {
    var Isclassified = $('#hdnIsClassified').val();

    $.ajax({
        async: false,
        url: appRoot + "Booking/GetPrint",
        type: "POST",
        dataType: "json",
        data: { Isclassified: Isclassified, Receipetid: Receipetid },
        success: function (data) {
            if (data != '') {

                window.open('' + appRoot + 'Report/PrintReport.aspx');
            }
        }, error: function (xhr, ajaxOptions, thrownError) {
            ShowMsg(xhr.status);
            ShowMsg(thrownError);
        }

    });
    return false;
}

function ReportPrint() {
    var Receipetid = $('#txtReceiptNo').val();
    if (Receipetid == '') {
        ShowMsg('Please enter the ReceiptID');
        return false;
    }
    var Isclassified = 0;

    $.ajax({
        async: false,
        url: appRoot + "Booking/GetPrint",
        type: "POST",
        dataType: "json",
        data: { Isclassified: Isclassified, Receipetid: Receipetid },
        success: function (data) {
            if (data != '') {

                window.open('' + appRoot + 'Report/PrintReport.aspx');
            }
        }, error: function (xhr, ajaxOptions, thrownError) {
            ShowMsg(xhr.status);
            ShowMsg(thrownError);
        }

    });
    return false;

}

function ViewCancelDetail() {
    $('#lblViewCancelPopupData').empty();
    $('#divViewCanclePopUp').dialog('open');
    $('#fromdate').datepicker("setDate", new Date());
    $('#todate').datepicker("setDate", new Date());
}

function ViewSearchAgencyDetail() {
    $('#SearchAgencyName').val('');
    $('#SearchAgencyCode').val('');
    $('#SearchAgencyCategory').val('');
    $('#SearchAgencyCity').val('');
    $('#SearchAgencyAddress').val('');
    $('#lblViewAgencyPopupData').empty();
    $('#divViewAgencyPopUp').dialog('open');
}

function SearchAgencyDetail() {
    $('#lblViewAgencyPopupData').html('');
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/AgencyDetail";
    param.SearchAgencyName = $('#SearchAgencyName').val();
    param.SearchAgencyCode = $('#SearchAgencyCode').val();
    param.SearchAgencyCategory = $('#SearchAgencyCategory').val();
    param.SearchAgencyCity = $('#SearchAgencyCity').val();
    param.SearchAgencyAddress = $('#SearchAgencyAddress').val();
    param.IsClassified = $('#hdnIsClassified').val();
    if (param.SearchAgencyName != '' || param.SearchAgencyCode != '' || param.SearchAgencyCategory != '' || param.SearchAgencyCity != '') {
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        if (result.length > 1) {
            var tableHtml = makeAgencySearchTable(result);
            $('#lblViewAgencyPopupData').append(tableHtml);
            $('#divViewAgencyPopUp').dialog('open');
        }
        else {
            $('#lblViewAgencyPopupData').css('text-align', 'center').html("Record not found!");
            $('#divViewAgencyPopUp').dialog('open');
            return false;
        }
    }
}

function ViewSearchClientDetail() {
    $('#SearchClientName').val('');
    $('#SearchClientID').val('');
    $('#SearchClientCity').val('');
    $('#SearchClientAddress').val('');
    $('#SearchClientOldCode').val('');
    $('#lblViewClientPopupData').empty();
    $('#divViewClientPopUp').dialog('open');
}

function SearchClientDetail() {
    $('#lblViewClientPopupData').html('');
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/ClientDetail";
    param.SearchClientName = $('#SearchClientName').val();
    param.SearchClientID = $('#SearchClientID').val();
    param.SearchClientCity = $('#SearchClientCity').val();
    param.SearchClientAddress = $('#SearchClientAddress').val();
    param.SearchClientOldCode = $('#SearchClientOldCode').val();
    param.IsClassified = $('#hdnIsClassified').val();
    if (param.SearchClientName != '' || param.SearchClientID != '' || param.SearchClientCity != '' || param.SearchClientAddress != '' || param.SearchClientOldCode != '') {
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        if (result.length > 1) {
            var tableHtml = makeClientSearchTable(result);
            $('#lblViewClientPopupData').append(tableHtml);
            $('#divViewClientPopUp').dialog('open');
        }
        else {
            $('#lblViewClientPopupData').css('text-align', 'center').html("Record not found!");
            $('#divViewClientPopUp').dialog('open');
            return false;
        }
    }
}

function makeAgencySearchTable(data) {
    var table = $("<table/>").addClass('tables');
    if (data.length > 1) {
        $.each(data, function (rowIndex, r) {
            var row = $("<tr/>");
            $.each(r, function (colIndex, c) {
                if (rowIndex == 0)
                    row.append($("<th/>").text(c));
                else if (data[0][colIndex] != 'Agency Name')
                    row.append($("<td onclick='SearchAgencyRow(this)' />").html('<span class="agency-td" title="' + c + '">' + c + '</span>'));
                else
                    row.append($("<td onclick='SearchAgencyRow(this)' />").html('<span class="agency-search" title="' + c + '">' + c + '</span>'));
            });
            table.append(row);
        });
    }
    else {
        table = '<div class="error-box">Sorry.. Record not found!</div>'
    }
    return table;
}


function SearchAgencyRow(th) {
    $('#lblViewAgencyPopupData').find('table tr').removeClass('rowSelected');
    $(th).parent().addClass('rowSelected');
}


function FillSearchAgency() {
    if ($('#lblViewAgencyPopupData').find('table tr.rowSelected').find('td:eq(0)')[0] != undefined) {
        var searchagencyid = $('#lblViewAgencyPopupData').find('table tr.rowSelected').find('td:eq(0)')[0].textContent;
        var searchagencyname = $('#lblViewAgencyPopupData').find('table tr.rowSelected').find('td:eq(1)')[0].textContent;
        $('#agencyid').val(searchagencyname);
        agencyidvalue = searchagencyid;
    }
    $('#agencyid').focus();
    $('#divViewAgencyPopUp').dialog('close');
}

function makeClientSearchTable(data) {
    var table = $("<table/>").addClass('tables');
    if (data.length > 1) {
        $.each(data, function (rowIndex, r) {
            var row = $("<tr/>");
            $.each(r, function (colIndex, c) {
                if (rowIndex == 0)
                    row.append($("<th/>").text(c));
                else if (data[0][colIndex] != 'Client Name')
                    row.append($("<td onclick='SearchClientRow(this)' />").html('<span class="client-td" title="' + c + '">' + c + '</span>'));
                else
                    row.append($("<td onclick='SearchClientRow(this)' />").html('<span class="client-search" title="' + c + '">' + c + '</span>'));
            });
            table.append(row);
        });
    }
    else {
        table = '<div class="error-box">Sorry.. Record not found!</div>'
    }
    return table;
}

function SearchClientRow(th) {
    $('#lblViewClientPopupData').find('table tr').removeClass('rowSelected');
    $(th).parent().addClass('rowSelected');
}

function FillSearchClient() {
    if ($('#lblViewClientPopupData').find('table tr.rowSelected').find('td:eq(0)')[0] != undefined) {
        var searchclientid = $('#lblViewClientPopupData').find('table tr.rowSelected').find('td:eq(0)')[0].textContent;
        var searchclientname = $('#lblViewClientPopupData').find('table tr.rowSelected').find('td:eq(1)')[0].textContent;
        $('#clientid').val(searchclientname);
        clientidvalue = searchclientid;
    }
    $('#clientid').focus();
    $('#divViewClientPopUp').dialog('close');
}

function ViewCancelShow() {
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/BookingCancelOrder";
    param.Parametername = 'viewcancelled';
    param.FromDate = $('#fromdate').val();
    param.ToDate = $('#todate').val();

    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        var tableHtml = makeCancelOrderShowTable(result);
        $('#lblViewCancelPopupData').empty();
        $('#lblViewCancelPopupData').append(tableHtml);

    }
}

function makeCancelOrderShowTable(data) {
    var table = $("<table id='tableid'/>").addClass('table tables');
    if (data.length > 1) {
        $.each(data, function (rowIndex, r) {
            var row = $("<tr/>");
            $.each(r, function (colIndex, c) {
                row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
            });
            table.append(row);
        });
    }
    else {
        table = '<div class="error-box">Sorry.. Record not found!</div>'
    }
    return table;
}

function PrintfileDownload() {
    if (DownloadType == '1') {
        ExcelReportPrint();

    }
    else {
        Csvfilecount++;
        if (Csvfilecount == 1) {
            Receiptprint();

        }
        else {
            $('<div title="Adpro"></div>').html("Do you want to print Same Receipt?").dialog({
                show: 'blind',
                closeOnEscape: false,
                autoOpen: true,
                hide: 'fold',
                modal: true,
                dialogClass: "base-message",
                buttons: {
                    "Yes": function () {
                        $(this).dialog("close");
                        Receiptprint();
                    },
                    "No": function () {
                        $(this).dialog("close");
                        return false;
                    }
                }
            });
        }
    }
}

function Receiptprint() {
    var Receipetid = $('#txtReceiptNo').val();
    if (Receipetid == '') {
        ShowMsg('Please enter The ReceiptID');
        return false;
    }
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/ReceiptPrint";
    param.ReceiptId = Receipetid;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result[0].ReceiptId != '' && result[0].ReceiptId != null) {
        window.location = appRoot + "/Booking/GetMainDatatable/?ReceiptId=" + result[0].ReceiptId + "&IsCheck=" + result[0].IsCheckType;
        setTimeout(function () {
            window.open(appRoot + "BookingSubPrint/GetSubDatatable/?ReceiptId=" + result[0].ReceiptId + "&IsCheck=" + result[0].IsCheckType);
        }, 3000);
    }
}

function ExcelReportPrint() {
    var Receipetid = $('#txtReceiptNo').val();
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    if (Receipetid == '') {
        ShowMsg('Please enter The ReceiptID');
        return false;
    }
    var Isclassified = 0;

    $.ajax({
        async: false,
        url: appRoot + "Booking/ExcelGetPrint",
        type: "POST",
        dataType: "json",
        data: { Isclassified: Isclassified, Receipetid: Receipetid, UserId: userid },
        success: function (data) {
            if (data.Receiptname != '') {
                window.location = "" + appRoot + "/Booking/PrintFileDownload/?ReceiptId=" + data.Receiptname;
            }
            else {
                ShowMsg('Please enter Correct RecepitId');

            }
        }, error: function (xhr, ajaxOptions, thrownError) {
            ShowMsg(xhr.status);
            ShowMsg(thrownError);
        }

    });
    return false;

}

function RoFileAttch() {
    $('#RofilePopUp').dialog('open');

}
function AddfileShow() {
    $('#divfileshow').show();
}
function AddfileHide() {
    $('#selectfile').val('');
    $('#filename').val('');
    $('#filetitle').val('');
    $('#Rofileid').val('');
    $('#divfileshow').hide();
}

function getoutput(event) {
    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
        return;
    }
    var filepath = $('#Rofileid').val();
    var pathfile = filepath.replace('fakepath', '');

    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');

    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);
    $('#selectfile').val(pathfile);
    $('#filename').val(fileName);
    $('#filetitle').val(fileName);
}

function Imageopen(thist) {
    var FilePath = $(thist).attr('filepath');
    window.open('' + appRoot + '' + FilePath + '');
}
function FileUpload() {
    var Gridfilename = $('#filename').val();
    var Gridtitel = $('#filetitle').val();
    var hdn = $('#hdnfilename').val();
    if (hdn != '') {
        $('.table-selected-row #btnview').attr('filepath', 'UploadFiles/' + Gridfilename + '');
    }
    var files = $("#Rofileid").get(0).files;
    if (hdn == '' & files.length == 0) {
        ShowMsg('Please Choose File');
        return false;
    }
    else {
        $('#fileGrid tr').each(function () {
            var oldgridfilename = $(this).find('td:eq(1)').text();
            var oldgridfiletype = $(this).find('td:eq(2)').text();
            if (oldgridfilename == Gridfilename && oldgridfiletype == fullFileName.slice((fullFileName.lastIndexOf(".")))) {
                $(this).addClass('table-selected-row');
                DeleteGridrow();
                ShowMsg('Same File Already Attached. Please Attach Different File');

                return false;
            }
        });
    }
    var fileData = new FormData();
    fileData.append('NewFileName', Gridfilename);
    fileData.append('OldFileName', hdn)
    for (var i = 0; i < files.length; i++) {
        fullFileName = files[i].name;
        fileData.append(Gridfilename + '.' + fullFileName.slice((fullFileName.lastIndexOf(".") - 1 >>> 0) + 2), files[i]);
    }
    var xml = '';
    $.ajax({
        type: "POST",
        url: appRoot + "Booking/RoFileUpload",
        dataType: "json",
        contentType: false, // Not to set any content header
        processData: false, // Not to process data
        data: fileData,
        success: function (result, status, xhr) {
            for (var i = 0; i < result.length; i++) {
                Rofilename.push(Gridfilename);
                Rofiletype.push(result[i].FileExt);
                Rofiletitle.push(Gridtitel);
                var trvalue = $('#hdntableno').val();

                if (trvalue != 0) {
                    xml += '<tr id="trfilename" style="cursor:pointer;"  file-name="' + result[i].FileName.trim() + '" ><td>' + $('#mytable tr').length + '</td>'
                        + '<td>' + Gridfilename + '</td>'
                        + '<td>' + result[i].FileExt + '</td>'
                        + '<td>' + Gridtitel + '</td>'
                        + '<td><button id="btnview"  onclick="Imageopen(this)" filepath="' + result[i].filelocalpath + '" >View</button></td></tr>'
                    $('#hdntableno').val((parseInt(trvalue) + 1));
                }
                else {
                    xml += '<tr id="trfilename" style="cursor:pointer;" file-name="' + result[i].FileName.trim() + '"><td>' + $('#mytable tr').length + '</td>'
                        + '<td>' + Gridfilename + '</td>'
                        + '<td>' + result[i].FileExt + '</td>'
                        + '<td>' + Gridtitel + '</td>'
                        + '<td><button id="btnview"  onclick="Imageopen(this)" filepath="' + result[i].filelocalpath + '" >View</button></td></tr>'
                }
            }
            $('#fileGrid').append(xml);
            var trcount = $('#mytable tbody tr').length;
            $('#hdntableno').val(trcount);
        },
        error: function (xhr, status, error) {
            ShowMsg(status);
        }
    });
    $('#selectfile').val('');
    $('#filename').val('');
    $('#filetitle').val('');
    $('#Rofileid').val('');
    $('#hdnfilename').val('');
}

function DeleteGridrow() {
    var FileName = $('.table-selected-row').attr("file-name");
    URL = "Booking/FileDelete";
    roid = $('#hdnroid').val();
    if (FileName == null || FileName == undefined) {
        FileName = $('.selected-row').attr("filename") + $('.selected-row td:eq(2)').html();
        URL = "Booking/FileDeletefromServer";
    }
    $.ajax({
        type: "POST",
        url: appRoot + URL,
        dataType: "json",
        data: { FileName: FileName },
        success: function (result, status, xhr) {
            if (result[0] == '0') {
                ShowMsg('Selected file not deleted');
            }
            else {
                if ($('.selected-row td:eq(1)').html() != null || $('.selected-row td:eq(1)').html() != undefined) {
                    Rofilename.splice(Rofilename.indexOf($('.selected-row td:eq(1)').html()), 1);
                    Rofiletype.splice(Rofiletype.indexOf($('.selected-row td:eq(2)').html()), 1);
                    Rofiletitle.splice(Rofiletitle.indexOf($('.selected-row td:eq(3)').html()), 1);
                }
                else {
                    Rofilename.splice(Rofilename.indexOf($('.table-selected-row td:eq(1)').html()), 1);
                    Rofiletype.splice(Rofiletype.indexOf($('.table-selected-row td:eq(2)').html()), 1);
                    Rofiletitle.splice(Rofiletitle.indexOf($('.table-selected-row td:eq(3)').html()), 1);
                }
                $('.selected-row,.table-selected-row').remove();
                $('#mytable tr').each(function (a, b) {
                    if ($(this).find('td:eq(0)').length > 0)
                        $(this).find('td:eq(0)').html(a);
                });
            }
        },
        error: function (xhr, status, error) {
            ShowMsg(status);
        }
    });
    $('#filetitle').val('');
    $('#filename').val('');
    $('#hdnfilename').val('');
}

$(document).on("click", "#trfilename", function () {
    $(this).addClass('table-selected-row').siblings().removeClass('table-selected-row');
    var filename = $(this).attr('file-name');
    $('#btModify').attr('file-content', filename);
    $('#filetitle').val('');
    $('.selected-row').removeClass('selected-row').css("background", "").css("color", "#000");
});

function BindRoFileDetailUpdate(th) {
    var Filename = $(th).attr('file-content');
    const lastDot = Filename.lastIndexOf('.');
    const filtitale = Filename.substring(0, lastDot);
    $('#filename').val(Filename);
    $('#filetitle').val(filtitale);
    $('#hdnfilename').val(Filename);
}

function PushSelectedDateToArray(dateText) {
    var jsdate = new Date(dateText.split('/')[1] + '/' + dateText.split('/')[0] + '/' + dateText.split('/')[2]);
    var selectedDay = jsdate.getDay();
    var sunday = "";
    var weekday = "";
    for (var i = 0; i < selectedPEwithValidDays.length; i++) {
        var tempPackageIDRunDays = selectedPEwithValidDays[i][1];
        var tempPackageID = selectedPEwithValidDays[i][0];
        if ((tempPackageIDRunDays & Math.pow(2, (jsdate.getDay() - 1) < 0 ? 6 : (jsdate.getDay() - 1))) > 0) {
            NxtPublicationDt = jsdate;
            strDate = (jsdate.getDate() < 10 ? '0' + jsdate.getDate() : jsdate.getDate()) + '/' +
                (jsdate.getMonth() < 9 ? '0' + (jsdate.getMonth() + 1) : jsdate.getMonth() + 1) + '/' + jsdate.getFullYear();
            selectedDateArray.push(strDate);
            selectedPEwithValidDays[i][2] = strDate;
            break;
        }
    }
    var num = 0;
    for (var i = 0; i < selectedPEwithValidDays.length; i++) {
        if (tempPackageID != selectedPEwithValidDays[i][0]) {
            packageIDRunDays = selectedPEwithValidDays[i][1];
            selectedPEwithValidDays[i][2] = BindDateAutomaticallyforMultiple();
        }
    }
}

function BindDateAutomaticallyforMultiple() {
    tempDate = NxtPublicationDt;
    while (CheckDateSelectable(tempDate) != "true,") {
        tempDate.setDate(tempDate.getDate() + 1);
    }
    strDate = (tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()) + '/' +
        (tempDate.getMonth() < 9 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    $('[parameter=ProductionDate]').append(new Option(strDate, strDate));
    selectedDateArray.push(strDate);
    callInnerBoxHover();
    return strDate
}


function PopSelectedDateToArray(dateText) {
    var jsdate = new Date(dateText.split('/')[1] + '/' + dateText.split('/')[0] + '/' + dateText.split('/')[2]);
    var selectedDay = jsdate.getDay();
    var sunday = "";
    var weekday = "";
    for (var i = 0; i < selectedPEwithValidDays.length; i++) {
        var tempPackageIDRunDays = selectedPEwithValidDays[i][1];
        var tempPackageID = selectedPEwithValidDays[i][0];
        if ((tempPackageIDRunDays & Math.pow(2, (jsdate.getDay() - 1) < 0 ? 6 : (jsdate.getDay() - 1))) > 0) {
            NxtPublicationDt = jsdate;
            strDate = (jsdate.getDate() < 10 ? '0' + jsdate.getDate() : jsdate.getDate()) + '/' +
                (jsdate.getMonth() < 9 ? '0' + (jsdate.getMonth() + 1) : jsdate.getMonth() + 1) + '/' + jsdate.getFullYear();
            selectedDateArray.push(strDate);
            selectedPEwithValidDays[i][2] = strDate;
            break;
        }
    }
    var num = 0;
    for (var i = 0; i < selectedPEwithValidDays.length; i++) {
        if (tempPackageID != selectedPEwithValidDays[i][0]) {
            packageIDRunDays = selectedPEwithValidDays[i][1];
            selectedPEwithValidDays[i][2] = BindDateAutomaticallyforMultiple();
        }
    }
}

function RemoveDateAutomaticallyforMultiple() {
    tempDate = NxtPublicationDt;
    while (CheckDateSelectable(tempDate) != "true,") {
        tempDate.setDate(tempDate.getDate() + 1);
    }
    strDate = (tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()) + '/' +
        (tempDate.getMonth() < 9 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    $('[parameter=ProductionDate]').append(new Option(strDate, strDate));
    selectedDateArray.push(strDate);
    callInnerBoxHover();
    return strDate
}

function ClPEclass() {
    setTimeout(function () {
        $(".chosen-container").removeClass('chosen-with-drop');
        $(".chosen-container").removeClass('chosen-container-active');
    }, 150);
}

function Agencyfocus() {
    setTimeout(function () {
        $("#agencyid").focus();
    }, 500);
}

//$('#packageiddiv').focusout(function (e) {
//    if (ispefocus == false) {
//        setTimeout(function () {
//            if ($('#hdnIsClassified').val() == "1" && ctrlupress == false) {
//                $("#categoryid").focus();
//                ctrlupress = false;
//            }
//            else {
//                $("#premiaid").focus();
//            }
//            ispefocus == true;
//        }, 10);
//    }
//});

$('#packageiddiv').on('keydown', function (e) {
    var keycode = e.which || e.keyCode;
    if ((keycode == 9 || keycode == 13) && ($(".chosen-search-input").val() == "" || $(".chosen-search-input").val() == "Type Package")) {
        if (ispefocus == false) {
            setTimeout(function () {
                if ($('#hdnIsClassified').val() == "1" && ctrlupress == false) {
                    $("#categoryid").focus();
                    ctrlupress = false;
                }
                else {
                    $("#premiaid").focus();
                }
                ispefocus == true;
            }, 10);
        }
    }
});

/* ---start new receipt functionality--- */

function ViewNewReceiptDetails() {
    $('#divNewReceiptPopUp').dialog('open');
    $('#lblCancelReceiptPendingRO').html('');
    $("#txtpendingpaymodeid").val('');
    $("#txtrcptagencyname").val('');
    $("#hdnrcptagencyid").val('');
    $("#hdnrcptcasualclientid").val('');
    $("#txtrcptcasualclientname").val('');
    $("#hdnrcptcasualclientaddress").val('');
    $("#hdnrcptcasualclientcity").val('');
    $("#hdnrcptcasualclientzip").val('');
    $("#hdnrcptcasualclientphone").val('');
    $("#hdnrcptpendingronet").val('');
    ClearMainScreenFields();
    EnableNewReciptPopup();
    ValidateNewReceiptField();
    PendingOrders();
    BindPendingRoPaymode();
    BindPendingRoBranch();
    $("#pendingorders").val(0);
    $("#pendingorders").focus();
}

function ValidateNewReceiptField() {
    $("#hdnnewsaveflag").val(0);
    $("#txtNewReceiptNo").val('');
    $("#newreceiptfield1").css('pointer-events', 'none');
    $("#newreceiptfield1").prop("disabled", true);
    $("#newreceiptfield2").css('pointer-events', 'none');
    $("#newreceiptfield2").prop("disabled", true);
    $("#newreceiptfield3").css('pointer-events', 'none');
    $("#newreceiptfield3").prop("disabled", true);
    $("#newreceiptfield1 input").val('');
    $("#newreceiptfield1 select").val(0);
    $("#newreceiptfield2 input").val('');
    $("#newreceiptfield2 select").val(0);
    $("#newreceiptfield3 input").val('');
    $("#newreceiptfield3 select").val(0);

    $("#txtcancelreceiptamount").val('');
    $("#txtcancelreturnamount").html('');
    $("#txtcancelwriteoffamount").html('');
    $("#txtcanceltotalamount").html('');
}

function ClearMainScreenFields() {
    ispefocus = true;
    $("#chkdiffer").prop("checked", false);
    CheckDifferReceipt();
    EnableElement();
    OrderlevelinfoEnable();
    OrderlevelEnable();
    RefreshData();
    cleartabletdvalue();
    $('.column-right table tr td input[type="text"]').val('');
    $('.column-right table tr td select').val('');
}

function PendingOrders() {
    $("#pendingorders").empty();
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/FillPendingOrders";
    param.Parametername = "prepaidpendingorders";
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        $("#pendingorders").append(new Option('Select Roid', '0'));
        for (var m = 0; m < result.length; m++)
            $("#pendingorders").append(new Option(result[m].PendingROID, result[m].PendingROID));
    }
}

function GetReceiptInfoForROID() {
    $('#lblCancelReceiptPendingRO').html('');
    $("#txtpendingpaymodeid").val('');
    $("#txtrcptagencyid").val('');
    $("#txtrcptcasualclientid").val('');
    ValidateNewReceiptField();
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/GetReceiptInfoForROID";
    param.Parametername = "getreceiptinfoforroid";
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    param.ROID = $("#pendingorders").val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.ReceiptInfo.length > 0) {
        $("#txtrcptagencyname").val(result.ReceiptInfo[0].AgencyName);
        $("#hdnrcptagencyid").val(result.ReceiptInfo[0].AgencyID);
        $("#hdnrcptcasualclientid").val(result.ReceiptInfo[0].ClientID);
        $("#txtrcptcasualclientname").val(result.ReceiptInfo[0].ClientName);
        $("#hdnrcptcasualclientaddress").val(result.ReceiptInfo[0].CasualAddress);
        $("#hdnrcptcasualclientcity").val(result.ReceiptInfo[0].City);
        $("#hdnrcptcasualclientzip").val(result.ReceiptInfo[0].Zip);
        $("#hdnrcptcasualclientphone").val(result.ReceiptInfo[0].Phone);
    }
    if (result.PendingROIDInfo.length > 0) {
        PendingROID(result.PendingROIDInfo);
        $("input[pendingro=" + $("#pendingorders").val() + "]").click();
        $("input[pendingro=" + $("#pendingorders").val() + "]").parent().css('pointer-events', 'none');
    }

    if (result.AdvanceReceiptInfo.length > 0) {
        BindAdvanceReceiptInfo(result.AdvanceReceiptInfo);
    }
}

function PendingROID(result) {
    var tableHtml = makePendingROTable(result);
    $('#lblCancelReceiptPendingRO').html('');
    $('#lblCancelReceiptPendingRO').append(tableHtml);
}

function makePendingROTable(data) {
    var table = "";
    for (var i = 0; i < data.length; i++) {
        table += '<tr>'
            + '<td><input type="checkbox" name="PendingROCheckbox" onclick="PendingROCkecbox(this)" pendingro="' + data[i].ROID + '" pendingronet="' + data[i].Net + '" style="float:left;margin-top:2px;" />'
            + '<label onclick="SearchPendingRORow(this)" pendingro="' + data[i].ROID + '" pendingronet="' + data[i].Net + '" style="cursor:pointer;">' + data[i].ROID + '</label></td> </tr>';
    }
    return table;
}
function PendingROCkecbox(th) {
    ValidateNewReceiptField();
    if ($(th).prop("checked") == true) {
        $(th).next().addClass('PendingRoSelected');

    }
    else {
        $(th).next().removeClass('PendingRoSelected');
    }
    FillPendingRoData();
}

function SearchPendingRORow(th) {
    ValidateNewReceiptField();
    $(th).addClass('PendingRoSelected');
    $(th).parents().find('[name="PendingROCheckbox"]').prop('checked', true);
    FillPendingRoData();
}

function FillPendingRoData() {
    var PendingRoNet = 0;
    $.each($("input[name='PendingROCheckbox']:checked"), function () {
        PendingRoNet = PendingRoNet + parseFloat($(this).attr('pendingronet'));
    });
    if ($("input[name='PendingROCheckbox']:checked").length > 0) {
        PendingROReceiptDetails(PendingRoNet);
        $("#hdnrcptpendingronet").val(PendingRoNet);
        $("#txtcanceltotalamount").html(PendingRoNet);
        $("#txtpendingpaymodeid").val(1);
        $("#txtpendingpaymodeid").change();
        $("#newreceiptfield1").css('pointer-events', 'auto');
        $("#newreceiptfield1").removeAttr("disabled");
    }
    else {
        $("#txtpendingpaymodeid").val('');
        $("#txtrcptagencyname").val('');
        $("#hdnrcptagencyid").val('');
        $("#hdnrcptcasualclientid").val('');
        $("#txtrcptcasualclientname").val('');
        $("#hdnrcptcasualclientaddress").val('');
        $("#hdnrcptcasualclientcity").val('');
        $("#hdnrcptcasualclientzip").val('');
        $("#hdnrcptcasualclientphone").val('');
        $("#hdnrcptpendingronet").val('');
        ValidateNewReceiptField();
    }
}

function BindPendingRoPaymode() {
    var allFilterElement = $('[newflag = "forNewReceiptXmltype"]');
    var allFilterElementLength = allFilterElement.length;
    for (var i = 0; i < allFilterElementLength; i++) {
        $("#" + allFilterElement[i].id).empty();
        var parametername = $("#" + allFilterElement[i].id).attr("parameter");
        var paramValue = $("#" + allFilterElement[i].id).val();
        if (paramValue === null)
            paramValue = 0;
        var url = appRoot + "Booking/GetTableData";
        var param = {};
        param.ApiName = "/FillReceiptData";
        param.Parametername = parametername;
        param.IsClassified = $('#hdnIsClassified').val();
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        if (result.length > 0) {
            for (var m = 0; m < result.length; m++)
                $("#" + allFilterElement[i].id).append(new Option(result[m].Value, result[m].ID));
        }
    }
}

function BindPendingRoBranch() {
    var allFilterElement = $('[newflag = "forNewBranchXmltype"]');
    var allFilterElementLength = allFilterElement.length;
    for (var i = 0; i < allFilterElementLength; i++) {
        $("#" + allFilterElement[i].id).empty();
        var parametername = $("#" + allFilterElement[i].id).attr("parameter");
        var paramValue = $("#" + allFilterElement[i].id).val();
        if (paramValue === null)
            paramValue = 0;
        var url = appRoot + "Booking/GetTableData";
        var param = {};
        param.ApiName = "/FillBranchData";
        param.Parametername = parametername;
        param.IsClassified = $('#hdnIsClassified').val();
        var result = getresult(url, param);
        result = jQuery.parseJSON(result);
        if (result.length > 0) {
            for (var m = 0; m < result.length; m++) {
                $("#" + allFilterElement[i].id).append('<option value="' + result[m].BranchID + '" bankid="' + result[m].BankID + '" bankname="' + result[m].BankName + '" branchname="' + result[m].BranchName + '">' + result[m].BankBranchCode + '</option>');
            }
        }
    }
}

function BindAdvanceReceiptInfo(result) {
    var allFilterElement = $('[newflag = "forAdvanceRcptXmltype"]');
    var allFilterElementLength = allFilterElement.length;
    for (var i = 0; i < allFilterElementLength; i++) {
        $("#" + allFilterElement[i].id).empty();
        if (result.length > 0) {
            $("#" + allFilterElement[i].id).append(new Option(' ', '0'));
            for (var m = 0; m < result.length; m++) {
                $("#" + allFilterElement[i].id).append('<option value="' + result[m].ReceiptID + '" balanceamount="' + result[m].BalanceAmount + '">' + result[m].ReceiptID + '</option>');
            }
        }
    }
}

function PendingROReceiptDetails(result) {
    $("#txtpendingamount").val(result);
}

function SaveNewReceipt() {
    var Pendingroidlist = new Array();
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/SaveNewReceiptData";
    param.UserId = userid;
    param.RevenueCentreID = centerid;
    param.AgencyID = $("#hdnrcptagencyid").val();
    param.ClientID = $("#hdnrcptcasualclientid").val();
    param.CasualClientName = $("#txtrcptcasualclientname").val().replace('&', '&amp;').trim();;
    param.CasualClientAddress = $("#hdnrcptcasualclientaddress").val();
    param.CasualClientCity = $("#hdnrcptcasualclientcity").val();
    param.CasualClientPhoneNo = $("#hdnrcptcasualclientphone").val();
    param.CasualClientZipCode = $("#hdnrcptcasualclientzip").val();
    var totalreceivable = "0";
    var tenderamount = "0";
    if ($("#txtpendingamount").val() != '') {
        totalreceivable = parseFloat($("#txtpendingamount").val());
    }
    if ($("#txtpendingamount1").val() != '') {
        totalreceivable = parseFloat($("#txtpendingamount").val()) + parseFloat($("#txtpendingamount1").val());
    }
    if ($("#txtpendingamount2").val() != '') {
        totalreceivable = parseFloat($("#txtpendingamount").val()) + parseFloat($("#txtpendingamount1").val()) + parseFloat($("#txtpendingamount2").val());
    }
    param.TotalReceivable = totalreceivable;
    param.ReceivableAmount = $("#txtcanceltotalamount").html();
    param.ReceiptAmount = $("#txtcancelreceiptamount").val();
    if (param.ReceiptAmount == null || param.ReceiptAmount == '' || param.ReceiptAmount == "0") {
        if ($("#txtpendingpaymodeid option:selected").val() == 1) {
            tenderamount = parseFloat($("#txtpendingamount").val());
        }
        else if ($("#txtpendingpaymodeid1 option:selected").val() == 1) {
            tenderamount = parseFloat($("#txtpendingamount1").val());
        }
        else if ($("#txtpendingpaymodeid2 option:selected").val() == 1) {
            tenderamount = parseFloat($("#txtpendingamount2").val());
        }
        param.ReceiptAmount = tenderamount;
    }

    param.WriteoffAmount = $("#txtcancelwriteoffamount").html();
    param.PaymentModeID = $("#txtpendingpaymodeid").val();
    if (param.PaymentModeID == null || param.PaymentModeID == '')
        param.PaymentModeID = 0;
    param.PaymentModeID1 = $("#txtpendingpaymodeid1").val();
    if (param.PaymentModeID1 == null || param.PaymentModeID1 == '')
        param.PaymentModeID1 = 0;
    param.PaymentModeID2 = $("#txtpendingpaymodeid2").val();
    if (param.PaymentModeID2 == null || param.PaymentModeID2 == '')
        param.PaymentModeID2 = 0;

    param.ChequeNumber = $("#txtpendingchequenum").val();
    param.ChequeNumber1 = $("#txtpendingchequenum1").val();
    param.ChequeNumber2 = $("#txtpendingchequenum2").val();
    param.ChequeDate = "0";
    param.Amount = $("#txtpendingamount").val();
    param.Amount1 = $("#txtpendingamount1").val();
    param.Amount2 = $("#txtpendingamount2").val();

    param.BankNameID = $("#txtpendingbankname").val();
    param.BankName = $("#txtpendingbankname option:selected").text();
    param.BankID = $("#txtpendingbankname option:selected").attr('bankid');
    param.BranchBankName = $("#txtpendingbankname option:selected").attr('bankname');
    param.BranchName = $("#txtpendingbankname option:selected").attr('branchname');
    if (param.BankNameID == null || param.BankNameID == '')
        param.BankNameID = 0;
    param.BankNameID1 = $("#txtpendingbankname1").val();
    param.BankName1 = $("#txtpendingbankname1 option:selected").text();
    param.BankID1 = $("#txtpendingbankname1 option:selected").attr('bankid');
    param.BranchBankName1 = $("#txtpendingbankname1 option:selected").attr('bankname');
    param.BranchName1 = $("#txtpendingbankname1 option:selected").attr('branchname');
    if (param.BankNameID1 == null || param.BankNameID1 == '')
        param.BankNameID1 = 0;
    param.BankNameID2 = $("#txtpendingbankname2").val();
    param.BankName2 = $("#txtpendingbankname2 option:selected").text();
    param.BankID2 = $("#txtpendingbankname2 option:selected").attr('bankid');
    param.BranchBankName2 = $("#txtpendingbankname2 option:selected").attr('bankname');
    param.BranchName2 = $("#txtpendingbankname2 option:selected").attr('branchname');
    if (param.BankNameID2 == null || param.BankNameID2 == '')
        param.BankNameID2 = 0;

    param.AdvanceAmount = "0";
    param.AdvanceAmount1 = "0";
    param.AdvanceAmount2 = "0";

    param.AdvanceReceiptID = $("#txtadvancereceiptid").val();
    param.AdvanceUtilised = $("#txtadvanceutilised").val();
    if (param.AdvanceUtilised == null || param.AdvanceUtilised == '')
        param.AdvanceUtilised = "0";

    param.AdvanceReceiptID1 = $("#txtadvancereceiptid1").val();
    param.AdvanceUtilised1 = $("#txtadvanceutilised1").val();
    if (param.AdvanceUtilised1 == null || param.AdvanceUtilised1 == '')
        param.AdvanceUtilised1 = "0";

    param.AdvanceReceiptID2 = $("#txtadvancereceiptid2").val();
    param.AdvanceUtilised2 = $("#txtadvanceutilised2").val();
    if (param.AdvanceUtilised2 == null || param.AdvanceUtilised2 == '')
        param.AdvanceUtilised2 = "0";

    param.SaveFlag = $("#hdnnewsaveflag").val();

    $.each($("input[name='PendingROCheckbox']:checked"), function () {
        Pendingroidlist.push($(this).attr('pendingro'));
    });

    param.PendingROID = Pendingroidlist.toString();;
    if (param.PendingROID == "" || Pendingroidlist.length == 0) {
        ShowMsg("Please select ROID");
        // $("#pendingorders").focus();
        return false;
    }

    var validation = CheckNewReceiptValidation();
    if (validation == false) {
        return false;
    }

    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.IsValid == 0) {
        var fullmsg = "";
        if (result.ErrorMessage == null) {
            cnfrmboxvalue = true;
            return false;
        }
        var msglength = result.ErrorMessage.split('.')[1].trim().split('\r').length;
        for (var i = 0; i < msglength; i++) {
            fullmsg += "<br />" + "<span style='color:#385723;font-weight:600;'>" + result.ErrorMessage.split('.')[1].trim().split('\r')[i].replace('-', '') + "</span>";
        }
        var msg = "<span style='color:#385723;'>" + result.ErrorMessage.split('.')[0] + "." + "</span>" + fullmsg + "<br />" + "<span style='color:#385723;'>" + "\nDo you want to print receipt?" + "</span>";
        $('<div title="Adpro"></div>').html(msg).dialog({
            show: 'blind',
            closeOnEscape: false,
            autoOpen: true,
            hide: 'fold',
            modal: true,
            dialogClass: "base-message",
            buttons: {
                "Ok": function () {
                    $(this).dialog("close");
                    $(this).parent().hide();
                    Csvfilecount = 0;
                    $('#txtNewReceiptNo').val(result.ReceiptID);
                    PrintNewReceiptfileDownload();
                    $('#txtNewReceiptNo').val('');
                    ViewNewReceiptDetails();
                    return false;
                },
                Cancel: function () {
                    $(this).dialog("close");
                    ViewNewReceiptDetails();
                    return false;
                }
            }
        });
    }

    else if (result.IsValid == 3) {

        $('<div title="Adpro"></div>').html(result.ErrorMessage).dialog({
            show: 'blind',
            closeOnEscape: false,
            autoOpen: true,
            hide: 'fold',
            modal: true,
            dialogClass: "base-message",
            buttons: {
                "Yes": function () {
                    $(this).dialog("close");
                    $("#hdnnewsaveflag").val(2);
                    SaveNewReceipt();
                },
                "No": function () {
                    $(this).dialog("close");
                    return false;
                }
            }
        });
    }
    else {
        ShowMsg(result.ErrorMessage);
        return false;
    }
}

function CheckNewReceiptValidation() {
    if ($("#txtpendingpaymodeid").val() == '4') {
        if ($("#txtpendingbankname").val() == 0) {
            ShowMsg("Please select Bank", $("#txtpendingbankname"));
            $("#txtpendingbankname").focus();
            return false;
        }
        else if ($("#txtpendingchequenum").val().trim() == '') {
            ShowMsg("Please enter Number", $("#txtpendingchequenum"));
            $("#txtpendingchequenum").focus();
            return false;
        }
    }
    else if ($("#txtpendingpaymodeid1").val() == '4') {
        if ($("#txtpendingbankname1").val() == 0) {
            ShowMsg("Please select Bank", $("#txtpendingbankname1"));
            $("#txtpendingbankname1").focus();
            return false;
        }
        else if ($("#txtpendingchequenum1").val().trim() == '') {
            ShowMsg("Please enter Number", $("#txtpendingchequenum1"));
            $("#txtpendingchequenum1").focus();
            return false;
        }

    }
    else if ($("#txtpendingpaymodeid2").val() == '4') {
        if ($("#txtpendingbankname2").val() == 0) {
            ShowMsg("Please select Bank", $("#txtpendingbankname2"));
            $("#txtpendingbankname2").focus();
            return false;
        }
        else if ($("#txtpendingchequenum2").val().trim() == '') {
            ShowMsg("Please enter Number", $("#txtpendingchequenum2"));
            $("#txtpendingchequenum2").focus();
            return false;
        }
    }
    if ($("#txtpendingamount").val() != '' && $("#txtpendingpaymodeid").val() == "-1") {
        ShowMsg("Please select PaymentMode", $("#txtpendingpaymodeid"));
        $("#txtpendingpaymodeid").focus();
        return false;
    }
    if ($("#txtpendingamount1").val() != '' && $("#txtpendingpaymodeid1").val() == "-1") {
        ShowMsg("Please select PaymentMode", $("#txtpendingpaymodeid1"));
        $("#txtpendingpaymodeid1").focus();
        return false;
    }
    if ($("#txtpendingamount2").val() != '' && $("#txtpendingpaymodeid2").val() == "-1") {
        ShowMsg("Please select PaymentMode", $("#txtpendingpaymodeid2"));
        $("#txtpendingpaymodeid2").focus();
        return false;
    }

    if ($("#txtpendingamount").val() != '' && ($("#txtpendingchequenum").val().trim() == '' && $("#txtpendingpaymodeid").val() == "-1")) {
        ShowMsg("Please select PaymentMode", $("#txtpendingpaymodeid"));
        $("#txtpendingpaymodeid").focus();
        return false;
    }

    if ($("#txtpendingamount1").val() != '' && ($("#txtpendingchequenum1").val().trim() == '' && $("#txtpendingpaymodeid1").val() == "-1")) {
        ShowMsg("Please select PaymentMode", $("#txtpendingpaymodeid1"));
        $("#txtpendingpaymodeid1").focus();
        return false;
    }

    if ($("#txtpendingamount2").val() != '' && ($("#txtpendingchequenum2").val().trim() == '' && $("#txtpendingpaymodeid2").val() == "-1")) {
        ShowMsg("Please select PaymentMode", $("#txtpendingpaymodeid2"));
        $("#txtpendingpaymodeid2").focus();
        return false;
    }

    if (($("#txtpendingbankname").val() != 0 && $("#txtpendingbankname").val() != null) && $("#txtpendingpaymodeid").val() == "-1") {
        ShowMsg("Please select PaymentMode", $("#txtpendingpaymodeid"));
        $("#txtpendingpaymodeid").focus();
        return false;
    }
    if (($("#txtpendingbankname1").val() != 0 && $("#txtpendingbankname1").val() != null) && $("#txtpendingpaymodeid1").val() == "-1") {
        ShowMsg("Please select PaymentMode", $("#txtpendingpaymodeid1"));
        $("#txtpendingpaymodeid1").focus();
        return false;
    }
    if (($("#txtpendingbankname2").val() != 0 && $("#txtpendingbankname2").val() != null) && $("#txtpendingpaymodeid2").val() == "-1") {
        ShowMsg("Please select PaymentMode", $("#txtpendingpaymodeid2"));
        $("#txtpendingpaymodeid2").focus();
        return false;
    }
}

function ClearNewReceipt() {
    ispefocus = true;
    $('#lblCancelReceiptPendingRO').html('');
    $("#txtpendingpaymodeid").val('');
    $("#txtrcptagencyname").val('');
    $("#hdnrcptagencyid").val('');
    $("#hdnrcptcasualclientid").val('');
    $("#txtrcptcasualclientname").val('');
    $("#hdnrcptcasualclientaddress").val('');
    $("#hdnrcptcasualclientcity").val('');
    $("#hdnrcptcasualclientzip").val('');
    $("#hdnrcptcasualclientphone").val('');
    $("#hdnrcptpendingronet").val('');
    EnableNewReciptPopup();
    ValidateNewReceiptField();
    $("#pendingorders").val(0);
}

$('#NewCancelDateid').datepicker({
    numberOfMonths: 1,
    dateFormat: 'dd/mm/yy',
    changeMonth: true,
    changeYear: true,
    minDate: 0,
});
$('#NewCancelDateid').datepicker("setDate", new Date());

function NewCancelReceipt() {
    $('#Newtextremark').val('');
    $('#NewCancelDateid').datepicker("setDate", new Date());
    var Receipetid = $('#txtNewReceiptNo').val();
    if (Receipetid == '') {
        ShowMsg('Please enter the ReceiptID');
        return false;
    }
    $('#NewCancelReceiptPopUp').dialog('open');
}

function NewCancelReceiptOk() {
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    var Receipetid = $('#txtNewReceiptNo').val();
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/BookingCancelReceipt";
    param.Parametername = 'cancelreceipt';
    param.ReceiptID = Receipetid;
    param.UserId = userid
    param.CancelReceiptDate = $('#NewCancelDateid').val();
    param.CancelReceiptRemark = $('#Newtextremark').val();
    param.IsClassified = $('#hdnIsClassified').val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result.length > 0) {
        $('#NewCancelReceiptPopUp').dialog('close');
        ShowMsg(result[0].Message);
        ClearNewReceipt();
        return false;
    }
}

function ValidateNewReceiptAmount() {
    $("#txtcancelwriteoffamount").val(0);
    $("#txtcancelwriteoffamount").html('');
    if ($("#txtpendingamount").val() != "" && $("#hdnrcptpendingronet").val() != "") {
        var receiptamount = parseFloat($("#txtpendingamount").val());
        var receviable = parseFloat($("#hdnrcptpendingronet").val());
        if ($("#txtpendingamount1").val() == "") {
            if (receviable > (receiptamount + WriteoffAmount)) {
                var receiptamount1 = parseFloat(receviable - receiptamount);
                $("#txtpendingamount1").val(receiptamount1.toFixed(2));
            }
            else {
                $("#newreceiptfield2").css('pointer-events', 'none');
                $("#newreceiptfield2").prop("disabled", true);
            }
            if (receviable > (receiptamount + receiptamount1 + WriteoffAmount)) {
                var receiptamount2 = parseFloat(receviable - (receiptamount + receiptamount1));
                $("#txtpendingamount2").val(receiptamount2.toFixed(2));
            }
            else {
                $("#newreceiptfield3").css('pointer-events', 'none');
                $("#newreceiptfield3").prop("disabled", true);
            }
        }
        else {
            $("#txtpendingamount1").val(parseFloat($("#txtpendingamount1").val()).toFixed(2));
            var receiptamount1 = parseFloat($("#txtpendingamount1").val());
            if (receviable > (receiptamount + receiptamount1 + WriteoffAmount)) {
                var receiptamount2 = parseFloat(receviable - (receiptamount + receiptamount1));
                $("#txtpendingamount2").val(receiptamount2.toFixed(2));
            }
            else {
                $("#newreceiptfield3").css('pointer-events', 'none');
                $("#newreceiptfield3").prop("disabled", true);
            }
        }
    }
    else {
        $("#txtpendingamount").val('');
        $("#txtpendingamount1").val('');
        $("#txtpendingamount2").val('');
    }
}

function ValidateAdvanceAmount() {
    if (parseFloat($("#txtpendingamount").val()) > parseFloat($("#hdnrcptpendingronet").val())) {
        $("#txtpendingamount").val($("#hdnrcptpendingronet").val());
    }
}

function ValidateAdvanceAmount1() {
    if (parseFloat($("#txtpendingamount1").val()) > parseFloat($("#hdnrcptpendingronet").val())) {
        $("#txtpendingamount1").val($("#hdnrcptpendingronet").val());
    }
}

function ValidateAdvanceAmount2() {
    if (parseFloat($("#txtpendingamount2").val()) > parseFloat($("#hdnrcptpendingronet").val())) {
        $("#txtpendingamount2").val($("#hdnrcptpendingronet").val());
    }
}

function ValidateNewTotalAmount() {
    var receviable = 0;
    var totalamount = parseFloat($("#txtcancelreceiptamount").val());

    if ($("#txtpendingpaymodeid option:selected").val() == 1) {
        receviable = parseFloat($("#txtpendingamount").val());
        $("#txtcancelreceiptamount").prop("disabled", "");
    }
    else if ($("#txtpendingpaymodeid1 option:selected").val() == 1) {
        receviable = parseFloat($("#txtpendingamount1").val());
        $("#txtcancelreceiptamount").prop("disabled", "");
    }
    else if ($("#txtpendingpaymodeid2 option:selected").val() == 1) {
        receviable = parseFloat($("#txtpendingamount2").val());
        $("#txtcancelreceiptamount").prop("disabled", "");
    }
    else {
        $("#txtcancelreceiptamount").prop("disabled", "disabled");
    }

    if (!isNaN(totalamount) && !isNaN(receviable)) {
        if (totalamount < receviable) {
            $("#txtcancelreceiptamount").val(0);
            $("#txtcancelreturnamount").val(0);
            $("#txtcancelreturnamount").html(0);
            ShowMsg("Tender amount can not be less than cash amount", $("#txtcancelreceiptamount"));
            $("#txtcancelreceiptamount").focus();
            return false;
        }
        else {
            var returnamount = totalamount - receviable;
            $("#txtcancelreturnamount").val(returnamount);
            $("#txtcancelreturnamount").html(parseFloat(returnamount).toFixed(2));
        }
    }
}

function TotalNewWriteoffAmount() {
    var totalamount;
    var receviable = parseFloat($("#hdnrcptpendingronet").val());
    totalamount = parseFloat($("#txtpendingamount").val());
    if ($("#txtpendingamount1").val() != '') {
        totalamount = parseFloat($("#txtpendingamount").val()) + parseFloat($("#txtpendingamount1").val());
    }
    if ($("#txtpendingamount2").val() != '') {
        totalamount = parseFloat($("#txtpendingamount").val()) + parseFloat($("#txtpendingamount1").val()) + parseFloat($("#txtpendingamount2").val());
    }
    var writeoffamount = parseFloat(receviable - totalamount);

    if (writeoffamount < 0) {
        writeoffamount = 0;
    }

    if (totalamount < (parseFloat(receviable - WriteoffAmount))) {
        $("#txtcancelwriteoffamount").val(WriteoffAmount);
        $("#txtcancelwriteoffamount").html(WriteoffAmount);
    }
    else {
        $("#txtcancelwriteoffamount").val(writeoffamount);
        $("#txtcancelwriteoffamount").html(writeoffamount);
    }
}

function GetNewReceiptDetail() {
    Csvfilecount = 0;
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    centerid = qStr.split('&')[1].split('=')[1];
    var receiptid = $("#txtNewReceiptNo").val();
    if (receiptid == null || receiptid == '') {
        ShowMsg('Please enter ReceiptID', $("#txtNewReceiptNo"));
        $("#txtNewReceiptNo").focus();
        return false;
    }
    else if (receiptid != '' && (isNaN(parseInt(receiptid))) || (receiptid.toString().length > 7 && receiptid.toString().length < 10)) {
        ShowMsg('Invalid ReceiptID');
        return false;
    }
    else if (receiptid.toString().length >= 1 && receiptid.toString().length <= 8) {
        var n = serverDate.getYear();
        receiptid = parseInt(n) * 10000000 + parseInt(receiptid);
        $("#txtNewReceiptNo").val(receiptid);
    }
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/GetCompositeReceiptData";
    param.ReceiptID = $("#txtNewReceiptNo").val();
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);

    if (result.OpenOrder != undefined) {
        ShowMsg(result.OpenOrder[0].ErrorMessage);
        $("#txtNewReceiptNo").val('');
        return false;
    }

    else if (result.CompoReceiptOrder.length > 0) {
        DisableNewReciptPopup();
        $('#divNewReceiptPopUp').dialog('open');
        $("#txtrcptagencyname").val(result.CompoReceiptOrder[0].AgencyName);
        $("#hdnrcptagencyid").val(result.CompoReceiptOrder[0].AgencyID);
        $("#hdnrcptcasualclientid").val(result.CompoReceiptOrder[0].ClientID);
        $("#txtrcptcasualclientname").val(result.CompoReceiptOrder[0].CasualClient);
        $("#hdnrcptcasualclientaddress").val(result.CompoReceiptOrder[0].CasualAddress);
        $("#hdnrcptcasualclientcity").val(result.CompoReceiptOrder[0].City);
        $("#hdnrcptcasualclientzip").val(result.CompoReceiptOrder[0].Zip);
        $("#hdnrcptcasualclientphone").val(result.CompoReceiptOrder[0].Phone);
        PendingROID(result.CompoReceiptROID);

        var TotalNetAmount = 0;
        for (var i = 0; i < result.CompoReceiptROID.length; i++) {
            $("input[pendingro=" + result.CompoReceiptROID[i].ROID + "]").click();
            TotalNetAmount = TotalNetAmount + result.CompoReceiptROID[i].Net;
        }

        $("#txtcanceltotalamount").val(TotalNetAmount);
        $("#txtcanceltotalamount").html(TotalNetAmount.toFixed(2));

        CompositeReceiptDetailsFill(result.CompoReceiptOrder);

        if ($("#hdnallowreceiptcancel").val() == "0") {
            $("#btncancelreceipt").css('pointer-events', 'none');
            $("#btncancelreceipt").css('opacity', '0.5');
            $("#btnnewcancelreceipt").css('pointer-events', 'none');
            $("#btnnewcancelreceipt").css('opacity', '0.5');
        }
        else {
            $("#btncancelreceipt").css('pointer-events', 'auto');
            $("#btncancelreceipt").css('opacity', '');
            $("#btnnewcancelreceipt").css('pointer-events', 'auto');
            $("#btnnewcancelreceipt").css('opacity', '');
        }
        $("#txtNewReceiptNo").val(param.ReceiptID);
    }
    else {
        ShowMsg("Record not found");
        $("#txtNewReceiptNo").val('');
        return false;
    }
}

function CompositeReceiptDetailsFill(result) {
    if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
            // Receipt Detail
            $("#txtcancelreceiptamount").val(result[0].CashReceived.toFixed(2));
            $("#txtcancelwriteoffamount").val(result[0].WriteOffAmount);
            $("#txtcancelwriteoffamount").html(result[0].WriteOffAmount.toFixed(2));
            $("#txtcancelreturnamount").val(result[0].CashRefund);
            $("#txtcancelreturnamount").html(result[0].CashRefund.toFixed(2));
            if (i == 0) {
                $("#txtpendingpaymodeid").val(result[0].ReceiptPaymentMode);
                $("#txtpendingbankname").val(result[0].BranchID);
                $("#txtpendingchequenum").val(result[0].CheckNumber);
                $("#txtpendingamount").val(result[0].Amount.toFixed(2));
                if (result[0].AdvanceReceiptID == 0)
                    $("#txtadvancereceiptid").append(new Option('', '0'));
                else
                    $("#txtadvancereceiptid").append(new Option(result[0].AdvanceReceiptID, result[0].AdvanceReceiptID));
            }
            if (i == 1) {
                $("#txtpendingpaymodeid1").val(result[1].ReceiptPaymentMode);
                $("#txtpendingbankname1").val(result[1].BranchID);
                $("#txtpendingchequenum1").val(result[1].CheckNumber);
                $("#txtpendingamount1").val(result[1].Amount.toFixed(2));
                if (result[1].AdvanceReceiptID == 0)
                    $("#txtadvancereceiptid1").append(new Option('', '0'));
                else
                    $("#txtadvancereceiptid1").append(new Option(result[1].AdvanceReceiptID, result[1].AdvanceReceiptID));
            }
            if (i == 2) {
                $("#txtpendingpaymodeid2").val(result[2].ReceiptPaymentMode);
                $("#txtpendingbankname2").val(result[2].BranchID);
                $("#txtpendingchequenum2").val(result[2].CheckNumber);
                $("#txtpendingamount2").val(result[2].Amount.toFixed(2));
                if (result[2].AdvanceReceiptID == 0)
                    $("#txtadvancereceiptid2").append(new Option('', '0'));
                else
                    $("#txtadvancereceiptid2").append(new Option(result[2].AdvanceReceiptID, result[2].AdvanceReceiptID));
            }
        }
    }
}

function PrintNewReceiptfileDownload() {
    if (DownloadType == '1') {
        ExcelNewReceiptReportPrint();

    }
    else {
        Csvfilecount++;
        if (Csvfilecount == 1) {
            NewReceiptprint();

        }
        else {

            $('<div title="Adpro"></div>').html("Do you want to print Same Receipt?").dialog({
                show: 'blind',
                closeOnEscape: false,
                autoOpen: true,
                hide: 'fold',
                modal: true,
                dialogClass: "base-message",
                buttons: {
                    "Yes": function () {
                        $(this).dialog("close");
                        NewReceiptprint();
                    },
                    "No": function () {
                        $(this).dialog("close");
                        return false;
                    }
                }
            });
        }
    }
}

function NewReceiptprint() {
    var Receipetid = $('#txtNewReceiptNo').val();
    if (Receipetid == '') {
        ShowMsg('Please Enter The ReceiptID');
        return false;
    }
    var url = appRoot + "Booking/GetTableData";
    var param = {};
    param.ApiName = "/ReceiptPrint";
    param.ReceiptId = Receipetid;
    var result = getresult(url, param);
    result = jQuery.parseJSON(result);
    if (result[0].ReceiptId != '' && result[0].ReceiptId != null) {
        window.location = appRoot + "/Booking/GetMainDatatable/?ReceiptId=" + result[0].ReceiptId + "&IsCheck=" + result[0].IsCheckType;
        setTimeout(function () {
            window.open(appRoot + "BookingSubPrint/GetSubDatatable/?ReceiptId=" + result[0].ReceiptId + "&IsCheck=" + result[0].IsCheckType);
        }, 3000);
    }
}

function ExcelNewReceiptReportPrint() {
    var Receipetid = $('#txtNewReceiptNo').val();
    userid = qStr.split('?')[1].split('=')[1].split('&')[0];
    if (Receipetid == '') {
        ShowMsg('Please Enter The ReceiptID');
        return false;
    }
    var Isclassified = 0;

    $.ajax({
        async: false,
        url: appRoot + "Booking/ExcelGetPrint",
        type: "POST",
        dataType: "json",
        data: { Isclassified: Isclassified, Receipetid: Receipetid, UserId: userid },
        success: function (data) {
            if (data.Receiptname != '') {
                window.location = "" + appRoot + "/Booking/PrintFileDownload/?ReceiptId=" + data.Receiptname;
            }
            else {
                ShowMsg('Please enter Correct RecepitID');

            }
        }, error: function (xhr, ajaxOptions, thrownError) {
            ShowMsg(xhr.status);
            ShowMsg(thrownError);
        }

    });
    return false;

}

$("#boxtypeid").focusout(function (e) {
    ispefocus = false;
    ctrlupress = false;
    if ($(".chosen-search-input").val() == "Type Package") {
        // $(".chosen-search-input").val('');
        $(".chosen-container").removeClass('chosen-with-drop');
        $(".chosen-container").removeClass('chosen-container-active');
        setTimeout(function () {
            $('.search-choice-close').click();
        }, 500);
    }
});

/* ---end new receipt functionality--- */

function OpenBuildToggle() {
    if ($('#toggleNavigationLeft').hasClass('open')) {
        $('#toggleNavigationLeft').removeClass('open');
    }
    else {
        $('#toggleNavigationLeft').addClass('open');
    }
}

function ReadBuildDetailFile() {
    var url = appRoot + "Booking/ReadBuildDetailFile";
    var param = {};
    var result = getresult(url, param);
    $("#detaildiv").html(result);
}

function ShowMsg(msg, thi) {
    $('<div title="Adpro"></div>').html(msg).dialog({
        show: 'blind',
        closeOnEscape: false,
        autoOpen: true,
        hide: 'fold',
        modal: true,
        dialogClass: "base-message",
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
                cnfrmboxvalue = true;
                dbclick = false;
                setTimeout(function () {
                    $(thi).focus();
                    cnfrmboxvalue = true;
                    dbclick = false;
                }, 50)
            }
        }
    });
}

function ShowClientMsg(msg, thi) {
    $('<div title="Adpro"></div>').html(msg).dialog({
        show: 'blind',
        closeOnEscape: false,
        autoOpen: true,
        hide: 'fold',
        modal: true,
        dialogClass: "base-message",
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
                cnfrmboxvalue = true;
                dbclick = false;
                $('#divAddrPopUp').dialog('open');
                setTimeout(function () {
                    $(thi).focus();
                    cnfrmboxvalue = true;
                    dbclick = false;
                }, 50);
            }
        }
    });
}



//new code start for grid

function Griddate(date) {
    $(".mydatepicker").datepicker({
        numberOfMonths: 1,
        dateFormat: 'dd/mm/yy',
        beforeShowDay: GridCheckDateSelectable,
        //defaultDate: date,
        changeYear: false,
        onSelect: function (datetext) {
            hilightmainCalender(datetext, $('.table-ad-detail .gridselected').attr('insDt'), $('.table-ad-detail .gridselected').attr('gridpeid'));
        }
    });
}

//var dic = {
//    dataSource = {},
//    add:function (peid,ndate) {
//        if (find(peid, ndate)) {
//            this.remove(peid, ndate);
//            let selectedPeidsData = this.dataSource[peid];
//            selectedPeidsData.push(ndate);
//            this.dataSource[peid] = selectedPeidsData;

//        } else {
//            this.dataSource[peid] = [].push(ndate);
//        }
//    },
//    remove: function (peid, date) {
//        for (var ind in this.dataSource[peid]) {
//            if (this.dataSource[peid][ind]['ScheduledDate'] == date) {
//                this.dataSource[peid].splice(ind, 1);
//            }
//        }
//    },
//    find: function (peid) {
//        return this.dataSource[peid];
//    },
//    isDateExists: function (peid, date) {

//    }

//}

var gridchange = 0;
function hilightmainCalender(curDate, preselcteddate, peid) {
    gridchange = 0;
    /// $('[parameter=ProductionDate]').find('option').each(function () {
    //curDate = date;
    var month = (parseInt(curDate.split('/')[1]) - 1);
    var curmnth = parseInt(curDate.split('/')[1]);
    var predatemnth = parseInt(preselcteddate.split('/')[1]);
    if (curmnth != predatemnth) {
        month = predatemnth - 1;
        $('[data-year=' + curDate.split('/')[2] + '][data-month=' + (month + 1) + '] a').each(function () {
            if (parseInt($(this).html()) == parseInt(curDate.split('/')[0]) && this.nodeName == 'A') {
                $(this).addClass('ui-state-active');
            }
        });

    }

    $('[data-year=' + curDate.split('/')[2] + '][data-month=' + month + '] a').each(function () {
        var year = new Date().getFullYear();
        if (parseInt($(this).html()) == parseInt(preselcteddate.split('/')[0]) && $(this).hasClass('ui-state-active') && gridchange == 0) {
            gridchange = 1;
            $(this).removeClass('ui-state-active');
            $('.table-ad-detail .gridselected').attr('insDt', curDate);
            $('[parameter=ProductionDate]').find('option[value="' + preselcteddate + '"]').eq(0).remove();
            $('[parameter=ProductionDate]').append(new Option(curDate, curDate));
            changePackageDate(peid, preselcteddate, curDate);
        }
        if (parseInt($(this).html()) == parseInt(curDate.split('/')[0]) && this.nodeName == 'A') {
            $(this).addClass('ui-state-active');
            //if ($('[parameter=ProductionDate]').find('option[value="' + curDate + '"]').length > 1) 
            //    $(this).css('background', ' #8c97df 50% 50% repeat-x');
        }
    });


    //$('.ui-datepicker-group span:contains("' + monthNames[parseInt(curDate.split('/')[1]) - 1] + '")').parent().parent().parent().find('table tr td').find('span').each(function () {
    //    if (parseInt($(this).html()) == parseInt(curDate.split('/')[0]) && this.nodeName == 'A') {
    //        $(this).addClass('ui-state-active');
    //        if ($('[parameter=ProductionDate]').find('option[value="' + curDate + '"]').length > 1)
    //            $(this).css('background', ' #8c97df 50% 50% repeat-x');
    //    }
    //});


    calenderFlag = false;
    gridchange = 0;
}

function changePackageDate(peid, pDate, cDate) {
    for (var i = 0; i < list.length; i++) {
        var curObj = list[i];
        var schdate = curObj['ScheduledDate'].replace('-', '/').replace('-', '/');

        var pdateparts = pDate.split('/');
        var previousdate = Number(pdateparts[2] + pdateparts[1] + pdateparts[0]);


        var parts = schdate.split('/');
        var tmpdt = new Date(parts[2], parts[1] - 1, parts[0]);
        var tempDate = tmpdt;
        var parts1 = (tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()) + '/' +
            (tempDate.getMonth() < 9 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        var schdateparts = parts1.split('/');
        var listSchDate = Number(schdateparts[2] + schdateparts[1] + schdateparts[0]);

        if (curObj['PEID'] == peid && listSchDate == previousdate) {
            curObj['ScheduledDate'] = cDate;
            curObj['Date'] = cDate;
            selectedPEwithValidDays[i][2] = cDate;
            break;
        }

        //if (curObj['PEID'] == peid && schdate == pDate) {
        //    curObj['ScheduledDate'] = cDate;
        //    curObj['Date'] = cDate;
        //    selectedPEwithValidDays[i][2] = cDate;
        //    break;
        //}


    }
}

function CheckGridRun(validdays, date) {
    if (validdays == 0 || validdays == "undefined") {
        for (var i = 0; i < selectedPEwithValidDays.length; i++) {
            var curObj = selectedPEwithValidDays[i];
            if (curObj[0] == $('.table-ad-detail .gridselected').attr('gridpeid')) {
                validdays = curObj[1];
                break;
            }
        }
    }
    GridpackageIDRunDays = validdays;

    //dt = GridBindDateAutomatically(date);
    //$('.mydatepicker').datepicker('refresh');
    Griddate(date);
    // selectedPEwithValidDays.push([result[i].PEID, validdays, dt]);
}

//function GridBindDateAutomatically(date) {
//    //if (IsBackDateAllow) {
//    //    NxtPublicationDt.setDate(serverDate.getDate() - parseInt($("#hdnbackdatedays").val() - 1));
//    //}
//    //else
//    //    NxtPublicationDt = new Date(date);

//    var parts = date.split('/');
//    var tmpdt = new Date(parts[2], parts[1], parts[0]);
//    tempDate = tmpdt;
//    while (GridCheckDateSelectable(tempDate) != "true,") {
//        tempDate.setDate(tempDate.getDate() + 1);
//    }
//    strDate = (tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()) + '/' +
//        (tempDate.getMonth() < 9 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
//    $('[parameter=ProductionDate]').append(new Option(strDate, strDate));
//    selectedDateArray.push(strDate);
//    GridcallInnerBoxHover();
//    return strDate;
//}

function GridCheckDateSelectable(date) {
    var curDate = new Date(serverDate);
    if (IsBackDateAllow) {
        var backdays = parseInt($("#hdnbackdatedays").val());
        curDate.setDate(curDate.getDate() - backdays);
        if (date > curDate)
            if ((GridpackageIDRunDays & Math.pow(2, (date.getDay() - 1) < 0 ? 6 : (date.getDay() - 1))) > 0)
                return [true, ''];
            else
                return [false, ''];
        else
            return [false, ''];
    }
    else {
        if (date > curDate)
            if ((GridpackageIDRunDays & Math.pow(2, (date.getDay() - 1) < 0 ? 6 : (date.getDay() - 1))) > 0)
                return [true, ''];
            else
                return [false, ''];
        else
            return [false, ''];
    }
    $('.mydatepicker').datepicker('refresh');
}

//function GridcallInnerBoxHover() {
//    $('.mydatepicker.ui-state-active').removeClass('ui-state-active');
//    $('[parameter=ProductionDate]').find('option').each(function () {
//        curDate = $(this).val();
//        $('[data-year=' + curDate.split('/')[2] + '][data-month=' + (parseInt(curDate.split('/')[1]) - 1) + '] a').each(function () {
//            var year = new Date().getFullYear();
//            if (parseInt($(this).html()) == parseInt(curDate.split('/')[0])) {
//                $(this).addClass('ui-state-active');
//                if ($('[parameter=ProductionDate]').find('option[value="' + curDate + '"]').length > 1)
//                    $(this).css('background', ' #8c97df 50% 50% repeat-x');
//            }
//        });
//        $('.ui-datepicker-group span:contains("' + monthNames[parseInt(curDate.split('/')[1]) - 1] + '")').parent().parent().parent().find('table tr td').find('span').each(function () {
//            if (parseInt($(this).html()) == parseInt(curDate.split('/')[0]) && this.nodeName == 'A') {
//                $(this).addClass('ui-state-active');
//                if ($('[parameter=ProductionDate]').find('option[value="' + curDate + '"]').length > 1)
//                    $(this).css('background', ' #8c97df 50% 50% repeat-x');
//            }
//        });
//    });
//    calenderFlag = false;
//}

//$('#rodatePicker').on('focus', function () {
//    $("#rodatePicker").datepicker('hide');
//    setTimeout(function () {
//        $("#rodatePicker").datepicker('hide');
//    }, 0);
//});

//$('#rodatePicker').click(function () {
//    $("#rodatePicker").datepicker('show');
//});

//end code







