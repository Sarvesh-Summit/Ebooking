using System;
using System.Data;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using CrystalDecisions.CrystalReports.Engine;
using Ebooking_New.Models;
using eBookingComplete.Models;
using EReports.DBInterface;
using System.Windows.Forms;
using System.Collections.Generic;
using ClosedXML.Excel;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

namespace Ebooking_New.Controllers
{
    public class BookingController : Controller
    {
        // GET: Booking
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Welcome()
        {
            string jsondata = "";
            BookingDetail objBookingDetail = new BookingDetail();
            objBookingDetail.UserId = Convert.ToInt16(Request.QueryString["id"]);
            objBookingDetail.RevenueCentreID = Convert.ToInt16(Request.QueryString["cid"]);
            objBookingDetail.ApiName = "/FillCustomerDetail";
            try
            {
                objBookingDetail.ApiName = Utility.ApiBasePath + objBookingDetail.ApiName;
                jsondata = Utility.CallApi(objBookingDetail);
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }
            string customerkey = jsondata.Replace("\"", "");
           // customerkey = "The Daily Star";
            if (customerkey == "The Daily Star")
            {
                return View("DSeBooking");
            }
            else
            {
                return View();
            }
        }

        public ActionResult DSeBooking()
        {
            return View();
        }

        public ActionResult DemoView()
        {
            return View();
        }

        public ActionResult DisplayView()
        {
            return View();
        }

        public ActionResult ClassifiedView()
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


        public string GetMachineData()
        {
            string MachineIP = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (MachineIP == "" || MachineIP == null)
                MachineIP = Request.ServerVariables["REMOTE_ADDR"];
            return MachineIP;
        }

        public JsonResult GetGridData()
        {
            GridObject objgrid = new GridObject();
            return Json(objgrid);
        }

        [ValidateInput(false)]
        public JsonResult Logout()
        {
            try
            {
                Session.Abandon();
                Session.Clear();
            }
            catch (Exception ex)
            {
            }
            return Json('1');
        }


        [ValidateInput(false)]
        public JsonResult CreateFolder(string FilePath, string ROID)
        {
            int isSavedSuccessfully;
            string folderPath = FilePath + "\\" + ROID + "\\";
            try
            {
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);
                isSavedSuccessfully = 1;
            }
            catch (Exception ex)
            {
                isSavedSuccessfully = 0;
            }
            return Json(isSavedSuccessfully);
        }

        public JsonResult CDFileUpload()
        {
            try
            {
                var UpdateFileName = Request["NewFileName"];
                var path = Request["ClMatPath"];
                int countfile = Request.Files.Count;
                if (countfile != 0)
                {
                    foreach (string fileName in Request.Files)
                    {
                        HttpPostedFileBase file = Request.Files[fileName];
                        string fileContent = file.ContentType;
                        file.SaveAs(path + fileName);
                    }
                }
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }
            return Json("");
        }

