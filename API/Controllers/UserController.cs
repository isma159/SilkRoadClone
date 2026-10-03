using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController(UserService service): ControllerBase
{

    [HttpGet(nameof(GetUsers))]
    public List<UserDto> GetUsers() => service.GetAll();

    [HttpGet("{name}")]
    public UserDto GetUserByName(string name) => service.GetUserByName(name);

    [HttpPost(nameof(Login))]
    public UserDto Login([FromBody] LoginDto dto) => service.Login(dto);

    [HttpPost(nameof(CreateUser))]
    public UserDto CreateUser(CreateUserRequestDto dto) => service.CreateUser(dto);

}