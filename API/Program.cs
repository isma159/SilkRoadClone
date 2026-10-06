using System.Text.Json.Serialization;
using API;
using Infra;
using LinqToDB;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Service;

var builder = WebApplication.CreateBuilder(args);
var dbPath = builder.Configuration["Database:Path"] ?? "db.db";
var dataOptions = new DataOptions<MyDatabaseConnection>(new DataOptions().UseSQLite($"Data Source={dbPath}"));
builder.Services.AddScoped(_ => new MyDatabaseConnection(dataOptions));
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped(sp => new OrderService(
    sp.GetRequiredService<MyDatabaseConnection>(),
    builder.Configuration.GetValue("Discount:LoyaltyPercent", 20m)));
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<SilkRoadCloneSeeder>();
builder.Services.AddControllers().AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApiDocument();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<MyExceptionHandler>();


var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:3000"];
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();
app.UseStaticFiles();
app.UseOpenApi();
app.UseSwaggerUi();

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<SilkRoadCloneSeeder>().Seed();
}

app.MapControllers();
app.Run();