using System.Net.Http.Json;

namespace Audiarr.Api.Services;

public class ProwlarrService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _cfg;

    public ProwlarrService(IConfiguration cfg)
    {
        _cfg = cfg;
        var baseUrl = cfg["Integrations:ProwlarrUrl"] ?? "http://localhost:9789";
        _http = new HttpClient { BaseAddress = new Uri(baseUrl) };
        var key = cfg["Integrations:ProwlarrApiKey"];
        if (!string.IsNullOrEmpty(key))
            _http.DefaultRequestHeaders.Add("X-Api-Key", key);
    }

    public async Task<IEnumerable<object>> SearchAsync(string term)
    {
        try
        {
            var resp = await _http.GetAsync($"/api/v1/search?term={Uri.EscapeDataString(term)}");
            if (!resp.IsSuccessStatusCode) return Array.Empty<object>();
            return await resp.Content.ReadFromJsonAsync<IEnumerable<object>>() ?? Array.Empty<object>();
        }
        catch
        {
            return Array.Empty<object>();
        }
    }
}
