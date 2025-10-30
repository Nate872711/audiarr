namespace Audiarr.Api.Models;

public class Audiobook
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Author { get; set; } = "";
    public string Narrator { get; set; } = "";
    public string Runtime { get; set; } = "";
    public string FilePath { get; set; } = "";
    public DateTime ImportedAt { get; set; } = DateTime.UtcNow;
}
