using LinqToDB.Mapping;

namespace Infra.Enums;

public enum Roles
{
    [MapValue("Admin")]
    Admin,
    [MapValue("User")]
    User
}