using Microsoft.Extensions.Hosting;
using System.Threading;
using System.Threading.Tasks;
using Audiarr.Api.Services;
using Audiarr.Api.Data;
using Audiarr.Api.Models;

namespace Audiarr.Api.Services;

public class ImportService : BackgroundService
{
    private readonly SettingsService _settings;
    private readonly AudiarrDb _db;
    private readonly TimeSpan _interval = TimeSpan.FromSeconds(30);

    public ImportService(SettingsService settings, AudiarrDb db)
    {
        _settings = settings;
        _db = db;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var cfg = _settings.Get();
                var downloadsPath = cfg.ContainsKey("DownloadsCompletedPath") && !string.IsNullOrEmpty(cfg["DownloadsCompletedPath"]) ? cfg["DownloadsCompletedPath"]! : "/data/downloads/completed";
                if (Directory.Exists(downloadsPath))
                {
                    var files = Directory.GetFiles(downloadsPath, "*.*", SearchOption.TopDirectoryOnly);
                    foreach (var f in files)
                    {
                        try
                        {
                            var fi = new FileInfo(f);
                            // naive metadata: filename as title
                            var title = Path.GetFileNameWithoutExtension(fi.Name);
                            var destDir = Path.Combine("/data/audiobooks", SanitizeFilename(title));
                            if (!Directory.Exists(destDir)) Directory.CreateDirectory(destDir);
                            var destPath = Path.Combine(destDir, fi.Name);
                            File.Move(f, destPath);
                            var ab = new Audiobook
                            {
                                Title = title,
                                Author = "Unknown",
                                Narrator = "Unknown",
                                Runtime = "",
                                FilePath = destPath,
                                ImportedAt = DateTime.UtcNow
                            };
                            _db.Audiobooks.Add(ab);
                            await _db.SaveChangesAsync(stoppingToken);
                        }
                        catch { /* ignore per-file errors */ }
                    }
                }
            }
            catch { }
            await Task.Delay(_interval, stoppingToken);
        }
    }

    private static string SanitizeFilename(string s)
    {
        foreach (var c in Path.GetInvalidFileNameChars()) s = s.Replace(c, '_');
        return s;
    }
}
