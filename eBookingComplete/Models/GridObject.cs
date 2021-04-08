using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eBookingComplete.Models
{
    public class GridObject
    {
        public string StartCol { get; set; }
        public string Yposition { get; set; }
        public string BoxNumber { get; set; }
        public int RecID { get; set; }
        public double BaseRate { get; set; }
        public double CardRate { get; set; }
        public double CardAmount { get; set; }
        public double AgreedRate { get; set; }
        public double AgreedAmount { get; set; }
        public double AgreedDiscPer { get; set; }
        public double AgreedDiscAmount { get; set; }
        public int RateCardID { get; set; }
        public int AdRateID { get; set; }
        public double RateDiff { get; set; }
        public double BillableArea { get; set; }
        public int SizeID { get; set; }
        public string AdSize { get; set; }
        public string AdsizeID { get; set; }
        public double AdSizeWidth { get; set; }
        public double AdSizeHeight { get; set; }
        public double AdSizeArea { get; set; }

        public string BillableSize { get; set; }
        public double Billablewidth { get; set; }
        public double Billableheight { get; set; }

        public double ColWidth { get; set; }
        public double ColumnSize { get; set; }
        public double Gutter { get; set; }
        public double AgencyCommissionPer { get; set; }
        public double AgencyCommissionAmount { get; set; }
        public double PreVATAmount { get; set; }
        public double Receivable { get; set; }
        public double NetReceivable { get; set; }
        public double ColorRate { get; set; }
        public double PremiaRate { get; set; }
        public double VATPer { get; set; }
        public double VATAmount { get; set; }
        public double WtPer { get; set; }
        public double WTAmount { get; set; }
        public double ExtraDiscPer { get; set; }
        public double ExtraDiscAmount { get; set; }
        public double ExtraChargesPer { get; set; }
        public double ExtraChargesAmount { get; set; }
        public double ExtraBoxChargesPer { get; set; }
        public double ExtraBoxChargesAmount { get; set; }
        public string ScheduledDate { get; set; }
        public int InsNum { get; set; }
        public int PublicationID { get; set; }
        public int PEID { get; set; }
        public int PremiaID { get; set; }
        public int ColorID { get; set; }
        public int SchemeID { get; set; }
        public int SchemeDetailID { get; set; }
        public double SchemeAmount { get; set; }
        public string SchemeName { get; set; }
        public string SchemeDays { get; set; }
        public int AdTypeID { get; set; }
        public int UOM { get; set; }
        public string Status { get; set; }
        public string AuditStatus { get; set; }
        public int MaterialType { get; set; }
        public int MaterialSource { get; set; }
        public int IsValid { get; set; }
        public string ErrorMessage { get; set; }
        public int ReceiptPayTypeID { get; set; }
        public int PackageID { get; set; }
        public string PackageName { get; set; }
        public string PECode { get; set; }
        public int ValidDays { get; set; }
        public string Date { get; set; }
        public string CategoryID { get; set; }
        public string AdtypeID1 { get; set; }
        public string AdtypeID2 { get; set; }
        public string AdtypeID3 { get; set; }
        public string AdtypeID4 { get; set; }
        public int Iscd { get; set; }
        public string Caption { get; set; }
        public string MaterialID { get; set; }
        public string ReadOnlyFlag { get; set; }
        public string AdColumns { get; set; }
        public int ItemRateFieldChanged { get; set; }
        public int StyleSheetID { get; set; }
        public string U_BodyText { get; set; }
        public string TotalWords { get; set; }
        public string CharCount { get; set; }
        public string MBodyCount { get; set; }
    }
}