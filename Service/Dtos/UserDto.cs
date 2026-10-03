using Facet;
using Infra.Entities;

namespace Service.Dtos;

[Facet(typeof(User), "Password")]
public partial class UserDto {}

public class LoginDto
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}

public class CreateUserRequestDto
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}

public class UpdateUserRequestDto
{
    public string UserIdForLookup { get; set; } = "";
    public string NewUsername { get; set; } = "";
    public string NewPassword { get; set; } = "";
}