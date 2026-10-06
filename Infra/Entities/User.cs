using Infra.Enums;
using LinqToDB;
using LinqToDB.Mapping;

namespace Infra.Entities;
[Table("User")]
public class User
{

    [PrimaryKey] public string Id { get; set; } = "";
    [Column] public string Username { get; set; } = "";
    [Column] public string Password { get; set; } = "";
    [Association(ThisKey = nameof(Id), OtherKey = nameof(Product.VendorId))] 
    public List<Product> Products { get; set; } = new();
    [Column(DataType = DataType.NVarChar, Length = 255)] public Roles Role { get; set; } = Roles.User;
    [Column] public bool IsShutDown { get; set; }

}