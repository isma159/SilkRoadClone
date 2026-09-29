using LinqToDB;
using LinqToDB.Data;

namespace Infra;

public class AppDb(DataOptions<AppDb> options) : DataConnection(options.Options)
{
    public ITable<Product> Products => this.GetTable<Product>();
}