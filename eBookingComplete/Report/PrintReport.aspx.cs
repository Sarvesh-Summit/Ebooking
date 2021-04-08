using CrystalDecisions.CrystalReports.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace eBookingComplete.Rpt
{
    public partial class PrintReport : System.Web.UI.Page
    {
        ReportDocument RDOC = new ReportDocument();
        protected void Page_Init(object sender, EventArgs e)
        {
            RDOC = (ReportDocument)Session["ReportData"];
            CrystalReportViewer2.ReportSource = RDOC;
         }
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                RDOC = new ReportDocument();
                if (this.RDOC != null)
                {

                    RDOC.Close();
                    RDOC.Dispose();
                    GC.Collect();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}