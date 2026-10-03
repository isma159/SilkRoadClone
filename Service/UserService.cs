using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Infra;
using Infra.Entities;
using Infra.Enums;
using LinqToDB;
using Service.Dtos;

namespace Service;

public class UserService(MyDatabaseConnection db)
{
    public List<UserDto> GetAll()
    {
        return db.Users.Select(u => new UserDto(u)).ToList();
    }

    public UserDto GetUserByName(string name)
    {
        var user = db.Users.Where(u => u.Username == name).Select(u => new UserDto(u)).FirstOrDefault();

        if (user == null) throw new KeyNotFoundException("User not found");

        return user;
    }

    public UserDto Login(LoginDto dto)
    {
        var user = db.Users.FirstOrDefault(u => u.Username == dto.Username);

        if (user == null) throw new KeyNotFoundException("User not found");

        if (user.Password == dto.Password) return new UserDto(user);
        else throw new UnauthorizedAccessException("Incorrect password");
    }

    public UserDto CreateUser(CreateUserRequestDto dto)
    {
        var name = dto.Username.Trim();
        if (string.IsNullOrWhiteSpace(name)) throw new ValidationException("Username is required");
        if (db.Users.Any(u => u.Username.ToLower() == name.ToLower())) 
            throw new ValidationException("Username already exists");
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Username = name,
            Password = dto.Password,
            Role = Roles.User
        };
        db.Insert(user);
        return new UserDto(user);
    }
    
    
}