using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Script.Serialization;
using eBookingComplete.Models;
using System.Text;
using System.Collections.Generic;


namespace Ebooking_New.Models
{
    public class Utility
    {
        public static string ApiBasePath
        {
            get
            {
                return System.Web.Configuration.WebConfigurationManager.AppSettings["ApiPath"];
            }
        }

        public static string CallApi(string url)
        {
            WebRequest request = WebRequest.Create(url);
            request.Credentials = CredentialCache.DefaultCredentials;
            WebResponse response = request.GetResponse();
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            Stream dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string responseFromServer = reader.ReadToEnd();
            return responseFromServer;
        }
        public static string CallApi(BookingDetail objBookingDetail)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(objBookingDetail.ApiName);
            client.DefaultRequestHeaders.Accept.Clear();
            JavaScriptSerializer Serializer = new JavaScriptSerializer();
            var json = Serializer.Serialize(objBookingDetail);
            var stringContent = new StringContent(json, System.Text.UnicodeEncoding.UTF8, "application/json");
            var result = client.PostAsync(objBookingDetail.ApiName, stringContent).Result;
            var responseValue = string.Empty;
            Task task = result.Content.ReadAsStreamAsync().ContinueWith(t =>
            {
                var stream = t.Result;
                using (var reader = new StreamReader(stream))
                {
                    responseValue = reader.ReadToEnd();
                }
            });
            task.Wait();
            return responseValue.ToString();
        }

        public static string CallMyLogApi(MyLogDetails objlogDetails)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(objlogDetails.ApiName);
            client.DefaultRequestHeaders.Accept.Clear();
            JavaScriptSerializer Serializer = new JavaScriptSerializer();
            var json = Serializer.Serialize(objlogDetails);
            var stringContent = new StringContent(json, System.Text.UnicodeEncoding.UTF8, "application/json");
            var result = client.PostAsync(objlogDetails.ApiName, stringContent).Result;
            var responseValue = string.Empty;
            Task task = result.Content.ReadAsStreamAsync().ContinueWith(t =>
            {
                var stream = t.Result;
                using (var reader = new StreamReader(stream))
                {
                    responseValue = reader.ReadToEnd();
                }
            });
            task.Wait();
            return responseValue.ToString();
        }
        //public static string CallApi(User objUser)
        //{
        //    HttpClient client = new HttpClient();
        //    client.BaseAddress = new Uri(objUser.ApiName);
        //    client.DefaultRequestHeaders.Accept.Clear();
        //    JavaScriptSerializer Serializer = new JavaScriptSerializer();
        //    var json = Serializer.Serialize(objUser);
        //    var stringContent = new StringContent(json, System.Text.UnicodeEncoding.UTF8, "application/json");
        //    var result = client.PostAsync(objUser.ApiName, stringContent).Result;
        //    var responseValue = string.Empty;
        //    Task task = result.Content.ReadAsStreamAsync().ContinueWith(t =>
        //    {
        //        var stream = t.Result;
        //        using (var reader = new StreamReader(stream))
        //        {
        //            responseValue = reader.ReadToEnd();
        //        }
        //    });
        //    task.Wait();
        //    return responseValue.ToString();
        //}
        public static void ReportError(string message, Exception exceptionMessage)
        {
            try
            {
                string path = HttpContext.Current.Server.MapPath("~/log.txt");
                if (System.Web.Configuration.WebConfigurationManager.AppSettings["IsLogGenerate"] == "1")
                {
                    StreamWriter objStreamWriter;
                    if (!File.Exists(path))
                        objStreamWriter = new StreamWriter(path);
                    else
                        objStreamWriter = File.AppendText(path);
                    objStreamWriter.WriteLine("Data Time:" + DateTime.Now);
                    objStreamWriter.WriteLine("----------" + DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss") + "-----------------\n" + exceptionMessage.Message);
                    objStreamWriter.Close();
                }
            }
            catch (Exception ex) { }
        }
        public static void SaveToLog(string message)
        {
            try
            {
                string path = HttpContext.Current.Server.MapPath("~/log.txt");
                if (System.Web.Configuration.WebConfigurationManager.AppSettings["IsLogGenerate"] == "1")
                {
                    StreamWriter objStreamWriter;
                    if (!File.Exists(path))
                        objStreamWriter = new StreamWriter(path);
                    else
                        objStreamWriter = File.AppendText(path);
                    objStreamWriter.WriteLine("Data Time:" + DateTime.Now);
                    objStreamWriter.WriteLine("----------" + DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss") + "-----------------\n" + message);
                    objStreamWriter.Close();
                }
            }
            catch (Exception ex) { }
        }

        public static string Encrypt(string input)
        {
            try
            {
                byte[] key = new byte[16] { 3, 3, 3, 5, 222, 13, 155, 55, 122, 123, 165, 187, 188, 1, 11, 133 };
                byte[] inputArray = UTF8Encoding.UTF8.GetBytes(input);
                TripleDESCryptoServiceProvider tripleDES = new TripleDESCryptoServiceProvider();
                tripleDES.Key = key;//UTF8Encoding.UTF8.GetBytes(key);
                tripleDES.Mode = CipherMode.ECB;
                tripleDES.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tripleDES.CreateEncryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(inputArray, 0, inputArray.Length);
                tripleDES.Clear();
                return Convert.ToBase64String(resultArray, 0, resultArray.Length);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static string Decrypt(string input)
        {
            try
            {
                byte[] key = new byte[16] { 3, 3, 3, 5, 222, 13, 155, 55, 122, 123, 165, 187, 188, 1, 11, 133 };
                byte[] inputArray = Convert.FromBase64String(input);
                TripleDESCryptoServiceProvider tripleDES = new TripleDESCryptoServiceProvider();
                tripleDES.Key = key;// UTF8Encoding.UTF8.GetBytes(key);
                tripleDES.Mode = CipherMode.ECB;
                tripleDES.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tripleDES.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(inputArray, 0, inputArray.Length);
                tripleDES.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception ex)
            {
                // don't throw from here.
                return "";

            }
        }

        public static List<List<string>> CallApiPrint(PrintData objBookingDetail)
        {
            List<List<string>> listarray = new List<List<string>>();
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(objBookingDetail.ApiName);
            client.DefaultRequestHeaders.Accept.Clear();
            JavaScriptSerializer Serializer = new JavaScriptSerializer();
            var json = Serializer.Serialize(objBookingDetail);
            var stringContent = new StringContent(json, System.Text.UnicodeEncoding.UTF8, "application/json");
            var result = client.PostAsync(objBookingDetail.ApiName, stringContent).Result;
            if (result.IsSuccessStatusCode)
            {
                //listarray = (new JavaScriptSerializer()).Deserialize<List<List<string>>>(result.Content.ReadAsStringAsync().Result);
                var t = result.Content.ReadAsStringAsync();
                t.Wait();

                listarray = (new JavaScriptSerializer()).Deserialize<List<List<string>>>(t.Result);
            }


            return listarray;
        }


    }
}