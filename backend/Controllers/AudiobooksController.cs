using Microsoft.AspNetCore.Mvc;
using Audiarr.Api.Services;
using Audiarr.Api.Data;
using Audiarr.Api.Models;

namespace Audiarr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AudiobooksController : ControllerBase
{
    private readonly AudiobookBayService _abb;
    private readonly DownloadService _dl;
    private readonly AudiarrDb _db;

    public AudiobooksController(AudiobookBayService abb, DownloadService dl, AudiarrDb db)
    {
        _abb = abb;
        _dl = dl;
        _db = db;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(string term)
    {
        if (string.IsNullOrWhiteSpace(term)) return BadRequest("term required");
        var results = await _abb.SearchAsync(term);
        return Ok(results);
    }

    public record DownloadRequest(string Title, string Url, string Client);

    [HttpPost("download")]
    public async Task<IActionResult> Download([FromBody] DownloadRequest req)
    {
        bool ok = req.Client.ToLower() switch
        {
            "deluge" => await _dl.SendToDelugeAsync(req.Url),
            "nzbget" => await _dl.SendToNZBGetAsync(req.Url, req.Title),
            _ => false
        };
        if (ok) return Ok(new { status = "queued" });
        return BadRequest(new { status = "failed" });
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var list = await _db.Audiobooks.OrderByDescending(a => a.ImportedAt).Take(200).ToListAsync();
        return Ok(list);
    }
}
