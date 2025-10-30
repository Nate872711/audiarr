using System.Net.Http.Json;

namespace Audiarr.Api.Services;

public class DownloadService
{
    private readonly IConfiguration _cfg;
    private readonly HttpClient _http;

    public DownloadService(IConfiguration cfg)
    {
        _cfg = cfg;
        _http = new HttpClient();
    }

    public async Task<bool> SendToDelugeAsync(string magnet)
    {
        var url = _cfg["Integrations:DelugeUrl"] ?? "http://host.docker.internal:8112/json";
        var password = _cfg["Integrations:DelugePassword"] ?? "deluge";
        try
        {
            var login = new { method = "auth.login", @params = new[] { password }, id = 1 };
            var loginResp = await _http.PostAsJsonAsync(url, login);
            if (!loginResp.IsSuccessStatusCode) return false;
            var loginContent = await loginResp.Content.ReadAsStringAsync();
            if (!loginContent.Contains("true")) return false;

            var add = new { method = "core.add_torrent_magnet", @params = new object[] { magnet, new { } }, id = 2 };
            var resp = await _http.PostAsJsonAsync(url, add);
            return resp.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> SendToNZBGetAsync(string nzbUrl, string title)
    {
        var url = _cfg["Integrations:NZBGetUrl"] ?? "http://host.docker.internal:6789/jsonrpc";
        var username = _cfg["Integrations:NZBGetUsername"] ?? "nzbget";
        var password = _cfg["Integrations:NZBGetPassword"] ?? "tegbzn6789";
        try
        {
            var payload = new { method = "appendurl", @params = new[] { nzbUrl, title, "audiobooks", 0, false }, id = 1 };
            var auth = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{username}:{password}")); 
            _http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", auth);
            var resp = await _http.PostAsJsonAsync(url, payload);
            return resp.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}
