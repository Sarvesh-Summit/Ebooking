using Ebooking_New.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace eBookingComplete.Handler
{
    /// <summary>
    /// Summary description for FileDownload
    /// </summary>
    public class FileDownload : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            string ImagePath = context.Request.QueryString[0].ToString().Replace('/', '\\');
            string ImageType = context.Request.QueryString["type"];//.ToString();
            string extn = Path.GetExtension(ImagePath);
            Bitmap btmp = null;
            try
            {
                if (ImageType == "thumnail")
                {
                    btmp = new Bitmap(ImagePath);
                    using (var thumbnail = btmp.GetThumbnailImage(60/*width*/, 60/*height*/, null, IntPtr.Zero))
                    {
                        thumbnail.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                    }
                    btmp.Dispose();
                    context.Response.Flush();
                }
                else
                {
                    string filename = System.IO.Path.GetFileName(ImagePath);
                    if (extn == ".pdf")
                    {
                        context.Response.ContentType = "Application/msword";
                        context.Response.AddHeader("Content-Type", "application/pdf");
                        context.Response.AppendHeader("Content-Disposition", string.Format("attachment;filename={0}", filename.Replace(" ", "")));
                        context.Response.WriteFile(ImagePath);
                        context.Response.Flush();
                        //context.Response.End();
                    }
                    else if (extn == ".doc" || extn == ".docx" || extn == ".xlsx")
                    {

                        context.Response.ContentType = "application/octet-stream";
                        context.Response.AppendHeader("Content-Disposition", string.Format("attachment;filename={0}", filename.Replace(" ", "")));
                        context.Response.TransmitFile(ImagePath);
                    }
                    else if (extn == ".txt")
                    {
                        context.Response.ContentType = "text/plain";
                        context.Response.AddHeader("content-disposition", string.Format("attachment;filename={0}", filename.Replace(" ", "")));
                        context.Response.WriteFile(ImagePath);
                        context.Response.Flush();
                        context.Response.End();
                    }
                    else
                    {
                        context.Response.ContentType = "image/png";
                        context.Response.AddHeader("content-disposition", string.Format("attachment;filename={0}", filename.Replace(" ", "")));
                        context.Response.WriteFile(ImagePath);
                        context.Response.Flush();
                        context.Response.End();
                        //btmp = new Bitmap(ImagePath);
                        //Image img1 = System.Drawing.Image.FromFile(ImagePath);
                        //int ActualWidth, ActualHeight;

                        //ActualWidth = img1.Width;
                        //ActualHeight = img1.Height;
                        //img1.Dispose();
                        //using (var thumbnail = btmp.GetThumbnailImage(ActualWidth/*width*/, ActualHeight/*height*/, null, IntPtr.Zero))
                        //{
                        //    thumbnail.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                        //} btmp.Dispose();
                        //context.Response.Flush();
                        //context.Response.End();

                        //context.Response.ClearContent();
                        //WebClient webClient = new WebClient();
                        //using (Stream stream = webClient.OpenRead(ImagePath))
                        //{
                        //    // Process image...
                        //    byte[] data1 = new byte[stream.Length];
                        //    stream.Read(data1, 0, data1.Length);
                        //    context.Response.AddHeader("Content-Disposition", string.Format("attachment; filename={0}", filename.Replace(" ","")));
                        //    context.Response.BinaryWrite(data1);
                        //    context.Response.Flush();
                        //    context.Response.SuppressContent = true;
                        //    context.ApplicationInstance.CompleteRequest();
                        //}
                    }
                }
            }
            catch (Exception ex)
            {
                if (ImagePath.ToLower().EndsWith(".pdf"))
                {
                    btmp = new Bitmap(context.Server.MapPath("../content/images/pdf.png"));
                    using (var thumbnail = btmp.GetThumbnailImage(60/*width*/, 60/*height*/, null, IntPtr.Zero))
                    {
                        thumbnail.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Png);
                    }
                    btmp.Dispose();
                    context.Response.Flush();
                }
                else if (ImagePath.ToLower().EndsWith(".doc") || ImagePath.ToLower().EndsWith(".docx") || ImagePath.ToLower().EndsWith(".rtf"))
                {
                    btmp = new Bitmap(context.Server.MapPath("../content/images/doc.png"));
                    using (var thumbnail = btmp.GetThumbnailImage(60/*width*/, 60/*height*/, null, IntPtr.Zero))
                    {
                        thumbnail.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Png);
                    }
                    btmp.Dispose();
                    context.Response.Flush();
                }
                else if (ImagePath.ToLower().EndsWith(".xls") || ImagePath.ToLower().EndsWith(".xlsx") || ImagePath.ToLower().EndsWith(".rtf"))
                {
                    btmp = new Bitmap(context.Server.MapPath("../content/images/xls.png"));
                    using (var thumbnail = btmp.GetThumbnailImage(60/*width*/, 60/*height*/, null, IntPtr.Zero))
                    {
                        thumbnail.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Png);
                    }
                    btmp.Dispose();
                    context.Response.Flush();
                }
                else
                {
                    btmp = new Bitmap(context.Server.MapPath("../content/images/no-image.jpg"));
                    using (var thumbnail = btmp.GetThumbnailImage(60/*width*/, 60/*height*/, null, IntPtr.Zero))
                    {
                        thumbnail.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                    }
                    btmp.Dispose();
                    context.Response.Flush();
                }
            }
        }
        public bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }
}