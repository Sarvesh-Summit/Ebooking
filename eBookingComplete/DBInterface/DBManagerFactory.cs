using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;


public enum DataProvider
{
    Oracle, SqlServer, OleDb, Odbc, MySqlServer
}
namespace EReports.DBInterface
{
    public sealed class DBManagerFactory
    {
        private DBManagerFactory() { }
        public static IDbConnection GetConnection(DataProvider providerType)
        {
            IDbConnection iDbConnection = null;
            switch (providerType)
            {
                case DataProvider.SqlServer:
                    iDbConnection = new SqlConnection();
                    break;
                //case DataProvider.Oracle:
                //  iDbConnection = new OracleConnection();
                //  break;
                case DataProvider.MySqlServer:
#if MySql
             iDbConnection = new MySqlConnection();
#endif
                    break;
                default:
                    return null;
            }
            return iDbConnection;
        }

        public static IDbCommand GetCommand(DataProvider providerType)
        {
            switch (providerType)
            {
                case DataProvider.SqlServer:
                    return new SqlCommand();
                //case DataProvider.Oracle:
                //  return new OracleCommand();
                case DataProvider.MySqlServer:
#if MySql
                    return new MySqlCommand();
#endif
                default:
                    return null;
            }
        }

        public static IDbDataAdapter GetDataAdapter(DataProvider
        providerType)
        {
            switch (providerType)
            {
                case DataProvider.SqlServer:
                    return new SqlDataAdapter();
                //case DataProvider.Oracle:
                //  return new OracleDataAdapter();
                case DataProvider.MySqlServer:
#if MySql
           return new MySqlDataAdapter();
#endif
                default:
                    return null;
            }
        }

        public static IDbTransaction GetTransaction(DataProvider
         providerType)
        {
            IDbConnection iDbConnection = GetConnection(providerType);
            IDbTransaction iDbTransaction = iDbConnection.BeginTransaction();
            return iDbTransaction;
        }

        public static IDataParameter GetParameter(DataProvider providerType)
        {
            IDataParameter iDataParameter = null;
            switch (providerType)
            {
                case DataProvider.SqlServer:
                    iDataParameter = new SqlParameter();
                    break;
                //case DataProvider.Oracle:
                //  iDataParameter = new OracleParameter();
                //  break;
                case DataProvider.MySqlServer:
#if MySql
                iDataParameter = new MySqlParameter();
#endif
                    break;

            }
            return iDataParameter;
        }

        public static IDbDataParameter[] GetParameters(DataProvider
         providerType,
          int paramsCount)
        {
            IDbDataParameter[] idbParams = new IDbDataParameter[paramsCount];

            switch (providerType)
            {
                case DataProvider.SqlServer:
                    for (int i = 0; i < paramsCount; ++i)
                    {
                        idbParams[i] = new SqlParameter();
                    }
                    break;
                //case DataProvider.Oracle:
                //  for (int i = 0; i <paramsCount ; ++i)
                //  {
                //    idbParams[i] = new OracleParameter();
                //  }
                //  break;
                case DataProvider.MySqlServer:
#if MySql
          for (int i = 0; i < paramsCount; ++i)
          {
              idbParams[i] = new MySqlParameter();
          }
#endif
                    break;
                default:
                    idbParams = null;
                    break;
            }
            return idbParams;
        }
    }
}