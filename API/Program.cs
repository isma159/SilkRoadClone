using Infra;
using LinqToDB;
using Service;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions<AppDb>(
    new DataOptions().UseSQLite("Data Source=../Infra/db.db"));

builder.Services.AddScoped<AppDb>(_ => new AppDb(options));
builder.Services.AddScoped<ProductService>();
builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();
builder.Services.AddCors();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<MyExceptionHandler>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    db.CreateTable<Product>(tableOptions: TableOptions.CreateIfNotExists);
}

app.UseExceptionHandler();
app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();
app.Run();