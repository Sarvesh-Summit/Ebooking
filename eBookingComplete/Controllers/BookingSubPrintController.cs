using Ebooking_New.Models;
using eBookingComplete.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace eBookingComplete.Controllers
{
    public class BookingSubPrintController : Controller
    {
        // GET: BookingSubPrint
        public ActionResult Index()
        {
            return View();
        }


        public void GetSubDatatable(int ReceiptId, bool IsCheck)
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
                objBookingDetail.ApiName = "/SubPrint";

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
                            if (listarray[i][j] == "PaymentDate")
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
                            if (k == 5)
                            {
                                dr[k] = Convert.ToDateTime(listarray[i][k]);
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
                Response.AddHeader("content-disposition", "attachment;filename=RecepitId_SubReport_" + ReceiptId + ".csv");
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


        //public void GetSubDatatable(int ReceiptId, bool IsCheck)
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
        //        objBookingDetail.ApiName = "/SubPrint";

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
        //        Response.AddHeader("content-disposition", "attachment;filename=RecepitId_SubReport_" + ReceiptId + ".csv");
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


    }
}