        public JsonResult RoFileUpload()
        {
            List<FileGridData> listarray = new List<FileGridData>();
            try
            {
                var UpdateFileName = Request["NewFileName"];
                var OldFileName = Request["OldFileName"];
                string path = Server.MapPath("~/UploadFiles/");
                int countfile = Request.Files.Count;
                if (countfile != 0)
                {
                    foreach (string fileName in Request.Files)
                    {
                        FileGridData fileobj = new FileGridData();
                        HttpPostedFileBase file = Request.Files[fileName];
                        string fileContent = file.ContentType;
                        file.SaveAs(path + fileName);
                        string fileViewPath = ("UploadFiles/" + fileName);
                        FileInfo fi = new FileInfo(fileName);
                        string fileext = fi.Extension;
                        file.SaveAs(path + fileName);
                        fileobj.FileName = fileName;
                        fileobj.FileTitel = Path.GetFileNameWithoutExtension(fileName);
                        fileobj.FileExt = fileext;
                        fileobj.filelocalpath = fileViewPath;
                        fileobj.FileContent = fileContent;
                        listarray.Add(fileobj);
                    }
                }
                else
                {
                    if (UpdateFileName != "" && UpdateFileName != "")
                    {
                        string Fromfile = path + "" + OldFileName + "";
                        string Tofile = path + "" + UpdateFileName + "";
                        System.IO.File.Move(Fromfile, Tofile);
                    }
                }
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }
            return Json(listarray, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FileDelete(string FileName)
        {
            string StatusCode = string.Empty;
            try
            {
                if (FileName != "")
                {
                    string path = Server.MapPath("~/UploadFiles/");
                    string DeleteFilePath = path + "" + FileName + "";
                    System.IO.File.Delete(DeleteFilePath);
                    StatusCode = "1";
                }
                else
                {
                    StatusCode = "0";
                }
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }
            return Json(StatusCode, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FileDeletefromServer(string FileName)
        {
            string StatusCode = string.Empty;
            try
            {
                if (System.IO.File.Exists(FileName))
                {
                    System.IO.File.Delete(FileName);
                    StatusCode = "1";
                }
                else
                {
                    StatusCode = "-1";
                }
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
                StatusCode = "0";
            }
            return Json(StatusCode, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult Savefile(string FilePath, string ROID)
        {
            int isSavedSuccessfully = 0;
            string folderPath = System.Web.HttpContext.Current.Server.MapPath("~/UploadFiles/");
            string filepath = FilePath + "\\" + ROID + "\\";
            string[] files = Directory.GetFiles(folderPath);
            if (files.Length > 0)
            {
                foreach (string file1 in files)
                {
                    string name = Path.GetFileName(file1);
                    string dest = filepath + "\\" + name;
                    // string dest = Path.Combine(filepath, name);
                    try
                    {
                        System.IO.File.Move(file1, dest);
                        isSavedSuccessfully = 1;
                    }
                    catch (Exception ex)
                    {
                        isSavedSuccessfully = 0;
                    }
                }
                Deletefile();
            }
            else
            {
                isSavedSuccessfully = 1;
            }
            return Json(isSavedSuccessfully);
        }


        [HttpPost]
        [ValidateInput(false)]
        public void Deletefile()
        {
            string folderPath = System.Web.HttpContext.Current.Server.MapPath("~/UploadFiles/");
            string[] localfiles = Directory.GetFiles(folderPath);
            foreach (string file in localfiles)
            {
                System.IO.File.Delete(file);
            }
        }

        public JsonResult GetPrint(int Isclassified, int Receipetid)
        {
            ReportDocument rdoc = new ReportDocument();

            string PrintReport = "success";
            try
            {
                DataSet dst = new DataSet();
                DataTable dt = new DataTable();
                DataTable dt1 = new DataTable();
                string XmlData = "<ebooking><actionname>printreceipt</actionname><isclassified>" + Isclassified + "</isclassified><receiptid>" + Receipetid + "</receiptid><loguserid>12</loguserid></ebooking>";
                string Errormsg = "";
                dst = PrintResult(XmlData, Errormsg);
                dt = dst.Tables[0];
                dt1 = dst.Tables[1];
                if (Isclassified == 0)
                {
                    rdoc.Load(Server.MapPath(("~/Rpt/AdProClassifiedReceipt.rpt")));
                    rdoc.OpenSubreport("ClassifiedPaymentDetailSub.rpt").SetDataSource(dt1.DefaultView);

                }
                else
                {
                    rdoc.Load(Server.MapPath(("~/Rpt/AdProDisplayReceipt.rpt")));
                    rdoc.OpenSubreport("DisplayPaymentDetailSub.rpt").SetDataSource(dt1.DefaultView);

                }


                rdoc.SetDataSource(dt.DefaultView);

                rdoc.SetParameterValue("Duplicate", "check");
                rdoc.SetParameterValue("IsVat", true);
                rdoc.SetParameterValue("Cashier", "hariom");
                Session["ReportData"] = rdoc;
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }

            return Json(PrintReport, JsonRequestBehavior.AllowGet);
        }

        private DataSet PrintResult(string XmlData, string Errormsg)
        {
            DataSet ds = new DataSet();
            try
            {

                using (DBManager db = new DBManager())
                {
                    db.Open();
                    db.CreateParameters(2);
                    db.AddParameters(0, "@XMLBody", XmlData);
                    db.AddParameters(1, "@ERRORMessage", Errormsg);
                    ds = db.ExecuteDataSet(CommandType.StoredProcedure, "EBK_SP_eBookingActions");
                }
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }
            return ds;


        }


        public void GetMainDatatable(int ReceiptId, bool IsCheck)
        {
            DataTable dt = new DataTable();
            List<List<string>> listarray = new List<List<string>>();
            PrintData objBookingDetail = new PrintData();
            string jsondata = "";
            //string[] data;
            try
            {
                objBookingDetail.ReceiptId = ReceiptId.ToString();
                objBookingDetail.IsCheckType = IsCheck;
                objBookingDetail.ApiName = "/MainPrint";

                objBookingDetail.ApiName = Utility.ApiBasePath + objBookingDetail.ApiName;
                listarray = Utility.CallApiPrint(objBookingDetail);

                //foreach(var i in listarray)
                //{
                //    foreach(var a in i)
                //    {
                //        string st = a.ToString();

                //    }

                //}
                for (int i = 0; i < listarray.Count; i++) // Loop through List with for
                {
                    if (i == 0)
                    {
                        for (int j = 0; j < listarray[i].Count; j++)
                        {
                            if (listarray[i][j] == "ReceiptDate" || listarray[i][j] == "TaxRegisterationDate" || listarray[i][j] == "timest" || listarray[i][j] == "StatementDate" || listarray[i][j] == "Scheduleddate")
                            {
                                dt.Columns.Add(listarray[i][j], typeof(DateTime));
                            }

                            else
                            {
                                dt.Columns.Add(listarray[i][j]);
                            }
                        }

                    }
                    else
                    {
                        DataRow dr = dt.NewRow();
                        for (int k = 0; k < listarray[i].Count; k++)
                        {
                            if (k == 3 || k == 7 || k == 17 || k == 22 || k == 63)
                            {
                                if (listarray[i][k] == "" || listarray[i][k] == null || listarray[i][k] == "NULL")
                                {
                                    dr[k] = DateTime.Now.ToString();
                                }
                                else
                                {
                                    dr[k] = Convert.ToDateTime(listarray[i][k]);
                                }
                            }
                            else
                            {
                                dr[k] = listarray[i][k].ToString();
                            }

                        }
                        dt.Rows.Add(dr); //add other rows  


                    }
                }

                string csv = string.Empty;


                foreach (DataColumn column in dt.Columns)
                {
                    //Add the Header row for CSV file.
                    csv += column.ColumnName + ',';
                    //sb.Append(column.ColumnName + ',');
                }

                //Add new line.
                csv += "\r\n";
                //sb.Append("\r\n");

                foreach (DataRow row in dt.Rows)
                {
                    //foreach (DataColumn column in dt.Columns)
                    //{
                    //    //Add the Data rows.
                    //    csv += row[column.ColumnName].ToString().Replace(",", ";") + ',';
                    //    //sb.Append(row[column.ColumnName].ToString().Replace(",", ";") + ',');
                    //}
                    for (int i = 0; i < dt.Columns.Count; i++)
                    {
                        System.Type type = row[i].GetType();

                        if (type == typeof(DateTime))
                        {
                            csv += Convert.ToDateTime(row[i]).ToString("dd/MM/yyyy HH:mm:ss").Replace(",", ";") + ',';
                        }
                        else
                        {
                            csv += row[i].ToString().Replace(",", ";") + ',';
                        }

                    }

                    //Add new line.
                    csv += "\r\n";
                    //sb.Append("\r\n");
                }
                Response.Clear();
                Response.Buffer = true;
                Response.AddHeader("content-disposition", "attachment;filename=RecepitId_MainReport_" + ReceiptId + ".csv");
                Response.Charset = "";
                Response.ContentType = "application/text";
                Response.Output.Write(csv);
                Response.Flush();
                Response.End();
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }

        }


        //public void GetMainDatatable(int ReceiptId, bool IsCheck)
        //{
        //    DataTable dt = new DataTable();
        //    List<List<string>> listarray = new List<List<string>>();
        //    PrintData objBookingDetail = new PrintData();
        //    string jsondata = "";
        //    //string[] data;
        //    try
        //    {
        //        objBookingDetail.ReceiptId = ReceiptId.ToString();
        //        objBookingDetail.IsCheckType = IsCheck;
        //        objBookingDetail.ApiName = "/MainPrint";

        //        objBookingDetail.ApiName = Utility.ApiBasePath + objBookingDetail.ApiName;
        //        listarray = Utility.CallApiPrint(objBookingDetail);

        //        //foreach(var i in listarray)
        //        //{
        //        //    foreach(var a in i)
        //        //    {
        //        //        string st = a.ToString();

        //        //    }

        //        //}
        //        for (int i = 0; i < listarray.Count; i++) // Loop through List with for
        //        {
        //            if (i == 0)
        //            {
        //                for (int j = 0; j < listarray[i].Count; j++)
        //                {

        //                    dt.Columns.Add(listarray[i][j]);
        //                }

        //            }
        //            else
        //            {
        //                DataRow dr = dt.NewRow();
        //                for (int k = 0; k < listarray[i].Count; k++)
        //                {

        //                    dr[k] = listarray[i][k].ToString();
        //                }
        //                dt.Rows.Add(dr); //add other rows  


        //            }
        //        }

        //        string csv = string.Empty;


        //        foreach (DataColumn column in dt.Columns)
        //        {
        //            //Add the Header row for CSV file.
        //            csv += column.ColumnName + ',';
        //            //sb.Append(column.ColumnName + ',');
        //        }

        //        //Add new line.
        //        csv += "\r\n";
        //        //sb.Append("\r\n");

        //        foreach (DataRow row in dt.Rows)
        //        {
        //            foreach (DataColumn column in dt.Columns)
        //            {
        //                //Add the Data rows.
        //                csv += row[column.ColumnName].ToString().Replace(",", ";") + ',';
        //                //sb.Append(row[column.ColumnName].ToString().Replace(",", ";") + ',');
        //            }

        //            //Add new line.
        //            csv += "\r\n";
        //            //sb.Append("\r\n");
        //        }
        //        Response.Clear();
        //        Response.Buffer = true;
        //        Response.AddHeader("content-disposition", "attachment;filename=RecepitId_MainReport_" + ReceiptId + ".csv");
        //        Response.Charset = "";
        //        Response.ContentType = "application/text";
        //        Response.Output.Write(csv);
        //        Response.Flush();
        //        Response.End();
        //    }
        //    catch (Exception ex)
        //    {
        //        Utility.ReportError("", ex);
        //    }

        //}


        public JsonResult ExcelGetPrint(int Isclassified, int Receipetid, int UserId)
        {

            ReportDocument rdoc = new ReportDocument();
            string ReceiptId = "";
            //string PrintReport = "success";
            try
            {
                DataSet dst = new DataSet();
                //DataTable dt = new DataTable();
                //DataTable dt1 = new DataTable();
                string XmlData = "<ebooking><actionname>printreceipt</actionname><isclassified>" + Isclassified + "</isclassified><receiptid>" + Receipetid + "</receiptid><loguserid>" + UserId + "</loguserid></ebooking>";
                string Errormsg = "";
                dst = ExcelPrintResult(XmlData, Errormsg);

                //Session["Dataset"] = dst;

                if (dst != null && dst.Tables[0].Rows.Count > 0 && dst.Tables[1].Rows.Count > 0)
                {
                    ReceiptId = dst.Tables[0].Rows[0]["ReceiptID"].ToString();
                    DataTable dt = dst.Tables[0];
                    DataTable dt1 = dst.Tables[1];
                    using (XLWorkbook wb = new XLWorkbook())
                    {
                        wb.Worksheets.Add(dt, "Maindata");
                        wb.Worksheets.Add(dt1, "Subdata");
                        Session["WorkBook"] = wb;

                    }
                }
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }

            return Json(new { Receiptname = ReceiptId });
        }
        public void PrintFileDownload(string ReceiptId)
        {
            XLWorkbook wb = new XLWorkbook();
            if (Session["WorkBook"] != null)
            {
                wb = (XLWorkbook)Session["WorkBook"];
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=RecepitID_" + ReceiptId + ".Rcpt");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
            Session["WorkBook"] = null;

        }
        private DataSet ExcelPrintResult(string XmlData, string Errormsg)
        {
            DataSet ds = new DataSet();
            try
            {

                using (DBManager db = new DBManager())
                {
                    db.Open();
                    db.CreateParameters(2);
                    db.AddParameters(0, "@XMLBody", XmlData);
                    db.AddParameters(1, "@ERRORMessage", Errormsg);
                    ds = db.ExecuteDataSet(CommandType.StoredProcedure, "EBK_SP_eBookingActions");
                }
            }
            catch (Exception ex)
            {
                Utility.ReportError("", ex);
            }
            return ds;


        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult ReadBuildDetailFile()
        {
            string text = "";
            string BuildDetailPath = System.Web.HttpContext.Current.Server.MapPath("~/BuildDetail.txt");
            text = System.IO.File.ReadAllText(BuildDetailPath);
            return Json(text);
        }




    }
}
