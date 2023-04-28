var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
int port = Int32.Parse(Environment.GetEnvironmentVariable("PORT")!); // Use ! to ignore null warning

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable HTTPs
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run($"http://localhost:{port}");
