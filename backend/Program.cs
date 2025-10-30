using Audiarr.Api.Data;
using Audiarr.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AudiarrDb>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Services
builder.Services.AddScoped<ProwlarrService>();
builder.Services.AddScoped<AudiobookBayService>();
builder.Services.AddScoped<DownloadService>();
builder.Services.AddSingleton<SettingsService>();
builder.Services.AddHostedService<ImportService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
