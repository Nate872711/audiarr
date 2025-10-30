using System.Text.RegularExpressions;

namespace Audiarr.Api.Services;

public class AudiobookBayService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _cfg;
    private readonly string _base;

    public AudiobookBayService(IConfiguration cfg)
    {
        _cfg = cfg;
        _base = cfg["Integrations:AudiobookBayUrl"] ?? "https://audiobookbay.is";
        _http = new HttpClient { BaseAddress = new Uri(_base) };
    }

    public async Task<IEnumerable<object>> SearchAsync(string term)
    {
        try
        {
            var url = $"/?s={Uri.EscapeDataString(term)}";
            var html = await _http.GetStringAsync(url);

            var matches = Regex.Matches(html, "<a href=\"(https?://[^"]+/torrent/[^\"]+)\"[^>]*>([^<]+)</a>", RegexOptions.IgnoreCase);
            var results = new List<object>();
            foreach (Match m in matches)
            {
                var page = m.Groups[1].Value;
                var title = Regex.Replace(m.Groups[2].Value, "\s+", " ").Trim();
                try
                {
                    var pageHtml = await _http.GetStringAsync(page);
                    var mm = Regex.Match(pageHtml, "(magnet:\\?xt=urn:[^'\"]+)", RegexOptions.IgnoreCase);
                    var magnet = mm.Success ? mm.Groups[1].Value : null;
                    results.Add(new { title, magnet, source = "AudiobookBay", url = page });
                }
                catch { }
            }

            return results;
        }
        catch
        {
            return Array.Empty<object>();
        }
    }
}
