using Ebooking_New.Models;
using eBookingComplete.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace eBookingComplete.Controllers
{
    public class BookingApprovalController : Controller
    {
        //
        // GET: /BookingApproval/
        public ActionResult History()
        {
            return View();
        }

        [ValidateInput(false)]
        public JsonResult GetTableData(BookingDetail objBookingDetail)
        {
            string jsondata = "";
            try
            {
                objBookingDetail.ApiName = Utility.ApiBasePath + objBookingDetail.ApiName;
                jsondata = Utility.CallApi(objBookingDetail);
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }
            return Json(jsondata);
        }
        [ValidateInput(false)]
        public JsonResult GetMyLogDetails(MyLogDetails objmylogdetail)
        {
            string jsondata = "";
            try
            {
                objmylogdetail.ApiName = Utility.ApiBasePath + objmylogdetail.ApiName;
                jsondata = Utility.CallMyLogApi(objmylogdetail);
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }
            return Json(jsondata);
        }
	}
}