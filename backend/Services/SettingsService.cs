using System.Text.Json;

namespace Audiarr.Api.Services;

public class SettingsService
{
    private readonly string _path;
    private readonly object _lock = new();

    public SettingsService(IConfiguration cfg)
    {
        _path = Path.Combine(Directory.GetCurrentDirectory(), "config", "settings.json");
        var dir = Path.GetDirectoryName(_path)!;
        if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
        if (!File.Exists(_path))
        {
            var defaultSettings = new Dictionary<string, string?>
            {
                ["ProwlarrUrl"] = cfg["Integrations:ProwlarrUrl"] ?? "http://localhost:9789",
                ["ProwlarrApiKey"] = cfg["Integrations:ProwlarrApiKey"],
                ["AudiobookBayUrl"] = cfg["Integrations:AudiobookBayUrl"] ?? "https://audiobookbay.is",
                ["DelugeUrl"] = cfg["Integrations:DelugeUrl"],
                ["DelugePassword"] = cfg["Integrations:DelugePassword"],
                ["NZBGetUrl"] = cfg["Integrations:NZBGetUrl"],
                ["NZBGetUsername"] = cfg["Integrations:NZBGetUsername"],
                ["NZBGetPassword"] = cfg["Integrations:NZBGetPassword"],
                ["DownloadsCompletedPath"] = cfg["Downloads:CompletedPath"] ?? "/data/downloads/completed"
            };
            File.WriteAllText(_path, JsonSerializer.Serialize(defaultSettings, new JsonSerializerOptions{WriteIndented=true}));
        }
    }

    public IDictionary<string, string?> Get()
    {
        lock(_lock)
        {
            var txt = File.ReadAllText(_path);
            return JsonSerializer.Deserialize<Dictionary<string, string?>>(txt) ?? new Dictionary<string, string?>();
        }
    }

    public void Save(IDictionary<string, string?> updates)
    {
        lock(_lock)
        {
            var current = Get();
            foreach(var kv in updates) current[kv.Key] = kv.Value;
            File.WriteAllText(_path, JsonSerializer.Serialize(current, new JsonSerializerOptions{WriteIndented=true}));
        }
    }
}
