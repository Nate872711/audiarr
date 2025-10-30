using Microsoft.AspNetCore.Mvc;
using Audiarr.Api.Services;

namespace Audiarr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly SettingsService _svc;
    public SettingsController(SettingsService svc) { _svc = svc; }

    [HttpGet]
    public IActionResult Get() => Ok(_svc.Get());

    [HttpPost]
    public IActionResult Save([FromBody] Dictionary<string, string?> updates)
    {
        _svc.Save(updates);
        return Ok();
    }
}
