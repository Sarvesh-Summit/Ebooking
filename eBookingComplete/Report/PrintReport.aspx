<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PrintReport.aspx.cs" Inherits="eBookingComplete.Rpt.PrintReport" %>

<%@ Register Assembly="CrystalDecisions.Web, Version=13.0.2000.0, Culture=neutral, PublicKeyToken=692fbea5521e1304" Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
      <script src="../aspnet_client/system_web/4_0_30319/crystalreportviewers13/js/crviewer/crv.js" type="text/javascript"></script>
</head>
<body onload="Print()">
    <form id="form1" runat="server">
        <center>
             <div id="dvReport"  >
            <CR:CrystalReportViewer ID="CrystalReportViewer2" runat="server" AutoDataBind="true"  ToolPanelView="None" EnableDatabaseLogonPrompt="False"
                    EnableParameterPrompt="False"  HasToggleGroupTreeButton="False" ReuseParameterValuesOnRefresh="True" ShowAllPageIds="True" 
                   Height="50px" Width="350px"  />
                 </div>
        </center>
        

    </form>
</body>
</html>
  <script src="//code.jquery.com/jquery-1.10.2.js"></script>
<script type="text/javascript">
    $(document).ready(function () {
        document.getElementById("dvReport").style.display = "none";
    });

    function Print() {
    
        var dvReport = document.getElementById("dvReport");
        //dvReport.attributes("display", "none");
        var frame1 = dvReport.getElementsByTagName("iframe")[0];
        if (navigator.appName.indexOf("Internet Explorer") != -1 || navigator.appVersion.indexOf("Trident") != -1 || navigator.appVersion.indexOf("Google Chrome") != -1) {
            frame1.name = frame1.id;
            window.frames[frame1.id].focus();
            window.frames[frame1.id].print();
        } else {
            var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
            frameDoc.print();
        }

        close();



    }

</script>
