using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eBookingComplete.Models
{
    public class MyLogDetails
    {
       
        public int AgencyId { get; set; }
        public int Roid { get; set; }
        public int Bookingexeid { get; set; }
        public int Packegid { get; set; }
        public int StatusId { get; set; }
        public int ClientId { get; set; }
        public string RoNumber { get; set; }
        public int CanvassorId { get; set; }
        public int date { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        public string ApiName { get; set; }
        public string ParameterName { get; set; }
        public int UserId { get; set; }
        public int IsClassified { get; set; }
       
    }
}